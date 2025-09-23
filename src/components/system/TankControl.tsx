import React from 'react';
import styled from 'styled-components';
import { TankDisplayProps } from '../../types';
import { ControlPanel, StatusIndicator, ValueDisplay, Button } from '../ui';

const LevelIndicator = styled.div`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  height: 200px;
  position: relative;
  margin: 10px 0;
  overflow: hidden;
`;

const LevelFill = styled.div<{ $level: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #0066ff, #00ff00);
  transition: height 0.5s ease;
  height: ${props => props.$level}%;
`;

const LevelMarks = styled.div`
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
  width: 20px;
`;

const LevelMark = styled.div<{ $position: number }>`
  position: absolute;
  right: 0;
  width: 100%;
  height: 1px;
  background: #00ff00;
  top: ${props => props.$position}%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const TankControl: React.FC<TankDisplayProps> = ({
  level,
  temperature,
  targetTemperature,
  onAutoFill,
  onEmergencyStop,
  onSettingsClick
}) => {
  const levelMarks = Array.from({ length: 10 }, (_, i) => i * 10);

  return (
    <ControlPanel 
      title="СМЕСИТЕЛЬНЫЙ БАК (200Л)" 
      settingsIcon 
      onSettingsClick={onSettingsClick}
    >
      <StatusIndicator
        status="online"
        label="Уровень бака"
        value={`${Math.round(level * 2)}Л`}
      />
      
      <LevelIndicator>
        <LevelFill $level={level} />
        <LevelMarks>
          {levelMarks.map((position) => (
            <LevelMark key={position} $position={position} />
          ))}
        </LevelMarks>
      </LevelIndicator>
      
      <ValueDisplay>
        Уровень: {Math.round(level * 10) / 10}% ({Math.round(level * 2)}Л/200Л)
      </ValueDisplay>
      <ValueDisplay>
        Температура: {temperature.toFixed(0)}°C / {targetTemperature}°C
      </ValueDisplay>
      
      <ButtonContainer>
        <Button onClick={onAutoFill}>
          АВТОЗАПОЛНЕНИЕ
        </Button>
        <Button onClick={onEmergencyStop} variant="danger">
          АВАРИЙНАЯ ОСТАНОВКА
        </Button>
      </ButtonContainer>
    </ControlPanel>
  );
};
