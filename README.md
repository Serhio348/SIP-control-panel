# SIP Water Management Control Panel - React TypeScript

A modern React TypeScript application for managing SIP (Steam In Place) water treatment systems. This application provides a comprehensive control panel for monitoring and controlling various system components including tanks, pumps, dosing stations, and sensors.

## Features

### System Components
- **Tank Control**: Monitor and control mixing tank levels and temperature
- **Water Supply System**: Manage water supply valves and flow rates
- **Dosing Stations**: Control alkali and acid dosing with rate and amount settings
- **Pump Systems**: Monitor and control feed and return pumps with frequency settings
- **Heat Exchanger**: Control steam heating system
- **Conductometer**: Monitor conductivity and pH levels with automatic dosing

### Key Features
- **Real-time Updates**: Live system monitoring with automatic updates
- **Modal Settings**: Comprehensive configuration panels for all system components
- **Alarm System**: Real-time alarm notifications and system status
- **Cycle Management**: Automated system cycles with phase tracking
- **Responsive Design**: Mobile-friendly interface with responsive grid layout
- **TypeScript**: Full type safety and better development experience

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive interfaces
- **Styled Components**: CSS-in-JS styling with theme consistency
- **React Context**: Centralized state management
- **Custom Hooks**: Reusable logic for system calculations and updates

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── StatusIndicator.tsx
│   │   ├── ValueDisplay.tsx
│   │   ├── Modal.tsx
│   │   └── InputGroup.tsx
│   ├── system/             # System-specific components
│   │   ├── TankControl.tsx
│   │   ├── PumpControl.tsx
│   │   ├── DosingStation.tsx
│   │   ├── ConductometerControl.tsx
│   │   └── SystemOverview.tsx
│   └── modals/             # Settings modal components
│       ├── TankSettingsModal.tsx
│       ├── PumpSettingsModal.tsx
│       └── SensorSettingsModal.tsx
├── context/
│   └── SystemContext.tsx   # Global state management
├── hooks/
│   ├── useSystemUpdates.ts # Real-time system updates
│   ├── usePumpCalculations.ts # Pump calculations
│   └── useCycleStatus.ts   # Cycle status management
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Component Architecture

### State Management
The application uses React Context for centralized state management with a reducer pattern for complex state updates. The `SystemContext` provides:
- System state (tank levels, temperatures, pump status, etc.)
- System actions (toggle functions, settings updates)
- Alarm management
- Calibration data

### Component Design
- **UI Components**: Reusable, styled components with consistent theming
- **System Components**: Domain-specific components for each system part
- **Modal Components**: Settings and configuration interfaces
- **Custom Hooks**: Encapsulated logic for calculations and real-time updates

### Styling
- **Styled Components**: CSS-in-JS with consistent theme variables
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Theme Consistency**: Unified color scheme and typography

## Key Improvements from Original

1. **Type Safety**: Full TypeScript implementation with comprehensive interfaces
2. **Component Architecture**: Modular, reusable components with clear separation of concerns
3. **State Management**: Centralized state with React Context and reducer pattern
4. **Performance**: Optimized with React hooks and memoization
5. **Maintainability**: Clean code structure with custom hooks for business logic
6. **User Experience**: Improved modal interactions and responsive design
7. **Code Organization**: Logical file structure with clear component hierarchy

## System Features

### Real-time Monitoring
- Tank level and temperature tracking
- Pump status and operating time
- Conductivity and pH monitoring
- System cycle progress

### Control Functions
- Manual and automatic tank filling
- Pump frequency control
- Dosing rate and amount settings
- Temperature and level targets
- Emergency stop functionality

### Configuration
- Calibration data management
- Hysteresis threshold settings
- Cycle duration and target levels
- Pump frequency parameters

## Development

The application is built with modern React patterns and best practices:
- Functional components with hooks
- TypeScript for type safety
- Styled components for styling
- Custom hooks for business logic
- Context for state management

## Testing

Run tests with:
```bash
npm test
```

## License

This project is part of a SIP water management system implementation.
