import { Element } from './Element';
import { DisplayObjectStyleProps, IDisplayObject, DisplayObjectProps, DisplayObjectEvents } from '../../../../../../../../src/types/core/DisplayObject';
import { IBaseRenderer } from '../../../../../../../../src/types/core/BaseRenderer';
import { RenderObject } from '../../../../../../../../src/types/core/Paint';
import { IViewport } from '../../../../../../../../src/types/core/Viewport';
import { Path2D } from 'skia-path2d';
/**
 * 容器类，用于管理子元素。
 */
export declare abstract class DisplayObject<Props extends DisplayObjectProps, Events extends DisplayObjectEvents = DisplayObjectEvents> extends Element<Props, Events> implements IDisplayObject<Props> {
    type: string;
    _fillPath: Path2D;
    _strokePath: Path2D;
    get style(): Props["style"];
    get shape(): Props["shape"];
    defaultProps(): Partial<Props>[];
    setShape(shape: Partial<Props['shape']>): void;
    setStyle(styles: Partial<DisplayObjectStyleProps>): void;
    hasStrokeDash(): boolean;
    hasFill(): boolean;
    hasStroke(): boolean;
    shouldRender(): boolean;
    isInViewport(viewport: IViewport): boolean;
    contains(x: number, y: number): boolean;
    isPointInPath(x: number, y: number): boolean;
    calcLocalBounds(): import('@dxyl/math/types/2d').BoundingRect;
    buildRenderPath(): void;
    render(renderer: IBaseRenderer, renderObject: RenderObject): void;
    buildPath(path: Path2D): void;
}
