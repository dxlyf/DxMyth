import { ShapeConfig } from '../../../../../../../src/types/Shape';
import { Shape, ShapeOptions } from './Shape';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export interface CircleOptions extends ShapeOptions<CircleShapeConfig> {
}
export interface CircleShapeConfig extends ShapeConfig {
    cx?: number;
    cy?: number;
    r?: number;
    startAngle?: number;
    endAngle?: number;
    clockwise?: boolean;
}
export declare class Circle extends Shape<CircleOptions> {
    type: string;
    constructor(options?: CircleOptions);
    getDefaultProps(): CircleOptions[];
    buildPath(path: CanvasKit.Path): void;
}
