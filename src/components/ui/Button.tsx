import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../../types';

const StyledButton = styled.button<{ $active?: boolean; $variant?: string; $disabled?: boolean }>`
  background: ${props => {
    if (props.$disabled) return '#333';
    if (props.$active) return '#00ff00';
    if (props.$variant === 'danger') return '#1a1a1a';
    return '#1a1a1a';
  }};
  border: 2px solid ${props => {
    if (props.$disabled) return '#666';
    if (props.$variant === 'danger') return '#ff0000';
    return '#00ff00';
  }};
  color: ${props => {
    if (props.$disabled) return '#666';
    if (props.$active) return '#1a1a1a';
    if (props.$variant === 'danger') return '#ff0000';
    return '#ffffff';
  }};
  padding: 8px 16px;
  margin: 5px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};

  &:hover {
    background: ${props => {
      if (props.$disabled) return '#333';
      if (props.$variant === 'danger') return '#ff0000';
      return '#00ff00';
    }};
    color: ${props => {
      if (props.$disabled) return '#666';
      if (props.$variant === 'danger') return '#ffffff';
      return '#1a1a1a';
    }};
    box-shadow: ${props => {
      if (props.$disabled) return 'none';
      if (props.$variant === 'danger') return '0 0 15px #ff0000';
      return '0 0 15px #00ff00';
    }};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  active = false, 
  disabled = false, 
  variant = 'primary' 
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $active={active}
      $disabled={disabled}
      $variant={variant}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};
