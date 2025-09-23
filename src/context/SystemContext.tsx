import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  SystemState, 
  SystemActions, 
  SystemContextType, 
  Alarm, 
  CalibrationData,
  AlarmType,
  TemperaturePoint,
  CyclePhase,
} from '../types';

// Начальное состояние системы
const initialState: SystemState = {
  tankLevel: 65,
  tankTemperature: 60,
  targetTemperature: 45,
  waterSupply: false,
  heating: false,
  alkaliDosing: false,
  alkaliSolutionAmount: 85,
  acidDosing: false,
  acidSolutionAmount: 85,
  acidDosingRate: 1.8,
  alkaliDosingRate: 1.8,
  feedPump: false,
  pumpFrequency: 50.0,
  pumpStartTime: null,
  pumpTotalTime: 0,
  returnPump: false,
  returnPumpFrequency: 50.0,
  returnPumpStartTime: null,
  returnPumpTotalTime: 0,
  systemRunning: false,
  cycleRunning: false,
  cycleStartTime: null,
  cycleDuration: 15 * 60, // 15 минут в секундах
  targetLevel: 80,
  cyclePhase: 'idle',
  systemPaused: false,
  cyclePausedTime: null,
  totalPausedTime: 0,
  temperatureHistory: [],
  maxHistoryPoints: 60,
  targetConcentration: 1.0,
  currentConductivity: 13,
  upperThreshold: 26.0,
  lowerThreshold: 22.0,
  lastDosingState: 'none',
  isManualDosing: false,
  alarms: []
};

// Калибровочные данные
const initialCalibrationData: CalibrationData = {
  concentrations: [0.5, 1.0, 1.5, 2.0],
  temperatures: [20, 40, 50, 60, 70, 80],
  data: [
    [10.49, 11.92, 18.78, 21.28, 23.97, 26.86], // 0.5%
    [19.38, 24.10, 37.97, 43.03, 48.47, 54.32], // 1.0%
    [28.50, 35.40, 55.77, 63.20, 71.18, 79.76], // 1.5%
    [37.02, 47.30, 74.51, 84.45, 95.12, 106.60] // 2.0%
  ]
};

// Типы действий
type SystemAction = 
  | { type: 'TOGGLE_TANK' }
  | { type: 'EMERGENCY_STOP' }
  | { type: 'TOGGLE_VALVE' }
  | { type: 'TOGGLE_HEATING' }
  | { type: 'START_ALKALI_DOSING' }
  | { type: 'START_ACID_DOSING' }
  | { type: 'TOGGLE_PUMP' }
  | { type: 'TOGGLE_RETURN_PUMP' }
  | { type: 'START_CYCLE' }
  | { type: 'PAUSE_SYSTEM' }
  | { type: 'SET_TANK_TEMPERATURE'; payload: number }
  | { type: 'SET_ALKALI_DOSING_RATE'; payload: number }
  | { type: 'SET_ACID_DOSING_RATE'; payload: number }
  | { type: 'SET_ALKALI_AMOUNT'; payload: number }
  | { type: 'SET_ACID_AMOUNT'; payload: number }
  | { type: 'SET_TARGET_CONCENTRATION'; payload: number }
  | { type: 'SET_HYSTERESIS_THRESHOLDS'; payload: { upper: number; lower: number } }
  | { type: 'SET_PUMP_FREQUENCY'; payload: number }
  | { type: 'SET_RETURN_PUMP_FREQUENCY'; payload: number }
  | { type: 'SET_CYCLE_DURATION'; payload: number }
  | { type: 'SET_TARGET_LEVEL'; payload: number }
  | { type: 'SET_TANK_LEVEL'; payload: number }
  | { type: 'UPDATE_TEMPERATURE_HISTORY'; payload: TemperaturePoint }
  | { type: 'UPDATE_CONDUCTIVITY'; payload: number }
  | { type: 'UPDATE_TANK_LEVEL'; payload: number }
  | { type: 'UPDATE_TANK_TEMPERATURE'; payload: number }
  | { type: 'UPDATE_PUMP_TIME' }
  | { type: 'UPDATE_RETURN_PUMP_TIME' }
  | { type: 'CYCLE_COMPLETED' }
  | { type: 'SET_CYCLE_PHASE'; payload: CyclePhase }
  | { type: 'UPDATE_SYSTEM_STATE' }
  | { type: 'AUTO_ALKALI_DOSING'; payload: { conductivity: number; targetConductivity: number } }
  | { type: 'UPDATE_ALARMS'; payload: Alarm[] }
  | { type: 'RESET_ALARMS' };

