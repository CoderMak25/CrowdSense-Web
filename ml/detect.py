import requests
import cv2
import numpy as np
import sqlite3
import time
from datetime import datetime
from collections import deque
from ultralytics import YOLO

model = YOLO("yolov8n.pt")

ZONE_COLORS = {
    "Gate A":     (255, 0, 0),
    "Platform 1": (0, 255, 0),
    "Platform 2": (0, 165, 255),
    "Concourse":  (0, 0, 255),
}

reading_history = {z: deque(maxlen=100) for z in ZONE_COLORS}
anomaly_status  = {z: False for z in ZONE_COLORS}
ALERT_THRESHOLD = 3

def get_zone(cx, cy, zones):
    for zone_name, polygon in zones.items():
        if cv2.pointPolygonTest(polygon, (cx, cy), False) >= 0:
            return zone_name
    return None

def check_anomaly(zone_name, current_count):
    history = reading_history[zone_name]
    history.append(current_count)
    if len(history) < 10:
        return False, 0.0
    arr = np.array(history)
    mean = np.mean(arr)
    std  = np.std(arr)
    if std == 0:
        return False, 0.0
    z_score = abs((current_count - mean) / std)
    return z_score > ALERT_THRESHOLD, round(z_score, 2)

def get_risk_level(count, is_anomaly):
    if is_anomaly:
        return "CRITICAL", (0, 0, 255)
    elif count >= 5:
        return "HIGH",     (0, 100, 255)
    elif count >= 3:
        return "MEDIUM",   (0, 200, 255)
    else:
        return "LOW",      (0, 255, 0)

def get_forecast(zone_name):
    history = list(reading_history[zone_name])
    if len(history) < 5:
        return None, None
    recent  = history[-5:]
    trend   = recent[-1] - recent[0]
    current = history[-1]
    if trend <= 0:
        return "STABLE", (0, 255, 0)
    HIGH_THRESHOLD = 5
    if current >= HIGH_THRESHOLD:
        return "ALREADY HIGH", (0, 0, 255)
    remaining       = HIGH_THRESHOLD - current
    rate_per_reading = trend / 5
    if rate_per_reading <= 0:
        return "STABLE", (0, 255, 0)
    minutes = round(((remaining / rate_per_reading) * 30) / 60, 1)
    if minutes < 2:
        return "SURGE IMMINENT",      (0, 0, 255)
    elif minutes < 5:
        return f"HIGH in ~{minutes}m", (0, 100, 255)
    else:
        return f"HIGH in ~{minutes}m", (0, 200, 255)
def is_preemptive_alert(zone_name):
    history = list(reading_history[zone_name])
    if len(history) < 5:
        return False

    recent = history[-5:]

    # steady upward trend
    if recent[-1] > recent[0] and all(x <= y for x, y in zip(recent, recent[1:])):
        return True

    return False

# Camera setup
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("ERROR: Webcam not found")
    exit()

W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

