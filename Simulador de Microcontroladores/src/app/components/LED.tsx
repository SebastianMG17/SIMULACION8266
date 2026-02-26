import { useDrag } from 'react-dnd';
import { LEDComponent } from '../types';
import { useApp } from '../store';

interface LEDProps {
  component: LEDComponent;
}

export function LED({ component }: LEDProps) {
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
      <div className="relative flex flex-col items-center">
        {/* Connection Point Top */}
        <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg hover:scale-125 transition-transform cursor-pointer" />
        
        {/* LED Body with glow effect */}
        <div className={`relative w-10 h-16 rounded-full shadow-2xl transition-all duration-300 mt-1 ${
          component.isOn ? 'scale-105' : ''
        }`}
        style={{ 
          backgroundColor: component.isOn ? component.color : `${component.color}99`,
        }}>
          {/* Glow effect when ON */}
          {component.isOn && (
            <>
              {/* Inner glow */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  backgroundColor: component.color,
                  opacity: 0.6,
                  filter: 'blur(4px)',
                }}
              />
              {/* Outer glow */}
              <div 
                className="absolute -inset-2 rounded-full"
                style={{
                  backgroundColor: component.color,
                  opacity: 0.4,
                  filter: 'blur(12px)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              {/* Bright center */}
              <div 
                className="absolute inset-3 rounded-full"
                style={{
                  background: `radial-gradient(circle, white, ${component.color})`,
                  opacity: 0.8,
                }}
              />
            </>
          )}
          
          {/* Glass effect overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* LED Legs */}
        <div className="flex gap-3 mt-1">
          <div className="w-1 h-5 bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
          <div className="w-1 h-5 bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        </div>

        {/* Connection Point Bottom */}
        <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg mt-1 hover:scale-125 transition-transform cursor-pointer" />

        {/* Label */}
        <div className="mt-2 text-xs font-mono text-white bg-black/70 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg">
          {component.label || 'LED'}
        </div>
        
        {/* Status indicator */}
        {component.isOn && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        )}
      </div>
    </div>
  );
}
