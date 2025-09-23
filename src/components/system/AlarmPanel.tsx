import React from 'react';
import styled from 'styled-components';
import { Alarm } from '../../types';
import { Modal, Button } from '../ui';

interface AlarmPanelProps {
  alarms: Alarm[];
  isOpen: boolean;
  onClose: () => void;
  onResetAlarms: () => void;
}

const Panel = styled.div`
  background: #2d2d2d;
  border: 2px solid #ff0000;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ff0000;
`;

const Title = styled.h3`
  color: #ff0000;
  border-bottom: 1px solid #ff0000;
  padding-bottom: 5px;
  margin-bottom: 15px;
`;

const AlarmItem = styled.div<{ $type: string }>`
  background: #1a1a1a;
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'error': return '#ff0000';
      case 'warning': return '#ffff00';
      case 'info': return '#00ff00';
      case 'success': return '#00ff00';
      default: return '#ff0000';
    }
  }};
  padding: 8px;
  margin: 5px 0;
  color: ${props => {
    switch (props.$type) {
      case 'error': return '#ff0000';
      case 'warning': return '#ffff00';
      case 'info': return '#00ff00';
      case 'success': return '#00ff00';
      default: return '#ff0000';
    }
  }};
  font-size: 0.9rem;
`;

export const AlarmPanel: React.FC<AlarmPanelProps> = ({ alarms, isOpen, onClose, onResetAlarms }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚠️ АВАРИЙНЫЕ СИГНАЛЫ СИСТЕМЫ">
      <Panel>
        {alarms.length === 0 ? (
          <AlarmItem $type="info">
            Нет активных аварийных сигналов
          </AlarmItem>
        ) : (
          alarms.map((alarm, index) => (
            <AlarmItem key={index} $type={alarm.type}>
              [{alarm.timestamp}] {alarm.message}
            </AlarmItem>
          ))
        )}
        
        {alarms.length > 0 && (
          <ButtonContainer>
            <Button 
              onClick={onResetAlarms}
              variant="danger"
            >
              СБРОСИТЬ ВСЕ АВАРИИ
            </Button>
          </ButtonContainer>
        )}
      </Panel>
    </Modal>
  );
};
