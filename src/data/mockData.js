// FermaSense AI — Comprehensive Mock Data

export const mockUser = {
  _id: '1',
  name: 'Dr. Sarah Chen',
  email: 'sarah@fermasense.io',
  role: 'researcher',
  organization: 'FermaSense Labs',
  avatar: null,
  isActive: true,
  lastLogin: new Date().toISOString(),
};

// ─── Sensor Parameters ──────────────────────────
export const mockSensorData = {
  temperature: { value: 28.4, min: 20, max: 40, unit: '°C', status: 'normal', trend: 'stable' },
  ph: { value: 4.52, min: 3, max: 7, unit: 'pH', status: 'normal', trend: 'decreasing' },
  co2: { value: 12.8, min: 0, max: 25, unit: '%', status: 'warning', trend: 'increasing' },
  turbidity: { value: 342, min: 0, max: 800, unit: 'NTU', status: 'normal', trend: 'stable' },
  dissolved_oxygen: { value: 2.3, min: 0, max: 10, unit: 'mg/L', status: 'normal', trend: 'decreasing' },
  pressure: { value: 1.02, min: 0.8, max: 1.5, unit: 'atm', status: 'normal', trend: 'stable' },
};

// ─── Time-Series Chart Data ─────────────────────
const generateTimeSeries = (base, variance, points = 24) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - 1 - i) * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    value: +(base + (Math.random() - 0.5) * variance).toFixed(2),
  }));
};

export const mockChartData = {
  temperature: generateTimeSeries(28, 3),
  ph: generateTimeSeries(4.5, 0.6),
  co2: generateTimeSeries(12, 5),
  turbidity: generateTimeSeries(340, 80),
};

// ─── Batches ────────────────────────────────────
export const mockBatches = [
  {
    _id: 'b1', batchId: 'BATCH-2026-001', yeastStrain: 'Saccharomyces cerevisiae S288C',
    status: 'active', startDate: '2026-05-10T08:00:00Z', progress: 72,
    targetTemp: 28, targetPH: 4.5, targetDuration: 168, tankId: 'Tank-A1',
    healthScore: 87,
  },
  {
    _id: 'b2', batchId: 'BATCH-2026-002', yeastStrain: 'Pichia pastoris GS115',
    status: 'active', startDate: '2026-05-12T14:00:00Z', progress: 45,
    targetTemp: 30, targetPH: 5.0, targetDuration: 120, tankId: 'Tank-B2',
    healthScore: 93,
  },
  {
    _id: 'b3', batchId: 'BATCH-2026-003', yeastStrain: 'Kluyveromyces marxianus',
    status: 'completed', startDate: '2026-05-01T06:00:00Z', progress: 100,
    targetTemp: 37, targetPH: 5.5, targetDuration: 96, tankId: 'Tank-C1',
    healthScore: 95,
  },
  {
    _id: 'b4', batchId: 'BATCH-2026-004', yeastStrain: 'Yarrowia lipolytica',
    status: 'paused', startDate: '2026-05-14T10:00:00Z', progress: 18,
    targetTemp: 26, targetPH: 6.0, targetDuration: 144, tankId: 'Tank-A3',
    healthScore: 61,
  },
  {
    _id: 'b5', batchId: 'BATCH-2025-089', yeastStrain: 'S. cerevisiae W303',
    status: 'failed', startDate: '2026-04-20T08:00:00Z', progress: 55,
    targetTemp: 30, targetPH: 4.8, targetDuration: 120, tankId: 'Tank-D1',
    healthScore: 22,
  },
];

