import type { CanvasItem } from "./CanvasItem";

export class EllipseItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    center: { x: number; y: number };
    radius: { x: number; y: number };

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number) {
        this.ctx = ctx;
        this.center = point;
        this.radius = { x: 0, y: 0 };
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
    }

    draw(): void {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.shape = new Path2D();
        this.shape.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
        this.ctx.fill(this.shape);
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        // Simple bounding box check for now
        const dx = x - this.center.x;
        const dy = y - this.center.y;
        // Equation for a point in an ellipse: (x/rx)^2 + (y/ry)^2 <= 1
        if (this.radius.x === 0 || this.radius.y === 0) return false;
        return (dx * dx) / (this.radius.x * this.radius.x) + (dy * dy) / (this.radius.y * this.radius.y) <= 1;
    }

    move(dx: number, dy: number): void {
        this.center.x += dx;
        this.center.y += dy;
        this.shape = new Path2D();
        this.shape.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
    }

    update(x: number, y: number): void {
        // The initial point is the center, so the radius is the distance to the current point
        this.radius.x = x - this.center.x;
        this.radius.y = y - this.center.y;
        this.shape = new Path2D();
        this.shape.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
    }

    duplicate(): CanvasItem {
        const newEllipse = new EllipseItem(
            this.ctx,
            { x: this.center.x + 10, y: this.center.y + 10 }, // Offset
            this.fillStyle,
            this.strokeStyle,
            this.lineWidth
        );
        newEllipse.radius = { ...this.radius };
        newEllipse.shape = new Path2D();
        newEllipse.shape.ellipse(newEllipse.center.x, newEllipse.center.y, Math.abs(newEllipse.radius.x), Math.abs(newEllipse.radius.y), 0, 0, 2 * Math.PI);
        return newEllipse;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        // The bounding box of an ellipse is a rectangle centered at the ellipse center
        const radiusX = Math.abs(this.radius.x);
        const radiusY = Math.abs(this.radius.y);
        return {
            x: this.center.x - radiusX,
            y: this.center.y - radiusY,
            width: radiusX * 2,
            height: radiusY * 2
        };
    }

    scale(scaleX: number, scaleY: number, anchorX: number, anchorY: number): void {
        // Calculate the current bounding box
        const bbox = this.getBoundingBox();
        
        // Calculate new dimensions
        const newWidth = bbox.width * scaleX;
        const newHeight = bbox.height * scaleY;
        
        // Calculate new center based on anchor point
        const oldCenterX = this.center.x;
        const oldCenterY = this.center.y;
        
        this.center.x = anchorX - (anchorX - oldCenterX) * scaleX;
        this.center.y = anchorY - (anchorY - oldCenterY) * scaleY;
        
        // Update radii
        this.radius.x = newWidth / 2;
        this.radius.y = newHeight / 2;
        
        // Recreate the shape
        this.shape = new Path2D();
        this.shape.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
    }
}