import React, { useState } from 'react';
import styled from 'styled-components';
import { SystemProvider, useSystem } from './context/SystemContext';
import { 
  SystemOverview, 
  TankControl, 
  WaterSupplyControl, 
  DosingStation, 
  ConductometerControl, 
  PumpControl, 
  ReturnPumpControl, 
  HeatExchangerControl, 
  AlarmPanel 
} from './components/system';
import { 
  TankSettingsModal, 
  PumpSettingsModal, 
  SystemSettingsModal, 
  SensorSettingsModal,
  HeatExchangerSettingsModal
} from './components/modals';
import { useSystemUpdates, usePumpCalculations, useCycleStatus, useAutoDosing } from './hooks';

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px;
`;

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AppContent: React.FC = () => {
  const { state, actions } = useSystem();
  const { feedPump, returnPump } = usePumpCalculations();
  const cycleStatus = useCycleStatus();
  
  // Состояния модальных окон
  const [tankModalOpen, setTankModalOpen] = useState(false);
  const [pumpModalOpen, setPumpModalOpen] = useState(false);
  const [returnPumpModalOpen, setReturnPumpModalOpen] = useState(false);
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [sensorModalOpen, setSensorModalOpen] = useState(false);
  const [heatExchangerModalOpen, setHeatExchangerModalOpen] = useState(false);
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);

  // Использование хука обновлений системы
  useSystemUpdates();
  
  // Использование хука автоматической дозировки
  useAutoDosing();

  // Расчет параметров водоснабжения
  const waterFlowRate = state.waterSupply ? 15.2 : 0;
  const waterPressure = state.waterSupply ? 2.8 : 0;

  // Расчет параметров теплообменника
  const steamTemperature = state.heating ? 120.5 : 0;

  // Расчет общего времени работы системы (упрощенно)
  const totalSystemTime = '24ч 35м';
  const processStatus = state.systemPaused ? 'ПАУЗА' : (state.systemRunning ? 'АКТИВЕН' : 'ОСТАНОВЛЕН');

  return (
    <AppContainer>
      <SystemOverview
        totalSystemTime={totalSystemTime}
        processStatus={processStatus}
        currentCycle={state.systemPaused ? 'ПАУЗА' : (cycleStatus.isRunning ? cycleStatus.phaseText : 'ОСТАНОВЛЕН')}
        remainingTime={cycleStatus.isRunning ? cycleStatus.formattedRemainingTime : '--'}
        onStartCycle={actions.startCycle}
        onPauseSystem={actions.pauseSystem}
        onSystemSettings={() => setSystemModalOpen(true)}
        onAlarmClick={() => setAlarmModalOpen(true)}
        hasAlarms={state.alarms && state.alarms.length > 0}
        isCycleRunning={cycleStatus.isRunning}
        isSystemPaused={state.systemPaused}
      />


      <ControlGrid>
        <TankControl
          level={state.tankLevel}
          temperature={state.tankTemperature}
          targetTemperature={state.targetTemperature}
          onAutoFill={actions.toggleTank}
          onEmergencyStop={actions.emergencyStop}
          onSettingsClick={() => setTankModalOpen(true)}
        />

        <WaterSupplyControl
          isOpen={state.waterSupply}
          flowRate={waterFlowRate}
          pressure={waterPressure}
          onToggle={actions.toggleValve}
        />

        <DosingStation
          type="alkali"
          isActive={state.alkaliDosing}
          solutionAmount={state.alkaliSolutionAmount}
          dosingRate={state.alkaliDosingRate}
          onToggle={actions.startAlkaliDosing}
          onSetAmount={actions.setAlkaliAmount}
          onSetRate={actions.setAlkaliDosingRate}
          disabled={state.acidDosing && !state.alkaliDosing}
        />

        <DosingStation
          type="acid"
          isActive={state.acidDosing}
          solutionAmount={state.acidSolutionAmount}
          dosingRate={state.acidDosingRate}
          onToggle={actions.startAcidDosing}
          onSetAmount={actions.setAcidAmount}
          onSetRate={actions.setAcidDosingRate}
          disabled={state.alkaliDosing && !state.acidDosing}
        />

        <ConductometerControl
          currentConductivity={state.currentConductivity}
          targetConcentration={state.targetConcentration}
          targetTemperature={state.targetTemperature}
          upperThreshold={state.upperThreshold}
          lowerThreshold={state.lowerThreshold}
          onSettingsClick={() => setSensorModalOpen(true)}
        />

        <PumpControl
          isRunning={state.feedPump}
          frequency={state.pumpFrequency}
          flowRate={feedPump.flowRate}
          pressure={feedPump.pressure}
          operatingTime={feedPump.operatingTime}
          onToggle={actions.togglePump}
          onSettingsClick={() => setPumpModalOpen(true)}
        />

        <ReturnPumpControl
          isRunning={state.returnPump}
          frequency={state.returnPumpFrequency}
          flowRate={returnPump.flowRate}
          pressure={returnPump.pressure}
          operatingTime={returnPump.operatingTime}
          onToggle={actions.toggleReturnPump}
          onSettingsClick={() => setReturnPumpModalOpen(true)}
        />

        <HeatExchangerControl
          isActive={state.heating}
          waterTemperature={state.tankTemperature}
          steamTemperature={steamTemperature}
          onToggle={actions.toggleHeating}
        />
      </ControlGrid>

      {/* Модальные окна */}
      <TankSettingsModal
        isOpen={tankModalOpen}
        onClose={() => setTankModalOpen(false)}
      />

      <PumpSettingsModal
        isOpen={pumpModalOpen}
        onClose={() => setPumpModalOpen(false)}
      />

      <PumpSettingsModal
        isOpen={returnPumpModalOpen}
        onClose={() => setReturnPumpModalOpen(false)}
        isReturnPump={true}
      />

      <SystemSettingsModal
        isOpen={systemModalOpen}
        onClose={() => setSystemModalOpen(false)}
      />

      <SensorSettingsModal
        isOpen={sensorModalOpen}
        onClose={() => setSensorModalOpen(false)}
      />

      <HeatExchangerSettingsModal
        isOpen={heatExchangerModalOpen}
        onClose={() => setHeatExchangerModalOpen(false)}
      />

      <AlarmPanel 
        isOpen={alarmModalOpen}
        onClose={() => setAlarmModalOpen(false)}
        alarms={state.alarms}
        onResetAlarms={actions.resetAlarms}
      />
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
};

export default App;
