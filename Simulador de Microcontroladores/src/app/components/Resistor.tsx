import { useDrag } from 'react-dnd';
import { ResistorComponent } from '../types';
import { useApp } from '../store';

interface ResistorProps {
  component: ResistorComponent;
}

// Calculate color bands for resistor value
function getColorBands(value: number): string[] {
  const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
  const colorMap: Record<string, string> = {
    black: '#000000',
    brown: '#8B4513',
    red: '#FF0000',
    orange: '#FFA500',
    yellow: '#FFFF00',
    green: '#008000',
    blue: '#0000FF',
    violet: '#8B00FF',
    gray: '#808080',
    white: '#FFFFFF',
  };

  // Simple calculation for demonstration (220Ω = Red, Red, Brown, Gold)
  if (value === 220) {
    return [colorMap.red, colorMap.red, colorMap.brown, colorMap.yellow];
  }
  if (value === 1000) {
    return [colorMap.brown, colorMap.black, colorMap.red, colorMap.yellow];
  }
  if (value === 10000) {
    return [colorMap.brown, colorMap.black, colorMap.orange, colorMap.yellow];
  }
  
  // Default
  return [colorMap.brown, colorMap.black, colorMap.brown, colorMap.yellow];
}

export function Resistor({ component }: ResistorProps) {
  const { moveComponent, selectComponent, selectedComponentId } = useApp();
  const isSelected = selectedComponentId === component.id;

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'component',
      item: { id: component.id, type: component.type },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
      end: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          moveComponent(component.id, {
            x: Math.round(component.position.x + delta.x),
            y: Math.round(component.position.y + delta.y),
          });
        }
      },
    }),
    [component.id, component.position]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const bands = getColorBands(component.value);

  return (
    <div
      ref={dragRef}
      onClick={handleClick}
      className={`absolute cursor-move transition-all duration-200 ${
        isSelected ? 'ring-4 ring-blue-500 ring-opacity-50 rounded-lg' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        opacity,
        transform: `rotate(${component.rotation}deg)`,
      }}
    >
      <div className="relative flex items-center">
        {/* Connection Point Left */}
        <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg hover:scale-125 transition-transform cursor-pointer" />
        
        {/* Left Wire */}
        <div className="w-6 h-1 bg-gradient-to-r from-gray-400 to-gray-300 shadow-md" />

        {/* Resistor Body with 3D effect */}
        <div className="relative w-20 h-8 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-lg flex items-center justify-around px-2 border-2 border-amber-200 shadow-xl">
          {/* Color Bands */}
          {bands.map((color, i) => (
            <div 
              key={i}
              className="w-1.5 h-full shadow-inner" 
              style={{ backgroundColor: color }}
            />
          ))}
          
          {/* 3D highlights */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute top-1 left-2 right-2 h-2 bg-white/30 rounded-full blur-sm" />
        </div>

        {/* Right Wire */}
        <div className="w-6 h-1 bg-gradient-to-r from-gray-300 to-gray-400 shadow-md" />

        {/* Connection Point Right */}
        <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg hover:scale-125 transition-transform cursor-pointer" />

        {/* Label with value */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white bg-black/70 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg whitespace-nowrap">
          {component.value >= 1000 ? `${component.value / 1000}kΩ` : `${component.value}Ω`}
        </div>
      </div>
    </div>
  );
}
