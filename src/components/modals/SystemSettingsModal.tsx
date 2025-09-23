import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../ui';
import { useSystem } from '../../context/SystemContext';

interface SystemSettingsModalProps {
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

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useSystem();
  const [durationInput, setDurationInput] = useState(Math.floor(state.cycleDuration / 60).toString());
  const [levelInput, setLevelInput] = useState(state.targetLevel.toString());

  useEffect(() => {
    setDurationInput(Math.floor(state.cycleDuration / 60).toString());
    setLevelInput(state.targetLevel.toString());
  }, [state.cycleDuration, state.targetLevel]);

  const handleDurationSubmit = () => {
    const duration = parseInt(durationInput);
    if (!isNaN(duration) && duration >= 1 && duration <= 120) {
      actions.setCycleDuration(duration);
    } else {
      alert('Пожалуйста, введите корректную длительность (1-120 минут)');
      setDurationInput(Math.floor(state.cycleDuration / 60).toString());
    }
  };

  const handleLevelSubmit = () => {
    const level = parseInt(levelInput);
    if (!isNaN(level) && level >= 10 && level <= 100) {
      actions.setTargetLevel(level);
    } else {
      alert('Пожалуйста, введите корректный уровень (10-100%)');
      setLevelInput(state.targetLevel.toString());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки системы">
      <Section>
        <SectionTitle>Настройки цикла системы</SectionTitle>
        <InputContainer>
          <Label>Длительность цикла (минуты):</Label>
          <Input
            type="number"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleDurationSubmit()}
            min="1"
            max="120"
            step="1"
          />
          <Button onClick={handleDurationSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InputContainer>
          <Label>Целевой уровень бака (%):</Label>
          <Input
            type="number"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLevelSubmit()}
            min="10"
            max="100"
            step="1"
          />
          <Button onClick={handleLevelSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InfoDisplay>
          <InfoText>
            Текущая длительность цикла: <InfoValue>{Math.floor(state.cycleDuration / 60)} минут</InfoValue>
          </InfoText>
          <InfoText>
            Целевой уровень бака: <InfoValue>{state.targetLevel}%</InfoValue>
          </InfoText>
          <InfoText>
            Объем при целевом уровне: <InfoValue>{Math.round(state.targetLevel * 2)}Л/200Л</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>

      <Section>
        <SectionTitle>Аварийные сигналы системы</SectionTitle>
        <InfoDisplay>
          <InfoText>
            Количество активных аварий: <InfoValue>{state.alarms.length}</InfoValue>
          </InfoText>
          {state.alarms.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <InfoText style={{ color: '#ff0000', fontWeight: 'bold' }}>
                Последние аварийные сигналы:
              </InfoText>
              {state.alarms.slice(0, 3).map((alarm, index) => (
                <InfoText key={index} style={{ 
                  color: alarm.type === 'error' ? '#ff0000' : 
                         alarm.type === 'warning' ? '#ffff00' : '#00ff00',
                  fontSize: '0.9rem',
                  marginTop: '5px'
                }}>
                  [{alarm.timestamp}] {alarm.message}
                </InfoText>
              ))}
            </div>
          )}
        </InfoDisplay>
      </Section>
    </Modal>
  );
};
