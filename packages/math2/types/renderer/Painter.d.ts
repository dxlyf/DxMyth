import { PathBuilder } from '../math/PathBuilder';
export declare class Painter {
    currentPath: PathBuilder;
    constructor();
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
}
