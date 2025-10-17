import { useEffect, useRef, useState } from 'react';
import { PersistentElements } from './PersistentElement.ts';
import Canvas from './canvas/Canvas.tsx';
import Toolbar from './Toolbar.tsx';
import { useDrawingMode } from './canvas/useDrawingMode';
import './App.css';


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [persistentElements, setPersistentElements] = useState<PersistentElements | null>(null);
  const { currentMode, setMode } = useDrawingMode(persistentElements);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("2D context not available");
        return;
      }

      /* TODO initialize persistent components */
      const tempPersistentElements = new PersistentElements(canvas, ctx, "#000000", "#0d00ff", 2);
      setPersistentElements(tempPersistentElements);

      resizeCanvas(canvas);
      window.addEventListener('resize', () => {
        resizeCanvas(canvas);
        tempPersistentElements.redraw();
      });
    } else {
      console.error("Canvas not found");
    }
  }, []);

  // Resize the canvas to fill its parent element
  function resizeCanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  return (
    <>
      <div id="main-div">
        <Toolbar persistentElements={persistentElements} setMode={setMode} />
        <Canvas canvasRef={canvasRef} persistentElements={persistentElements} currentMode={currentMode} />
      </div>
    </>
  )
}

export default App
