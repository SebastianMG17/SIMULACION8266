import { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Component, Connection, Position, ESP8266Component, ESP8266Pin } from './types';

interface AppContextType extends AppState {
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, position: Position) => void;
  selectComponent: (id: string | null) => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  selectConnection: (id: string | null) => void;
  setRunning: (running: boolean) => void;
  toggleTheme: () => void;
  setZoom: (zoom: number) => void;
  setCanvasOffset: (offset: Position) => void;
  addSerialOutput: (message: string) => void;
  clearSerialOutput: () => void;
  updatePinState: (componentId: string, pinId: string, state: boolean | number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Create ESP8266 with all pins
function createESP8266(position: Position): ESP8266Component {
  const pins: ESP8266Pin[] = [
    // Left side pins (top to bottom)
    { id: '3v3-1', label: '3V3', type: 'power', position: { x: 0, y: 132 }, voltage: 3.3 },
    { id: 'gnd-1', label: 'GND', type: 'ground', position: { x: 0, y: 148 }, voltage: 0 },
    { id: 'd0', label: 'D0', gpioNumber: 16, type: 'digital', position: { x: 0, y: 164 }, mode: 'input', state: false },
    { id: 'd1', label: 'D1', gpioNumber: 5, type: 'digital', position: { x: 0, y: 180 }, mode: 'input', state: false },
    { id: 'd2', label: 'D2', gpioNumber: 4, type: 'digital', position: { x: 0, y: 196 }, mode: 'input', state: false },
    { id: 'd3', label: 'D3', gpioNumber: 0, type: 'digital', position: { x: 0, y: 212 }, mode: 'input', state: false },
    { id: 'd4', label: 'D4', gpioNumber: 2, type: 'digital', position: { x: 0, y: 228 }, mode: 'input', state: false },
    { id: 'd5', label: 'D5', gpioNumber: 14, type: 'digital', position: { x: 0, y: 244 }, mode: 'input', state: false },
    
    // Right side pins (top to bottom)
    { id: 'vin', label: 'VIN', type: 'power', position: { x: 192, y: 132 }, voltage: 5 },
    { id: 'gnd-2', label: 'GND', type: 'ground', position: { x: 192, y: 148 }, voltage: 0 },
    { id: 'rx', label: 'RX', gpioNumber: 3, type: 'communication', position: { x: 192, y: 164 }, mode: 'input', state: false },
    { id: 'tx', label: 'TX', gpioNumber: 1, type: 'communication', position: { x: 192, y: 180 }, mode: 'output', state: false },
    { id: 'd6', label: 'D6', gpioNumber: 12, type: 'digital', position: { x: 192, y: 196 }, mode: 'input', state: false },
    { id: 'd7', label: 'D7', gpioNumber: 13, type: 'digital', position: { x: 192, y: 212 }, mode: 'input', state: false },
    { id: 'd8', label: 'D8', gpioNumber: 15, type: 'digital', position: { x: 192, y: 228 }, mode: 'input', state: false },
    { id: 'a0', label: 'A0', type: 'analog', position: { x: 192, y: 244 }, mode: 'input', state: 0 },
  ];

  return {
    id: 'esp8266-1',
    type: 'esp8266',
    position,
    rotation: 0,
    label: 'NodeMCU ESP8266',
    pins,
    isRunning: false,
  };
}

const initialState: AppState = {
  components: [createESP8266({ x: 100, y: 100 })],
  connections: [],
  selectedComponentId: null,
  selectedConnectionId: null,
  isRunning: false,
  isDarkMode: true,
  canvasZoom: 1,
  canvasOffset: { x: 0, y: 0 },
  serialOutput: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const addComponent = (component: Component) => {
    setState((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));
  };

  const updateComponent = (id: string, updates: Partial<Component>) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const deleteComponent = (id: string) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== id),
      connections: prev.connections.filter(
        (conn) => conn.from.componentId !== id && conn.to.componentId !== id
      ),
      selectedComponentId: prev.selectedComponentId === id ? null : prev.selectedComponentId,
    }));
  };

  const moveComponent = (id: string, position: Position) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === id ? { ...c, position } : c
      ),
    }));
  };

  const selectComponent = (id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedComponentId: id,
      selectedConnectionId: null,
    }));
  };

  const addConnection = (connection: Connection) => {
    setState((prev) => ({
      ...prev,
      connections: [...prev.connections, connection],
    }));
  };

  const updateConnection = (id: string, updates: Partial<Connection>) => {
    setState((prev) => ({
      ...prev,
      connections: prev.connections.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const deleteConnection = (id: string) => {
    setState((prev) => ({
      ...prev,
      connections: prev.connections.filter((c) => c.id !== id),
      selectedConnectionId: prev.selectedConnectionId === id ? null : prev.selectedConnectionId,
    }));
  };

  const selectConnection = (id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedConnectionId: id,
      selectedComponentId: null,
    }));
  };

  const setRunning = (running: boolean) => {
    setState((prev) => ({
      ...prev,
      isRunning: running,
    }));
  };

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }));
  };

  const setZoom = (zoom: number) => {
    setState((prev) => ({
      ...prev,
      canvasZoom: Math.max(0.25, Math.min(3, zoom)),
    }));
  };

  const setCanvasOffset = (offset: Position) => {
    setState((prev) => ({
      ...prev,
      canvasOffset: offset,
    }));
  };

  const addSerialOutput = (message: string) => {
    setState((prev) => ({
      ...prev,
      serialOutput: [...prev.serialOutput, message],
    }));
  };

  const clearSerialOutput = () => {
    setState((prev) => ({
      ...prev,
      serialOutput: [],
    }));
  };

  const updatePinState = (componentId: string, pinId: string, pinState: boolean | number) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((c) => {
        if (c.id === componentId && c.type === 'esp8266') {
          const esp8266 = c as ESP8266Component;
          return {
            ...esp8266,
            pins: esp8266.pins.map((p) =>
              p.id === pinId ? { ...p, state: pinState } : p
            ),
          };
        }
        return c;
      }),
    }));
  };

  const value: AppContextType = {
    ...state,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    selectComponent,
    addConnection,
    updateConnection,
    deleteConnection,
    selectConnection,
    setRunning,
    toggleTheme,
    setZoom,
    setCanvasOffset,
    addSerialOutput,
    clearSerialOutput,
    updatePinState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
