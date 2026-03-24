# CrowdSense AI 🛡️

**A predictive crowd management and surge prevention platform.**

CrowdSense AI is a full-stack MERN application designed to ingest multi-sensor data (CCTV, BLE, WiFi, SMS) from large venues (transit hubs, stadiums, festivals), fuse the data to estimate crowd density, and trigger real-time alerts to prevent stampedes and overcrowding.

## 🚀 Features

*   **Multi-Modal Sensor Fusion**: Combines CCTV bounding boxes, BLE device counts, and motion classification using a weighted Kalman filter approach.
*   **Real-time Risk Engine**: Calculates a 0-100 stampede risk score based on density thresholds, surge rates, and statistical anomalies.
*   **Live Dashboard**: A React + Tailwind dashboard for operators to monitor zone analytics, view simulated YOLO feeds, and dispatch guards.
*   **WebSockets**: Bi-directional real-time data streaming to the frontend powered by Redis Pub/Sub.
*   **Twilio Integration**: Automated SMS and WhatsApp alerts to stakeholders, plus an SMS intake webhook for offline commuter reporting.
*   **Commuter App**: A mobile-first public view for citizens to check live transit conditions.
*   **Simulation Engine**: Built-in endpoints to trigger fake crowd surges for demonstration and stress testing.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Zustand (State), React Query, React Router, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database & Cache**: MongoDB (Mongoose), Redis (Caching & Pub/Sub).
*   **Integrations**: Twilio (SMS/WhatsApp), WebSocket (ws).

## 📁 Project Structure

```
CrowdSense/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI widgets (Layout, Dashboard)
│   │   ├── hooks/          # useWebSocket, useCrowdData
│   │   ├── pages/          # Full route views (Login, Map, Commuter)
│   │   ├── services/       # Axios API generic configurations
│   │   ├── store/          # Zustand state managers
│   │   └── index.css       # Tailwind entry and custom styling
├── server/                 # Express Backend
│   ├── config/             # DB & Redis connections, Constants
│   ├── middleware/         # Auth, Role guards, Rate limiters, Error handling
│   ├── models/             # Mongoose Schemas (Venue, Alert, CrowdReading)
│   ├── routes/             # Express API endpoints
│   ├── seeds/              # Initial Mock Data (Venues, Historical Crowds)
│   ├── services/           # Core AI Math (Fusion, Risk, Prediction, Alerts)
│   ├── utils/              # Parsers and deduplicators
│   └── websocket/          # Live Pub/Sub broadcasting
└── docker-compose.yml      # Infrastructure orchestration
```

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose (for Mongo and Redis)
*   Twilio Account (Optional: requires `.env` configuration for real SMS)

### 1. Start Infrastructure
Start the MongoDB and Redis containers:
```bash
docker-compose up -d
```

### 2. Backend Setup
Configure environment and start the server:
```bash
cd server
npm install
cp .env.example .env  # Update variables if needed
npm run seed          # Load dummy venues and historical data
npm run dev
```
*Server runs on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:5173`*

### Demo Credentials
To log in to the operator dashboard, use:
*   **Email**: `operator@crowdsense.ai`
*   **Password**: `password123`

## 🧠 Core Architecture Highlights

1.  **Ingestion Limiters**: Heavy burst traffic from edge hardware is rate-limited via `express-rate-limit`.
2.  **Kalman Fusion Weighting**: `server/services/kalmanFusion.js` blends high-confidence data (CCTV) with low-confidence proxies (BLE) to provide a single truth metric.
3.  **Z-Score Anomaly Detection**: `server/services/anomalyDetector.js` automatically triggers warnings if current crowd sizes deviate significantly from historical standard deviations for that specific venue, zone, and hour.
4.  **Pub/Sub Scalability**: The `wsManager.js` routes all WebSocket real-time updates through Redis Pub/Sub, allowing multiple Node.js instances to scale horizontally behind a load balancer.

## 🛡️ License
MIT License
