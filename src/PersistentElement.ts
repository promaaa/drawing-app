import type { CanvasItem } from "./canvas/CanvasItem";


export class PersistentElements {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public items: CanvasItem[];

    public selectedItem: CanvasItem | null = null;
    public foregroundColor: string;
    public backgroundColor: string;
    public linewidth: number;


    constructor(canvas:HTMLCanvasElement, 
                ctx: CanvasRenderingContext2D, 
                foregroundColor: string = "#000000",  // Valeurs par défaut dans les paramètres
                backgroundColor: string = "#0d00ff", 
                linewidth: number = 2) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.items = [];
        this.foregroundColor = foregroundColor;
        this.backgroundColor = backgroundColor;
        this.linewidth = linewidth;
        // Supprimer les lignes qui écrasent les paramètres
    }

    // Setters pour modifier depuis des composants externes
    setForegroundColor(color: string) {
        this.foregroundColor = color;
    }

    setBackgroundColor(color: string) {
        this.backgroundColor = color;
    }

    setLineWidth(width: number) {
        this.linewidth = width;
    }

    // add item to the canvas
    addItem(item: CanvasItem) {
        this.items.push(item);
        this.selectedItem = item; // Automatically select the newly added item
    }

    // remove selected item from the canvas
    removeSelectedItem() {
        if (!this.selectedItem) return;
        const index = this.items.indexOf(this.selectedItem);
        if (index > -1) {
            this.items.splice(index, 1);
            this.selectedItem = null;
            this.redraw();
        }
    }

    // duplicate selected item
    duplicateSelectedItem() {
        if (!this.selectedItem) return;
        const newItem = this.selectedItem.duplicate();
        this.addItem(newItem); // addItem also selects the new item
        this.redraw();
    }

    // Bring selected item one step forward in the rendering order
    bringForward(item: CanvasItem) {
        const index = this.items.indexOf(item);
        if (index > -1 && index < this.items.length - 1) {
            const [removed] = this.items.splice(index, 1);
            this.items.splice(index + 1, 0, removed);
            this.redraw();
        }
    }

    // Send selected item one step backward in the rendering order
    sendBackward(item: CanvasItem) {
        const index = this.items.indexOf(item);
        if (index > 0) {
            const [removed] = this.items.splice(index, 1);
            this.items.splice(index - 1, 0, removed);
            this.redraw();
        }
    }

    // Move item to the very end of the array (top of the z-index)
    bringToFront(item: CanvasItem) {
        const index = this.items.indexOf(item);
        if (index > -1 && index < this.items.length - 1) {
            const [removed] = this.items.splice(index, 1);
            this.items.push(removed);
            this.redraw();
        }
    }

    // Move item to the very beginning of the array (bottom of the z-index)
    sendToBack(item: CanvasItem) {
        const index = this.items.indexOf(item);
        if (index > 0) {
            const [removed] = this.items.splice(index, 1);
            this.items.unshift(removed);
            this.redraw();
        }
    }

    // get items under the given coordinates
    getItemAt(x: number, y: number): CanvasItem | null {
        // Iterate backwards to find the topmost item
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (item.contains(x, y)) {
                return item;
            }
        }
        return null;
    }

    // get mouse position relative to the canvas
    getMousePos(x: number, y: number) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }

    // redraw all items
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.items.forEach(item => item.draw());
        
        // Draw bounding box and handles for selected item
        if (this.selectedItem) {
            this.drawBoundingBox(this.selectedItem);
            this.drawHandles(this.selectedItem);
        }
    }

    // Draw dashed bounding box around selected item
    private drawBoundingBox(item: CanvasItem) {
        const bbox = item.getBoundingBox();
        
        this.ctx.save();
        this.ctx.strokeStyle = '#0066ff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
        this.ctx.restore();
    }

    // Draw eight handles around the bounding box
    private drawHandles(item: CanvasItem) {
        const bbox = item.getBoundingBox();
        const handleSize = 8;
        
        // Calculate handle positions
        const handles = this.getHandlePositions(bbox);
        
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#0066ff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        // Draw each handle
        handles.forEach(handle => {
            this.ctx.fillRect(
                handle.x - handleSize / 2,
                handle.y - handleSize / 2,
                handleSize,
                handleSize
            );
            this.ctx.strokeRect(
                handle.x - handleSize / 2,
                handle.y - handleSize / 2,
                handleSize,
                handleSize
            );
        });
        
        this.ctx.restore();
    }

    // Get positions of all eight handles
    getHandlePositions(bbox: { x: number; y: number; width: number; height: number }) {
        return [
            { x: bbox.x, y: bbox.y, cursor: 'nw-resize', name: 'nw' }, // Top-left
            { x: bbox.x + bbox.width / 2, y: bbox.y, cursor: 'n-resize', name: 'n' }, // Top-center
            { x: bbox.x + bbox.width, y: bbox.y, cursor: 'ne-resize', name: 'ne' }, // Top-right
            { x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2, cursor: 'e-resize', name: 'e' }, // Middle-right
            { x: bbox.x + bbox.width, y: bbox.y + bbox.height, cursor: 'se-resize', name: 'se' }, // Bottom-right
            { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height, cursor: 's-resize', name: 's' }, // Bottom-center
            { x: bbox.x, y: bbox.y + bbox.height, cursor: 'sw-resize', name: 'sw' }, // Bottom-left
            { x: bbox.x, y: bbox.y + bbox.height / 2, cursor: 'w-resize', name: 'w' } // Middle-left
        ];
    }

    // Check if a point is on a handle
    getHandleAt(x: number, y: number, item: CanvasItem): { name: string; cursor: string } | null {
        const bbox = item.getBoundingBox();
        const handles = this.getHandlePositions(bbox);
        const handleSize = 8;
        
        for (const handle of handles) {
            const dx = x - handle.x;
            const dy = y - handle.y;
            if (Math.abs(dx) <= handleSize / 2 && Math.abs(dy) <= handleSize / 2) {
                return { name: handle.name, cursor: handle.cursor };
            }
        }
        
        return null;
    }
}