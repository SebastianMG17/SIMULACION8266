import { Cpu, Lightbulb, Radio, Gauge, Plus } from 'lucide-react';
import { useApp } from '../store';
import { ComponentType, LEDComponent, ResistorComponent, PotentiometerComponent } from '../types';
import { Button } from './ui/button';

export function ComponentPalette() {
  const { addComponent, components } = useApp();

  const addNewComponent = (type: ComponentType) => {
    const id = `${type}-${Date.now()}`;
    const position = { x: 300, y: 200 };

    switch (type) {
      case 'led': {
        const led: LEDComponent = {
          id,
          type: 'led',
          position,
          rotation: 0,
          label: 'LED',
          color: '#EF4444',
          isOn: false,
          brightness: 1,
        };
        addComponent(led);
        break;
      }
      case 'resistor': {
        const resistor: ResistorComponent = {
          id,
          type: 'resistor',
          position,
          rotation: 0,
          label: 'Resistor',
          value: 220,
          tolerance: 5,
        };
        addComponent(resistor);
        break;
      }
      case 'potentiometer': {
        const pot: PotentiometerComponent = {
          id,
          type: 'potentiometer',
          position,
          rotation: 0,
          label: 'Potentiometer',
          maxValue: 10000,
          currentValue: 512,
          rotation: 0,
        };
        addComponent(pot);
        break;
      }
    }
  };

  const components_data = [
    { type: 'led' as ComponentType, icon: Lightbulb, label: 'LED', color: 'bg-red-600 hover:bg-red-700' },
    { type: 'resistor' as ComponentType, icon: Radio, label: 'Resistor', color: 'bg-amber-600 hover:bg-amber-700' },
    { type: 'potentiometer' as ComponentType, icon: Gauge, label: 'Potentiometer', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return (
    <div className="bg-[#2D2D2D] border-b border-gray-700 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Component:</span>
        </div>
        
        {components_data.map((comp) => (
          <Button
            key={comp.type}
            onClick={() => addNewComponent(comp.type)}
            className={`flex items-center gap-2 px-4 py-2 ${comp.color} text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium`}
          >
            <comp.icon className="w-4 h-4" />
            <span>{comp.label}</span>
          </Button>
        ))}

        <div className="ml-auto text-xs text-gray-500 font-mono">
          {components.length} component{components.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