// Редьюсер системы
const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
  switch (action.type) {
    case 'TOGGLE_TANK':
      return {
        ...state,
        waterSupply: !state.waterSupply     // Переключает клапан воды
      };

    case 'EMERGENCY_STOP':
      return {
        ...state,
        systemRunning: false,   // Останавливает всю систему
        waterSupply: false,      // Закрывает воду
        heating: false,          // Выключает нагрев
        feedPump: false,         // Останавливает насосы
        returnPump: false,       // Останавливает насосы
        alkaliDosing: false,
        acidDosing: false,
        cycleRunning: false,
        cycleStartTime: null,
        cyclePhase: 'idle',
        systemPaused: false
      };

    case 'TOGGLE_VALVE':
      return {
        ...state,
        waterSupply: !state.waterSupply
      };

    case 'TOGGLE_HEATING':
      return {
        ...state,
        heating: !state.heating
      };

    case 'START_ALKALI_DOSING':
      // Ручное управление дозировкой щелочи (работает независимо от состояния цикла)
      const newAlkaliDosing = !state.alkaliDosing;
      return {
        ...state,
        alkaliDosing: newAlkaliDosing,
        acidDosing: newAlkaliDosing ? false : state.acidDosing,
        lastDosingState: newAlkaliDosing ? 'alkali' : 'none',
        isManualDosing: newAlkaliDosing // Устанавливаем флаг ручного управления только при запуске
      };

    case 'START_ACID_DOSING':
      // Ручное управление дозировкой кислоты (работает независимо от состояния цикла)
      const newAcidDosing = !state.acidDosing;
      return {
        ...state,
        acidDosing: newAcidDosing,
        alkaliDosing: newAcidDosing ? false : state.alkaliDosing,
        lastDosingState: newAcidDosing ? 'acid' : 'none',
        isManualDosing: newAcidDosing // Устанавливаем флаг ручного управления только при запуске
      };

    case 'TOGGLE_PUMP':
      const currentTime = new Date().getTime();
      if (state.feedPump && state.pumpStartTime) {
        const elapsedTime = Math.floor((currentTime - state.pumpStartTime) / 1000);
        return {
          ...state,
          feedPump: !state.feedPump,
          pumpStartTime: null,
          pumpTotalTime: state.pumpTotalTime + elapsedTime
        };
      } else {
        return {
          ...state,
          feedPump: !state.feedPump,
          pumpStartTime: currentTime
        };
      }

    case 'TOGGLE_RETURN_PUMP':
      const returnCurrentTime = new Date().getTime();
      if (state.returnPump && state.returnPumpStartTime) {
        const elapsedTime = Math.floor((returnCurrentTime - state.returnPumpStartTime) / 1000);
        return {
          ...state,
          returnPump: !state.returnPump,
          returnPumpStartTime: null,
          returnPumpTotalTime: state.returnPumpTotalTime + elapsedTime
        };
      } else {
        return {
          ...state,
          returnPump: !state.returnPump,
          returnPumpStartTime: returnCurrentTime
        };
      }

    case 'START_CYCLE':
      if (!state.systemRunning) {
        return {
          ...state,
          systemRunning: true,
          cycleRunning: true,
          cycleStartTime: new Date().getTime(),
          cyclePhase: 'filling',
          waterSupply: true,
          systemPaused: false,
          cyclePausedTime: null,
          totalPausedTime: 0
        };
      } else {
        return {
          ...state,
          systemRunning: false,
          waterSupply: false,
          heating: false,
          feedPump: false,
          returnPump: false,
          alkaliDosing: false,
          acidDosing: false,
          cycleRunning: false,
          cycleStartTime: null,
          cyclePhase: 'idle',
          systemPaused: false,
          cyclePausedTime: null,
          totalPausedTime: 0
        };
      }

    case 'PAUSE_SYSTEM':
      if (!state.systemPaused) {
        // Приостановка системы - остановка насосов и закрытие клапана, запись времени паузы
        const currentTime = new Date().getTime();
        return {
          ...state,
          systemPaused: true,
          cyclePausedTime: currentTime,
          waterSupply: false,
          feedPump: false,
          returnPump: false,
          heating: false,
          alkaliDosing: false,
          acidDosing: false
        };
      } else {
        // Возобновление системы - расчет общего времени паузы и корректировка времени начала цикла
        const currentTime = new Date().getTime();
        const pausedDuration = state.cyclePausedTime ? Math.floor((currentTime - state.cyclePausedTime) / 1000) : 0;
        const newTotalPausedTime = state.totalPausedTime + pausedDuration;
        
        // Корректировка времени начала цикла с учетом времени паузы
        const adjustedCycleStartTime = state.cycleStartTime ? state.cycleStartTime + (newTotalPausedTime * 1000) : null;
        
        const newState = { 
          ...state, 
          systemPaused: false,
          cyclePausedTime: null,
          totalPausedTime: newTotalPausedTime,
          cycleStartTime: adjustedCycleStartTime
        };
        
        // Восстановление систем в зависимости от фазы цикла
        if (state.cyclePhase === 'filling') {
          newState.waterSupply = true;
          newState.heating = true;
          newState.alkaliDosing = true;
        } else if (state.cyclePhase === 'processing') {
          newState.feedPump = true;
          newState.returnPump = true;
          newState.heating = true;
        }
        
        return newState;
      }

    case 'SET_TANK_TEMPERATURE':
      return {
        ...state,
        targetTemperature: action.payload
      };

    case 'SET_ALKALI_DOSING_RATE':
      return {
        ...state,
        alkaliDosingRate: action.payload
      };

    case 'SET_ACID_DOSING_RATE':
      return {
        ...state,
        acidDosingRate: action.payload
      };

    case 'SET_ALKALI_AMOUNT':
      return {
        ...state,
        alkaliSolutionAmount: action.payload
      };

    case 'SET_ACID_AMOUNT':
      return {
        ...state,
        acidSolutionAmount: action.payload
      };

    case 'SET_TARGET_CONCENTRATION':
      return {
        ...state,
        targetConcentration: action.payload
      };

    case 'SET_HYSTERESIS_THRESHOLDS':
      return {
        ...state,
        upperThreshold: action.payload.upper,
        lowerThreshold: action.payload.lower
      };

    case 'SET_PUMP_FREQUENCY':
      return {
        ...state,
        pumpFrequency: action.payload
      };

    case 'SET_RETURN_PUMP_FREQUENCY':
      return {
        ...state,
        returnPumpFrequency: action.payload
      };

    case 'SET_CYCLE_DURATION':
      return {
        ...state,
        cycleDuration: action.payload * 60 // Преобразование минут в секунды
      };

    case 'SET_TARGET_LEVEL':
      return {
        ...state,
        targetLevel: action.payload
      };

    case 'SET_TANK_LEVEL':
      return {
        ...state,
        tankLevel: action.payload
      };

    case 'UPDATE_TEMPERATURE_HISTORY':
      const newHistory = [...state.temperatureHistory, action.payload];
      if (newHistory.length > state.maxHistoryPoints) {
        newHistory.shift();
      }
      return {
        ...state,
        temperatureHistory: newHistory
      };

    case 'UPDATE_CONDUCTIVITY':
      return {
        ...state,
        currentConductivity: action.payload
      };

    case 'UPDATE_TANK_LEVEL':
      return {
        ...state,
        tankLevel: Math.min(100, Math.max(0, action.payload))
      };

    case 'UPDATE_TANK_TEMPERATURE':
      return {
        ...state,
        tankTemperature: Math.min(80, Math.max(20, action.payload))
      };

    case 'UPDATE_PUMP_TIME':
      if (state.feedPump && state.pumpStartTime) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - state.pumpStartTime) / 1000);
        return {
          ...state,
          pumpTotalTime: state.pumpTotalTime + elapsedTime,
          pumpStartTime: currentTime
        };
      }
      return state;

    case 'UPDATE_RETURN_PUMP_TIME':
      if (state.returnPump && state.returnPumpStartTime) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - state.returnPumpStartTime) / 1000);
        return {
          ...state,
          returnPumpTotalTime: state.returnPumpTotalTime + elapsedTime,
          returnPumpStartTime: currentTime
        };
      }
      return state;

    case 'CYCLE_COMPLETED':
      return {
        ...state,
        systemRunning: false,
        waterSupply: false,
        heating: false,
        feedPump: false,
        returnPump: false,
        alkaliDosing: false,
        cycleRunning: false,
        cycleStartTime: null,
        cyclePhase: 'completed',
        systemPaused: false,
        cyclePausedTime: null,
        totalPausedTime: 0
      };

    case 'SET_CYCLE_PHASE':
      return {
        ...state,
        cyclePhase: action.payload
      };

    case 'AUTO_ALKALI_DOSING':
      // Автоматическая дозировка щелочи на основе отклонения проводимости
      const { conductivity, targetConductivity } = action.payload;
      const deviation = ((targetConductivity - conductivity) / targetConductivity) * 100;
      
      // Пропорциональная дозировка: чем больше отклонение, тем больше скорость дозировки
      const baseDosingRate = 1.8; // Базовая скорость дозировки л/час
      const maxDosingRate = 5.0;  // Максимальная скорость дозировки л/час
      const proportionalRate = Math.min(maxDosingRate, baseDosingRate * (deviation / 10));
      
      return {
        ...state,
        alkaliDosing: true,
        acidDosing: false,
        alkaliDosingRate: Math.round(proportionalRate * 10) / 10, // Округление до 1 знака
        lastDosingState: 'alkali',
        isManualDosing: false // Автоматическая дозировка
      };

    case 'UPDATE_ALARMS':
      return {
        ...state,
        alarms: action.payload
      };

    case 'RESET_ALARMS':
      return {
        ...state,
        alarms: []
      };

    case 'UPDATE_SYSTEM_STATE':
      // Этот случай обрабатывает обновления в реальном времени
      let newState = { ...state };
      
      // Обновление уровня бака, если подача воды включена
      if (newState.waterSupply && newState.tankLevel < 100) {
        newState.tankLevel = Math.min(100, newState.tankLevel + Math.random() * 0.5);
      }
      
      // Обновление температуры в зависимости от нагрева
      if (newState.heating) {
        const tempDiff = newState.targetTemperature - newState.tankTemperature;
        if (Math.abs(tempDiff) > 0.1) {
          newState.tankTemperature += tempDiff * 0.02;
        }
      } else {
        newState.tankTemperature -= Math.random() * 0.1;
      }
      
      // Поддержание температуры в пределах
      newState.tankTemperature = Math.min(80, Math.max(20, newState.tankTemperature));
      
      // Обновление истории температуры
      const historyTime = new Date().getTime();
      const historyPoint = {
        time: historyTime,
        actualTemp: newState.tankTemperature,
        targetTemp: newState.targetTemperature
      };
      const updatedHistory = [...newState.temperatureHistory, historyPoint];
      if (updatedHistory.length > newState.maxHistoryPoints) {
        updatedHistory.shift();
      }
      newState.temperatureHistory = updatedHistory;
      
      // Случайное обновление проводимости
      if (Math.random() < 0.1) {
        const change = (Math.random() - 0.5) * 2;
        newState.currentConductivity = Math.max(10, Math.min(100, 
          newState.currentConductivity + change
        ));
        newState.currentConductivity = Math.round(newState.currentConductivity * 100) / 100;
        
        // Автоматическая дозировка щелочи при падении проводимости ниже нижнего порога
        if (newState.currentConductivity < newState.lowerThreshold && !newState.alkaliDosing) {
          // Расчет эквивалентной проводимости для целевой концентрации
          const baseConductivity = newState.targetConcentration * 24.1;
          const tempFactor = 1 + (newState.tankTemperature - 40) * 0.02;
          const targetConductivity = baseConductivity * tempFactor;
          
          // Запуск автоматической дозировки щелочи
          newState.alkaliDosing = true;
          newState.acidDosing = false; // Остановка дозировки кислоты
          newState.lastDosingState = 'alkali';
        }
        // Автоматическая дозировка кислоты при превышении верхнего порога
        else if (newState.currentConductivity > newState.upperThreshold && !newState.acidDosing) {
          newState.acidDosing = true;
          newState.alkaliDosing = false; // Остановка дозировки щелочи
          newState.lastDosingState = 'acid';
        }
        // Остановка дозировки при достижении зоны гистерезиса
        else if (newState.currentConductivity >= newState.lowerThreshold && 
                 newState.currentConductivity <= newState.upperThreshold) {
          if (newState.alkaliDosing || newState.acidDosing) {
            newState.alkaliDosing = false;
            newState.acidDosing = false;
            newState.lastDosingState = 'none';
          }
        }
      }
      
      // Проверка завершения и прогресса цикла (только когда не приостановлено)
      if (newState.cycleRunning && newState.cycleStartTime && !newState.systemPaused) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - newState.cycleStartTime) / 1000) - newState.totalPausedTime;
        const remainingTime = Math.max(0, newState.cycleDuration - elapsedTime);
        
        if (remainingTime <= 0) {
          // Цикл завершен
          newState.systemRunning = false;
          newState.waterSupply = false;
          newState.heating = false;
          newState.feedPump = false;
          newState.returnPump = false;
          newState.alkaliDosing = false;
          newState.acidDosing = false;
          newState.cycleRunning = false;
          newState.cycleStartTime = null;
          newState.cyclePhase = 'completed';
          newState.systemPaused = false;
        } else {
          // Обновление фазы цикла на основе прогресса и автоматическое управление системами
          const progress = elapsedTime / newState.cycleDuration;
          
          if (progress < 0.2) {
            // Фаза заполнения - подача воды включена, начинается нагрев
            newState.cyclePhase = 'filling';
            if (!newState.systemPaused) {
              newState.waterSupply = true;
              if (progress > 0.1) {
                newState.heating = true;
                newState.alkaliDosing = true;
              }
            }
          } else if (progress < 0.8) {
            // Фаза обработки - подача воды выключена, насосы включены
            newState.cyclePhase = 'processing';
            if (newState.tankLevel >= newState.targetLevel && !newState.systemPaused) {
              newState.waterSupply = false;
              newState.feedPump = true;
              newState.returnPump = true;
            }
          } else {
            // Финальная фаза - подготовка к завершению
            newState.cyclePhase = 'processing';
          }
        }
      }
      
      return newState;

    default:
      return state;
  }
};


