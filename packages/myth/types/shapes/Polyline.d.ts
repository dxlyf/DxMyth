import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type PolylineShapeProps = {
    points: number[];
};
export declare class Polyline extends DisplayObject<DisplayObjectProps<PolylineShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<PolylineShapeProps>>[];
    buildPath(path: Path2D): void;
}
