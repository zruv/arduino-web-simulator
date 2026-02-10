import React, { useMemo } from 'react';
import type { CanvasComponent } from '../types';

interface CodeViewProps {
  canvasComponents: CanvasComponent[];
}

export const CodeView: React.FC<CodeViewProps> = ({ canvasComponents }) => {
  const generateArduinoCode = useMemo(() => {
    let setupCode = '';
    let loopCode = '';
    const definitions: string[] = [];

    const leds = canvasComponents.filter(comp => comp.type === 'led' && comp.pin !== undefined);
    const buttons = canvasComponents.filter(comp => comp.type === 'button' && comp.pin !== undefined);

    if (leds.length > 0 || buttons.length > 0) {
      setupCode += '  Serial.begin(9600);\n';
    }

    leds.forEach((led, index) => {
      definitions.push(`const int ledPin${index + 1} = ${led.pin};`);
      setupCode += `  pinMode(ledPin${index + 1}, OUTPUT);\n`;
    });

    buttons.forEach((button, index) => {
      definitions.push(`const int buttonPin${index + 1} = ${button.pin};`);
      setupCode += `  pinMode(buttonPin${index + 1}, INPUT_PULLUP);\n`;
      loopCode += `  int buttonState${index + 1} = digitalRead(buttonPin${index + 1});\n`;
      loopCode += `  if (buttonState${index + 1} == LOW) {\n`;
      if (leds[index]) { 
        loopCode += `    digitalWrite(ledPin${index + 1}, HIGH);\n`;
      }
      loopCode += `  } else {\n`;
      if (leds[index]) {
        loopCode += `    digitalWrite(ledPin${index + 1}, LOW);\n`;
      }
      loopCode += `  }\n`;
    });

    const fullCode = `
${definitions.join('\n')}

void setup() {
${setupCode}
}

void loop() {
${loopCode}
}`;
    return fullCode;
  }, [canvasComponents]);

  const codeLines = generateArduinoCode.split('\n');

  return (
    <div className="w-1/3 glass-panel flex flex-col shadow-2xl z-20 animate-fade-in border-l border-slate-800">
      <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
           <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
           <h2 className="text-xs font-bold text-slate-300">main.cpp</h2>
        </div>
        <div className="flex gap-1.5">
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-[#0d1117] custom-scrollbar relative">
         <div className="flex min-h-full">
            <div className="flex flex-col items-end px-3 py-4 text-right bg-slate-900/50 border-r border-slate-800 select-none">
                {codeLines.map((_, i) => (
                    <div key={i} className="text-xs font-mono text-slate-600 leading-6 h-6 w-6">
                        {i + 1}
                    </div>
                ))}
            </div>

            <div className="flex-1 py-4 px-4 overflow-x-auto">
                {codeLines.map((line, i) => (
                    <div key={i} className="text-xs font-mono leading-6 h-6 whitespace-pre">
                        {line.split(' ').map((word, j) => {
                            if (['void', 'int', 'const', 'if', 'else', 'for', 'while'].includes(word)) return <span key={j} className="text-purple-400">{word} </span>;
                            if (['setup', 'loop', 'pinMode', 'digitalWrite', 'digitalRead', 'Serial', 'begin'].includes(word.replace(/\(.*\)/, ''))) return <span key={j} className="text-blue-400">{word} </span>;
                            if (['HIGH', 'LOW', 'OUTPUT', 'INPUT', 'INPUT_PULLUP'].includes(word.replace(/;|,/, ''))) return <span key={j} className="text-orange-400">{word} </span>;
                            if (word.startsWith('//') || word.startsWith('/*') || word.startsWith('*')) return <span key={j} className="text-slate-500">{word} </span>;
                            if (line.trim().startsWith('//')) return <span key={j} className="text-slate-500">{word} </span>;

                            return <span key={j} className="text-slate-300">{word} </span>;
                        })}
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};
