import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const FermentationContext = createContext(null);

// ─── Stages ─────────────────────────────────────
const STAGES = [
  { id: 'initializing', label: 'Initializing', duration: 6, color: '#6b7280', icon: '⚙️' },
  { id: 'yeast_activation', label: 'Yeast Activation', duration: 8, color: '#3b82f6', icon: '🧬' },
  { id: 'active_fermentation', label: 'Active Fermentation', duration: 16, color: '#22c55e', icon: '🔬' },
  { id: 'peak_activity', label: 'Peak Activity', duration: 12, color: '#f97316', icon: '⚡' },
  { id: 'stabilization', label: 'Stabilization', duration: 8, color: '#a855f7', icon: '📊' },
  { id: 'final_processing', label: 'Final Processing', duration: 6, color: '#06b6d4', icon: '🧪' },
  { id: 'completed', label: 'Batch Completed', duration: 0, color: '#10b981', icon: '✅' },
];
const TOTAL_DURATION = STAGES.reduce((s, st) => s + st.duration, 0);

// ─── Biological sensor curves ───────────────────
// Returns target values for a given overall progress (0-1) based on biological modeling.
// Each parameter follows a biologically-motivated curve, not independent random targets.
function biologicalTargets(progress) {
  const p = Math.max(0, Math.min(1, progress));
  // Temperature: rises during active/peak, cools during stabilization/final
  // Bell-shaped around 60% progress with asymmetric cooldown
  const temp = 22 + 8 * Math.sin(Math.PI * Math.pow(p, 0.7)) * (p < 0.85 ? 1 : 1 - (p - 0.85) * 4);
  // pH: starts neutral, drops as yeast produces acid, stabilizes low
  // Logistic-like decline
  const ph = 4.2 + 2.6 / (1 + Math.exp(6 * (p - 0.3)));
  // CO₂: follows metabolic activity — rises, peaks around 55-65%, then declines
  // Skewed gaussian
  const co2Peak = 0.55;
  const co2 = 0.3 + 14.7 * Math.exp(-Math.pow((p - co2Peak) / 0.2, 2));
  // Turbidity: cell density grows, peaks late, slight decline at end
  const turb = 40 + 380 * (1 / (1 + Math.exp(-10 * (p - 0.25)))) * (1 - 0.3 * Math.max(0, p - 0.8) / 0.2);
  return {
    temperature: Math.max(20, Math.min(38, temp)),
    ph: Math.max(3.5, Math.min(7.0, ph)),
    co2: Math.max(0.2, Math.min(16, co2)),
    turbidity: Math.max(30, Math.min(450, turb)),
  };
}

// ─── Scenario overrides — modify curves during specific stages ──
const SCENARIOS = {
  normal: { label: 'Normal Fermentation', description: 'Standard healthy batch operation', mods: {} },
  temp_spike: {
    label: 'Temperature Spike',
    description: 'Cooling system failure during peak activity',
    mods: {
      // During peak (progress ~0.56-0.74), temperature overshoots
      sensorMod: (sensors, progress) => {
        if (progress > 0.50 && progress < 0.75) {
          const intensity = Math.sin(Math.PI * ((progress - 0.50) / 0.25));
          sensors.temperature += 8 * intensity; // up to +8°C overshoot
          sensors.co2 += 3 * intensity; // metabolic stress raises CO₂
          sensors.ph -= 0.4 * intensity; // stress acidification
        }
        return sensors;
      },
    },
  },
  ph_failure: {
    label: 'pH Failure',
    description: 'Buffer depletion causes acidification crisis',
    mods: {
      sensorMod: (sensors, progress) => {
        if (progress > 0.30 && progress < 0.70) {
          const intensity = Math.min(1, (progress - 0.30) / 0.20);
          sensors.ph -= 1.5 * intensity; // pH crashes by up to 1.5
          sensors.turbidity -= 60 * intensity; // cell death reduces turbidity
        }
        return sensors;
      },
    },
  },
  sensor_disconnect: {
    label: 'Sensor Disconnect',
    description: 'Temperature probe loses connection mid-batch',
    mods: {
      sensorMod: (sensors, progress) => {
        // Sensor reads erratically then flatlines
        if (progress > 0.35 && progress < 0.50) {
          const phase = (progress - 0.35) / 0.15;
          if (phase < 0.5) {
            sensors.temperature += Math.sin(phase * 20) * 5; // erratic
          } else {
            sensors.temperature = 0; // flatline (disconnected)
          }
        }
        return sensors;
      },
    },
  },
  critical_instability: {
    label: 'Critical Instability',
    description: 'Multiple parameter failures cascade',
    mods: {
      sensorMod: (sensors, progress) => {
        if (progress > 0.45 && progress < 0.80) {
          const intensity = Math.min(1, (progress - 0.45) / 0.15);
          sensors.temperature += 6 * intensity;
          sensors.ph -= 1.2 * intensity;
          sensors.co2 += 6 * intensity;
          sensors.turbidity += 80 * intensity;
        }
        return sensors;
      },
    },
  },
};

