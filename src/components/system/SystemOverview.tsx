import React from 'react';
import styled from 'styled-components';
import { SystemOverviewProps } from '../../types';
import { Button } from '../ui';

// === 1. СТИЛИЗАЦИЯ КОМПОНЕНТОВ ===

// Основной заголовок системы
const Header = styled.div`
  background: #2d2d2d;
  border: 2px solid #00ff00;  // Зеленая рамка в стиле промышленного интерфейса
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
`;

// Контейнер для иконок управления (левый верхний угол)
const HeaderControls = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  gap: 10px;
`;

// Иконка настроек с анимацией при наведении
const SettingsIcon = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  color: #00ff00;
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    color: #ffffff;
    background: rgba(0, 255, 0, 0.2);
    transform: scale(1.1);
  }
`;

// Иконка лампы аварийных сигналов с анимацией
const AlarmIcon = styled.span<{ $hasAlarms: boolean }>`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.$hasAlarms ? '#ff0000' : '#ffff00'};
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 5px;
  animation: ${props => props.$hasAlarms ? 'lampBlink 1s infinite' : 'none'};
  text-shadow: ${props => props.$hasAlarms ? '0 0 10px #ff0000' : '0 0 5px #ffff00'};

  &:hover {
    color: #ffffff;
    background: ${props => props.$hasAlarms ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 0, 0.2)'};
    transform: scale(1.1);
    text-shadow: 0 0 15px #ffffff;
  }

  @keyframes lampBlink {
    0%, 50% { 
      opacity: 1; 
      text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
    }
    51%, 100% { 
      opacity: 0.3; 
      text-shadow: 0 0 5px #ff0000;
    }
  }
`;

// Главный заголовок системы
const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  text-shadow: 0 0 10px #ffffff;  // Свечение для лучшей читаемости
  margin-bottom: 5px;
`;

// Контейнер для отображения параметров системы
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #00ff00;
  border-radius: 5px;
  flex-wrap: wrap;  // Адаптивность на мобильных устройствах
`;

// Отдельный элемент параметра системы
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
`;

// Подпись параметра
const OverviewLabel = styled.span`
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 5px;
`;

// Значение параметра (выделено зеленым)
const OverviewValue = styled.span`
  color: #00ff00;
  font-size: 1.1rem;
  font-weight: bold;
`;

// Контейнер для кнопок управления
const OverviewControls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

// === 2. ОСНОВНОЙ КОМПОНЕНТ СИСТЕМНОГО ОБЗОРА ===
export const SystemOverview: React.FC<SystemOverviewProps> = ({
  totalSystemTime,      // Общее время работы системы
  processStatus,        // Статус процесса (Активен/Пауза/Остановлен)
  currentCycle,         // Текущая фаза цикла СИП-мойки
  remainingTime,        // Оставшееся время текущей фазы
  onStartCycle,         // Колбек запуска/остановки цикла
  onPauseSystem,        // Колбек паузы/продолжения
  onSystemSettings,     // Колбек открытия настроек системы
  onAlarmClick,         // Колбек открытия аварийных сигналов
  hasAlarms = false,    // Флаг наличия аварийных сигналов
  isCycleRunning = false, // Флаг активного цикла
  isSystemPaused = false  // Флаг режима паузы
}) => {
  return (
    <Header>
      {/* 3. БЛОК УПРАВЛЕНИЯ (иконки настроек и аварийных сигналов) */}
      <HeaderControls>
        <AlarmIcon 
          onClick={onAlarmClick} 
          title="Аварийные сигналы"
          $hasAlarms={hasAlarms}
        >
          💡
        </AlarmIcon>
        <SettingsIcon 
          onClick={onSystemSettings} 
          title="Настройки системы"
        >
          ⚙️
        </SettingsIcon>
      </HeaderControls>

      {/* 4. ЗАГОЛОВОК СИСТЕМЫ */}
      <Title>ПАНЕЛЬ УПРАВЛЕНИЯ СИСТЕМОЙ SIP</Title>

      {/* 5. ОСНОВНАЯ ИНФОРМАЦИОННАЯ ПАНЕЛЬ */}
      <Overview>
        {/* 5.1. ОБЩЕЕ ВРЕМЯ РАБОТЫ */}
        <OverviewItem>
          <OverviewLabel>Общее время работы:</OverviewLabel>
          <OverviewValue>{totalSystemTime}</OverviewValue>
        </OverviewItem>

        {/* 5.2. СТАТУС ПРОЦЕССА */}
        <OverviewItem>
          <OverviewLabel>Статус процесса:</OverviewLabel>
          <OverviewValue>{processStatus}</OverviewValue>
        </OverviewItem>

        {/* 5.3. ТЕКУЩИЙ ЦИКЛ СИП-МОЙКИ */}
        <OverviewItem>
          <OverviewLabel>Текущий цикл:</OverviewLabel>
          <OverviewValue>{currentCycle}</OverviewValue>
        </OverviewItem>

        {/* 5.4. ОСТАВШЕЕСЯ ВРЕМЯ ТЕКУЩЕЙ ФАЗЫ */}
        <OverviewItem>
          <OverviewLabel>Осталось времени:</OverviewLabel>
          <OverviewValue>{remainingTime}</OverviewValue>
        </OverviewItem>

        {/* 6. БЛОК УПРАВЛЯЮЩИХ КНОПОК */}
        <OverviewControls>
          {/* 6.1. КНОПКА ЗАПУСКА/ОСТАНОВКИ ЦИКЛА */}
          <Button 
            onClick={onStartCycle} 
            active={isCycleRunning}
          >
            {isCycleRunning ? 'ОСТАНОВИТЬ ЦИКЛ' : 'ЗАПУСТИТЬ ЦИКЛ'}
          </Button>

          {/* 6.2. КНОПКА ПАУЗЫ/ПРОДОЛЖЕНИЯ */}
          <Button 
            onClick={onPauseSystem} 
            active={isSystemPaused} 
            disabled={!isCycleRunning}  // Неактивна когда цикл не запущен
          >
            {isSystemPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА'}
          </Button>
        </OverviewControls>
      </Overview>
    </Header>
  );
};