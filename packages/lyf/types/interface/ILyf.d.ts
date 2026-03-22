import { IRenderer } from './IRenderer';
import { IPlugin } from './IPlugin';
import { IEventEmitter } from './IEventEmitter';
export declare const LYF_EVENTS: {
    BEFORE_INIT: string;
    INIT: string;
    DISPOSE: string;
};
export type LyfEventMap = {};
export type LyfConfig = {
    canvas: HTMLElement;
    width?: number;
    height?: number;
    dpr?: number;
    plugins?: IPlugin[];
    rendererType?: string;
};
export interface ILyf extends IEventEmitter<LyfEventMap> {
    config: LyfConfig;
    domElement: HTMLElement;
    registerPlugin(...plugins: IPlugin[]): void;
    registerRenderer(type: string, renderer: IRenderer): void;
    addInitTask(task: Promise<void>): void;
    initialize: (config: LyfConfig) => Promise<void>;
    dispose: () => void;
}