// ─── Sequenced AI narrative per stage ───────────
// Messages are played IN ORDER, not randomly. Each has a trigger time (seconds into stage).
const AI_SCRIPT = {
  initializing: [
    { at: 1, type: 'info', text: 'Batch BATCH-2026-042 initialized — system self-check in progress' },
    { at: 3, type: 'info', text: 'All 6 sensors calibrated and reporting. Baseline readings locked.' },
    { at: 5, type: 'prediction', text: 'Media at 22.0°C ± 0.5°C. Conditions optimal. Proceeding to activation.' },
  ],
  yeast_activation: [
    { at: 1, type: 'insight', text: 'Yeast cells entering lag phase — metabolic machinery activating' },
    { at: 3, type: 'info', text: 'Cell viability confirmed: 97.2%. First CO₂ micro-bubbles detected.' },
    { at: 6, type: 'prediction', text: 'Lag phase nominal. Temperature rising from metabolic heat — expected.' },
  ],
  active_fermentation: [
    { at: 1, type: 'insight', text: 'Exponential growth phase confirmed — cell doubling time: 2.1 hours' },
    { at: 4, type: 'warning', text: 'pH declining as organic acids accumulate — acidification rate: 0.08 pH/h' },
    { at: 8, type: 'prediction', text: 'Peak activity predicted at ~55-65% progress. Ethanol: 1.2 g/L/h.' },
    { at: 12, type: 'insight', text: 'CO₂ evolution rate accelerating — fermentation kinetics on nominal trajectory' },
    { at: 15, type: 'recommendation', text: 'Consider buffer addition if pH drops below 4.5 to maintain viability' },
  ],
  peak_activity: [
    { at: 1, type: 'alert', text: 'Peak metabolic activity reached — maximum CO₂ evolution rate' },
    { at: 4, type: 'warning', text: 'Temperature at upper comfort zone — metabolic heat generation at maximum' },
    { at: 7, type: 'insight', text: 'Substrate consumption rate peaked at 3.8 g/L/h — glucose depleting' },
    { at: 10, type: 'recommendation', text: 'Maintain cooling at maximum. Reduce agitation to prevent foaming.' },
  ],
  stabilization: [
    { at: 1, type: 'insight', text: 'Fermentation entering deceleration phase — growth rate declining' },
    { at: 4, type: 'info', text: 'CO₂ production decreasing — substrate nearing exhaustion' },
    { at: 7, type: 'prediction', text: 'Cell viability 91.8%. No contamination indicators. Batch health improving.' },
  ],
  final_processing: [
    { at: 1, type: 'info', text: 'Controlled cooldown initiated. Residual sugar: 0.3 g/L — 99.2% conversion.' },
    { at: 3, type: 'prediction', text: 'Final yield projection: 93.7%. Optimal harvest window open.' },
    { at: 5, type: 'recommendation', text: 'Harvest within next 10 minutes for maximum cell viability.' },
  ],
  completed: [
    { at: 0, type: 'success', text: 'Batch completed successfully — all parameters within specification' },
  ],
};

