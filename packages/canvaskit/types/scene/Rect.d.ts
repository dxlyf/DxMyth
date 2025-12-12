import { ShapeConfig } from '../../../../../../../src/types/Shape';
import { Shape, ShapeOptions } from './Shape';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export interface RectOptions extends ShapeOptions<RectShapeConfig> {
}
export interface RectShapeConfig extends ShapeConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number | number[];
}
export declare class Rect extends Shape<RectOptions> {
    type: string;
    constructor(options?: RectOptions);
    getDefaultProps(): RectOptions[];
    buildPath(path: CanvasKit.Path): void;
}
