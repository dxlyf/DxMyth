import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { Vector2 } from '../../../../../../../src/math';
import { ShapeStyleConfig, ShapeConfig } from '../../../../../../../src/types/Shape';
import { Shape, ShapeOptions } from './Shape';
export interface GraphicPathStyle extends ShapeStyleConfig {
}
export interface GraphicPathShapeConfig extends ShapeConfig {
}
export interface GraphicPathOptions extends ShapeOptions<GraphicPathShapeConfig, GraphicPathStyle> {
}
type GraphicPathCammandParameters = {
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
type GraphicPathCommandType = keyof GraphicPathCammandParameters;
type GraphicPathCommandData = {
    type: GraphicPathCommandType;
    params?: GraphicPathCammandParameters[GraphicPathCommandType];
};
export declare class GraphicPath<Options extends GraphicPathOptions = GraphicPathOptions> extends Shape<Options> {
    type: string;
    pathCmdData: GraphicPathCommandData[];
    lastPathPoint: Vector2;
    constructor(options?: Options);
    getDefaultProps(): Options[];
    buildPath(path: CanvasKit.Path): void;
    addPathCommand(command: GraphicPathCommandData): void;
    clearPath(): void;
    setLastPathPoint(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): void;
    bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void;
    conicTo(cpX: number, cpY: number, x: number, y: number, w: number): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, clockwise?: boolean): void;
    ellipse(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, clockwise?: boolean): void;
    closePath(): void;
    draw(renderer: CanvaskitRenderer): void;
}
export {};
