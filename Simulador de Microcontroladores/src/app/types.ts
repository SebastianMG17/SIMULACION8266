// Component Types
export type ComponentType = 'esp8266' | 'led' | 'resistor' | 'potentiometer';

export interface Position {
  x: number;
  y: number;
}

// ESP8266 Pin Types
export type PinType = 'digital' | 'analog' | 'power' | 'ground' | 'communication';

export interface ESP8266Pin {
  id: string;
  label: string; // D0, D1, A0, etc.
  gpioNumber?: number; // Real GPIO number
  type: PinType;
  position: Position; // Relative to board
  voltage?: number;
  mode?: 'input' | 'output';
  state?: boolean | number; // Digital or analog value
}

// Component Properties
export interface ComponentBase {
  id: string;
  type: ComponentType;
  position: Position;
  rotation: number;
  label?: string;
}

export interface ESP8266Component extends ComponentBase {
  type: 'esp8266';
  pins: ESP8266Pin[];
  isRunning: boolean;
}

export interface LEDComponent extends ComponentBase {
  type: 'led';
  color: string;
  isOn: boolean;
  brightness: number;
}

export interface ResistorComponent extends ComponentBase {
  type: 'resistor';
  value: number; // in Ohms
  tolerance: number; // percentage
}

export interface PotentiometerComponent extends ComponentBase {
  type: 'potentiometer';
  maxValue: number; // max resistance in Ohms
  currentValue: number; // 0-1023 (ADC value)
  rotation: number; // knob rotation
}

export type Component = ESP8266Component | LEDComponent | ResistorComponent | PotentiometerComponent;

// Wire/Connection
export interface Connection {
  id: string;
  from: {
    componentId: string;
    pinId?: string; // For ESP8266
    point: Position; // Actual position on canvas
  };
  to: {
    componentId: string;
    pinId?: string;
    point: Position;
  };
  color: string; // red, black, yellow, green
  type: 'vcc' | 'gnd' | 'data' | 'analog';
}

// App State
export interface AppState {
  components: Component[];
  connections: Connection[];
  selectedComponentId: string | null;
  selectedConnectionId: string | null;
  isRunning: boolean;
  isDarkMode: boolean;
  canvasZoom: number;
  canvasOffset: Position;
  serialOutput: string[];
}
