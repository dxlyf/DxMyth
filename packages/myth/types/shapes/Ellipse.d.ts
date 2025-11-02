import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type EllipseShapeProps = {
    cx?: number;
    cy?: number;
    xAxisRoation?: number;
    rx?: number;
    ry?: number;
    startAngle?: number;
    endAngle?: number;
    ccw?: boolean;
};
export declare class Ellipse extends DisplayObject<DisplayObjectProps<EllipseShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<EllipseShapeProps>>[];
    buildPath(path: Path2D): void;
}
