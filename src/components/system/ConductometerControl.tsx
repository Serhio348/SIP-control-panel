import React from 'react';
import { ControlPanel, StatusIndicator, ValueDisplay } from '../ui';

interface ConductometerControlProps {
  currentConductivity: number;
  targetConcentration: number;
  targetTemperature: number;
  upperThreshold: number;
  lowerThreshold: number;
  onSettingsClick: () => void;
}

// Вспомогательная функция для преобразования концентрации в проводимость
const concentrationToConductivity = (concentration: number, temperature: number): number => {
  // Упрощенное преобразование - в реальной реализации использовались бы калибровочные данные
  const baseConductivity = concentration * 24.1; // Base at 40°C
  const tempFactor = 1 + (temperature - 40) * 0.02; // 2% per degree
  return baseConductivity * tempFactor;
};

export const ConductometerControl: React.FC<ConductometerControlProps> = ({
  currentConductivity,
  targetConcentration,
  targetTemperature,
  upperThreshold,
  lowerThreshold,
  onSettingsClick
}) => {
  const equivalentConductivity = concentrationToConductivity(targetConcentration, targetTemperature);
  
  let hysteresisStatus = '';
  const percentageDeviation = ((equivalentConductivity - currentConductivity) / equivalentConductivity) * 100;
  
  if (currentConductivity > upperThreshold) {
    hysteresisStatus = `ТРЕБУЕТСЯ ДОЗИРОВКА КИСЛОТЫ (${percentageDeviation.toFixed(1)}%)`;
  } else if (currentConductivity < lowerThreshold) {
    hysteresisStatus = `АВТОМАТИЧЕСКАЯ ДОЗИРОВКА ЩЕЛОЧИ (${percentageDeviation.toFixed(1)}%)`;
  } else {
    hysteresisStatus = `В НОРМЕ (ЗОНА ГИСТЕРЕЗИСА) (${percentageDeviation.toFixed(1)}%)`;
  }

  return (
    <ControlPanel 
      title="УПРАВЛЕНИЕ КОНДУКТОМЕТРОМ" 
      settingsIcon 
      onSettingsClick={onSettingsClick}
    >
      <StatusIndicator
        status="online"
        label="Статус датчика"
        value="АКТИВЕН"
      />
      
      <ValueDisplay>
        Проводимость: {currentConductivity} мСм/см
      </ValueDisplay>
      <ValueDisplay>
        Уровень pH: 7.2
      </ValueDisplay>
      <ValueDisplay>
        Целевая концентрация: {targetConcentration}% ({equivalentConductivity.toFixed(2)} мСм/см)
      </ValueDisplay>
      <ValueDisplay>
        Статус: {hysteresisStatus}
      </ValueDisplay>
    </ControlPanel>
  );
};
