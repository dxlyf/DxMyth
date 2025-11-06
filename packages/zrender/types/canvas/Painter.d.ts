import { default as Layer, LayerConfig } from './Layer';
import { default as Displayable } from '../graphic/Displayable';
import { GradientObject } from '../graphic/Gradient';
import { ImagePatternObject } from '../graphic/Pattern';
import { default as Storage } from '../Storage';
import { PainterBase } from '../PainterBase';
interface CanvasPainterOption {
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
    useDirtyRect?: boolean;
}
export default class CanvasPainter implements PainterBase {
    type: string;
    root: HTMLElement;
    dpr: number;
    storage: Storage;
    private _singleCanvas;
    private _opts;
    private _zlevelList;
    private _prevDisplayList;
    private _layers;
    private _layerConfig;
    /**
     * zrender will do compositing when root is a canvas and have multiple zlevels.
     */
    private _needsManuallyCompositing;
    private _width;
    private _height;
    private _domRoot;
    private _hoverlayer;
    private _redrawId;
    private _backgroundColor;
    constructor(root: HTMLElement, storage: Storage, opts: CanvasPainterOption, id: number);
    getType(): string;
    /**
     * If painter use a single canvas
     */
    isSingleCanvas(): boolean;
    getViewportRoot(): HTMLElement;
    getViewportRootOffset(): {
        offsetLeft: number;
        offsetTop: number;
    };
    /**
     * 刷新
     * @param paintAll 强制绘制所有displayable
     */
    refresh(paintAll?: boolean): this;
    refreshHover(): void;
    private _paintHoverList;
    getHoverLayer(): Layer;
    paintOne(ctx: CanvasRenderingContext2D, el: Displayable): void;
    private _paintList;
    private _compositeManually;
    private _doPaintList;
    private _doPaintEl;
    /**
     * 获取 zlevel 所在层，如果不存在则会创建一个新的层
     * @param zlevel
     * @param virtual Virtual layer will not be inserted into dom.
     */
    getLayer(zlevel: number, virtual?: boolean): Layer;
    insertLayer(zlevel: number, layer: Layer): void;
    eachLayer<T>(cb: (this: T, layer: Layer, z: number) => void, context?: T): void;
    eachBuiltinLayer<T>(cb: (this: T, layer: Layer, z: number) => void, context?: T): void;
    eachOtherLayer<T>(cb: (this: T, layer: Layer, z: number) => void, context?: T): void;
    /**
     * 获取所有已创建的层
     * @param prevLayer
     */
    getLayers(): {
        [key: number]: Layer;
    };
    _updateLayerStatus(list: Displayable[]): void;
    /**
     * 清除hover层外所有内容
     */
    clear(): this;
    _clearLayer(layer: Layer): void;
    setBackgroundColor(backgroundColor: string | GradientObject | ImagePatternObject): void;
    /**
     * 修改指定zlevel的绘制参数
     */
    configLayer(zlevel: number, config: LayerConfig): void;
    /**
     * 删除指定层
     * @param zlevel 层所在的zlevel
     */
    delLayer(zlevel: number): void;
    /**
     * 区域大小变化后重绘
     */
    resize(width?: number | string, height?: number | string): this;
    /**
     * 清除单独的一个层
     * @param {number} zlevel
     */
    clearLayer(zlevel: number): void;
    /**
     * 释放
     */
    dispose(): void;
    /**
     * Get canvas which has all thing rendered
     */
    getRenderedCanvas(opts?: {
        backgroundColor?: string | GradientObject | ImagePatternObject;
        pixelRatio?: number;
    }): HTMLCanvasElement;
    /**
     * 获取绘图区域宽度
     */
    getWidth(): number;
    /**
     * 获取绘图区域高度
     */
    getHeight(): number;
}
export {};