// ─── Devices ────────────────────────────────────
export const mockDevices = [
  { _id: 'd1', deviceId: 'SENS-T-001', name: 'Temperature Probe Alpha', type: 'temperature', status: 'online', battery: 94, firmware: 'v2.4.1', assignedBatch: 'BATCH-2026-001', lastSeen: '2026-05-15T13:42:00Z', signalStrength: 98, calibratedAt: '2026-05-01T10:00:00Z', readings: 14280 },
  { _id: 'd2', deviceId: 'SENS-PH-002', name: 'pH Electrode Beta', type: 'ph', status: 'online', battery: 78, firmware: 'v2.4.1', assignedBatch: 'BATCH-2026-001', lastSeen: '2026-05-15T13:42:00Z', signalStrength: 92, calibratedAt: '2026-05-10T14:00:00Z', readings: 14280 },
  { _id: 'd3', deviceId: 'SENS-CO2-003', name: 'CO₂ Analyzer Gamma', type: 'co2', status: 'online', battery: 66, firmware: 'v2.3.8', assignedBatch: 'BATCH-2026-002', lastSeen: '2026-05-15T13:41:00Z', signalStrength: 85, calibratedAt: '2026-04-28T08:00:00Z', readings: 9520 },
  { _id: 'd4', deviceId: 'SENS-TU-004', name: 'Turbidity Sensor Delta', type: 'turbidity', status: 'warning', battery: 23, firmware: 'v2.3.5', assignedBatch: 'BATCH-2026-001', lastSeen: '2026-05-15T13:40:00Z', signalStrength: 71, calibratedAt: '2026-04-15T12:00:00Z', readings: 14200 },
  { _id: 'd5', deviceId: 'SENS-DO-005', name: 'DO Probe Epsilon', type: 'dissolved_oxygen', status: 'offline', battery: 0, firmware: 'v2.2.0', assignedBatch: null, lastSeen: '2026-05-14T22:10:00Z', signalStrength: 0, calibratedAt: '2026-03-20T09:00:00Z', readings: 52100 },
  { _id: 'd6', deviceId: 'SENS-P-006', name: 'Pressure Transducer Zeta', type: 'pressure', status: 'online', battery: 88, firmware: 'v2.4.1', assignedBatch: 'BATCH-2026-002', lastSeen: '2026-05-15T13:42:00Z', signalStrength: 95, calibratedAt: '2026-05-05T16:00:00Z', readings: 7600 },
  { _id: 'd7', deviceId: 'SENS-T-007', name: 'Temperature Probe Eta', type: 'temperature', status: 'maintenance', battery: 55, firmware: 'v2.3.8', assignedBatch: null, lastSeen: '2026-05-13T18:30:00Z', signalStrength: 0, calibratedAt: '2026-02-10T11:00:00Z', readings: 98400 },
  { _id: 'd8', deviceId: 'SENS-PH-008', name: 'pH Electrode Theta', type: 'ph', status: 'online', battery: 91, firmware: 'v2.4.1', assignedBatch: 'BATCH-2026-004', lastSeen: '2026-05-15T13:42:00Z', signalStrength: 96, calibratedAt: '2026-05-12T09:00:00Z', readings: 2160 },
];

// ─── Alerts ─────────────────────────────────────
export const mockAlerts = [
  { _id: 'a1', type: 'temperature', severity: 'critical', message: 'Temperature exceeded 35°C in Tank-A1', batchId: 'BATCH-2026-001', value: 36.2, threshold: 35, isRead: false, isAcknowledged: false, createdAt: '2026-05-15T13:30:00Z' },
  { _id: 'a2', type: 'co2', severity: 'warning', message: 'CO₂ levels rising rapidly in Tank-B2', batchId: 'BATCH-2026-002', value: 18.5, threshold: 20, isRead: false, isAcknowledged: false, createdAt: '2026-05-15T13:15:00Z' },
  { _id: 'a3', type: 'ph', severity: 'warning', message: 'pH dropping below target range in Tank-A1', batchId: 'BATCH-2026-001', value: 3.8, threshold: 4.0, isRead: true, isAcknowledged: false, createdAt: '2026-05-15T12:45:00Z' },
  { _id: 'a4', type: 'sensor_disconnect', severity: 'critical', message: 'DO Probe Epsilon lost connection', batchId: null, value: null, threshold: null, isRead: false, isAcknowledged: false, createdAt: '2026-05-14T22:10:00Z' },
  { _id: 'a5', type: 'ai_anomaly', severity: 'info', message: 'AI detected unusual fermentation curve pattern in Tank-C1', batchId: 'BATCH-2026-003', value: null, threshold: null, isRead: true, isAcknowledged: true, createdAt: '2026-05-14T16:20:00Z' },
  { _id: 'a6', type: 'turbidity', severity: 'warning', message: 'Turbidity sensor battery critically low (23%)', batchId: 'BATCH-2026-001', value: 23, threshold: 25, isRead: true, isAcknowledged: false, createdAt: '2026-05-14T10:00:00Z' },
  { _id: 'a7', type: 'temperature', severity: 'info', message: 'Temperature returned to normal range in Tank-B2', batchId: 'BATCH-2026-002', value: 29.8, threshold: 32, isRead: true, isAcknowledged: true, createdAt: '2026-05-13T20:30:00Z' },
  { _id: 'a8', type: 'ai_anomaly', severity: 'warning', message: 'Predicted risk of contamination in Tank-A3 within 6h', batchId: 'BATCH-2026-004', value: null, threshold: null, isRead: false, isAcknowledged: false, createdAt: '2026-05-15T11:05:00Z' },
];

