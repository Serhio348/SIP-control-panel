import React, { useState } from 'react';
import styled from 'styled-components';
import { InputGroupProps } from '../../types';
import { Button } from './Button';

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

const UnitLabel = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit 
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        alert(`Значение должно быть не менее ${min}`);
        return;
      }
      if (max !== undefined && numValue > max) {
        alert(`Значение должно быть не более ${max}`);
        return;
      }
      onChange(numValue);
    } else {
      alert('Пожалуйста, введите корректное числовое значение');
      setInputValue(value.toString());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <InputContainer>
      <Label>{label}:</Label>
      <Input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        min={min}
        max={max}
        step={step}
      />
      {unit && <UnitLabel>{unit}</UnitLabel>}
      <Button onClick={handleSubmit}>УСТАНОВИТЬ</Button>
    </InputContainer>
  );
};
