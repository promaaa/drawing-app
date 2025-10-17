import type { Mode } from './Mode';
import { PersistentElements } from '../PersistentElement';
import { LineItem } from '../canvas/LineItem';

/**
 * Represents the "Line" drawing mode.
 * This mode allows users to draw new line items on the canvas.
 */
export class LineMode implements Mode {
    private persistentElements: PersistentElements;
    private isDrawing: boolean = false;

    constructor(persistentElements: PersistentElements) {
        this.persistentElements = persistentElements;
    }

    onMouseDown(event: React.MouseEvent): void {
        if (!this.persistentElements || !this.persistentElements.canvas) return;

        const mousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);

        const newLine = new LineItem(
            this.persistentElements.ctx,
            mousePos,
            this.persistentElements.foregroundColor,
            this.persistentElements.linewidth
        );

        this.persistentElements.addItem(newLine);
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
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.persistentElements.redraw(); // Ensure final state is drawn
    }

    onWheel(_event: React.WheelEvent): void {
        // No action for line mode on wheel event
    }
}