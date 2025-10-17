import type { CanvasItem } from "./CanvasItem";

export class LineItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };

    // fillStyle is not used for lines, but is part of the interface
    public fillStyle: string = 'transparent';

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        strokeStyle: string,
        lineWidth: number) {
        this.ctx = ctx;
        this.startPoint = point;
        this.endPoint = point; // Initially, start and end are the same
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.updatePath();
    }

    private updatePath(): void {
        this.shape = new Path2D();
        this.shape.moveTo(this.startPoint.x, this.startPoint.y);
        this.shape.lineTo(this.endPoint.x, this.endPoint.y);
    }

    draw(): void {
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        // Use a buffer around the line for easier selection
        return this.ctx.isPointInStroke(this.shape, x, y);
    }

    move(dx: number, dy: number): void {
        this.startPoint.x += dx;
        this.startPoint.y += dy;
        this.endPoint.x += dx;
        this.endPoint.y += dy;
        this.updatePath();
    }

    update(x: number, y: number): void {
        this.endPoint = { x, y };
        this.updatePath();
    }

    duplicate(): CanvasItem {
        const newLine = new LineItem(
            this.ctx,
            { x: this.startPoint.x + 10, y: this.startPoint.y + 10 },
            this.strokeStyle,
            this.lineWidth
        );
        newLine.endPoint = { x: this.endPoint.x + 10, y: this.endPoint.y + 10 };
        newLine.updatePath();
        return newLine;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        const minX = Math.min(this.startPoint.x, this.endPoint.x);
        const minY = Math.min(this.startPoint.y, this.endPoint.y);
        const maxX = Math.max(this.startPoint.x, this.endPoint.x);
        const maxY = Math.max(this.startPoint.y, this.endPoint.y);
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    scale(scaleX: number, scaleY: number, anchorX: number, anchorY: number): void {
        // Scale both endpoints relative to the anchor point
        this.startPoint.x = anchorX + (this.startPoint.x - anchorX) * scaleX;
        this.startPoint.y = anchorY + (this.startPoint.y - anchorY) * scaleY;
        this.endPoint.x = anchorX + (this.endPoint.x - anchorX) * scaleX;
        this.endPoint.y = anchorY + (this.endPoint.y - anchorY) * scaleY;
        
        this.updatePath();
    }
}