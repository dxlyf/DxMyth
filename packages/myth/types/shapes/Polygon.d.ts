import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type PolygonShapeProps = {
    points: number[];
};
export declare class Polygon extends DisplayObject<DisplayObjectProps<PolygonShapeProps>> {
    defaultProps(): Partial<DisplayObjectProps<PolygonShapeProps>>[];
    buildPath(path: Path2D): void;
}