// Создание контекста
const SystemContext = createContext<SystemContextType | undefined>(undefined);

// Компонент провайдера
export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(systemReducer, initialState);
  const [calibrationData, setCalibrationData] = React.useState<CalibrationData>(initialCalibrationData);

  // Вспомогательная функция для добавления аварийных сигналов (только когда цикл активен)
  const addAlarm = useCallback((message: string, type: AlarmType) => {
    // Генерировать аварийные сигналы только когда цикл работает
    if (!state.cycleRunning) {
      return;
    }
    
    const timestamp = new Date().toLocaleTimeString('ru-RU');
    const newAlarm = { message, type, timestamp };
    const updatedAlarms = [newAlarm, ...state.alarms.slice(0, 4)]; // Сохранить только последние 5 аварийных сигналов
    dispatch({ type: 'UPDATE_ALARMS', payload: updatedAlarms });
  }, [state.alarms, state.cycleRunning]);

  // Вспомогательная функция для критических аварийных сигналов (всегда генерируются)
  const addCriticalAlarm = useCallback((message: string, type: AlarmType) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU');
    const newAlarm = { message, type, timestamp };
    const updatedAlarms = [newAlarm, ...state.alarms.slice(0, 4)]; // Сохранить только последние 5 аварийных сигналов
    dispatch({ type: 'UPDATE_ALARMS', payload: updatedAlarms });
  }, [state.alarms]);

  // Действия системы
  const actions: SystemActions = {
    toggleTank: useCallback(() => {
      dispatch({ type: 'TOGGLE_TANK' });
      addAlarm('Автозаполнение активировано', 'warning');
    }, [addAlarm]),

    emergencyStop: useCallback(() => {
      dispatch({ type: 'EMERGENCY_STOP' });
      addCriticalAlarm('АВАРИЙНАЯ ОСТАНОВКА АКТИВИРОВАНА - Все системы остановлены!', 'error');
    }, [addCriticalAlarm]),

    toggleValve: useCallback(() => {
      dispatch({ type: 'TOGGLE_VALVE' });
      addAlarm(
        state.waterSupply 
          ? 'КЛАПАН ПОДАЧИ ВОДЫ ЗАКРЫТ - Подача воды остановлена' 
          : 'КЛАПАН ПОДАЧИ ВОДЫ ОТКРЫТ - Ручное управление', 
        'warning'
      );
    }, [state.waterSupply, addAlarm]),

    toggleHeating: useCallback(() => {
      dispatch({ type: 'TOGGLE_HEATING' });
    }, []),

    startAlkaliDosing: useCallback(() => {
      dispatch({ type: 'START_ALKALI_DOSING' });
      if (!state.alkaliDosing) {
        addAlarm(`Дозировка щелочи запущена - Скорость: ${state.alkaliDosingRate} л/час`, 'info');
      } else {
        addAlarm('Дозировка щелочи остановлена', 'warning');
      }
    }, [state.alkaliDosing, state.alkaliDosingRate, addAlarm]),

    startAcidDosing: useCallback(() => {
      dispatch({ type: 'START_ACID_DOSING' });
      if (!state.acidDosing) {
        addAlarm(`Дозировка кислоты запущена - Скорость: ${state.acidDosingRate} л/час`, 'info');
      } else {
        addAlarm('Дозировка кислоты остановлена', 'warning');
      }
    }, [state.acidDosing, state.acidDosingRate, addAlarm]),

    togglePump: useCallback(() => {
      dispatch({ type: 'TOGGLE_PUMP' });
    }, []),

    toggleReturnPump: useCallback(() => {
      dispatch({ type: 'TOGGLE_RETURN_PUMP' });
    }, []),

    startCycle: useCallback(() => {
      dispatch({ type: 'START_CYCLE' });
      if (!state.systemRunning) {
        addCriticalAlarm('Цикл запущен - Начато заполнение бака', 'info');
      } else {
        addCriticalAlarm('Система полностью остановлена', 'info');
      }
    }, [state.systemRunning, addCriticalAlarm]),

    pauseSystem: useCallback(() => {
      dispatch({ type: 'PAUSE_SYSTEM' });
      if (!state.systemPaused) {
        addCriticalAlarm('СИСТЕМА ПРИОСТАНОВЛЕНА - Клапан закрыт, насосы остановлены', 'warning');
      } else {
        addCriticalAlarm('СИСТЕМА ВОЗОБНОВЛЕНА - Цикл продолжается', 'info');
      }
    }, [state.systemPaused, addCriticalAlarm]),

    setTankTemperature: useCallback((temp: number) => {
      dispatch({ type: 'SET_TANK_TEMPERATURE', payload: temp });
      addAlarm(`Целевая температура установлена: ${temp}°C`, 'info');
    }, [addAlarm]),

    setAlkaliDosingRate: useCallback((rate: number) => {
      dispatch({ type: 'SET_ALKALI_DOSING_RATE', payload: rate });
      addAlarm(`Скорость дозировки щелочи установлена: ${rate} л/час`, 'info');
    }, [addAlarm]),

    setAcidDosingRate: useCallback((rate: number) => {
      dispatch({ type: 'SET_ACID_DOSING_RATE', payload: rate });
      addAlarm(`Скорость дозировки кислоты установлена: ${rate} л/час`, 'info');
    }, [addAlarm]),

    setAlkaliAmount: useCallback((amount: number) => {
      dispatch({ type: 'SET_ALKALI_AMOUNT', payload: amount });
      addAlarm(`Количество раствора щелочи установлено: ${amount} мл`, 'info');
    }, [addAlarm]),

    setAcidAmount: useCallback((amount: number) => {
      dispatch({ type: 'SET_ACID_AMOUNT', payload: amount });
      addAlarm(`Количество раствора кислоты установлено: ${amount} мл`, 'info');
    }, [addAlarm]),

    setTargetConcentration: useCallback((concentration: number) => {
      dispatch({ type: 'SET_TARGET_CONCENTRATION', payload: concentration });
      addAlarm(`Целевая концентрация установлена: ${concentration}%`, 'info');
    }, [addAlarm]),

    setHysteresisThresholds: useCallback((upper: number, lower: number) => {
      dispatch({ type: 'SET_HYSTERESIS_THRESHOLDS', payload: { upper, lower } });
      addAlarm(`Пороги гистерезиса установлены: Верхний ${upper} мСм/см, Нижний ${lower} мСм/см`, 'info');
    }, [addAlarm]),

    setPumpFrequency: useCallback((frequency: number) => {
      dispatch({ type: 'SET_PUMP_FREQUENCY', payload: frequency });
      const flowRate = (105 * frequency / 50).toFixed(1);
      const pressure = (2.5 * Math.pow(frequency / 50, 2)).toFixed(1);
      addAlarm(`Частота насоса установлена: ${frequency} Гц (расход: ${flowRate} л/мин, давление: ${pressure} бар)`, 'info');
    }, [addAlarm]),

    setReturnPumpFrequency: useCallback((frequency: number) => {
      dispatch({ type: 'SET_RETURN_PUMP_FREQUENCY', payload: frequency });
      const flowRate = (105 * frequency / 50).toFixed(1);
      const pressure = (2.5 * Math.pow(frequency / 50, 2)).toFixed(1);
      addAlarm(`Частота насоса возврата установлена: ${frequency} Гц (расход: ${flowRate} л/мин, давление: ${pressure} бар)`, 'info');
    }, [addAlarm]),

    setCycleDuration: useCallback((duration: number) => {
      dispatch({ type: 'SET_CYCLE_DURATION', payload: duration });
      addAlarm(`Длительность цикла установлена: ${duration} минут`, 'info');
    }, [addAlarm]),

    setTargetLevel: useCallback((level: number) => {
      dispatch({ type: 'SET_TARGET_LEVEL', payload: level });
      addAlarm(`Целевой уровень бака установлен: ${level}% (${Math.round(level * 2)}Л/200Л)`, 'info');
    }, [addAlarm]),

    setTankLevel: useCallback((level: number) => {
      dispatch({ type: 'SET_TANK_LEVEL', payload: level });
      addAlarm(`Уровень воды в баке установлен: ${level}% (${Math.round(level * 2)}Л/200Л)`, 'info');
    }, [addAlarm]),

    saveCalibrationData: useCallback((data: CalibrationData) => {
      setCalibrationData(data);
      addAlarm('Калибровочные данные сохранены', 'success');
    }, [addAlarm]),

    triggerAutoAlkaliDosing: useCallback((conductivity: number, targetConductivity: number) => {
      dispatch({ type: 'AUTO_ALKALI_DOSING', payload: { conductivity, targetConductivity } });
      const deviation = ((targetConductivity - conductivity) / targetConductivity) * 100;
      addAlarm(`Автоматическая дозировка щелочи активирована - Отклонение: ${deviation.toFixed(1)}%`, 'info');
    }, [addAlarm]),

    resetAlarms: useCallback(() => {
      dispatch({ type: 'RESET_ALARMS' });
      addCriticalAlarm('Все аварийные сигналы сброшены', 'success');
    }, [addCriticalAlarm]),

    addAlarm
  };

  const contextValue: SystemContextType = {
    state,
    actions,
    alarms: state.alarms,
    calibrationData,
    dispatch
  };

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  );
};

// Пользовательский хук для использования контекста системы
export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
