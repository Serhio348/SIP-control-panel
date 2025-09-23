import React from 'react';
import styled from 'styled-components';
import { PumpDisplayProps } from '../../types';
import { ControlPanel, StatusIndicator, ValueDisplay, Button } from '../ui';

const PumpIcon = styled.span<{ $isRunning: boolean }>`
  display: inline-block;
  font-size: 1.5rem;
  margin-right: 8px;
  transition: all 0.3s ease;
  color: ${props => props.$isRunning ? '#00ff00' : '#ff0000'};
  text-shadow: ${props => props.$isRunning ? '0 0 10px #00ff00' : '0 0 10px #ff0000'};
  animation: ${props => props.$isRunning ? 'pumpSpin 1s linear infinite' : 'none'};

  @keyframes pumpSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const formatOperatingTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}ч ${minutes}м`;
};

export const ReturnPumpControl: React.FC<PumpDisplayProps> = ({
  isRunning,
  frequency,
  flowRate,
  pressure,
  operatingTime,
  onToggle,
  onSettingsClick
}) => {
  const pumpIcon = <PumpIcon $isRunning={isRunning}>⚙</PumpIcon>;

  return (
    <ControlPanel 
      title="НАСОС ВОЗВРАТА РАСТВОРА" 
      settingsIcon 
      onSettingsClick={onSettingsClick}
    >
      <StatusIndicator
        status={isRunning ? 'online' : 'offline'}
        label="Статус насоса"
        value={isRunning ? 'РАБОТАЕТ' : 'ОСТАНОВЛЕН'}
        icon={pumpIcon}
      />
      
      <ValueDisplay>
        Расход: {flowRate.toFixed(1)} л/мин
      </ValueDisplay>
      <ValueDisplay>
        Давление: {pressure.toFixed(1)} бар
      </ValueDisplay>
      <ValueDisplay>
        Время работы: {formatOperatingTime(operatingTime)}
      </ValueDisplay>
      
      <Button onClick={onToggle} active={isRunning}>
        {isRunning ? 'НАСОС ВКЛ' : 'НАСОС ВЫКЛ'}
      </Button>
    </ControlPanel>
  );
};
