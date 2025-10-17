export interface CanvasItem {
    ctx: CanvasRenderingContext2D;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    shape: Path2D;

    draw(): void;
    contains(x: number, y: number): boolean;
    move(dx: number, dy: number): void;
    update(x: number, y: number): void;
    duplicate(): CanvasItem;
    getBoundingBox(): { x: number; y: number; width: number; height: number };
    scale(scaleX: number, scaleY: number, anchorX: number, anchorY: number): void;
}