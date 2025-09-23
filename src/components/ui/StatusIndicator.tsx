import React from 'react';
import styled from 'styled-components';
import { StatusIndicatorProps } from '../../types';

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StatusDot = styled.span<{ $status: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${props => {
    switch (props.$status) {
      case 'online': return '#00ff00';
      case 'warning': return '#ffff00';
      case 'offline': return '#ff0000';
      default: return '#666';
    }
  }};
  box-shadow: ${props => {
    switch (props.$status) {
      case 'online': return '0 0 10px #00ff00';
      case 'warning': return '0 0 10px #ffff00';
      case 'offline': return '0 0 10px #ff0000';
      default: return 'none';
    }
  }};
`;

const StatusLabel = styled.span`
  color: #ffffff;
  font-size: 0.9rem;
`;

const StatusValue = styled.span`
  font-size: 1.2rem;
  color: #ffffff;
  text-shadow: 0 0 5px #ffffff;
  min-width: 120px;
  text-align: right;
`;

const IconWrapper = styled.span<{ $status: string }>`
  display: inline-block;
  font-size: 1.5rem;
  margin-right: 8px;
  transition: all 0.3s ease;
  color: ${props => {
    switch (props.$status) {
      case 'online': return '#00ff00';
      case 'warning': return '#ffff00';
      case 'offline': return '#ff0000';
      default: return '#666';
    }
  }};
  text-shadow: ${props => {
    switch (props.$status) {
      case 'online': return '0 0 10px #00ff00';
      case 'warning': return '0 0 10px #ffff00';
      case 'offline': return '0 0 10px #ff0000';
      default: return 'none';
    }
  }};
`;

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label, 
  value, 
  icon 
}) => {
  return (
    <IndicatorContainer>
      <StatusWrapper>
        {icon && <IconWrapper $status={status}>{icon}</IconWrapper>}
        <StatusDot $status={status} />
        <StatusLabel>{label}</StatusLabel>
      </StatusWrapper>
      <StatusValue>{value}</StatusValue>
    </IndicatorContainer>
  );
};