// Scenario-specific alert sequences (fired by elapsed time into scenario-affected stage)
const SCENARIO_ALERTS = {
  temp_spike: [
    { progress: 0.52, type: 'warning', severity: 'warning', text: 'Temperature rising above optimal range — cooling system under stress' },
    { progress: 0.57, type: 'alert', severity: 'critical', text: '⚠️ CRITICAL: Temperature exceeds 34°C — cooling system failure detected!' },
    { progress: 0.60, type: 'alert', severity: 'critical', text: 'Thermal runaway risk — metabolic heat exceeding dissipation capacity' },
    { progress: 0.63, type: 'recommendation', severity: 'critical', text: 'IMMEDIATE ACTION: Activate emergency cooling. Reduce agitation. Consider ice bath.' },
    { progress: 0.68, type: 'insight', severity: 'warning', text: 'Yeast viability declining — thermal stress causing 2.1% cell death per minute' },
    { progress: 0.73, type: 'info', severity: 'info', text: 'Temperature beginning to stabilize as emergency measures take effect' },
  ],
  ph_failure: [
    { progress: 0.32, type: 'warning', severity: 'warning', text: 'pH buffer capacity declining — acid neutralization slowing' },
    { progress: 0.38, type: 'alert', severity: 'warning', text: 'pH dropping below 4.0 — approaching yeast stress threshold' },
    { progress: 0.43, type: 'alert', severity: 'critical', text: '⚠️ pH CRITICAL: 3.4 — yeast viability at risk of irreversible decline!' },
    { progress: 0.48, type: 'recommendation', severity: 'critical', text: 'Add 200mL 1M NaOH buffer immediately. Cell death imminent below pH 3.0.' },
    { progress: 0.55, type: 'insight', severity: 'warning', text: 'Turbidity declining — cell lysis detected. Yield will be impacted.' },
    { progress: 0.65, type: 'info', severity: 'info', text: 'pH partially recovering as acid production slows with reduced viability' },
  ],
  sensor_disconnect: [
    { progress: 0.36, type: 'warning', severity: 'warning', text: 'Temperature sensor SENS-T-001 showing intermittent signal dropouts' },
    { progress: 0.40, type: 'alert', severity: 'critical', text: '⚠️ SENSOR OFFLINE: Temperature probe SENS-T-001 disconnected!' },
    { progress: 0.42, type: 'recommendation', severity: 'warning', text: 'Switch to backup probe SENS-T-007. Check wiring harness connector J4.' },
    { progress: 0.46, type: 'info', severity: 'info', text: 'Backup sensor SENS-T-007 activated — calibration offset applied: +0.12°C' },
    { progress: 0.49, type: 'info', severity: 'info', text: 'Temperature readings restored. Primary sensor flagged for maintenance.' },
  ],
  critical_instability: [
    { progress: 0.47, type: 'warning', severity: 'warning', text: 'Multiple parameters beginning to drift from optimal ranges' },
    { progress: 0.50, type: 'alert', severity: 'warning', text: 'Temperature and pH simultaneously deviating — correlation suggests contamination' },
    { progress: 0.54, type: 'alert', severity: 'critical', text: '⚠️ MULTI-PARAMETER ALERT: Temp, pH, and CO₂ all in critical range!' },
    { progress: 0.58, type: 'alert', severity: 'critical', text: 'AI contamination model: probability increased to 34% — threshold exceeded' },
    { progress: 0.62, type: 'recommendation', severity: 'critical', text: 'EMERGENCY: Consider batch abort. Contamination risk unacceptable at >30%.' },
    { progress: 0.68, type: 'insight', severity: 'warning', text: 'Root cause analysis: metabolic profile inconsistent with pure culture. Likely bacterial ingress.' },
    { progress: 0.75, type: 'info', severity: 'info', text: 'Parameters beginning to stabilize — contamination contained but yield impacted' },
  ],
};

