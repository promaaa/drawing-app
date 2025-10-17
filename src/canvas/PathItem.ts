import type { CanvasItem } from "./CanvasItem";

export class PathItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;
    public points: { x: number; y: number }[];

    // fillStyle is not used for paths, but is part of the interface
    public fillStyle: string = 'transparent';

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        strokeStyle: string,
        lineWidth: number) {
        this.ctx = ctx;
        this.points = [point];
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.updatePath();
    }

    private updatePath(): void {
        this.shape = new Path2D();
        if (this.points.length > 0) {
            this.shape.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                this.shape.lineTo(this.points[i].x, this.points[i].y);
            }
        }
    }

    draw(): void {
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        return this.ctx.isPointInStroke(this.shape, x, y);
    }

    move(dx: number, dy: number): void {
        this.points.forEach(p => {
            p.x += dx;
            p.y += dy;
        });
        this.updatePath();
    }

    update(x: number, y: number): void {
        this.points.push({ x, y });
        this.updatePath();
    }

    duplicate(): CanvasItem {
        const newPath = new PathItem(
            this.ctx,
            { x: this.points[0].x + 10, y: this.points[0].y + 10 },
            this.strokeStyle,
            this.lineWidth
        );
        newPath.points = this.points.map(p => ({ x: p.x + 10, y: p.y + 10 }));
        newPath.updatePath();
        return newPath;
    }

    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        if (this.points.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;

        for (const point of this.points) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    scale(scaleX: number, scaleY: number, anchorX: number, anchorY: number): void {
        // Scale all points relative to the anchor point
        this.points = this.points.map(point => ({
            x: anchorX + (point.x - anchorX) * scaleX,
            y: anchorY + (point.y - anchorY) * scaleY
        }));
        
        this.updatePath();
    }
}