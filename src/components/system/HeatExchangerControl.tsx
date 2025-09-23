import React from 'react';
import { ControlPanel, StatusIndicator, ValueDisplay, Button } from '../ui';

interface HeatExchangerControlProps {
  isActive: boolean;
  waterTemperature: number;
  steamTemperature: number;
  onToggle: () => void;
}

export const HeatExchangerControl: React.FC<HeatExchangerControlProps> = ({
  isActive,
  waterTemperature,
  steamTemperature,
  onToggle
}) => {
  return (
    <ControlPanel title="ПАРОВОЙ ТЕПЛООБМЕННИК">
      <StatusIndicator
        status={isActive ? 'online' : 'offline'}
        label="Система нагрева"
        value={isActive ? 'РАБОТАЕТ' : 'ОСТАНОВЛЕНА'}
      />
      
      <ValueDisplay>
        Температура воды: {waterTemperature.toFixed(1)}°C
      </ValueDisplay>
      <ValueDisplay>
        Температура пара: {steamTemperature.toFixed(1)}°C
      </ValueDisplay>
      
      <Button onClick={onToggle} active={isActive}>
        {isActive ? 'НАГРЕВ ВКЛ' : 'НАГРЕВ ВЫКЛ'}
      </Button>
    </ControlPanel>
  );
};
