import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ModalProps } from '../../types';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const ModalContent = styled.div`
  background: #2d2d2d;
  border: 2px solid #00ff00;
  margin: 2% auto;
  padding: 0;
  width: 95%;
  max-width: 900px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
`;

const ModalHeader = styled.div`
  background: #1a1a1a;
  border-bottom: 1px solid #00ff00;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 1.3rem;
`;

const CloseButton = styled.span`
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff0000;
  }
`;

const ModalBody = styled.div`
  padding: 15px;
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
