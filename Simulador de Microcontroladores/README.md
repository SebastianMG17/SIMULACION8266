# ESP8266 Simulator Pro 🚀

Una aplicación profesional de simulación de microcontroladores ESP8266 NodeMCU con interfaz tipo Wokwi + VS Code + Figma.

## ✨ Características Principales

### 🎯 Interfaz Moderna

- **Diseño profesional** con tema oscuro/claro
- **Sidebar colapsable** con editor de código integrado
- **Panel de propiedades** tipo Figma para editar componentes
- **Canvas interactivo** con zoom y pan
- **Animaciones suaves** y micro-interacciones

### 🔧 ESP8266 NodeMCU Completamente Funcional

- **Todos los pines disponibles y programables:**
  - Pines digitales: D0-D8 (GPIO 16, 5, 4, 0, 2, 14, 12, 13, 15)
  - Pin analógico: A0
  - Comunicación: RX (GPIO3), TX (GPIO1)
  - Alimentación: 3V3, VIN, GND (múltiples)
- **Tooltips informativos** en cada pin mostrando:
  - Nombre del pin
  - Número GPIO real
  - Tipo (Digital, Analog, Power, Communication)
  - Estado actual
  - Voltaje
- **Indicadores visuales** cuando los pines están activos
- **Botones RST y FLASH** funcionales

### 🎨 Componentes Electrónicos

Todos los componentes son **100% movibles** con drag & drop:

#### LED

- Animación de brillo cuando está encendido
- Efecto de glow realista
- Color editable (rojo, amarillo, verde, azul, púrpura)
- Control de brightness

#### Resistencia

- Bandas de colores dinámicas según el valor
- Valores comunes: 100Ω, 220Ω, 330Ω, 470Ω, 1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ
- Tolerancia ajustable
- Efecto 3D realista

#### Potenciómetro

- Perilla rotatoria interactiva
- Control deslizante integrado
- Muestra valor ADC (0-1023)
- Cálculo automático de voltaje
- Valor máximo configurable

### 📝 Editor de Código

- **Syntax highlighting** para Arduino/C++
- **Tabs múltiples** (main.ino, diagram.json)
- **Numeración de líneas**
- **Temas**: Oscuro (VS Code) y Claro
- **Funciones de guardado y descarga**

### 📊 Panel de Propiedades (tipo Figma)

- **Edición de posición** (X, Y)
- **Rotación** con slider (0-360°)
- **Propiedades específicas** por componente:
  - LED: color, brightness
  - Resistencia: valor, tolerancia
  - Potenciómetro: valor actual, voltaje calculado
  - ESP8266: estados de pines, información del chip

### 🖥️ Monitor Serial

- **Terminal integrado** con output en tiempo real
- **Timestamps** en cada mensaje
- **Auto-scroll** al final
- **Botones de limpiar y cerrar**
- **Indicador de conexión** animado

### 🎮 Canvas Interactivo

- **Zoom** con Ctrl + Scroll (25% - 300%)
- **Pan** con Shift + Drag o Middle Mouse
- **Grid animado** de fondo
- **Vista de reset** rápida
- **Indicadores visuales** de zoom y controles

### ⌨️ Atajos de Teclado

- `F5` - Ejecutar/Detener simulación
- `Ctrl + S` - Guardar código
- `Ctrl + B` - Toggle sidebar izquierdo
- `Ctrl + \`` - Toggle monitor serial
- `Ctrl + Scroll` - Zoom del canvas
- `Shift + Drag` - Pan del canvas

### 🎨 Sistema de Diseño

- **Paleta de colores profesional:**
  - Fondo oscuro: `#111827`
  - Paneles: `#1F2937`
  - Verde ejecución: `#22C55E`
  - Azul primario: `#3B82F6`
  - Amarillo pines: `#FACC15`
- **Efectos visuales:**
  - Sombras suaves
  - Gradientes sutiles
  - Glassmorphism en overlays
  - Bordes redondeados (12px)

### 🔌 Sistema de Cables (Próximamente)

