import type { Mode } from './Mode';
import { PersistentElements } from '../PersistentElement';

/**
 * Represents the "Select & Move" mode for interacting with canvas items.
 * This mode allows users to select existing items and move them around.
 */
export class SelectMoveMode implements Mode {
    private persistentElements: PersistentElements;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private lastMousePos: { x: number; y: number } | null = null;
    private activeHandle: { name: string; cursor: string } | null = null;
    private initialBBox: { x: number; y: number; width: number; height: number } | null = null;

    constructor(persistentElements: PersistentElements) {
        this.persistentElements = persistentElements;
    }

    onMouseDown(event: React.MouseEvent): void {
        const mousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);

        // Check if clicking on a handle of the selected item
        if (this.persistentElements.selectedItem) {
            const handle = this.persistentElements.getHandleAt(
                mousePos.x,
                mousePos.y,
                this.persistentElements.selectedItem
            );

            if (handle) {
                this.isResizing = true;
                this.activeHandle = handle;
                this.lastMousePos = mousePos;
                this.initialBBox = this.persistentElements.selectedItem.getBoundingBox();
                return;
            }
        }

        // Otherwise, check if clicking on an item
        const item = this.persistentElements.getItemAt(mousePos.x, mousePos.y);

        this.persistentElements.selectedItem = item;

        if (item) {
            this.isDragging = true;
            this.lastMousePos = mousePos;
        }

        this.persistentElements.redraw(); // Redraw to show selection (if any visual feedback is added)
    }

    onMouseMove(event: React.MouseEvent): void {
        const mousePos = this.persistentElements.getMousePos(event.clientX, event.clientY);

        // Handle resizing
        if (this.isResizing && this.persistentElements.selectedItem && this.lastMousePos && this.activeHandle && this.initialBBox) {
            const dx = mousePos.x - this.lastMousePos.x;
            const dy = mousePos.y - this.lastMousePos.y;

            this.resizeItem(this.activeHandle.name, dx, dy);
            this.lastMousePos = mousePos;
            this.persistentElements.redraw();
            return;
        }

        // Handle moving
        if (!this.isDragging || !this.persistentElements.selectedItem || !this.lastMousePos) return;

        const dx = mousePos.x - this.lastMousePos.x;
        const dy = mousePos.y - this.lastMousePos.y;

        this.persistentElements.selectedItem.move(dx, dy);
        this.lastMousePos = mousePos;

        this.persistentElements.redraw();
    }

    onMouseUp(_event: React.MouseEvent): void {
        this.isDragging = false;
        this.isResizing = false;
        this.lastMousePos = null;
        this.activeHandle = null;
        this.initialBBox = null;
    }

    onWheel(event: React.WheelEvent): void {
        if (!this.persistentElements.selectedItem) return;

        // Prevent page scrolling
        event.preventDefault(); 

        if (event.deltaY < 0) {
            // Scroll up: bring item forward
            this.persistentElements.bringForward(this.persistentElements.selectedItem);
        } else {
            // Scroll down: send item backward
            this.persistentElements.sendBackward(this.persistentElements.selectedItem);
        }
    }

    private resizeItem(handleName: string, dx: number, dy: number): void {
        if (!this.persistentElements.selectedItem || !this.initialBBox) return;

        const bbox = this.persistentElements.selectedItem.getBoundingBox();
        let newWidth = bbox.width;
        let newHeight = bbox.height;

        // Adjust based on which handle is being dragged
        switch (handleName) {
            case 'nw': // Top-left
                newWidth = bbox.width - dx;
                newHeight = bbox.height - dy;
                break;
            case 'n': // Top-center
                newHeight = bbox.height - dy;
                break;
            case 'ne': // Top-right
                newWidth = bbox.width + dx;
                newHeight = bbox.height - dy;
                break;
            case 'e': // Middle-right
                newWidth = bbox.width + dx;
                break;
            case 'se': // Bottom-right
                newWidth = bbox.width + dx;
                newHeight = bbox.height + dy;
                break;
            case 's': // Bottom-center
                newHeight = bbox.height + dy;
                break;
            case 'sw': // Bottom-left
                newWidth = bbox.width - dx;
                newHeight = bbox.height + dy;
                break;
            case 'w': // Middle-left
                newWidth = bbox.width - dx;
                break;
        }

        // Calculate scale factors (handle reversal with negative scales)
        const scaleX = newWidth / this.initialBBox.width;
        const scaleY = newHeight / this.initialBBox.height;

        // Determine anchor point (opposite corner/edge from the handle being dragged)
        let anchorX: number;
        let anchorY: number;

        switch (handleName) {
            case 'nw':
                anchorX = this.initialBBox.x + this.initialBBox.width;
                anchorY = this.initialBBox.y + this.initialBBox.height;
                break;
            case 'n':
                anchorX = this.initialBBox.x + this.initialBBox.width / 2;
                anchorY = this.initialBBox.y + this.initialBBox.height;
                break;
            case 'ne':
                anchorX = this.initialBBox.x;
                anchorY = this.initialBBox.y + this.initialBBox.height;
                break;
            case 'e':
                anchorX = this.initialBBox.x;
                anchorY = this.initialBBox.y + this.initialBBox.height / 2;
                break;
            case 'se':
                anchorX = this.initialBBox.x;
                anchorY = this.initialBBox.y;
                break;
            case 's':
                anchorX = this.initialBBox.x + this.initialBBox.width / 2;
                anchorY = this.initialBBox.y;
                break;
            case 'sw':
                anchorX = this.initialBBox.x + this.initialBBox.width;
                anchorY = this.initialBBox.y;
                break;
            case 'w':
                anchorX = this.initialBBox.x + this.initialBBox.width;
                anchorY = this.initialBBox.y + this.initialBBox.height / 2;
                break;
            default:
                anchorX = this.initialBBox.x;
                anchorY = this.initialBBox.y;
        }

        // Apply the scale transformation
        this.persistentElements.selectedItem.scale(scaleX, scaleY, anchorX, anchorY);
    }
}