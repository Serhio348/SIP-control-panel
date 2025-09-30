import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../ui';
import { useSystem } from '../../context/SystemContext';

interface HeatExchangerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #00ff00;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.label`
  color: #00ff00;
  font-weight: bold;
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const Input = styled.input`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #ffffff;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 1rem;
  width: 120px;

  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }
`;

const InfoDisplay = styled.div`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  padding: 8px;
  margin-top: 10px;
`;

const InfoText = styled.p`
  color: #ffffff;
  margin: 0;
`;

const InfoValue = styled.span`
  color: #00ff00;
  font-weight: bold;
`;

export const HeatExchangerSettingsModal: React.FC<HeatExchangerSettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useSystem();
  const [targetTempInput, setTargetTempInput] = useState(state.targetTemperature.toString());

  useEffect(() => {
    setTargetTempInput(state.targetTemperature.toString());
  }, [state.targetTemperature]);

  const handleTargetTempSubmit = () => {
    const temperature = parseFloat(targetTempInput);
    if (!isNaN(temperature) && temperature >= 20 && temperature <= 80) {
      actions.setTankTemperature(temperature);
    } else {
      alert('Пожалуйста, введите корректную температуру (20-80°C)');
      setTargetTempInput(state.targetTemperature.toString());
    }
  };

  const handleToggleHeating = () => {
    actions.toggleHeating();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки теплообменника">
      <Section>
        <SectionTitle>Управление нагревом</SectionTitle>
        <div style={{ marginBottom: '15px' }}>
          <Button 
            onClick={handleToggleHeating}
            active={state.heating}
          >
            {state.heating ? 'ОСТАНОВИТЬ НАГРЕВ' : 'ВКЛЮЧИТЬ НАГРЕВ'}
          </Button>
        </div>
        <InfoDisplay>
          <InfoText>
            Статус нагрева: <InfoValue>{state.heating ? 'АКТИВЕН' : 'ОСТАНОВЛЕН'}</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>

      <Section>
        <SectionTitle>Настройки температуры</SectionTitle>
        <InputContainer>
          <Label>Целевая температура (°C):</Label>
          <Input
            type="number"
            value={targetTempInput}
            onChange={(e) => setTargetTempInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTargetTempSubmit()}
            min="20"
            max="80"
            step="1"
          />
          <Button onClick={handleTargetTempSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InfoDisplay>
          <InfoText>
            Текущая температура: <InfoValue>{state.tankTemperature.toFixed(1)}°C</InfoValue>
          </InfoText>
          <InfoText>
            Целевая температура: <InfoValue>{state.targetTemperature}°C</InfoValue>
          </InfoText>
          <InfoText>
            Разница: <InfoValue>{(state.targetTemperature - state.tankTemperature).toFixed(1)}°C</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>

      <Section>
        <SectionTitle>Информация о системе</SectionTitle>
        <InfoDisplay>
          <InfoText>
            Режим работы: <InfoValue>{state.heating ? 'НАГРЕВ АКТИВЕН' : 'НАГРЕВ ОСТАНОВЛЕН'}</InfoValue>
          </InfoText>
          <InfoText>
            Время работы: <InfoValue>--</InfoValue>
          </InfoText>
          <InfoText>
            Энергопотребление: <InfoValue>--</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>
    </Modal>
  );
};
