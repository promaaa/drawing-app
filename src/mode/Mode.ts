export interface Mode {
    onMouseDown(event: React.MouseEvent): void;
    onMouseMove(event: React.MouseEvent): void;
    onMouseUp(event: React.MouseEvent): void; 
    onWheel(event: React.WheelEvent): void; // Added for mouse wheel interaction
}