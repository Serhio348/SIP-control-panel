import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '../ui';
import { useSystem } from '../../context/SystemContext';
import { CalibrationData } from '../../types';

interface SensorSettingsModalProps {
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

const CalibrationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  background: #1a1a1a;
`;

const TableHeader = styled.th`
  border: 1px solid #00ff00;
  padding: 4px 6px;
  text-align: center;
  font-size: 0.85rem;
  background: #1a1a1a;
  color: #00ff00;
  font-weight: bold;
`;

const TableCell = styled.td`
  border: 1px solid #00ff00;
  padding: 4px 6px;
  text-align: center;
  font-size: 0.85rem;
  color: #ffffff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #2a2a2a;
  }
`;

const CalibrationInput = styled.input`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #ffffff;
  padding: 2px 4px;
  width: 70px;
  text-align: center;
  font-size: 11px;
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }

  &:hover {
    border-color: #00ff00;
    box-shadow: 0 0 3px rgba(0, 255, 0, 0.3);
  }
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

// Вспомогательная функция для преобразования концентрации в проводимость
const concentrationToConductivity = (concentration: number, temperature: number, calibrationData: CalibrationData): number => {
  const tempIndex = calibrationData.temperatures.findIndex(t => t >= temperature) || calibrationData.temperatures.length - 1;
  
  for (let i = 0; i < calibrationData.concentrations.length - 1; i++) {
    const lowerConc = calibrationData.concentrations[i];
    const upperConc = calibrationData.concentrations[i + 1];
    
    if (concentration > lowerConc && concentration < upperConc) {
      const lowerCond = calibrationData.data[i][tempIndex];
      const upperCond = calibrationData.data[i + 1][tempIndex];
      const concentrationRange = upperConc - lowerConc;
      const ratio = (concentration - lowerConc) / concentrationRange;
      
      return lowerCond + (ratio * (upperCond - lowerCond));
    }
  }
  
  return calibrationData.data[0][tempIndex];
};

export const SensorSettingsModal: React.FC<SensorSettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, actions, calibrationData } = useSystem();
  const [targetConcentration, setTargetConcentration] = useState(state.targetConcentration.toString());
  const [upperThreshold, setUpperThreshold] = useState(state.upperThreshold.toString());
  const [lowerThreshold, setLowerThreshold] = useState(state.lowerThreshold.toString());
  const [calibrationInputs, setCalibrationInputs] = useState<number[][]>(calibrationData.data);

  useEffect(() => {
    setTargetConcentration(state.targetConcentration.toString());
    setUpperThreshold(state.upperThreshold.toString());
    setLowerThreshold(state.lowerThreshold.toString());
    setCalibrationInputs(calibrationData.data);
  }, [state.targetConcentration, state.upperThreshold, state.lowerThreshold, calibrationData.data]);

  const handleTargetConcentrationSubmit = () => {
    const concentration = parseFloat(targetConcentration);
    if (!isNaN(concentration) && concentration >= 0.1 && concentration <= 2.5) {
      actions.setTargetConcentration(concentration);
    } else {
      alert('Пожалуйста, введите корректную концентрацию (0.1-2.5%)');
      setTargetConcentration(state.targetConcentration.toString());
    }
  };

  const handleThresholdsSubmit = () => {
    const upper = parseFloat(upperThreshold);
    const lower = parseFloat(lowerThreshold);
    
    if (!isNaN(upper) && !isNaN(lower) && 
        upper > lower && 
        upper >= 0.1 && upper <= 200 && 
        lower >= 0.1 && lower <= 200) {
      actions.setHysteresisThresholds(upper, lower);
    } else {
      alert('Пожалуйста, введите корректные пороги (верхний > нижний, 0.1-200 мСм/см)');
      setUpperThreshold(state.upperThreshold.toString());
      setLowerThreshold(state.lowerThreshold.toString());
    }
  };

  const handleCalibrationChange = (concIndex: number, tempIndex: number, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue > 0) {
      const newInputs = [...calibrationInputs];
      newInputs[concIndex][tempIndex] = newValue;
      setCalibrationInputs(newInputs);
    }
  };

  const handleSaveCalibration = () => {
    const newCalibrationData: CalibrationData = {
      ...calibrationData,
      data: calibrationInputs
    };
    actions.saveCalibrationData(newCalibrationData);
  };

  const equivalentConductivity = concentrationToConductivity(
    state.targetConcentration, 
    state.targetTemperature, 
    calibrationData
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки датчика кондуктометра">
      <Section>
        <SectionTitle>Калибровочные данные</SectionTitle>
        <p style={{ color: '#ccc', marginBottom: '10px' }}>
          Данные проводимости (мСм/см) для различных концентраций и температур:
        </p>
        
        <CalibrationTable>
          <thead>
            <tr>
              <TableHeader>Концентрация, %</TableHeader>
              {calibrationData.temperatures.map(temp => (
                <TableHeader key={temp}>{temp}°C</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {calibrationData.concentrations.map((conc, concIndex) => (
              <TableRow key={conc}>
                <TableCell>{conc}%</TableCell>
                {calibrationData.temperatures.map((temp, tempIndex) => (
                  <TableCell key={temp}>
                    <CalibrationInput
                      type="number"
                      value={calibrationInputs[concIndex][tempIndex].toFixed(2)}
                      onChange={(e) => handleCalibrationChange(concIndex, tempIndex, e.target.value)}
                      step="0.01"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </CalibrationTable>
        
        <div style={{ marginTop: '10px' }}>
          <Button onClick={handleSaveCalibration}>
            СОХРАНИТЬ КАЛИБРОВКУ
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle>Целевые настройки</SectionTitle>
        <InputContainer>
          <Label>Целевая концентрация (%):</Label>
          <Input
            type="number"
            value={targetConcentration}
            onChange={(e) => setTargetConcentration(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTargetConcentrationSubmit()}
            step="0.1"
            min="0.1"
            max="2.5"
          />
          <Button onClick={handleTargetConcentrationSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InfoDisplay>
          <InfoText>
            Эквивалентная проводимость: <InfoValue>{equivalentConductivity.toFixed(2)} мСм/см</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>

      <Section>
        <SectionTitle>Настройки гистерезиса</SectionTitle>
        <InputContainer>
          <Label>Верхний порог (мСм/см):</Label>
          <Input
            type="number"
            value={upperThreshold}
            onChange={(e) => setUpperThreshold(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleThresholdsSubmit()}
            step="0.1"
            min="0.1"
            max="200"
          />
          <Button onClick={handleThresholdsSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InputContainer>
          <Label>Нижний порог (мСм/см):</Label>
          <Input
            type="number"
            value={lowerThreshold}
            onChange={(e) => setLowerThreshold(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleThresholdsSubmit()}
            step="0.1"
            min="0.1"
            max="200"
          />
          <Button onClick={handleThresholdsSubmit}>УСТАНОВИТЬ</Button>
        </InputContainer>
        <InfoDisplay>
          <InfoText>
            Текущие пороги: <InfoValue>Верхний: {state.upperThreshold} мСм/см, Нижний: {state.lowerThreshold} мСм/см</InfoValue>
          </InfoText>
          <InfoText>
            Зона гистерезиса: <InfoValue>{(state.upperThreshold - state.lowerThreshold).toFixed(1)} мСм/см</InfoValue>
          </InfoText>
        </InfoDisplay>
      </Section>
    </Modal>
  );
};
