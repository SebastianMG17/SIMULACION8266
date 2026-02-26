import { useEffect, useRef } from 'react';
import { Terminal, X, Trash2 } from 'lucide-react';
import { useApp } from '../store';
import { Button } from './ui/button';

interface SerialMonitorProps {
  isRunning: boolean;
  onClose?: () => void;
}

export function SerialMonitor({ isRunning, onClose }: SerialMonitorProps) {
  const { serialOutput, clearSerialOutput } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [serialOutput]);

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#3E3E3E]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Serial Monitor</span>
          <span className="text-xs text-gray-400 font-mono">115200 baud</span>
          {isRunning && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSerialOutput}
            className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 px-4 py-3 overflow-y-auto font-mono text-xs text-green-400 bg-[#0D1117]"
      >
        {serialOutput.length === 0 ? (
          <div className="text-gray-500">Waiting for data...</div>
        ) : (
          serialOutput.map((log, i) => (
            <div key={i} className="leading-relaxed">
              <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}