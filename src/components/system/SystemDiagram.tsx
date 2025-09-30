import React, { useState } from 'react';
import styled from 'styled-components';
import { useSystem } from '../../context/SystemContext';
import { ValveIcon } from '../ui';

interface SystemDiagramProps {
  onTankClick: () => void;
  onPumpClick: (type: 'feed' | 'return') => void;
  onDosingClick: (type: 'alkali' | 'acid') => void;
  onSensorClick: () => void;
  onHeatExchangerClick: () => void;
  onWaterSupplyClick: () => void;
}

const DiagramContainer = styled.div`
  background: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  color: #00ff00;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-shadow: 0 0 10px #00ff00;
`;

const ValveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const ValveLabel = styled.div`
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
`;

const StatusText = styled.div<{ $isOpen: boolean }>`
  color: ${props => props.$isOpen ? '#27ae60' : '#e74c3c'};
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const AnimationControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const AnimationLabel = styled.label`
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AnimationSlider = styled.input`
  width: 200px;
  height: 5px;
  background: #2d2d2d;
  border-radius: 5px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    background: #00ff00;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #00ff00;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background: #2d2d2d;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00ff00;
    color: #1a1a1a;
    box-shadow: 0 0 10px #00ff00;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SystemDiagram: React.FC<SystemDiagramProps> = ({
  onTankClick,
  onPumpClick,
  onDosingClick,
  onSensorClick,
  onHeatExchangerClick,
  onWaterSupplyClick
}) => {
  const { state } = useSystem();
  const [isValveOpen, setIsValveOpen] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(300);

  const handleValveToggle = (isOpen: boolean) => {
    console.log(`Клапан ${isOpen ? 'открыт' : 'закрыт'}`);
    setIsValveOpen(isOpen);
    onWaterSupplyClick();
  };

  return (
    <DiagramContainer>
      <Title>СИСТЕМА SIP-МОЙКИ - ПРОМЫВОЧНАЯ СТАНЦИЯ</Title>
      <ValveContainer>
        <ValveLabel>ВОДОПОДАЧА</ValveLabel>
        <ValveIcon
          isOpen={isValveOpen}
          size={120}
          onToggle={handleValveToggle}
          animationDuration={animationSpeed}
        />
        <StatusText $isOpen={isValveOpen}>
          Состояние: {isValveOpen ? '🟢 ОТКРЫТ' : '🔴 ЗАКРЫТ'}
        </StatusText>
      </ValveContainer>

      <AnimationControl>
        <AnimationLabel>
          Скорость анимации: {animationSpeed}ms
          <AnimationSlider
            type="range"
            min="100"
            max="1000"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          />
        </AnimationLabel>
      </AnimationControl>

      <ControlButtons>
        <ControlButton onClick={() => setIsValveOpen(true)}>
          Открыть клапан
        </ControlButton>
        <ControlButton onClick={() => setIsValveOpen(false)}>
          Закрыть клапан
        </ControlButton>
        <ControlButton onClick={() => setIsValveOpen(!isValveOpen)}>
          Переключить
        </ControlButton>
      </ControlButtons>
    </DiagramContainer>
  );
};

