import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';
import { Play, Square, Moon, Sun, Cpu, PanelLeftClose, PanelLeft, Terminal } from 'lucide-react';
import { AppProvider, useApp } from './store';
import { CodeEditorImproved } from './components/CodeEditorImproved';
import { CanvasArea } from './components/CanvasArea';
import { ComponentPalette } from './components/ComponentPalette';
import { PropertiesPanel } from './components/PropertiesPanel';
import { SerialMonitor } from './components/SerialMonitor';
import { WelcomeTooltip } from './components/WelcomeTooltip';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';

function AppContent() {
  const { 
    isRunning, 
    setRunning, 
    isDarkMode, 
    toggleTheme,
    addSerialOutput,
    clearSerialOutput 
  } = useApp();
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [serialOpen, setSerialOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 - Run/Stop
      if (e.key === 'F5') {
        e.preventDefault();
        setRunning(!isRunning);
      }
      // Ctrl+S - Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        console.log('Código guardado');
      }
      // Ctrl+B - Toggle sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setLeftSidebarOpen(!leftSidebarOpen);
      }
      // Ctrl+` - Toggle terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setSerialOpen(!serialOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, setRunning, leftSidebarOpen, serialOpen]);

  // Simulate serial output when running
  useEffect(() => {
    if (isRunning) {
      clearSerialOutput();
      addSerialOutput('ESP8266 Initialized');
      addSerialOutput('LED Pin: D2 (GPIO4)');
      addSerialOutput('Potentiometer: A0');
      addSerialOutput('Ready!');
      
      const interval = setInterval(() => {
        const potValue = Math.floor(Math.random() * 1024);
        const brightness = Math.floor((potValue / 1023) * 255);
        addSerialOutput(`Pot: ${potValue} | Brightness: ${brightness}`);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRunning, addSerialOutput, clearSerialOutput]);

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-6 py-3 ${isDarkMode ? 'bg-[#2D2D2D] border-b border-[#3E3E3E]' : 'bg-white border-b border-gray-300'} shadow-lg transition-colors z-10`}>
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ESP8266 Simulator Pro
              </h1>
              <p className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                NodeMCU Development Platform
              </p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-2 ${
              isRunning 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run</span>
              </>
            )}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSerialOpen(!serialOpen)}
            className={`flex items-center gap-2 ${
              serialOpen 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="text-xs">Serial</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Code Editor */}
        {leftSidebarOpen && (
          <div className="w-[600px] border-r border-gray-700 flex flex-col">
            <CodeEditorImproved />
          </div>
        )}

        {/* Center - Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ComponentPalette />
          <CanvasArea />
        </div>

        {/* Right Sidebar - Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Serial Monitor Overlay */}
      {serialOpen && (
        <div className="absolute bottom-0 left-0 right-80 h-64 bg-[#1E1E1E] border-t border-gray-700 shadow-2xl z-20">
          <SerialMonitor isRunning={isRunning} onClose={() => setSerialOpen(false)} />
        </div>
      )}

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-6 py-2 text-white text-xs ${
        isRunning ? 'bg-green-600' : 'bg-[#007ACC]'
      } transition-colors`}>
        <div className="flex items-center gap-4">
          <span className="font-mono flex items-center gap-2">
            {isRunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Running
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-white/60"></span>
                Stopped
              </>
            )}
          </span>
          <span className="opacity-60">|</span>
          <span className="font-mono">NodeMCU ESP8266</span>
          <span className="opacity-60">|</span>
          <span className="font-mono">Ready</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span>F5: Run/Stop</span>
          <span className="opacity-60">|</span>
          <span>Ctrl+B: Toggle Sidebar</span>
          <span className="opacity-60">|</span>
          <span>Ctrl+`: Terminal</span>
        </div>
      </div>

      {/* Welcome Tooltip */}
      <WelcomeTooltip />
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </DndProvider>
  );
}