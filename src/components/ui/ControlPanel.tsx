import React from 'react';
import styled from 'styled-components';
import { ControlPanelProps } from '../../types';

const PanelContainer = styled.div`
  background: #2d2d2d;
  border: 2px solid #00ff00;
  padding: 15px;
  position: relative;
`;

const PanelTitle = styled.h3`
  color: #ffffff;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SettingsIcon = styled.span`
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    transform: rotate(90deg);
    text-shadow: 0 0 10px #00ff00;
    background: rgba(0, 255, 0, 0.2);
  }
`;

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  title, 
  children, 
  settingsIcon = false, 
  onSettingsClick 
}) => {
  return (
    <PanelContainer>
      <PanelTitle>
        {title}
        {settingsIcon && (
          <SettingsIcon onClick={onSettingsClick} title="Настройки">
            🔧
          </SettingsIcon>
        )}
      </PanelTitle>
      {children}
    </PanelContainer>
  );
};
