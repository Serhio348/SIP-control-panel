import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../ui';
import { useSystem } from '../../context/SystemContext';

interface PumpSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReturnPump?: boolean;
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

export const PumpSettingsModal: React.FC<PumpSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isReturnPump = false 
}) => {
  const { state, actions } = useSystem();
  const [frequencyInput, setFrequencyInput] = useState(
    isReturnPump ? state.returnPumpFrequency.toString() : state.pumpFrequency.toString()
  );

  useEffect(() => {
    setFrequencyInput(
      isReturnPump ? state.returnPumpFrequency.toString() : state.pumpFrequency.toString()
    );
  }, [state.pumpFrequency, state.returnPumpFrequency, isReturnPump]);

  const handleSubmit = () => {
    const frequency = parseFloat(frequencyInput);
    if (!isNaN(frequency) && frequency >= 0 && frequency <= 100) {
      if (isReturnPump) {
        actions.setReturnPumpFrequency(frequency);
      } else {
        actions.setPumpFrequency(frequency);
      }
    } else {
      alert('Пожалуйста, введите корректную частоту (0-100 Гц)');
      setFrequencyInput(
        isReturnPump ? state.returnPumpFrequency.toString() : state.pumpFrequency.toString()
      );
    }
  };

  const currentFrequency = isReturnPump ? state.returnPumpFrequency : state.pumpFrequency;
  const nominalFlow = 105; // л/мин при 50 Гц
  const nominalPressure = 2.5; // бар при 50 Гц
  const frequencyRatio = currentFrequency / 50;
  const flowRate = (nominalFlow * frequencyRatio).toFixed(1);
  const pressure = (nominalPressure * Math.pow(frequencyRatio, 2)).toFixed(1);

  const pumpType = isReturnPump ? 'возврата раствора' : 'подачи раствора';
  const pumpModel = 'ОНЦ 6,3/25К5-1,5/2';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Настройки насоса ${pumpType}`}
    >
      <Section>
        <SectionTitle>Настройки частоты насоса {pumpModel}</SectionTitle>
        <InputContainer>
          <Label>Частота насоса (Гц):</Label>
          <Input
            type="number"
            value={frequencyInput}
            onChange={(e) => setFrequencyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            min="0"
            max="100"
            step="0.1"
          />
          <Button onClick={handleSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InfoDisplay>
          <InfoText>
            Текущая частота: <InfoValue>{currentFrequency} Гц</InfoValue>
          </InfoText>
          <InfoText>
            Расход: <InfoValue>{flowRate} л/мин</InfoValue>
          </InfoText>
          <InfoText>
            Давление: <InfoValue>{pressure} бар</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>
    </Modal>
  );
};
