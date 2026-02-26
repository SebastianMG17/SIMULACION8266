import { useApp } from '../store';

export function Minimap() {
  const { components, canvasZoom } = useApp();

  return (
    <div className="absolute bottom-4 right-4 w-48 h-32 bg-[#1F2937]/90 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
      <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-400 font-semibold">
        Minimap
      </div>
      
      <div className="w-full h-full p-2 pt-6 relative">
        {/* Background grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        />
        
        {/* Components as dots */}
        {components.map((component) => {
          const x = (component.position.x / 3000) * 100;
          const y = (component.position.y / 3000) * 100;
          
          const colors = {
            esp8266: '#3B82F6',
            led: '#EF4444',
            resistor: '#F59E0B',
            potentiometer: '#8B5CF6',
          };
          
          return (
            <div
              key={component.id}
              className="absolute w-2 h-2 rounded-full shadow-lg"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: colors[component.type],
              }}
            />
          );
        })}
        
        {/* Viewport indicator */}
        <div 
          className="absolute border-2 border-white/50 rounded pointer-events-none"
          style={{
            width: `${Math.min(100, (100 / canvasZoom))}%`,
            height: `${Math.min(100, (100 / canvasZoom))}%`,
            left: '0%',
            top: '0%',
          }}
        />
      </div>
    </div>
  );
}
