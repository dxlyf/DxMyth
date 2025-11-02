import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type CircleShapeProps = {
    cx?: number;
    cy?: number;
    r?: number;
    startAngle?: number;
    endAngle?: number;
    ccw?: boolean;
};
export declare class Circle extends DisplayObject<DisplayObjectProps<CircleShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<CircleShapeProps>>[];
    buildPath(path: Path2D): void;
}
