import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ESP8266Component, ESP8266Pin } from '../types';
import { useApp } from '../store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ESP8266BoardProps {
  component: ESP8266Component;
}

function PinTooltipContent({ pin }: { pin: ESP8266Pin }) {
  const typeColors: Record<string, string> = {
    digital: 'text-blue-400',
    analog: 'text-green-400',
    power: 'text-red-400',
    ground: 'text-gray-400',
    communication: 'text-purple-400',
  };

  return (
    <div className="space-y-1 text-xs">
      <div className="font-bold text-white">{pin.label}</div>
      {pin.gpioNumber !== undefined && (
        <div className="text-gray-300">GPIO{pin.gpioNumber}</div>
      )}
      <div className={typeColors[pin.type]}>
        Type: {pin.type.charAt(0).toUpperCase() + pin.type.slice(1)}
      </div>
      {pin.mode && <div className="text-gray-300">Mode: {pin.mode}</div>}
      {pin.voltage !== undefined && <div className="text-yellow-400">{pin.voltage}V</div>}
      {pin.state !== undefined && (
        <div className="text-cyan-400">
          State: {typeof pin.state === 'boolean' ? (pin.state ? 'HIGH' : 'LOW') : pin.state}
        </div>
      )}
    </div>
  );
}

export function ESP8266Board({ component }: ESP8266BoardProps) {
  const { moveComponent, selectComponent, selectedComponentId } = useApp();
  const [isDragging, setIsDragging] = useState(false);
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
        setIsDragging(false);
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
        isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
      } ${isDragging ? 'scale-105' : 'hover:scale-[1.02]'}`}
      style={{
        left: component.position.x,
        top: component.position.y,
        opacity,
        transform: `rotate(${component.rotation}deg)`,
      }}
    >
      {/* Board Body with glassmorphism effect */}
      <div className="relative bg-gradient-to-br from-[#2C5F7C] to-[#1A3A4F] rounded-xl shadow-2xl border-2 border-[#1A3A4F] w-48 h-80 backdrop-blur-sm">
        {/* Shadow overlay for depth */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* USB Port at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-gradient-to-b from-[#E0E0E0] to-[#A0A0A0] rounded-t-lg border border-[#808080] shadow-lg">
          <div className="absolute inset-x-1 top-1 h-2 bg-[#1A1A1A] rounded-sm" />
        </div>
        
        {/* ESP8266 Module */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-20 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-lg border border-[#333333] shadow-xl flex items-center justify-center">
          {/* Module text */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[#FFD700] text-sm font-bold font-mono">ESP-12E</div>
            <div className="text-[#888888] text-[10px] font-mono mt-1">ESP8266</div>
          </div>
          
          {/* Power LED */}
          <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            component.isRunning 
              ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse' 
              : 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]'
          }`} />
          
          {/* WiFi antenna pattern */}
          <div className="absolute bottom-2 left-2 flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-[#FFD700] rounded-full"
                style={{ height: `${i * 2 + 2}px` }}
              />
            ))}
          </div>
        </div>

        {/* Buttons with better styling */}
        <div className="absolute top-32 left-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-lg border-2 border-[#404040] text-white text-[10px] font-mono hover:bg-[#2A2A2A] hover:border-[#606060] transition-all shadow-lg active:scale-95">
            RST
          </button>
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-lg border-2 border-[#404040] text-white text-[10px] font-mono hover:bg-[#2A2A2A] hover:border-[#606060] transition-all shadow-lg active:scale-95">
            FLASH
          </button>
        </div>

        {/* Left Pins */}
        <div className="absolute left-0 top-32 flex flex-col gap-1">
          <TooltipProvider>
            {component.pins.slice(0, 8).map((pin) => (
              <Tooltip key={pin.id}>
                <TooltipTrigger asChild>
                  <div className="flex items-center group">
                    {/* Pin connector */}
                    <div 
                      className={`w-5 h-4 rounded-l-md border-2 transition-all duration-200 ${
                        pin.state ? 'bg-yellow-400 border-yellow-500 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-[#FFD700] border-[#B8860B]'
                      } group-hover:bg-yellow-300 group-hover:shadow-[0_0_12px_rgba(250,204,21,0.8)] cursor-pointer`}
                    />
                    {/* Pin label */}
                    <div className="bg-[#1A1A1A] px-2 py-1 text-white text-[10px] font-mono font-bold border border-[#333333] group-hover:bg-[#2A2A2A] transition-colors">
                      {pin.label}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-gray-900 border-gray-700">
                  <PinTooltipContent pin={pin} />
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Right Pins */}
        <div className="absolute right-0 top-32 flex flex-col gap-1">
          <TooltipProvider>
            {component.pins.slice(8).map((pin) => (
              <Tooltip key={pin.id}>
                <TooltipTrigger asChild>
                  <div className="flex items-center group">
                    {/* Pin label */}
                    <div className="bg-[#1A1A1A] px-2 py-1 text-white text-[10px] font-mono font-bold border border-[#333333] group-hover:bg-[#2A2A2A] transition-colors">
                      {pin.label}
                    </div>
                    {/* Pin connector */}
                    <div 
                      className={`w-5 h-4 rounded-r-md border-2 transition-all duration-200 ${
                        pin.state ? 'bg-yellow-400 border-yellow-500 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-[#FFD700] border-[#B8860B]'
                      } group-hover:bg-yellow-300 group-hover:shadow-[0_0_12px_rgba(250,204,21,0.8)] cursor-pointer`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 border-gray-700">
                  <PinTooltipContent pin={pin} />
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Board Label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold bg-[#1A1A1A]/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          NodeMCU v3
        </div>

        {/* PCB texture details */}
        <div className="absolute inset-2 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
    </div>
  );
}
