import { EventEmitter } from '../events/EventEmitter';
import { Renderer, RendererConstructor, RendererProps } from './Renderer';
import { PointerEventSystem } from '../events/PointerEventSystem';
export type StageEvents = {
    tick: [delta: number];
    preInit: [stage: Stage];
    postInit: [stage: Stage];
    beforeFrame: [delta: number, stage: Stage];
    afterFrame: [delta: number, stage: Stage];
};
export type StageInitializeProps = {
    width?: number;
    height?: number;
    dpr?: number;
    container?: HTMLElement;
    renderer: 'canvas' | 'webgl' | 'webgpu';
    rendererConfig?: Partial<RendererProps>;
};
export declare class Stage extends EventEmitter<StageEvents> {
    static renderers: Map<string, RendererConstructor>;
    private needRendering;
    private delta;
    domElement: HTMLElement;
    renderer: Renderer;
    eventSystem: PointerEventSystem;
    constructor();
    init(props: StageInitializeProps): Promise<void>;
    get width(): number;
    get height(): number;
    start(): void;
    stop(): void;
    private updateDomElementSize;
    setSize(width: number, height: number, dpr?: number): void;
    refresh(): void;
    private render;
    private tick;
}
