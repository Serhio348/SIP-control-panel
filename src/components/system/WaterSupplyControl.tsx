import React from 'react';
import { ControlPanel, StatusIndicator, ValueDisplay, Button } from '../ui';

interface WaterSupplyControlProps {
  isOpen: boolean;
  flowRate: number;
  pressure: number;
  onToggle: () => void;
}

export const WaterSupplyControl: React.FC<WaterSupplyControlProps> = ({
  isOpen,
  flowRate,
  pressure,
  onToggle
}) => {
  return (
    <ControlPanel title="СИСТЕМА ПОДАЧИ ВОДЫ">
      <StatusIndicator
        status={isOpen ? 'online' : 'offline'}
        label="Запорный клапан"
        value={isOpen ? 'ОТКРЫТ' : 'ЗАКРЫТ'}
      />
      
      <ValueDisplay>
        Расход: {flowRate.toFixed(1)} л/мин
      </ValueDisplay>
      <ValueDisplay>
        Давление: {pressure.toFixed(1)} бар
      </ValueDisplay>
      
      <Button onClick={onToggle} active={isOpen}>
        {isOpen ? 'КЛАПАН ОТКРЫТ' : 'КЛАПАН ЗАКРЫТ'}
      </Button>
    </ControlPanel>
  );
};
