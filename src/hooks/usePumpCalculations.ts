import { useMemo, useCallback } from 'react';
import { useSystem } from '../context/SystemContext';

export function usePumpCalculations() {
  const { state } = useSystem();

  // Расчет времени работы насоса
  const calculatePumpOperatingTime = useCallback((isRunning: boolean, startTime: number | null, totalTime: number) => {
    if (!isRunning || !startTime) {
      return totalTime;
    }
    
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    return totalTime + elapsedTime;
  }, []);

  // Расчет расхода и давления насоса на основе частоты
  const calculatePumpParameters = useCallback((frequency: number) => {
    const nominalFlow = 105; // л/мин при 50 Гц
    const nominalPressure = 2.5; // бар при 50 Гц
    const frequencyRatio = frequency / 50;
    
    const flowRate = nominalFlow * frequencyRatio;
    const pressure = nominalPressure * Math.pow(frequencyRatio, 2);
    
    return { flowRate, pressure };
  }, []);

  // Расчеты питающего насоса
  const feedPumpOperatingTime = useMemo(() => 
    calculatePumpOperatingTime(state.feedPump, state.pumpStartTime, state.pumpTotalTime),
    [state.feedPump, state.pumpStartTime, state.pumpTotalTime, calculatePumpOperatingTime]
  );

  const feedPumpParams = useMemo(() => 
    calculatePumpParameters(state.pumpFrequency),
    [state.pumpFrequency, calculatePumpParameters]
  );

  // Расчеты возвратного насоса
  const returnPumpOperatingTime = useMemo(() => 
    calculatePumpOperatingTime(state.returnPump, state.returnPumpStartTime, state.returnPumpTotalTime),
    [state.returnPump, state.returnPumpStartTime, state.returnPumpTotalTime, calculatePumpOperatingTime]
  );

  const returnPumpParams = useMemo(() => 
    calculatePumpParameters(state.returnPumpFrequency),
    [state.returnPumpFrequency, calculatePumpParameters]
  );

  return {
    feedPump: {
      operatingTime: feedPumpOperatingTime,
      flowRate: feedPumpParams.flowRate,
      pressure: feedPumpParams.pressure
    },
    returnPump: {
      operatingTime: returnPumpOperatingTime,
      flowRate: returnPumpParams.flowRate,
      pressure: returnPumpParams.pressure
    }
  };
};
