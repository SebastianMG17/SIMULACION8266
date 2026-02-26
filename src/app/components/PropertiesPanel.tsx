import { X, Trash2, RotateCw } from 'lucide-react';
import { useApp } from '../store';
import { Component, LEDComponent, ResistorComponent, PotentiometerComponent, ESP8266Component } from '../types';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function PropertiesPanel() {
  const { 
    selectedComponentId, 
    components, 
    selectComponent, 
    updateComponent,
    deleteComponent 
  } = useApp();

  if (!selectedComponentId) {
    return (
      <div className="w-80 bg-[#1F2937] border-l border-gray-700 flex items-center justify-center p-8">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">Select a component to edit properties</p>
        </div>
      </div>
    );
  }

  const component = components.find((c) => c.id === selectedComponentId);
  if (!component) return null;

  const handleDelete = () => {
    deleteComponent(component.id);
  };

  const handleUpdate = (updates: Partial<Component>) => {
    updateComponent(component.id, updates);
  };

  return (
    <div className="w-80 bg-[#1F2937] border-l border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#111827]">
        <div>
          <h3 className="text-white font-semibold text-sm">Properties</h3>
          <p className="text-gray-400 text-xs mt-0.5">{component.type.toUpperCase()}</p>
        </div>
        <button
          onClick={() => selectComponent(null)}
          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Common Properties */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400 mb-1">Label</Label>
            <Input
              value={component.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              className="bg-[#111827] border-gray-600 text-white text-sm"
              placeholder="Component name..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400 mb-1">X Position</Label>
              <Input
                type="number"
                value={Math.round(component.position.x)}
                onChange={(e) => handleUpdate({ 
                  position: { ...component.position, x: Number(e.target.value) }
                })}
                className="bg-[#111827] border-gray-600 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1">Y Position</Label>
              <Input
                type="number"
                value={Math.round(component.position.y)}
                onChange={(e) => handleUpdate({ 
                  position: { ...component.position, y: Number(e.target.value) }
                })}
                className="bg-[#111827] border-gray-600 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-2">Rotation: {component.rotation}°</Label>
            <Slider
              value={[component.rotation]}
              onValueChange={([value]) => handleUpdate({ rotation: value })}
              min={0}
              max={360}
              step={15}
              className="mt-2"
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdate({ rotation: 0 })}
                className="flex-1 bg-[#111827] border-gray-600 text-white text-xs hover:bg-gray-700"
              >
                <RotateCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Type-specific Properties */}
        {component.type === 'led' && <LEDProperties component={component as LEDComponent} onUpdate={handleUpdate} />}
        {component.type === 'resistor' && <ResistorProperties component={component as ResistorComponent} onUpdate={handleUpdate} />}
        {component.type === 'potentiometer' && <PotentiometerProperties component={component as PotentiometerComponent} onUpdate={handleUpdate} />}
        {component.type === 'esp8266' && <ESP8266Properties component={component as ESP8266Component} />}
      </div>

      {/* Footer with Delete */}
      <div className="p-4 border-t border-gray-700 bg-[#111827]">
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="w-full"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Component
        </Button>
      </div>
    </div>
  );
}

function LEDProperties({ component, onUpdate }: { component: LEDComponent; onUpdate: (updates: Partial<Component>) => void }) {
  return (
    <div className="space-y-3">
      <h4 className="text-white text-xs font-semibold">LED Settings</h4>
      
      <div>
        <Label className="text-xs text-gray-400 mb-1">Color</Label>
        <div className="flex gap-2">
          {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'].map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ ...component, color })}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                component.color === color ? 'border-white scale-110' : 'border-gray-600'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2">Brightness: {Math.round(component.brightness * 100)}%</Label>
        <Slider
          value={[component.brightness * 100]}
          onValueChange={([value]) => onUpdate({ ...component, brightness: value / 100 })}
          min={0}
          max={100}
          step={5}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${component.isOn ? 'bg-green-500' : 'bg-gray-600'}`} />
        <span className="text-xs text-gray-400">Status: {component.isOn ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  );
}

function ResistorProperties({ component, onUpdate }: { component: ResistorComponent; onUpdate: (updates: Partial<Component>) => void }) {
  const resistorValues = [100, 220, 330, 470, 1000, 2200, 4700, 10000];
  
  return (
    <div className="space-y-3">
      <h4 className="text-white text-xs font-semibold">Resistor Settings</h4>
      
      <div>
        <Label className="text-xs text-gray-400 mb-1">Resistance (Ω)</Label>
        <Input
          type="number"
          value={component.value}
          onChange={(e) => onUpdate({ ...component, value: Number(e.target.value) })}
          className="bg-[#111827] border-gray-600 text-white text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2">Common Values</Label>
        <div className="grid grid-cols-2 gap-2">
          {resistorValues.map((value) => (
            <Button
              key={value}
              size="sm"
              variant="outline"
              onClick={() => onUpdate({ ...component, value })}
              className={`text-xs ${
                component.value === value 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-[#111827] border-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {value >= 1000 ? `${value / 1000}kΩ` : `${value}Ω`}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2">Tolerance: ±{component.tolerance}%</Label>
        <Slider
          value={[component.tolerance]}
          onValueChange={([value]) => onUpdate({ ...component, tolerance: value })}
          min={1}
          max={20}
          step={1}
        />
      </div>
    </div>
  );
}

function PotentiometerProperties({ component, onUpdate }: { component: PotentiometerComponent; onUpdate: (updates: Partial<Component>) => void }) {
  return (
    <div className="space-y-3">
      <h4 className="text-white text-xs font-semibold">Potentiometer Settings</h4>
      
      <div>
        <Label className="text-xs text-gray-400 mb-1">Max Resistance (Ω)</Label>
        <Input
          type="number"
          value={component.maxValue}
          onChange={(e) => onUpdate({ ...component, maxValue: Number(e.target.value) })}
          className="bg-[#111827] border-gray-600 text-white text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2">Current Value: {component.currentValue} / 1023</Label>
        <Slider
          value={[component.currentValue]}
          onValueChange={([value]) => onUpdate({ ...component, currentValue: value })}
          min={0}
          max={1023}
          step={1}
        />
      </div>

      <div className="bg-[#111827] rounded-lg p-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Voltage:</span>
          <span className="text-white font-mono">{((component.currentValue / 1023) * 3.3).toFixed(2)}V</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Percentage:</span>
          <span className="text-white font-mono">{Math.round((component.currentValue / 1023) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

function ESP8266Properties({ component }: { component: ESP8266Component }) {
  return (
    <div className="space-y-3">
      <h4 className="text-white text-xs font-semibold">ESP8266 Info</h4>
      
      <div className="bg-[#111827] rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Status:</span>
          <span className={`font-mono ${component.isRunning ? 'text-green-400' : 'text-gray-400'}`}>
            {component.isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Total Pins:</span>
          <span className="text-white font-mono">{component.pins.length}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Digital I/O:</span>
          <span className="text-white font-mono">9</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Analog In:</span>
          <span className="text-white font-mono">1 (A0)</span>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-400 mb-2">Pin States</Label>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {component.pins.map((pin) => (
            <div key={pin.id} className="flex items-center justify-between bg-[#111827] rounded px-2 py-1.5">
              <span className="text-xs text-gray-300 font-mono">{pin.label}</span>
              <div className="flex items-center gap-2">
                {pin.gpioNumber !== undefined && (
                  <span className="text-[10px] text-gray-500">GPIO{pin.gpioNumber}</span>
                )}
                <div className={`w-2 h-2 rounded-full ${
                  pin.state ? 'bg-green-500' : 'bg-gray-600'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
