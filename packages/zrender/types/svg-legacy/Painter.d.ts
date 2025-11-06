import { default as Displayable } from '../graphic/Displayable';
import { default as Storage } from '../Storage';
import { PainterBase } from '../PainterBase';
interface SVGPainterOption {
    width?: number | string;
    height?: number | string;
}
declare class SVGPainter implements PainterBase {
    type: string;
    root: HTMLElement;
    storage: Storage;
    private _opts;
    private _svgDom;
    private _svgRoot;
    private _backgroundRoot;
    private _backgroundNode;
    private _gradientManager;
    private _patternManager;
    private _clipPathManager;
    private _shadowManager;
    private _viewport;
    private _visibleList;
    private _width;
    private _height;
    constructor(root: HTMLElement, storage: Storage, opts: SVGPainterOption, zrId: number);
    getType(): string;
    getViewportRoot(): HTMLDivElement;
    getSvgDom(): SVGElement;
    getSvgRoot(): SVGGElement;
    getViewportRootOffset(): {
        offsetLeft: number;
        offsetTop: number;
    };
    refresh(): void;
    setBackgroundColor(backgroundColor: string): void;
    createSVGElement(tag: string): SVGElement;
    paintOne(el: Displayable): SVGElement;
    _paintList(list: Displayable[]): void;
    resize(width: number | string, height: number | string): void;
    /**
     * 获取绘图区域宽度
     */
    getWidth(): number;
    /**
     * 获取绘图区域高度
     */
    getHeight(): number;
    dispose(): void;
    clear(): void;
    toDataURL(): string;
    refreshHover: PainterBase["refreshHover"];
    configLayer: PainterBase["configLayer"];
}
export default SVGPainter;
