import { EventEmitter } from '../../../../../../../src/events';
import { PluginService } from '../../../../../../../src/core/PluginService';
import { CKEnginePluginHooks, CKEnginePluginMethods, CKEngineEvents, CKEngineOptions } from '../../../../../../../src/types/CKEngine';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { Ticker } from '../../../../../../../src/animation/Ticker';
import { Container } from '../../../../../../../src/scene/Container';
import { Node } from '../../../../../../../src/scene/Node';
export interface CKEngine {
}
export declare class CKEngine extends EventEmitter<CKEngineEvents> {
    static defaultPresets: import('../../../../../../../src/core/PluginService').IPreset[];
    pluginService: PluginService<CKEngine, CKEnginePluginHooks, CKEnginePluginMethods>;
    needRefresh: boolean;
    options: CKEngineOptions;
    ticker: Ticker;
    renderer: CanvaskitRenderer;
    container: Container;
    constructor();
    init(options: CKEngineOptions): Promise<void>;
    initRenderer(): Promise<void>;
    add(child: Node): void;
    remove(child: Node): void;
    refresh(): void;
    hitObject(x: number, y: number): import('../scene/DisplayObject').DisplayObject<import('..').DisplayObjectOptions<import('..').DisplayObjectStyle>>;
    getInteractionRenderList(): import('../scene/DisplayObject').DisplayObject<import('..').DisplayObjectOptions<import('..').DisplayObjectStyle>>[];
    updateRenderList(): import('../scene/DisplayObject').DisplayObject<import('..').DisplayObjectOptions<import('..').DisplayObjectStyle>>[];
    update(delta: number): void;
    render(): void;
    start(): void;
    dispose(): void;
}
