import React from 'react';
import './Canvas.css'
import type { PersistentElements } from '../PersistentElement';
import type { Mode } from '../mode/Mode';

interface CanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    persistentElements: PersistentElements | null;
    currentMode: Mode | null;
}

function Canvas({canvasRef, currentMode}: CanvasProps) {

    const handleMouseDown = (event: React.MouseEvent) => {
        if (currentMode) {
            currentMode.onMouseDown(event);
        }
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (currentMode) {
            currentMode.onMouseMove(event);
        }
    };

    const handleMouseUp = (event: React.MouseEvent) => {
        if (currentMode) {
            currentMode.onMouseUp(event);
        }
    };

    const handleMouseWheel = (event: React.WheelEvent) => {
        if (currentMode) {
            currentMode.onWheel(event);
        }
    };

    return (
        <div id="div-canvas">
            <canvas 
                id="canvas" 
                ref={canvasRef} 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleMouseWheel}
            />
        </div>
    )
}

export default Canvas;