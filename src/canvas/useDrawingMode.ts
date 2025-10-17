import { useState, useEffect } from 'react';
import type { Mode } from '../mode/Mode';
import { PersistentElements } from '../PersistentElement';
import { SelectMoveMode } from '../mode/SelectMoveMode';
import { RectangleMode } from '../mode/RectangleMode';
import { PencilMode } from '../mode/PencilMode';
import { LineMode } from '../mode/LineMode';
import { EllipseMode } from '../mode/EllipseMode';

export type DrawingModeName = 'selectMove' | 'pencil' | 'line' | 'rectangle' | 'ellipse';

interface UseDrawingModeResult {
    currentMode: Mode | null;
    setMode: (modeName: DrawingModeName) => void;
    modeName: DrawingModeName;
}

export function useDrawingMode(persistentElements: PersistentElements | null): UseDrawingModeResult {
    const [modeName, setModeName] = useState<DrawingModeName>('selectMove');
    const [currentMode, setCurrentMode] = useState<Mode | null>(null);

    useEffect(() => {
        if (!persistentElements) {
            setCurrentMode(null);
            return;
        }

        let newMode: Mode;
        switch (modeName) {
            case 'selectMove': newMode = new SelectMoveMode(persistentElements); break;
            case 'rectangle': newMode = new RectangleMode(persistentElements); break;
            case 'pencil': newMode = new PencilMode(persistentElements); break;
            case 'line': newMode = new LineMode(persistentElements); break;
            case 'ellipse': newMode = new EllipseMode(persistentElements); break;
            default: newMode = new SelectMoveMode(persistentElements); break; // Fallback
        }
        setCurrentMode(newMode);
        console.log(`Current mode set to: ${modeName}`);
    }, [modeName, persistentElements]);

    return { currentMode, setMode: setModeName, modeName };
}