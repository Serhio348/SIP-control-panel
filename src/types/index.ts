export interface SystemState {
  tankLevel: number;
  tankTemperature: number;
  targetTemperature: number;
  waterSupply: boolean;
  heating: boolean;
  alkaliDosing: boolean;
  alkaliSolutionAmount: number;
  acidDosing: boolean;
  acidSolutionAmount: number;
  acidDosingRate: number;
  alkaliDosingRate: number;
  feedPump: boolean;
  pumpFrequency: number;
  pumpStartTime: number | null;
  pumpTotalTime: number;
  returnPump: boolean;
  returnPumpFrequency: number;
  returnPumpStartTime: number | null;
  returnPumpTotalTime: number;
  systemRunning: boolean;
  cycleRunning: boolean;
  cycleStartTime: number | null;
  cycleDuration: number;
  targetLevel: number;
  cyclePhase: CyclePhase;
  systemPaused: boolean;
  cyclePausedTime: number | null;
  totalPausedTime: number;
  temperatureHistory: TemperaturePoint[];
  maxHistoryPoints: number;
  targetConcentration: number;
  currentConductivity: number;
  upperThreshold: number;
  lowerThreshold: number;
  lastDosingState: DosingState;
  isManualDosing: boolean;
  alarms: Alarm[];
}

export type CyclePhase = 'idle' | 'filling' | 'processing' | 'completed';
export type DosingState = 'alkali' | 'acid' | 'none';
export type AlarmType = 'error' | 'warning' | 'info' | 'success';

export interface TemperaturePoint {
  time: number;
  actualTemp: number;
  targetTemp: number;
}

export interface Alarm {
  message: string;
  type: AlarmType;
  timestamp: string;
}

export interface CalibrationData {
  concentrations: number[];
  temperatures: number[];
  data: number[][];
}

export interface SystemActions {
  toggleTank: () => void;
  emergencyStop: () => void;
  toggleValve: () => void;
  toggleHeating: () => void;
  startAlkaliDosing: () => void;
  startAcidDosing: () => void;
  togglePump: () => void;
  toggleReturnPump: () => void;
  startCycle: () => void;
  pauseSystem: () => void;
  setTankTemperature: (temp: number) => void;
  setAlkaliDosingRate: (rate: number) => void;
  setAcidDosingRate: (rate: number) => void;
  setAlkaliAmount: (amount: number) => void;
  setAcidAmount: (amount: number) => void;
  setTargetConcentration: (concentration: number) => void;
  setHysteresisThresholds: (upper: number, lower: number) => void;
  setPumpFrequency: (frequency: number) => void;
  setReturnPumpFrequency: (frequency: number) => void;
  setCycleDuration: (duration: number) => void;
  setTargetLevel: (level: number) => void;
  setTankLevel: (level: number) => void;
  saveCalibrationData: (data: CalibrationData) => void;
  addAlarm: (message: string, type: AlarmType) => void;
  triggerAutoAlkaliDosing: (conductivity: number, targetConductivity: number) => void;
  resetAlarms: () => void;
}

export interface SystemContextType {
  state: SystemState;
  actions: SystemActions;
  alarms: Alarm[];
  calibrationData: CalibrationData;
  dispatch: React.Dispatch<any>;
}

export interface ControlPanelProps {
  title: string;
  children: React.ReactNode;
  settingsIcon?: boolean;
  onSettingsClick?: () => void;
}

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning';
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ValueDisplayProps {
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface PumpDisplayProps {
  isRunning: boolean;
  frequency: number;
  flowRate: number;
  pressure: number;
  operatingTime: number;
  onToggle: () => void;
  onSettingsClick: () => void;
}

export interface TankDisplayProps {
  level: number;
  temperature: number;
  targetTemperature: number;
  onAutoFill: () => void;
  onEmergencyStop: () => void;
  onSettingsClick: () => void;
}

export interface DosingStationProps {
  type: 'alkali' | 'acid';
  isActive: boolean;
  solutionAmount: number;
  dosingRate: number;
  onToggle: () => void;
  onSetAmount: (amount: number) => void;
  onSetRate: (rate: number) => void;
  disabled?: boolean;
}

export interface ConductometerProps {
  currentConductivity: number;
  targetConcentration: number;
  targetTemperature: number;
  upperThreshold: number;
  lowerThreshold: number;
  onSettingsClick: () => void;
}

export interface HeatExchangerProps {
  isActive: boolean;
  waterTemperature: number;
  steamTemperature: number;
  onToggle: () => void;
}

export interface SystemOverviewProps {
  totalSystemTime: string;
  processStatus: string;
  currentCycle: string;
  remainingTime: string;
  onStartCycle: () => void;
  onPauseSystem: () => void;
  onSystemSettings: () => void;
  onAlarmClick: () => void;
  hasAlarms?: boolean;
  isCycleRunning?: boolean;
  isSystemPaused?: boolean;
}