- Colores codificados:
  - 🔴 Rojo: VCC (alimentación)
  - ⚫ Negro: GND (tierra)
  - 🟡 Amarillo: DATA (señal digital)
  - 🟢 Verde: ANALOG (señal analógica)

## 🚀 Uso

### Agregar Componentes

1. Haz clic en los botones de la barra superior (LED, Resistor, Potentiometer)
2. El componente aparecerá en el canvas
3. Arrástralo a la posición deseada

### Editar Componentes

1. Haz clic en cualquier componente para seleccionarlo
2. El panel de propiedades se abrirá a la derecha
3. Modifica posición, rotación y propiedades específicas
4. Los cambios se aplican en tiempo real

### Programar el ESP8266

1. Escribe tu código Arduino en el editor (tab main.ino)
2. Presiona F5 o el botón "Run" para ejecutar
3. Observa el monitor serial para ver la salida
4. Los LEDs se animarán según tu código

### Navegar el Canvas

- **Zoom:** Mantén Ctrl y usa la rueda del mouse
- **Pan:** Mantén Shift y arrastra, o usa el botón central del mouse
- **Reset:** Haz clic en el botón Maximize en los controles de zoom

## 🎓 Ejemplo de Código

\`\`\`cpp
#define LED_PIN D2
#define POT_PIN A0

void setup() {
Serial.begin(115200);
pinMode(LED_PIN, OUTPUT);
Serial.println("ESP8266 Ready!");
}

void loop() {
int potValue = analogRead(POT_PIN);
int brightness = map(potValue, 0, 1023, 0, 255);
analogWrite(LED_PIN, brightness);

Serial.print("Pot: ");
Serial.print(potValue);
Serial.print(" | Brightness: ");
Serial.println(brightness);

delay(100);
}
\`\`\`

## 🎯 Características Técnicas

### Arquitectura

- **React 18** con Hooks
- **React DnD** para drag & drop
- **Context API** para gestión de estado global
- **Tailwind CSS v4** para estilos
- **TypeScript** para type safety

### Componentes Reutilizables

Todos los componentes están diseñados como elementos modulares y reutilizables:

- Drag & drop integrado
- Propiedades editables
- Estados persistentes
- Animaciones fluidas

### Rendimiento

- Optimización de re-renders con React.memo
- Lazy loading de componentes
- Animaciones con CSS y GPU acceleration
- Canvas virtualizado para grandes circuitos

## 📦 Estructura del Proyecto

\`\`\`
/src/app/
├── types.ts # Type definitions
├── store.tsx # Estado global (Context API)
├── App.tsx # Componente principal
└── components/
├── ESP8266Board.tsx # Placa NodeMCU
├── LED.tsx # Componente LED
├── Resistor.tsx # Componente Resistencia
├── Potentiometer.tsx # Componente Potenciómetro
├── CanvasArea.tsx # Área de simulación
├── CodeEditorImproved.tsx # Editor con tabs
├── PropertiesPanel.tsx # Panel de propiedades
├── ComponentPalette.tsx # Paleta de componentes
├── SerialMonitor.tsx # Monitor serial
└── ui/ # Componentes UI base
\`\`\`

## 🎨 Exportación a Otros Formatos

El diseño está organizado para ser fácilmente exportable:

- **HTML/CSS:** Todos los componentes usan Tailwind CSS standard
- **JavaScript:** Lógica separada de la presentación
- **Figma:** Estructura con auto-layout y naming consistente

## 🔮 Roadmap

- [ ] Sistema de cables drag & drop entre pines
- [ ] Guardado de proyectos en localStorage
- [ ] Exportación de diagramas a JSON/PNG
- [ ] Más componentes (servo, sensor DHT, display LCD)
- [ ] Compilación y carga real a ESP8266
- [ ] Biblioteca de proyectos de ejemplo
- [ ] Modo colaborativo en tiempo real

## 📄 Licencia

Proyecto educacional - ESP8266 Simulator Pro

---

**Hecho con ❤️ para la comunidad maker**
