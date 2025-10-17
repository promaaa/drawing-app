import type { CanvasItem } from "./CanvasItem";

export class RectangleItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    firstPoint: { x: number; y: number };
    wh: { x: number; y: number };

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number) {
        this.ctx = ctx;
        this.firstPoint = point;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.wh = { x: 0, y: 0 };
    }

    // Draw the rectangle on the canvas
    draw(): void {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.shape = new Path2D();
        this.shape.rect(this.firstPoint.x, this.firstPoint.y, this.wh.x, this.wh.y);
        this.ctx.fill(this.shape);
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        // Handle cases where width or height are negative (drawing from right to left or bottom to top)
        const startX = Math.min(this.firstPoint.x, this.firstPoint.x + this.wh.x);
        const endX = Math.max(this.firstPoint.x, this.firstPoint.x + this.wh.x);
        const startY = Math.min(this.firstPoint.y, this.firstPoint.y + this.wh.y);
        const endY = Math.max(this.firstPoint.y, this.firstPoint.y + this.wh.y);

        return x >= startX && x <= endX && y >= startY && y <= endY;
    }
    
    move(dx: number, dy: number): void {
        this.firstPoint.x += dx;
        this.firstPoint.y += dy;
        // Recreate the shape path with the new coordinates
        this.shape = new Path2D();
        this.shape.rect(this.firstPoint.x, this.firstPoint.y, this.wh.x, this.wh.y);
    }

    update(x: number, y: number): void {
        // Calculate width and height based on the initial click point and current mouse position
        this.wh.x = x - this.firstPoint.x;
        this.wh.y = y - this.firstPoint.y;
        this.shape = new Path2D();
        this.shape.rect(this.firstPoint.x, this.firstPoint.y, this.wh.x, this.wh.y);
    }

    duplicate(): CanvasItem {
        const newRect = new RectangleItem(
            this.ctx,
            { x: this.firstPoint.x + 10, y: this.firstPoint.y + 10 }, // Offset to see the duplicate
            this.fillStyle,
            this.strokeStyle,
            this.lineWidth
        );
        newRect.wh = { ...this.wh };
        newRect.update(newRect.firstPoint.x + newRect.wh.x, newRect.firstPoint.y + newRect.wh.y);
        return newRect;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        // Return normalized bounding box (handling negative widths/heights)
        const x = Math.min(this.firstPoint.x, this.firstPoint.x + this.wh.x);
        const y = Math.min(this.firstPoint.y, this.firstPoint.y + this.wh.y);
        const width = Math.abs(this.wh.x);
        const height = Math.abs(this.wh.y);
        return { x, y, width, height };
    }

    scale(scaleX: number, scaleY: number, anchorX: number, anchorY: number): void {
        // Calculate the current bounding box
        const bbox = this.getBoundingBox();
        
        // Calculate new dimensions
        const newWidth = bbox.width * scaleX;
        const newHeight = bbox.height * scaleY;
        
        // Calculate new position based on anchor point
        const newX = anchorX - (anchorX - bbox.x) * scaleX;
        const newY = anchorY - (anchorY - bbox.y) * scaleY;
        
        // Update the rectangle (preserve original drawing direction)
        this.firstPoint.x = newX;
        this.firstPoint.y = newY;
        this.wh.x = newWidth;
        this.wh.y = newHeight;
        
        // Recreate the shape
        this.shape = new Path2D();
        this.shape.rect(this.firstPoint.x, this.firstPoint.y, this.wh.x, this.wh.y);
    }
}