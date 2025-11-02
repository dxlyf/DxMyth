import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type RectShapeProps = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};
export declare class Rect extends DisplayObject<DisplayObjectProps<RectShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<RectShapeProps>>[];
    buildPath(path: Path2D): void;
}
