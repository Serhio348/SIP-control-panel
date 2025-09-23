import React from 'react';
import styled from 'styled-components';
import { ValueDisplayProps } from '../../types';

const DisplayContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #ffffff;
  padding: 8px;
  margin: 5px 0;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  text-align: center;
`;

export const ValueDisplay: React.FC<ValueDisplayProps> = ({ children }) => {
  return (
    <DisplayContainer>
      {children}
    </DisplayContainer>
  );
};
