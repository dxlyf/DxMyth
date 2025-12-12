import { CanvasKit } from '../../../../../../../src/canvaskit';
type CommandParameter = {
    moveTo: [number, number];
    lineTo: [number, number];
    quadraticCurveTo: [number, number, number, number];
    bezierCurveTo: [number, number, number, number, number, number];
    conicTo: [number, number, number, number, number];
    arcTo: [number, number, number, number, number];
    rect: [number, number, number, number];
    roundRect: [number, number, number, number, number | [number, number]];
    arc: [number, number, number, number, number, boolean];
    ellipse: [number, number, number, number, number, number, number, boolean];
    closePath: [];
};
type CommandType = keyof CommandParameter;
type CommandData = [CommandType, ...CommandParameter[CommandType]];
declare function applyCKPath(path: CanvasKit.Path, type: string, params: any[]): boolean;
declare class ProxyPath {
    segmentType: number;
    cmds: CommandData[];
    lastPosition: number[];
    constructor();
    addCmd(type: CommandType, ...params: CommandParameter[CommandType]): void;
    setLastPosition(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    conicTo(cp1x: number, cp1y: number, x: number, y: number, w: number): void;
    arcTo(x1: number, y1: number, x: number, y: number, radius: number): void;
    rect(x: number, y: number, width: number, height: number): void;
    roundRect(x: number, y: number, width: number, height: number, radius: number): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    closePath(): void;
    toCKPath(path: CanvasKit.Path): CanvasKit.Path;
}
export { ProxyPath, applyCKPath };
