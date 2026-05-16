import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { mockSensorData } from '../data/mockData';

const SocketContext = createContext(null);

// Realistic fluctuation with drift
const fluctuate = (base, range, drift = 0) => {
  const noise = (Math.random() - 0.5) * range;
  return +(base + noise + drift).toFixed(2);
};

// Generate a random alert
const alertTypes = ['temperature', 'ph', 'co2', 'turbidity', 'ai_anomaly', 'sensor_disconnect'];
const severities = ['critical', 'warning', 'info'];
const alertMessages = {
  temperature: ['Temperature spike detected in Tank-A1', 'Thermal drift exceeding safe range', 'Temperature anomaly in fermenter #3'],
  ph: ['pH dropped below optimal threshold', 'Acidification rate increasing abnormally', 'pH buffer depletion detected'],
  co2: ['CO₂ production rate surging', 'Gas evolution pattern abnormal', 'CO₂ concentration nearing safety limit'],
  turbidity: ['Unexpected turbidity increase', 'Optical density shift detected', 'Cell density anomaly in Tank-B2'],
  ai_anomaly: ['AI detected irregular fermentation curve', 'Predictive model flagged contamination risk', 'ML engine detected metabolic shift'],
  sensor_disconnect: ['Sensor SENS-T-007 intermittent signal', 'pH probe communication timeout', 'Pressure transducer signal weak'],
};

