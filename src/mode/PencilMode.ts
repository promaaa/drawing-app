import type { Mode } from './Mode';
import { PersistentElements } from '../PersistentElement';
import { PathItem } from '../canvas/PathItem';

/**
 * Represents the "Pencil" drawing mode.
 * This mode allows users to draw free-form paths on the canvas.
 */
export class PencilMode implements Mode {
    private persistentElements: PersistentElements;
    private isDrawing: boolean = false;

    constructor(persistentElements: PersistentElements) {
        this.persistentElements = persistentElements;
    }

    onMouseDown(event: React.MouseEvent): void {
        if (!this.persistentElements || !this.persistentElements.canvas) return;

        const mousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);

        const newPath = new PathItem(
            this.persistentElements.ctx,
            mousePos,
            this.persistentElements.foregroundColor,
            this.persistentElements.linewidth
        );

        this.persistentElements.addItem(newPath);
        this.isDrawing = true;
        this.persistentElements.redraw();
    }

    onMouseMove(event: React.MouseEvent): void {
        if (!this.isDrawing || !this.persistentElements || !this.persistentElements.selectedItem) return;
        const mousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);
        this.persistentElements.selectedItem.update(mousePos.x, mousePos.y);
        this.persistentElements.redraw();
    }

    onMouseUp(_event: React.MouseEvent): void {
        this.isDrawing = false;
    }

    onWheel(_event: React.WheelEvent): void {
        // No action for pencil mode on wheel event
    }
}