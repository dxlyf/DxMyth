import { ShapeConfig } from '../../../../../../../src/types/Shape';
import { Shape, ShapeOptions } from './Shape';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export interface EllipseOptions extends ShapeOptions<EllipseShapeConfig> {
}
export interface EllipseShapeConfig extends ShapeConfig {
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
    xRotation?: number;
    startAngle?: number;
    endAngle?: number;
    clockwise?: boolean;
}
export declare class Ellipse extends Shape<EllipseOptions> {
    type: string;
    constructor(options?: EllipseOptions);
    getDefaultProps(): EllipseOptions[];
    buildPath(path: CanvasKit.Path): void;
}
