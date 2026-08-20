import { EventEmitter } from '../events/EventEmitter';
import { Renderer, RendererConstructor } from './Renderer';
import { PointerEventSystem } from '../events/PointerEventSystem';
export type StageEvents = {
    tick: [delta: number];
    preInit: [stage: Stage];
    postInit: [stage: Stage];
    beforeRender: [stage: Stage];
    render: [stage: Stage];
    afterRender: [stage: Stage];
};
export type StageProps = {};
export type StageInitProps = {
    width?: number;
    height?: number;
    dpr?: number;
    container: HTMLElement;
    renderer: 'canvas' | 'webgl' | 'webgpu';
};
export declare class Stage extends EventEmitter<StageEvents> {
    static renderers: Map<string, RendererConstructor>;
    private needRendering;
    private delta;
    domElement: HTMLElement;
    renderer: Renderer;
    eventSystem: PointerEventSystem;
    constructor(props: StageProps);
    init(props: StageInitProps): Promise<void>;
    start(): void;
    get width(): number;
    get height(): number;
    setSize(width: number, height: number, dpr?: number): void;
    refresh(): void;
    private render;
    tick(delta: number): void;
}