// ─── Predictions ────────────────────────────────
export const mockPredictions = {
  healthScore: 87,
  confidence: 92,
  riskLevel: 'low',
  predictions: [
    { type: 'fermentation_end', value: '~18 hours remaining', confidence: 88, icon: 'clock' },
    { type: 'contamination_risk', value: '2.1% probability', confidence: 94, icon: 'shield' },
    { type: 'yield_estimate', value: '94.2% of target', confidence: 85, icon: 'target' },
    { type: 'optimal_harvest', value: 'May 16, 03:00 UTC', confidence: 79, icon: 'calendar' },
  ],
  recommendations: [
    { priority: 'high', title: 'Reduce Temperature', description: 'Lower Tank-A1 temperature by 2°C to prevent thermal stress on yeast cells. Current trajectory suggests enzyme denaturation risk above 35°C.', impact: 'Prevents 15% yield loss' },
    { priority: 'medium', title: 'Adjust pH Buffer', description: 'Add 50mL of sodium hydroxide solution to Tank-A1. pH trending below optimal range for S. cerevisiae.', impact: 'Maintains metabolic efficiency' },
    { priority: 'low', title: 'Schedule Sensor Calibration', description: 'Turbidity sensor SENS-TU-004 due for calibration. Last calibrated 30 days ago.', impact: 'Ensures data accuracy' },
    { priority: 'info', title: 'CO₂ Monitoring Note', description: 'CO₂ production rate consistent with exponential growth phase. No action required.', impact: 'Informational' },
  ],
  riskFactors: [
    { name: 'Temperature Stability', score: 72, status: 'warning' },
    { name: 'pH Consistency', score: 85, status: 'good' },
    { name: 'CO₂ Production Rate', score: 90, status: 'excellent' },
    { name: 'Contamination Risk', score: 95, status: 'excellent' },
    { name: 'Nutrient Levels', score: 78, status: 'good' },
    { name: 'Cell Viability', score: 88, status: 'good' },
  ],
};

// ─── Trends (Historical Data for Reports) ───────
const generateTrend = (base, variance, days = 30) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: +(base + (Math.random() - 0.5) * variance + Math.sin(i / 5) * (variance / 3)).toFixed(2),
      predicted: +(base + (Math.random() - 0.5) * (variance * 0.5) + Math.sin(i / 5) * (variance / 4)).toFixed(2),
    };
  });
};

export const mockTrends = {
  temperature: generateTrend(28, 4, 30),
  ph: generateTrend(4.5, 1, 30),
  co2: generateTrend(12, 6, 30),
  turbidity: generateTrend(340, 100, 30),
  yield: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    actual: +(85 + Math.random() * 12).toFixed(1),
    target: 92,
  })),
};

// ─── Dashboard Statistics ───────────────────────
export const mockStats = {
  activeBatches: 2,
  totalDevices: 8,
  onlineDevices: 5,
  activeAlerts: 4,
  avgHealthScore: 87,
  uptime: 99.7,
  dataPointsToday: 28560,
  avgYield: 91.4,
};

// ─── Landing Page Features ──────────────────────
export const features = [
  {
    title: 'Real-Time Monitoring',
    description: 'Track temperature, pH, CO₂, turbidity, and dissolved oxygen with sub-second latency across all fermentation tanks.',
    icon: 'activity',
    color: 'cyan',
  },
  {
    title: 'AI Predictions',
    description: 'Machine learning models predict fermentation endpoints, contamination risks, and optimal harvest windows with 94%+ accuracy.',
    icon: 'brain',
    color: 'purple',
  },
  {
    title: 'Smart Alerts',
    description: 'Intelligent threshold-based and AI-anomaly alerts with severity classification, auto-escalation, and push notifications.',
    icon: 'bell',
    color: 'orange',
  },
  {
    title: 'IoT Device Management',
    description: 'Register, monitor, and calibrate IoT sensors remotely. Battery tracking, firmware updates, and signal strength monitoring.',
    icon: 'cpu',
    color: 'blue',
  },
  {
    title: 'Advanced Analytics',
    description: 'Historical trend analysis, batch comparison, yield forecasting, and exportable reports in CSV and PDF formats.',
    icon: 'chart',
    color: 'green',
  },
  {
    title: 'Enterprise Security',
    description: 'JWT authentication, role-based access control, encrypted data streams, and comprehensive audit logging.',
    icon: 'shield',
    color: 'pink',
  },
];

// ─── Notification Preferences ───────────────────
export const mockNotificationSettings = {
  email: true,
  push: true,
  sms: false,
  criticalAlerts: true,
  warningAlerts: true,
  infoAlerts: false,
  dailyDigest: true,
  weeklyReport: true,
};

// ─── Threshold Settings ─────────────────────────
export const mockThresholds = {
  temperature: { min: 20, max: 35, critical: 38 },
  ph: { min: 3.5, max: 6.0, critical: 3.0 },
  co2: { min: 0, max: 20, critical: 25 },
  turbidity: { min: 0, max: 600, critical: 750 },
};
