import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type LineShapeProps = {
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
};
export declare class Line extends DisplayObject<DisplayObjectProps<LineShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<LineShapeProps>>[];
    buildPath(path: Path2D): void;
}
