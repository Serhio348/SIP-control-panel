import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../ui';
import { useSystem } from '../../context/SystemContext';

interface TankSettingsModalProps {
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


export const TankSettingsModal: React.FC<TankSettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useSystem();
  const [levelInput, setLevelInput] = useState(state.tankLevel.toString());
  const [temperatureInput, setTemperatureInput] = useState(state.targetTemperature.toString());

  useEffect(() => {
    setLevelInput(state.tankLevel.toString());
    setTemperatureInput(state.targetTemperature.toString());
  }, [state.tankLevel, state.targetTemperature]);

  const handleLevelSubmit = () => {
    const level = parseFloat(levelInput);
    if (!isNaN(level) && level >= 0 && level <= 100) {
      actions.setTankLevel(level);
    } else {
      alert('Пожалуйста, введите корректный уровень (0-100%)');
      setLevelInput(state.tankLevel.toString());
    }
  };

  const handleTemperatureSubmit = () => {
    const temperature = parseFloat(temperatureInput);
    if (!isNaN(temperature) && temperature >= 20 && temperature <= 80) {
      actions.setTankTemperature(temperature);
    } else {
      alert('Пожалуйста, введите корректную температуру (20-80°C)');
      setTemperatureInput(state.targetTemperature.toString());
    }
  };

  const currentVolume = (state.tankLevel * 2).toFixed(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки смесительного бака">
      <Section>
        <SectionTitle>Настройки уровня воды</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <label style={{ color: '#00ff00', fontWeight: 'bold', minWidth: '200px' }}>
            Уровень воды (%):
          </label>
          <input
            type="number"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLevelSubmit()}
            min="0"
            max="100"
            step="0.1"
            style={{
              background: '#1a1a1a',
              border: '1px solid #00ff00',
              color: '#ffffff',
              padding: '8px 12px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              width: '120px'
            }}
          />
          <Button onClick={handleLevelSubmit}>УСТАНОВИТЬ</Button>
        </div>
        <InfoDisplay>
          <InfoText>
            Текущий объем: <InfoValue>{currentVolume}Л/200Л</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>

      <Section>
        <SectionTitle>Настройки температуры</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <label style={{ color: '#00ff00', fontWeight: 'bold', minWidth: '200px' }}>
            Целевая температура (°C):
          </label>
          <input
            type="number"
            value={temperatureInput}
            onChange={(e) => setTemperatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTemperatureSubmit()}
            min="20"
            max="80"
            step="1"
            style={{
              background: '#1a1a1a',
              border: '1px solid #00ff00',
              color: '#ffffff',
              padding: '8px 12px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              width: '120px'
            }}
          />
          <Button onClick={handleTemperatureSubmit}>УСТАНОВИТЬ</Button>
        </div>
        <InfoDisplay>
          <InfoText>
            Текущая температура: <InfoValue>{state.tankTemperature.toFixed(1)}°C</InfoValue>
          </InfoText>
          <InfoText>
            Целевая температура: <InfoValue>{state.targetTemperature}°C</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>
    </Modal>
  );
};
