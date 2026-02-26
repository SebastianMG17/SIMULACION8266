import { X, Lightbulb, Keyboard, MousePointer2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function WelcomeTooltip() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[600px] bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white animate-in fade-in slide-in-from-top-4 duration-500">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold">Welcome to ESP8266 Simulator Pro! 🚀</h3>
          <p className="text-sm text-white/90">
            A professional microcontroller simulator with full drag & drop support, real-time serial monitoring, and beautiful animations.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Mouse Controls</span>
              </div>
              <ul className="text-xs space-y-1 text-white/80">
                <li>• Drag components to move</li>
                <li>• Shift + Drag to pan canvas</li>
                <li>• Ctrl + Scroll to zoom</li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-4 h-4" />
                <span className="text-xs font-semibold">Keyboard Shortcuts</span>
              </div>
              <ul className="text-xs space-y-1 text-white/80">
                <li>• <kbd className="bg-white/20 px-1 rounded">F5</kbd> Run/Stop</li>
                <li>• <kbd className="bg-white/20 px-1 rounded">Ctrl+B</kbd> Toggle Sidebar</li>
                <li>• <kbd className="bg-white/20 px-1 rounded">Ctrl+`</kbd> Serial Monitor</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => setIsVisible(false)}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold"
              size="sm"
            >
              Got it, let's start!
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
