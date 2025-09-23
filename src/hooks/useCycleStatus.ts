import { useMemo, useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';

///Этот хук отслеживает и рассчитывает текущее состояние цикла очистки в реальном времени.
export const useCycleStatus = () => {
  const { state } = useSystem();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Обновление текущего времени каждую секунду, когда цикл работает и не на паузе
  // Назначение: Создает таймер, который обновляет время только когда цикл активен и не на паузе.
  useEffect(() => {
    if (!state.cycleRunning || state.systemPaused) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [state.cycleRunning, state.systemPaused]);

  /// Расчёт ключевых параметров цикла
  const cycleStatus = useMemo(() => {
    if (!state.cycleRunning || !state.cycleStartTime) {
      return {
        isRunning: false,
        phase: 'idle' as const,
        remainingTime: 0,
        elapsedTime: 0,
        progress: 0
      };
    }
    // Расчет прошедшего времени с учетом пауз
    const elapsedTime = Math.floor((currentTime - state.cycleStartTime) / 1000) - state.totalPausedTime;

    // Расчет оставшегося времени
    const remainingTime = Math.max(0, state.cycleDuration - elapsedTime);

    // Расчет прогресса (0-100%)
    const progress = Math.min(100, (elapsedTime / state.cycleDuration) * 100);

    return {
      isRunning: true,
      phase: state.cyclePhase,     // Текущая фаза цикла
      remainingTime,               // Оставшееся время в секундах
      elapsedTime,                 // Прошедшее время в секундах
      progress                     // Прогресс в процентах
    };
  }, [state.cycleRunning, state.cycleStartTime, state.cycleDuration, state.cyclePhase, state.totalPausedTime, state.systemPaused, currentTime]);

     ////Форматирование времени:
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

     /////Текстовые описания фаз:
  const getPhaseText = (phase: string): string => {
    switch (phase) {
      case 'filling': return 'ЗАПОЛНЕНИЕ';     // Фаза наполнения бака
      case 'processing': return 'ОБРАБОТКА';   // Фаза химической обработки
      case 'completed': return 'ЗАВЕРШЕН';     // Цикл завершен
      default: return 'РАБОТАЕТ';               // Общий статус
    }
  };
   ////Цветовая индикация фаз:
  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'filling': return '#00ff00';    // Зеленый - нормальная работа
      case 'processing': return '#00ff00';  // Зеленый - нормальная работа  
      case 'completed': return '#ffaa00';   // Оранжевый - завершение
      default: return '#ff0000';           // Красный - ошибка/неизвестно
    }
  };
     ////Хук возвращает объект со следующими свойствами:
  return {
    ...cycleStatus,
    formattedRemainingTime: formatTime(cycleStatus.remainingTime),
    formattedElapsedTime: formatTime(cycleStatus.elapsedTime),
    phaseText: getPhaseText(cycleStatus.phase),
    phaseColor: getPhaseColor(cycleStatus.phase)
  };
};