import { useDrag } from 'react-dnd';
import { PotentiometerComponent } from '../types';
import { useApp } from '../store';

interface PotentiometerProps {
  component: PotentiometerComponent;
}

export function Potentiometer({ component }: PotentiometerProps) {
  const { moveComponent, selectComponent, selectedComponentId, updateComponent } = useApp();
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

  const knobRotation = (component.currentValue / 1023) * 270 - 135; // -135 to +135 degrees

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
        {/* Potentiometer Body with gradient */}
        <div className="w-20 h-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-xl shadow-2xl border-2 border-blue-700 flex flex-col items-center justify-center relative overflow-hidden">
          {/* PCB texture */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '8px 8px'
          }} />
          
          {/* Dial background */}
          <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full border-3 border-gray-600 shadow-inner flex items-center justify-center">
            {/* Rotation track marks */}
            <div className="absolute inset-0">
              {[...Array(9)].map((_, i) => {
                const angle = (i * 30 - 120) * (Math.PI / 180);
                const x = Math.cos(angle) * 22;
                const y = Math.sin(angle) * 22;
                return (
                  <div
                    key={i}
                    className="absolute w-0.5 h-1.5 bg-gray-500"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${i * 30 - 120}deg)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Knob */}
            <div className="relative w-11 h-11 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-full shadow-xl border-2 border-gray-600 flex items-center justify-center">
              {/* Knob indicator line */}
              <div 
                className="absolute w-1 h-5 bg-white rounded-full top-1 shadow-lg transition-transform duration-200"
                style={{ 
                  transform: `rotate(${knobRotation}deg)`, 
                  transformOrigin: 'center 18px' 
                }}
              />
              {/* Center dot */}
              <div className="w-2 h-2 bg-gray-600 rounded-full shadow-inner" />
              
              {/* Grip texture */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'repeating-conic-gradient(from 0deg, transparent 0deg 5deg, rgba(255,255,255,0.05) 5deg 10deg)',
              }} />
            </div>
          </div>

          {/* Adjustment indicator */}
          <div className="absolute top-2 text-[8px] font-mono text-blue-300 font-bold">
            10kΩ
          </div>
        </div>

        {/* Pins with better styling */}
        <div className="flex gap-5 mt-2">
          {[
            { label: 'VCC', color: 'red' },
            { label: 'SIG', color: 'green' },
            { label: 'GND', color: 'black' }
          ].map((pin) => (
            <div key={pin.label} className="flex flex-col items-center">
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg hover:scale-125 transition-transform cursor-pointer" />
              <div 
                className="text-[9px] font-mono text-white bg-black/70 px-1.5 py-0.5 rounded mt-1 backdrop-blur-sm border border-white/20"
              >
                {pin.label}
              </div>
            </div>
          ))}
        </div>

        {/* Label and value display */}
        <div className="mt-2 flex flex-col items-center gap-1">
          <div className="text-xs font-mono text-white bg-black/70 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg">
            {component.label || 'POT'}
          </div>
          <div className="text-[10px] font-mono text-cyan-400 bg-black/50 px-2 py-0.5 rounded">
            {component.currentValue} / 1023
          </div>
        </div>
      </div>
    </div>
  );
}
