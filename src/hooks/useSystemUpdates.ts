import { useEffect } from 'react';
import { useSystem } from '../context/SystemContext';

export const useSystemUpdates = () => {
  const { state, dispatch } = useSystem();

  // Обновления системы в реальном времени
  useEffect(() => {
    if (state.systemPaused) {
      return; // Не обновлять, если система на паузе
    }

    const interval = setInterval(() => {
      // Отправка действия UPDATE_SYSTEM_STATE для обработки всех обновлений в реальном времени
      dispatch({ type: 'UPDATE_SYSTEM_STATE' });
    }, 1000); // Обновление каждую секунду

    return () => clearInterval(interval);
  }, [state.systemPaused, dispatch]);
};