ZONES = {
    "Gate A":     np.array([[0, 0],       [W//2, 0],    [W//2, H//2], [0, H//2]],    np.int32),
    "Platform 1": np.array([[W//2, 0],    [W, 0],       [W, H//2],    [W//2, H//2]], np.int32),
    "Platform 2": np.array([[0, H//2],    [W//2, H//2], [W//2, H],    [0, H]],       np.int32),
    "Concourse":  np.array([[W//2, H//2], [W, H//2],    [W, H],       [W//2, H]],    np.int32),
}

# SQLite setup
conn = sqlite3.connect("crowdsense.db")
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS crowd_log (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        venue_id  TEXT,
        zone_id   TEXT,
        count     INTEGER,
        z_score   REAL,
        anomaly   INTEGER,
        alert     TEXT,
        timestamp TEXT
    )
""")
conn.commit()

last_log_time  = time.time()
VENUE_ID       = "VESIT_CANTEEN"
API_URL = "http://localhost:5000/api/ingest/cctv"
BACKEND_ONLINE = False

print("Press Q (click webcam window first) to quit")
cv2.namedWindow("CrowdSense - Zone Detection", cv2.WINDOW_NORMAL)
cv2.resizeWindow("CrowdSense - Zone Detection", 800, 600)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # CLAHE
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    frame = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)

    # Zone overlay
    overlay = frame.copy()
    for zone_name, polygon in ZONES.items():
        cv2.fillPoly(overlay, [polygon], ZONE_COLORS[zone_name])
    frame = cv2.addWeighted(overlay, 0.15, frame, 0.85, 0)

    for zone_name, polygon in ZONES.items():
        cv2.polylines(frame, [polygon], True, ZONE_COLORS[zone_name], 2)
        x, y = polygon[0]
        cv2.putText(frame, zone_name, (x + 8, y + 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, ZONE_COLORS[zone_name], 2)

    # YOLO
    results = model.predict(source=frame, classes=[0], conf=0.35, iou=0.45, verbose=False)

    zone_counts = {z: 0 for z in ZONES}
    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        zone = get_zone(cx, cy, ZONES)
        if zone:
            zone_counts[zone] += 1
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
        cv2.circle(frame, (cx, cy), 4, (0, 255, 255), -1)

    # Anomaly check + left panel
    total    = sum(zone_counts.values())
    y_offset = 60

    for zone_name, count in zone_counts.items():
        is_anomaly, z_score = check_anomaly(zone_name, count)
        risk_level, risk_color = get_risk_level(count, is_anomaly)
        anomaly_status[zone_name] = is_anomaly

        label = f"{zone_name}: {count} [{risk_level}]"
        if is_anomaly:
            label += f" z={z_score}"

        cv2.putText(frame, label, (20, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.52, risk_color, 2)
        y_offset += 25
    
    pre_alert_zones = []

    for zone_name in ZONES:
        if is_preemptive_alert(zone_name):
            pre_alert_zones.append(zone_name)

    # CRITICAL banner
    if any(anomaly_status.values()):
        cv2.rectangle(frame, (0, H - 60), (W, H), (0, 0, 200), -1)
        cv2.putText(frame, "!! ANOMALY DETECTED - SURGE IN PROGRESS",
                    (20, H - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

    # Total
    cv2.putText(frame, f"TOTAL: {total}", (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    # Backend status
    status_text  = "Backend: ONLINE" if BACKEND_ONLINE else "Backend: OFFLINE"
    status_color = (0, 255, 0) if BACKEND_ONLINE else (0, 0, 255)
    cv2.putText(frame, status_text, (W - 220, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)

    # Forecast panel (right side)
    fx = W // 2 + 10
    fy = 50
    cv2.putText(frame, "FORECAST:", (fx, fy),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    fy += 22
    for zone_name in ZONES:
        forecast_text, forecast_color = get_forecast(zone_name)
        if forecast_text:
            cv2.putText(frame, f"{zone_name}: {forecast_text}", (fx, fy),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.48, forecast_color, 1)
            fy += 20

    
    # Log every 30s
    if time.time() - last_log_time >= 30:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        for zone_name, count in zone_counts.items():
            # ALWAYS compute fresh (do NOT read from dict)
            is_anomaly, z_score = check_anomaly(zone_name, count)
            risk_level, _ = get_risk_level(count, is_anomaly)

            cursor.execute(
                "INSERT INTO crowd_log (venue_id, zone_id, count, z_score, anomaly, alert, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (VENUE_ID, zone_name, count, z_score, int(is_anomaly), risk_level, timestamp)
            )

            frame_id = int(time.time() * 1000)  # unique per frame

            payload = {
                "venueId": "cst-mumbai",
                "zoneId": zone_name,
                "count": count,
                "frameId": str(frame_id),
                "confidence": round(count / 10, 2)  # simple approximation
            }

            try:
                response = requests.post(API_URL, json=payload, timeout=1)
                BACKEND_ONLINE = response.status_code == 200
            except:
                BACKEND_ONLINE = False

        conn.commit()
        last_log_time = time.time()
        print(f"[{timestamp}] {zone_counts} | Anomalies: {anomaly_status}")

        

    cv2.imshow("CrowdSense - Zone Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
conn.close()
cv2.destroyAllWindows()