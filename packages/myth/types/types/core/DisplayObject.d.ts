import { Renderer2DContext } from './BaseRenderer';
import { ElementEvents, IElement, ElementProps } from './Element';
import { IViewport } from './Viewport';
import { FillRule, LineJoin, PaintColor, LineCap, RenderObject } from './Paint';
import { Path2D, ProxyPath2D } from 'skia-path2d';
export type DisplayObjectStyleProps = {
    firstFill?: boolean;
    opacity?: number;
    fillStyle?: PaintColor;
    strokeStyle?: PaintColor;
    lineWidth?: number;
    miterLimit?: number;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    fillRule?: FillRule;
    lineDashOffset?: number;
    lineDash?: number[];
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
};
export type DisplayObjectProps<ShapeProps extends {} = {}, StyleProps extends {} = DisplayObjectStyleProps> = {
    style?: StyleProps;
    shape?: ShapeProps;
    clipShape?: IDisplayObject;
    clipPath?: ProxyPath2D;
    clipPathFillRule?: FillRule;
} & ElementProps;
export interface DisplayObjectEvents extends ElementEvents {
}
export interface IDisplayObject<Props extends DisplayObjectProps = DisplayObjectProps> extends IElement<Props> {
    readonly style: Props['style'];
    readonly shape: Props['shape'];
    _fillPath: Path2D;
    _strokePath: Path2D;
    setShape(shape: Props['shape']): void;
    setStyle(styles: Props['style']): void;
    isInViewport(viewport: IViewport): boolean;
    contains(x: number, y: number): boolean;
    hasFill(): boolean;
    hasStroke(): boolean;
    buildPath(path: Path2D): void;
    buildRenderPath(): void;
    render(renderer: Renderer2DContext, renderObject: RenderObject): void;
}
