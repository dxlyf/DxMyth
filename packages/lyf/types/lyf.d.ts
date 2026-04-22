import { ILyf, LyfConfig, LyfEventMap } from './interface/ILyf';
import { IPlugin } from './interface/IPlugin';
import { IRenderer } from './interface/IRenderer';
import { EventEmitter } from './utils';
export declare class Lyf extends EventEmitter<LyfEventMap> implements ILyf {
    static defaultPlugins: IPlugin[];
    static registerPlugin(plugin: IPlugin): void;
    config: LyfConfig;
    renderer: IRenderer | null;
    private renderers;
    private promises;
    private plugins;
    constructor();
    registerPlugin(...plugins: IPlugin[]): void;
    private installPlugins;
    registerRenderer(type: string, renderer: IRenderer): void;
    addInitTask(promise: Promise<void>): void;
    get domElement(): Element;
    initialize(config: LyfConfig): Promise<void>;
    dispose(): void;
}
