import { useState, useRef } from 'react';
import { Save, FileJson, FileCode, Download, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

const defaultArduinoCode = `// ESP8266 NodeMCU - Main Sketch
// Author: ESP8266 Simulator
// Date: ${new Date().toLocaleDateString()}

#define LED_PIN D2
#define POT_PIN A0

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  delay(100);
  
  // Configure pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(POT_PIN, INPUT);
  
  Serial.println("\\nESP8266 Initialized");
  Serial.println("LED Pin: D2 (GPIO4)");
  Serial.println("Potentiometer: A0");
  Serial.println("Ready!");
}

void loop() {
  // Read potentiometer value (0-1023)
  int potValue = analogRead(POT_PIN);
  
  // Control LED brightness with PWM
  int brightness = map(potValue, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
  
  // Print values to serial monitor
  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" | Brightness: ");
  Serial.println(brightness);
  
  delay(100);
}`;

const defaultDiagramJson = `{
  "version": "1.0",
  "simulator": "ESP8266 Simulator",
  "components": [
    {
      "type": "esp8266",
      "id": "esp8266-1",
      "position": { "x": 100, "y": 100 }
    },
    {
      "type": "led",
      "id": "led-1",
      "position": { "x": 400, "y": 150 },
      "color": "#EF4444"
    },
    {
      "type": "resistor",
      "id": "resistor-1",
      "position": { "x": 450, "y": 250 },
      "value": 220
    },
    {
      "type": "potentiometer",
      "id": "pot-1",
      "position": { "x": 600, "y": 150 },
      "maxValue": 10000
    }
  ],
  "connections": [
    {
      "from": { "component": "esp8266-1", "pin": "D2" },
      "to": { "component": "led-1", "pin": "anode" },
      "type": "data"
    },
    {
      "from": { "component": "led-1", "pin": "cathode" },
      "to": { "component": "resistor-1", "pin": "1" },
      "type": "data"
    },
    {
      "from": { "component": "resistor-1", "pin": "2" },
      "to": { "component": "esp8266-1", "pin": "GND" },
      "type": "gnd"
    }
  ]
}`;

// Simple syntax highlighter
function highlightArduinoCode(code: string): JSX.Element[] {
  const lines = code.split('\n');
  
  return lines.map((line, i) => {
    let highlighted = line
      // Keywords
      .replace(/\b(void|int|float|char|const|return|if|else|for|while|do|break|continue|switch|case|default|true|false|#define|#include)\b/g, 
        '<span class="text-[#569CD6]">$1</span>')
      // Functions
      .replace(/\b(setup|loop|pinMode|digitalWrite|digitalRead|analogWrite|analogRead|delay|Serial\.begin|Serial\.print|Serial\.println|map)\b/g, 
        '<span class="text-[#DCDCAA]">$1</span>')
      // Strings
      .replace(/"([^"]*)"/g, '<span class="text-[#CE9178]">"$1"</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
      // Comments
      .replace(/(\/\/.*$)/g, '<span class="text-[#6A9955]">$1</span>');

    return (
      <div key={i} className="min-h-[24px]" dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
    );
  });
}

function highlightJSON(code: string): JSX.Element[] {
  const lines = code.split('\n');
  
  return lines.map((line, i) => {
    let highlighted = line
      // Keys
      .replace(/"([^"]+)":/g, '<span class="text-[#9CDCFE]">"$1"</span>:')
      // String values
      .replace(/: "([^"]*)"/g, ': <span class="text-[#CE9178]">"$1"</span>')
      // Numbers
      .replace(/: (\d+\.?\d*)/g, ': <span class="text-[#B5CEA8]">$1</span>')
      // Booleans
      .replace(/: (true|false|null)/g, ': <span class="text-[#569CD6]">$1</span>');

    return (
      <div key={i} className="min-h-[24px]" dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
    );
  });
}

export function CodeEditorImproved() {
  const [arduinoCode, setArduinoCode] = useState(defaultArduinoCode);
  const [diagramCode, setDiagramCode] = useState(defaultDiagramJson);
  const [activeTab, setActiveTab] = useState<'arduino' | 'diagram'>('arduino');
  const [scrollTop, setScrollTop] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentCode = activeTab === 'arduino' ? arduinoCode : diagramCode;
  const setCurrentCode = activeTab === 'arduino' ? setArduinoCode : setDiagramCode;
  const lines = currentCode.split('\n');
  const lineNumbers = lines.map((_, i) => i + 1);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleSave = () => {
    console.log('Code saved');
    // Add save logic here
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'arduino' ? 'sketch.ino' : 'diagram.json';
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      {/* Header with Tabs */}
      <div className="bg-[#2D2D2D] border-b border-[#3E3E3E] px-4 py-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'arduino' | 'diagram')} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[#1E1E1E] border border-[#3E3E3E]">
              <TabsTrigger 
                value="arduino" 
                className="data-[state=active]:bg-[#007ACC] data-[state=active]:text-white text-gray-400 gap-2"
              >
                <FileCode className="w-3 h-3" />
                <span className="text-xs">main.ino</span>
              </TabsTrigger>
              <TabsTrigger 
                value="diagram" 
                className="data-[state=active]:bg-[#007ACC] data-[state=active]:text-white text-gray-400 gap-2"
              >
                <FileJson className="w-3 h-3" />
                <span className="text-xs">diagram.json</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleDownload}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleSave}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              >
                <Save className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div 
          className="bg-[#1E1E1E] text-[#858585] text-right py-4 pr-3 pl-4 select-none font-mono text-sm leading-6 overflow-hidden"
          style={{ transform: `translateY(-${scrollTop}px)` }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="min-h-[24px]">{num}</div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Overlay */}
          <div 
            className="absolute inset-0 px-4 py-4 font-mono text-sm leading-6 pointer-events-none overflow-hidden"
            style={{ transform: `translateY(-${scrollTop}px)` }}
          >
            {activeTab === 'arduino' ? highlightArduinoCode(currentCode) : highlightJSON(currentCode)}
          </div>

          {/* Invisible Textarea for Input */}
          <textarea
            ref={textareaRef}
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            onScroll={handleScroll}
            className="w-full h-full px-4 py-4 bg-transparent text-transparent caret-white font-mono text-sm leading-6 resize-none focus:outline-none relative z-10"
            style={{ tabSize: 2 }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
