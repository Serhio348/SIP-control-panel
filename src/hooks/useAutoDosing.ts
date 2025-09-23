import { useEffect } from 'react';
import { useSystem } from '../context/SystemContext';

// Вспомогательная функция для преобразования концентрации в проводимость
const concentrationToConductivity = (concentration: number, temperature: number): number => {
  const baseConductivity = concentration * 24.1; // Базовая проводимость при 40°C
  const tempFactor = 1 + (temperature - 40) * 0.02; // 2% на градус
  return baseConductivity * tempFactor;
};

export const useAutoDosing = () => {
  const { state, actions } = useSystem();

  useEffect(() => {
    // Проверка автоматической дозировки только когда система работает и цикл активен
    if (!state.systemRunning || state.systemPaused || !state.cycleRunning) {
      return;
    }

    // Расчет целевой проводимости на основе концентрации и температуры
    const targetConductivity = concentrationToConductivity(
      state.targetConcentration, 
      state.tankTemperature
    );

    // Проверка необходимости автоматической дозировки щелочи
    if (state.currentConductivity < state.lowerThreshold && !state.alkaliDosing) {
      // Запуск автоматической дозировки щелочи с пропорциональной скоростью
      actions.triggerAutoAlkaliDosing(state.currentConductivity, targetConductivity);
    }
    // Проверка необходимости автоматической дозировки кислоты
    else if (state.currentConductivity > state.upperThreshold && !state.acidDosing) {
      // Автоматическая дозировка кислоты (можно расширить в будущем)
      actions.startAcidDosing();
    }
    // Остановка дозировки при достижении зоны гистерезиса
    else if (state.currentConductivity >= state.lowerThreshold && 
             state.currentConductivity <= state.upperThreshold) {
      if (state.alkaliDosing || state.acidDosing) {
        // Остановка дозировки при достижении целевой зоны
        if (state.alkaliDosing) {
          actions.startAlkaliDosing(); // Переключение выключит дозировку
        }
        if (state.acidDosing) {
          actions.startAcidDosing(); // Переключение выключит дозировку
        }
      }
    }

  }, [
    state.currentConductivity,
    state.lowerThreshold,
    state.upperThreshold,
    state.targetConcentration,
    state.tankTemperature,
    state.alkaliDosing,
    state.acidDosing,
    state.systemRunning,
    state.systemPaused,
    state.cycleRunning,
    actions
  ]);

  // Отдельный эффект для остановки автоматической дозировки при остановке цикла
  useEffect(() => {
    // Если цикл остановлен, приостановлен или система не работает - остановить только автоматическую дозировку
    if (!state.cycleRunning || state.systemPaused || !state.systemRunning) {
      if ((state.alkaliDosing || state.acidDosing) && !state.isManualDosing) {
        // Остановка только автоматической дозировки при остановке цикла
        if (state.alkaliDosing) {
          actions.startAlkaliDosing(); // Переключение выключит дозировку
        }
        if (state.acidDosing) {
          actions.startAcidDosing(); // Переключение выключит дозировку
        }
      }
    }
  }, [state.cycleRunning, state.systemPaused, state.systemRunning, state.alkaliDosing, state.acidDosing, state.isManualDosing, actions]);
};
