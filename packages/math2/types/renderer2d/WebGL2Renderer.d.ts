import { Matrix2D } from '../math/Matrix2D';
import { Mesh2D } from './geometry';
import { BlendMode, ImageSource, PaintColor, PaintSource } from './Paint';
import { GPU2DRenderer, GPU2DRendererOptions, Rect, UvRect } from './GPU2DRenderer';
export interface WebGL2RendererOptions extends GPU2DRendererOptions {
    /** 覆盖默认的 WebGL 上下文属性 */
    contextAttributes?: WebGLContextAttributes;
    antialias?: boolean;
    preserveDrawingBuffer?: boolean;
    powerPreference?: WebGLPowerPreference;
}
export declare class WebGL2Renderer extends GPU2DRenderer {
    private readonly _gl;
    private _shapeProgram;
    private _imageProgram;
    private _vao;
    private _vbo;
    private _ibo;
    private readonly _shapeLoc;
    private readonly _imageLoc;
    private readonly _textures;
    private readonly _textureSet;
    private readonly _patternMatrix;
    private _blendKey;
    private _quadMesh;
    constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options?: WebGL2RendererOptions);
    get gl(): WebGL2RenderingContext;
    private _initResources;
    private _link;
    private _compile;
    protected onResize(): void;
    protected onClear(color: PaintColor | null): void;
    protected onClearRectDevice(x: number, y: number, width: number, height: number): void;
    protected submitMesh(mesh: Mesh2D, matrix: Matrix2D, source: PaintSource, opacity: number, blend: BlendMode): void;
    protected submitImage(image: ImageSource, matrix: Matrix2D, dst: Rect, uv: UvRect, opacity: number, blend: BlendMode, smoothing: boolean): void;
    protected beginClip(mesh: Mesh2D, matrix: Matrix2D, level: number): void;
    protected endClip(from: number, to: number): void;
    protected onFlush(): void;
    protected onDispose(): void;
    private _loc;
    private _prepareShape;
    private _drawMesh;
    private _upload;
    private _applyBlend;
    private _factor;
    private _applyClipState;
    private _setPatternMatrix;
    private _texture;
}