// ─── Smooth exponential approach with micro-noise ──
function approach(current, target, rate) {
  // Pure exponential smoothing — no random jumps
  const diff = target - current;
  // Micro-noise proportional to distance (larger when far from target, near-zero when close)
  const microNoise = diff * 0.02 * (Math.random() - 0.5);
  return current + diff * rate + microNoise;
}

// ─── Derive health score deterministically from sensor state ──
function computeHealth(sensors, idealTargets) {
  const tempDev = Math.abs(sensors.temperature - idealTargets.temperature);
  const phDev = Math.abs(sensors.ph - idealTargets.ph);
  const co2Dev = Math.abs(sensors.co2 - idealTargets.co2);
  const turbDev = Math.abs(sensors.turbidity - idealTargets.turbidity) / 10;
  // Weighted penalty — pH and temp are most critical biologically
  const penalty = tempDev * 2.5 + phDev * 10 + co2Dev * 0.8 + turbDev * 0.3;
  return Math.round(Math.max(15, Math.min(99, 98 - penalty)));
}

function computeRiskFactors(sensors, idealTargets, health) {
  const tDev = Math.abs(sensors.temperature - idealTargets.temperature);
  const pDev = Math.abs(sensors.ph - idealTargets.ph);
  const cDev = Math.abs(sensors.co2 - idealTargets.co2);
  return {
    tempStability: Math.round(Math.max(10, 98 - tDev * 6)),
    phConsistency: Math.round(Math.max(10, 98 - pDev * 14)),
    co2Rate: Math.round(Math.max(20, 96 - cDev * 2)),
    contamination: Math.round(Math.max(15, Math.min(99, health + 2))),
    cellViability: Math.round(Math.max(25, Math.min(98, health - 1))),
  };
}

function timeStr() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function makeEvent(type, text, severity, stage) {
  return { id: Date.now() + Math.random(), time: timeStr(), type, text, severity, stage };
}

