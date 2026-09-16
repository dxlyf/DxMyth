export declare class GLContext {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    dpr: number;
    width: number;
    height: number;
    _isContextLost: boolean;
    constructor(canvas: HTMLCanvasElement, options: WebGLContextAttributes);
    onContextLost(): void;
    onContextRestore: () => void;
    onContextCreationError(): void;
    setDpr(dpr: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    initGLContext(): void;
}
