import React, { useState } from 'react';
import styled from 'styled-components';
import { DosingStationProps } from '../../types';
import { ControlPanel, StatusIndicator, ValueDisplay, Button } from '../ui';

const DosingIcon = styled.span<{ $isActive: boolean }>`
  display: inline-block;
  font-size: 1.3rem;
  margin-right: 8px;
  transition: all 0.3s ease;
  color: ${props => props.$isActive ? '#00ff00' : '#666666'};
  text-shadow: ${props => props.$isActive ? '0 0 15px #00ff00' : 'none'};
  animation: ${props => props.$isActive ? 'flowingWave 2s ease-in-out infinite' : 'none'};

  @keyframes flowingWave {
    0% { 
      transform: translateX(0px) scale(1);
      opacity: 1;
    }
    25% { 
      transform: translateX(3px) scale(1.1);
      opacity: 0.8;
    }
    50% { 
      transform: translateX(0px) scale(1);
      opacity: 1;
    }
    75% { 
      transform: translateX(-3px) scale(1.1);
      opacity: 0.8;
    }
    100% { 
      transform: translateX(0px) scale(1);
      opacity: 1;
    }
  }
`;

const RateSelector = styled.div`
  margin: 10px 0;
`;

const RateLabel = styled.label`
  color: #00ff00;
  font-size: 12px;
  display: block;
  margin-bottom: 5px;
`;

const RateSelect = styled.select`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #ffffff;
  padding: 5px;
  margin-right: 5px;
  width: 150px;
  font-family: inherit;
`;

const AmountInput = styled.input`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #ffffff;
  padding: 5px;
  margin-right: 5px;
  width: 120px;
  font-family: inherit;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const dosingRates = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0];

export const DosingStation: React.FC<DosingStationProps> = ({
  type,
  isActive,
  solutionAmount,
  dosingRate,
  onToggle,
  onSetAmount,
  onSetRate,
  disabled = false
}) => {
  const [amountInput, setAmountInput] = useState(solutionAmount.toString());
  const isAlkali = type === 'alkali';
  const stationName = isAlkali ? 'СТАНЦИЯ ДОЗИРОВКИ ЩЕЛОЧИ' : 'СТАНЦИЯ ДОЗИРОВКИ КИСЛОТЫ';
  const dosingIcon = <DosingIcon $isActive={isActive}>💧</DosingIcon>;

  const handleAmountSubmit = () => {
    const amount = parseFloat(amountInput);
    if (!isNaN(amount) && amount > 0 && amount <= 1000) {
      onSetAmount(amount);
    } else {
      alert('Пожалуйста, введите корректное количество (1-1000 мл)');
      setAmountInput(solutionAmount.toString());
    }
  };

  const rateInMlPerMin = (dosingRate * 1000 / 60).toFixed(1);

  return (
    <ControlPanel title={stationName}>
      <StatusIndicator
        status={isActive ? 'online' : 'warning'}
        label="Насос дозировки"
        value={isActive ? 'ДОЗИРОВКА' : 'ОСТАНОВЛЕНО'}
        icon={dosingIcon}
      />
      
      <ValueDisplay>
        Скорость дозы: {rateInMlPerMin} мл/мин
      </ValueDisplay>
      <ValueDisplay>
        Количество раствора: {solutionAmount} мл
      </ValueDisplay>
      
      <RateSelector>
        <RateLabel>Скорость дозировки (л/час):</RateLabel>
        <RateSelect 
          value={dosingRate} 
          onChange={(e) => onSetRate(parseFloat(e.target.value))}
        >
          {dosingRates.map(rate => (
            <option key={rate} value={rate}>
              {rate} л/час
            </option>
          ))}
        </RateSelect>
      </RateSelector>
      
      <div style={{ margin: '10px 0' }}>
        <AmountInput
          type="number"
          placeholder="Количество (мл)"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAmountSubmit()}
        />
        <Button onClick={handleAmountSubmit}>УСТАНОВИТЬ</Button>
      </div>
      
      <ButtonContainer>
        <Button 
          onClick={onToggle} 
          active={isActive}
          disabled={disabled}
        >
          {isActive ? 'ОСТАНОВИТЬ ДОЗИРОВКУ' : 'НАЧАТЬ ДОЗИРОВКУ'}
        </Button>
      </ButtonContainer>
    </ControlPanel>
  );
};