// ═══════════════════════════════════════════════════
export function FermentationProvider({ children }) {
  // ─── Render state ─────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [activeScenario, setActiveScenario] = useState('normal');
  const [sensors, setSensors] = useState({ temperature: 22, ph: 6.8, co2: 0.3, turbidity: 40 });
  const [healthScore, setHealthScore] = useState(98);
  const [riskFactors, setRiskFactors] = useState({ tempStability: 98, phConsistency: 98, co2Rate: 96, contamination: 99, cellViability: 98 });
  const [predictions, setPredictions] = useState({ fermentationEnd: '—', contaminationRisk: '0.1%', yieldEstimate: '—', optimalHarvest: '—' });
  const [aiMessages, setAiMessages] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [chartData, setChartData] = useState({ temperature: [], ph: [], co2: [], turbidity: [] });

  // ─── Mutable refs for tick logic ──────────────
  const tickRef = useRef(null);
  const simRef = useRef({
    elapsed: 0,
    stageIdx: 0,
    stageTick: 0,
    scenario: 'normal',
    sensors: { temperature: 22, ph: 6.8, co2: 0.3, turbidity: 40 },
    aiScriptIndex: {}, // { stageId: nextMessageIndex }
    firedScenarioAlerts: new Set(),
    prevHealth: 98,
  });

  const currentStage = STAGES[stageIndex];

  // ─── Actions ──────────────────────────────────
  const startSimulation = useCallback((scenario = 'normal') => {
    const sim = simRef.current;
    sim.elapsed = 0;
    sim.stageIdx = 0;
    sim.stageTick = 0;
    sim.scenario = scenario;
    sim.sensors = { temperature: 22, ph: 6.8, co2: 0.3, turbidity: 40 };
    sim.aiScriptIndex = {};
    sim.firedScenarioAlerts = new Set();
    sim.prevHealth = 98;

    setActiveScenario(scenario);
    setIsRunning(true);
    setStageIndex(0);
    setStageProgress(0);
    setOverallProgress(0);
    setElapsed(0);
    setSensors({ ...sim.sensors });
    setHealthScore(98);
    setRiskFactors({ tempStability: 98, phConsistency: 98, co2Rate: 96, contamination: 99, cellViability: 98 });
    setPredictions({ fermentationEnd: `~${TOTAL_DURATION}s`, contaminationRisk: '0.1%', yieldEstimate: '—', optimalHarvest: '—' });
    setAiMessages([]);
    setChartData({ temperature: [], ph: [], co2: [], turbidity: [] });

    const label = SCENARIOS[scenario]?.label || 'Normal';
    setTimeline([makeEvent('stage', `Batch initialized — ${label} scenario started`, 'info', 'Initializing')]);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    setStageIndex(0); setStageProgress(0); setOverallProgress(0); setElapsed(0);
    setSensors({ temperature: 22, ph: 6.8, co2: 0.3, turbidity: 40 });
    setHealthScore(98); setAiMessages([]); setTimeline([]);
    setChartData({ temperature: [], ph: [], co2: [], turbidity: [] });
  }, [stopSimulation]);

  // ─── Main tick ────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;

    tickRef.current = setInterval(() => {
      const sim = simRef.current;
      sim.elapsed += 1;
      sim.stageTick += 1;

      const stage = STAGES[sim.stageIdx];
      if (!stage || stage.id === 'completed') {
        setIsRunning(false);
        // Fire completion message
        setAiMessages(prev => [{ id: Date.now(), type: 'success', text: 'Batch completed successfully — all parameters within specification', time: timeStr() }, ...prev]);
        setTimeline(prev => [makeEvent('success', 'Batch completed — simulation finished', 'info', 'Completed'), ...prev]);
        return;
      }

      // ── Stage progression ───────────────────
      const stgProg = Math.min(sim.stageTick / stage.duration, 1);
      const completedDur = STAGES.slice(0, sim.stageIdx).reduce((s, st) => s + st.duration, 0);
      const overallProg = (completedDur + sim.stageTick) / TOTAL_DURATION;

      setStageProgress(stgProg * 100);
      setOverallProgress(overallProg * 100);
      setElapsed(sim.elapsed);

      // ── Stage transition ────────────────────
      if (sim.stageTick >= stage.duration) {
        sim.stageTick = 0;
        sim.stageIdx += 1;
        const next = STAGES[sim.stageIdx];
        if (next) {
          setStageIndex(sim.stageIdx);
          setTimeline(prev => [makeEvent('stage', `Stage transition → ${next.label}`, 'info', next.label), ...prev].slice(0, 100));
        }
        return; // skip rest of this tick to cleanly enter new stage
      }

      // ── Sensor evolution (biological curves) ──
      const idealTargets = biologicalTargets(overallProg);

      // Apply scenario modifications
      let modTargets = { ...idealTargets };
      const scenarioData = SCENARIOS[sim.scenario];
      if (scenarioData?.mods?.sensorMod) {
        modTargets = scenarioData.mods.sensorMod({ ...modTargets }, overallProg);
      }

      // Smooth exponential approach — tuned for 60s simulation
      const rate = stage.id === 'initializing' || stage.id === 'completed' ? 0.20
        : stage.id === 'peak_activity' ? 0.25
        : 0.18;

      sim.sensors = {
        temperature: +approach(sim.sensors.temperature, modTargets.temperature, rate).toFixed(2),
        ph: +approach(sim.sensors.ph, modTargets.ph, rate * 0.8).toFixed(3), // pH moves slower biologically
        co2: +Math.max(0.1, approach(sim.sensors.co2, modTargets.co2, rate)).toFixed(2),
        turbidity: Math.round(Math.max(20, approach(sim.sensors.turbidity, modTargets.turbidity, rate * 0.9))),
      };

      setSensors({ ...sim.sensors });

      // ── Health score (deterministic from deviations) ──
      const health = computeHealth(sim.sensors, idealTargets);
      // Smooth health transitions — never jump more than 3 points per tick
      const smoothedHealth = Math.round(sim.prevHealth + Math.max(-3, Math.min(3, health - sim.prevHealth)));
      sim.prevHealth = smoothedHealth;
      setHealthScore(smoothedHealth);
      setRiskFactors(computeRiskFactors(sim.sensors, idealTargets, smoothedHealth));

      // ── Chart data ────────────────────────────
      const t = timeStr();
      setChartData(prev => ({
        temperature: [...prev.temperature.slice(-59), { time: t, value: sim.sensors.temperature }],
        ph: [...prev.ph.slice(-59), { time: t, value: sim.sensors.ph }],
        co2: [...prev.co2.slice(-59), { time: t, value: sim.sensors.co2 }],
        turbidity: [...prev.turbidity.slice(-59), { time: t, value: sim.sensors.turbidity }],
      }));

      // ── Predictions (derived from state, not random) ──
      const remaining = TOTAL_DURATION - sim.elapsed;
      const baseYield = sim.scenario === 'normal' ? 93.7 : sim.scenario === 'temp_spike' ? 85 + smoothedHealth * 0.05 : 80 + smoothedHealth * 0.08;
      const contRisk = Math.max(0.1, 100 - smoothedHealth * 1.02);
      setPredictions({
        fermentationEnd: remaining > 0 ? `~${remaining}s remaining` : 'Complete',
        contaminationRisk: `${contRisk.toFixed(1)}%`,
        yieldEstimate: `${Math.min(99, baseYield + (smoothedHealth - 70) * 0.1).toFixed(1)}%`,
        optimalHarvest: overallProg > 0.8 ? 'Now — harvest window open' : overallProg > 0.6 ? 'Approaching' : 'Not yet',
      });

      // ── Sequenced AI messages ─────────────────
      const script = AI_SCRIPT[stage.id];
      if (script) {
        const scriptKey = stage.id;
        if (sim.aiScriptIndex[scriptKey] === undefined) sim.aiScriptIndex[scriptKey] = 0;
        const nextIdx = sim.aiScriptIndex[scriptKey];
        if (nextIdx < script.length && sim.stageTick >= script[nextIdx].at) {
          const msg = script[nextIdx];
          sim.aiScriptIndex[scriptKey] = nextIdx + 1;
          const entry = { id: Date.now() + Math.random(), type: msg.type, text: msg.text, time: timeStr() };
          setAiMessages(prev => [entry, ...prev].slice(0, 30));
          setTimeline(prev => [makeEvent(msg.type, msg.text, msg.type === 'alert' || msg.type === 'warning' ? 'warning' : 'info', stage.label), ...prev].slice(0, 100));
        }
      }

      // ── Scenario alerts (fired by progress, not random) ──
      const scenarioAlerts = SCENARIO_ALERTS[sim.scenario];
      if (scenarioAlerts) {
        for (const alert of scenarioAlerts) {
          const key = `${alert.progress}`;
          if (overallProg >= alert.progress && !sim.firedScenarioAlerts.has(key)) {
            sim.firedScenarioAlerts.add(key);
            setTimeline(prev => [makeEvent(alert.type, alert.text, alert.severity, stage.label), ...prev].slice(0, 100));
            setAiMessages(prev => [{ id: Date.now() + Math.random(), type: alert.type, text: alert.text, time: timeStr() }, ...prev].slice(0, 30));
          }
        }
      }
    }, 1000);

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isRunning]);

  return (
    <FermentationContext.Provider value={{
      isRunning, currentStage, currentStageIndex: stageIndex, stageProgress, overallProgress,
      elapsedTime: elapsed, sensors, healthScore, aiMessages, predictions, riskFactors,
      timeline, chartData, activeScenario,
      stages: STAGES, scenarios: SCENARIOS, totalDuration: TOTAL_DURATION,
      startSimulation, stopSimulation, resetSimulation,
    }}>
      {children}
    </FermentationContext.Provider>
  );
}

export const useFermentation = () => {
  const ctx = useContext(FermentationContext);
  if (!ctx) throw new Error('useFermentation must be used within FermentationProvider');
  return ctx;
};
