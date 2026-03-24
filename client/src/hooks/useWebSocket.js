import { useEffect, useState, useRef, useCallback } from 'react';
import useCrowdStore from '../store/crowdStore';
import useAlertStore from '../store/alertStore';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

export const useWebSocket = (venueId) => {
  const [status, setStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected', 'reconnecting'
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectDelay = 8000;

  const updateCrowdData = useCrowdStore(state => state.updateFromWebSocket);
  const addLiveAlert = useAlertStore(state => state.addLiveAlert);

  const connect = useCallback(() => {
    if (!venueId) return;

    setStatus(reconnectAttempts.current > 0 ? 'reconnecting' : 'connecting');

    const ws = new WebSocket(`${WS_URL}/live/${venueId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      reconnectAttempts.current = 0;
      console.log('WS Connected for venue:', venueId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
            case 'CROWD_UPDATE':
                updateCrowdData(data.payload);
                break;
            case 'ALERT':
                addLiveAlert(data.payload.alert);
                // Optional: Show toast for CRITICAL alerts immediately
                if (data.payload.alert.level === 'CRITICAL') {
                    toast.error(`CRITICAL: ${data.payload.alert.message}`, { duration: 5000 });
                } else if (data.payload.alert.level === 'HIGH') {
                    toast('High Density Warning', { icon: '⚠️' });
                }
                break;
            default:
                console.log('Unknown WS message:', data.type);
        }
      } catch (err) {
        console.error('WS Parse Error', err);
      }
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return; // Ignore if intentional manual close
      
      setStatus('disconnected');
      
      // Exponential backoff reconnect
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), maxReconnectDelay);
      reconnectAttempts.current += 1;
      
      console.log(`WS Disconnected. Reconnecting in ${delay}ms...`);
      setTimeout(connect, delay);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      // Let onclose handle the reconnect
    };

  }, [venueId, updateCrowdData, addLiveAlert]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { status };
};

export default useWebSocket;
