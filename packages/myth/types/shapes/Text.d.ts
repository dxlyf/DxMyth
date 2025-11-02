import { Path2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type TextShapeProps = {
    text: string;
};
export declare class Text extends DisplayObject<DisplayObjectProps<TextShapeProps>> {
    defaultProps(): DisplayObjectProps<TextShapeProps>[];
    buildPath(path: Path2D): void;
}
