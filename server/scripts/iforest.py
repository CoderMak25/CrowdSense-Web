import sys, json
import numpy as np
from sklearn.ensemble import IsolationForest
import warnings
warnings.filterwarnings('ignore')

def main():
    try:
        input_data = json.loads(sys.stdin.read())
        history = input_data.get('history', [])
        current = input_data.get('current', 0.0)
        
        if len(history) < 10:
            print(json.dumps({"anomaly_score": 0}))
            return
            
        X = np.array(history + [current]).reshape(-1, 1)
        clf = IsolationForest(contamination=0.1, random_state=42)
        clf.fit(X)
        
        score = clf.decision_function([[current]])[0]
        # Normalize: lower scores (negatives) are anomalies in sklearn.
        normalized = max(0, min(100, (0.5 - score) * 100))
        
        print(json.dumps({"anomaly_score": float(normalized)}))
    except Exception as e:
        print(json.dumps({"anomaly_score": 0, "error": str(e)}))

if __name__ == '__main__':
    main()