function generateRandomAlert() {
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const msgs = alertMessages[type];
  return {
    _id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    severity,
    message: msgs[Math.floor(Math.random() * msgs.length)],
    batchId: ['BATCH-2026-001', 'BATCH-2026-002', 'BATCH-2026-004'][Math.floor(Math.random() * 3)],
    value: type !== 'ai_anomaly' && type !== 'sensor_disconnect' ? +(Math.random() * 40).toFixed(1) : null,
    threshold: type !== 'ai_anomaly' && type !== 'sensor_disconnect' ? +(Math.random() * 35 + 5).toFixed(1) : null,
    isRead: false,
    isAcknowledged: false,
    createdAt: new Date().toISOString(),
    isLive: true,
  };
}

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [liveData, setLiveData] = useState(mockSensorData);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [healthScore, setHealthScore] = useState(87);
  const [healthConfidence, setHealthConfidence] = useState(92);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [chartHistory, setChartHistory] = useState({
    temperature: [],
    ph: [],
    co2: [],
    turbidity: [],
  });
  const [deviceStatuses, setDeviceStatuses] = useState({});
  const [riskLevel, setRiskLevel] = useState('low');
  const [dataPointCount, setDataPointCount] = useState(28560);
  const intervalRef = useRef(null);
  const alertIntervalRef = useRef(null);
  const driftRef = useRef({ temp: 0, ph: 0, co2: 0, turb: 0 });

  const startStreaming = useCallback(() => {
    if (intervalRef.current) return;
    setConnected(true);

    // Main sensor update — every 2 seconds
    intervalRef.current = setInterval(() => {
      // Slow drift simulation
      driftRef.current.temp += (Math.random() - 0.52) * 0.1;
      driftRef.current.ph += (Math.random() - 0.51) * 0.02;
      driftRef.current.co2 += (Math.random() - 0.48) * 0.15;
      driftRef.current.turb += (Math.random() - 0.5) * 2;

      // Clamp drifts
      driftRef.current.temp = Math.max(-3, Math.min(3, driftRef.current.temp));
      driftRef.current.ph = Math.max(-0.5, Math.min(0.5, driftRef.current.ph));
      driftRef.current.co2 = Math.max(-4, Math.min(4, driftRef.current.co2));
      driftRef.current.turb = Math.max(-50, Math.min(50, driftRef.current.turb));

      const newTemp = fluctuate(28.4, 2, driftRef.current.temp);
      const newPH = fluctuate(4.52, 0.3, driftRef.current.ph);
      const newCO2 = fluctuate(12.8, 3, driftRef.current.co2);
      const newTurb = Math.round(fluctuate(342, 40, driftRef.current.turb));

      const getStatus = (val, low, high) => val < low || val > high ? 'warning' : 'normal';
      const getTrend = (current, base) => current > base + 0.5 ? 'increasing' : current < base - 0.5 ? 'decreasing' : 'stable';

      setLiveData({
        temperature: { ...mockSensorData.temperature, value: newTemp, status: getStatus(newTemp, 22, 34), trend: getTrend(newTemp, 28.4) },
        ph: { ...mockSensorData.ph, value: newPH, status: getStatus(newPH, 3.8, 5.5), trend: getTrend(newPH, 4.52) },
        co2: { ...mockSensorData.co2, value: newCO2, status: getStatus(newCO2, 5, 18), trend: getTrend(newCO2, 12.8) },
        turbidity: { ...mockSensorData.turbidity, value: newTurb, status: getStatus(newTurb, 100, 600), trend: getTrend(newTurb, 342) },
        dissolved_oxygen: { ...mockSensorData.dissolved_oxygen, value: fluctuate(2.3, 0.5), status: 'normal', trend: 'stable' },
        pressure: { ...mockSensorData.pressure, value: fluctuate(1.02, 0.05), status: 'normal', trend: 'stable' },
      });

      // Update chart history (rolling window of 30 points)
      const timeLabel = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setChartHistory(prev => ({
        temperature: [...prev.temperature.slice(-29), { time: timeLabel, value: newTemp }],
        ph: [...prev.ph.slice(-29), { time: timeLabel, value: newPH }],
        co2: [...prev.co2.slice(-29), { time: timeLabel, value: newCO2 }],
        turbidity: [...prev.turbidity.slice(-29), { time: timeLabel, value: newTurb }],
      }));

      // Health score fluctuation
      setHealthScore(prev => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.round(Math.max(60, Math.min(98, prev + delta)));
      });
      setHealthConfidence(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.round(Math.max(75, Math.min(98, prev + delta)));
      });

      // Risk level based on health
      setHealthScore(prev => {
        setRiskLevel(prev >= 80 ? 'low' : prev >= 60 ? 'medium' : 'high');
        return prev;
      });

      // Data point counter
      setDataPointCount(prev => prev + Math.floor(Math.random() * 5) + 1);

      setLastUpdate(new Date());
    }, 2000);

    // Alert generation — every 8-15 seconds
    alertIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance of new alert
        const newAlert = generateRandomAlert();
        setLiveAlerts(prev => [newAlert, ...prev].slice(0, 50));
      }
    }, 8000 + Math.random() * 7000);

    // Device status changes — every 15-30 seconds
    const deviceInterval = setInterval(() => {
      const deviceIds = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'];
      const randomDevice = deviceIds[Math.floor(Math.random() * deviceIds.length)];
      const statuses = ['online', 'online', 'online', 'warning', 'offline']; // weighted toward online
      setDeviceStatuses(prev => ({
        ...prev,
        [randomDevice]: statuses[Math.floor(Math.random() * statuses.length)],
      }));
    }, 15000 + Math.random() * 15000);

    // Store cleanup ref
    intervalRef.current = { main: intervalRef.current, alerts: alertIntervalRef.current, devices: deviceInterval };
  }, []);

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      if (typeof intervalRef.current === 'object') {
        clearInterval(intervalRef.current.main);
        clearInterval(intervalRef.current.alerts);
        clearInterval(intervalRef.current.devices);
      } else {
        clearInterval(intervalRef.current);
      }
      if (alertIntervalRef.current) clearInterval(alertIntervalRef.current);
      intervalRef.current = null;
      alertIntervalRef.current = null;
    }
    setConnected(false);
  }, []);

  const dismissAlert = useCallback((id) => {
    setLiveAlerts(prev => prev.filter(a => a._id !== id));
  }, []);

  useEffect(() => {
    startStreaming();
    return () => stopStreaming();
  }, [startStreaming, stopStreaming]);

  return (
    <SocketContext.Provider value={{
      connected, liveData, lastUpdate, startStreaming, stopStreaming,
      healthScore, healthConfidence, riskLevel,
      liveAlerts, dismissAlert,
      chartHistory,
      deviceStatuses,
      dataPointCount,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
