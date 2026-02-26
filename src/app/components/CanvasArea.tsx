import { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useApp } from '../store';
import { ESP8266Board } from './ESP8266Board';
import { LED } from './LED';
import { Resistor } from './Resistor';
import { Potentiometer } from './Potentiometer';
import { Minimap } from './Minimap';
import { ESP8266Component, LEDComponent, ResistorComponent, PotentiometerComponent } from '../types';
import { Button } from './ui/button';

export function CanvasArea() {
  const { 
    components, 
    connections, 
    canvasZoom, 
    canvasOffset, 
    setZoom, 
    setCanvasOffset,
    selectComponent,
    isDarkMode
  } = useApp();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Drop zone for dragging components
  const [, dropRef] = useDrop(() => ({
    accept: 'component',
    drop: () => ({}),
  }));

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(canvasZoom + delta);
    }
  };

  // Pan with middle mouse button or space + drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    } else if (e.button === 0 && e.target === canvasRef.current) {
      // Clicked on canvas background, deselect
      selectComponent(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#2A2A2A] relative overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-[#1F2937] rounded-lg p-2 shadow-2xl border border-gray-700">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setZoom(canvasZoom + 0.1)}
          className="text-white hover:bg-gray-700"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="text-xs text-center text-white font-mono px-2">
          {Math.round(canvasZoom * 100)}%
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setZoom(canvasZoom - 0.1)}
          className="text-white hover:bg-gray-700"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="h-px bg-gray-700 my-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={resetView}
          className="text-white hover:bg-gray-700"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          dropRef(node);
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
        style={{
          backgroundImage: isDarkMode 
            ? `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: `${20 * canvasZoom}px ${20 * canvasZoom}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
        }}
      >
        {/* Animated grid effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 0%, ${isDarkMode ? '#111827' : '#e5e7eb'} 100%)`,
          }}
        />

        {/* Transform wrapper for zoom and pan */}
        <div
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
            transformOrigin: '0 0',
          }}
          className="relative w-[3000px] h-[3000px]"
        >
          {/* Render connections (wires) */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {connections.map((conn) => (
              <line
                key={conn.id}
                x1={conn.from.point.x}
                y1={conn.from.point.y}
                x2={conn.to.point.x}
                y2={conn.to.point.y}
                stroke={conn.color}
                strokeWidth="3"
                opacity="0.8"
                className="drop-shadow-lg"
              />
            ))}
          </svg>

          {/* Render components */}
          {components.map((component) => {
            switch (component.type) {
              case 'esp8266':
                return <ESP8266Board key={component.id} component={component as ESP8266Component} />;
              case 'led':
                return <LED key={component.id} component={component as LEDComponent} />;
              case 'resistor':
                return <Resistor key={component.id} component={component as ResistorComponent} />;
              case 'potentiometer':
                return <Potentiometer key={component.id} component={component as PotentiometerComponent} />;
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Canvas Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-[#1F2937]/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400 font-mono border border-gray-700 shadow-xl">
        <div>Pan: Shift + Drag or Middle Mouse</div>
        <div>Zoom: Ctrl + Scroll</div>
      </div>

      {/* Minimap */}
      <Minimap />
    </div>
  );
}