
import { EventEmitter } from 'src/events'
import { IPlugin, PluginService, type PluginServiceOPtions } from 'src/core/PluginService'
import { merge } from 'src/utils';
import type { CKEnginePluginHooks, CKEnginePluginMethods, CKEngineEvents, CKEngineOptions } from 'src/types/CKEngine';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer'
import { Ticker } from 'src/animation/Ticker';
import { BrowserEnvPresets } from 'src/plugins';
import { Container } from 'src/scene/Container';
import { Node } from 'src/scene/Node';
import { Vector2 } from 'src/math';
import { getCanvasKit } from 'src/canvaskit';


export interface CKEngine {

}
export class CKEngine extends EventEmitter<CKEngineEvents> {
    static defaultPresets = [BrowserEnvPresets]
    pluginService: PluginService<CKEngine, CKEnginePluginHooks, CKEnginePluginMethods>
    needRefresh: boolean = false
    options: CKEngineOptions
    ticker: Ticker
    renderer: CanvaskitRenderer
    container: Container
    constructor() {
        super();
        this.pluginService = new PluginService<CKEngine, CKEnginePluginHooks, CKEnginePluginMethods>(this)
        this.container = new Container(this)
        this.update = this.update.bind(this)
        this.ticker = Ticker.getInstance()
        this.ticker.add(this.update)
    }
    async init(options: CKEngineOptions) {
        await getCanvasKit()
        this.options = merge({alwaysRefresh:false}, this.options, options);
        this.pluginService.initPresetsAndPlugins({
            plugins: [...(this.options.plugins ?? [])],
            presets: [...CKEngine.defaultPresets, ...(this.options.presets ?? [])],
        });
        await this.initRenderer()
        this.emit('init', this)
    }
    async initRenderer() {
        this.renderer = new CanvaskitRenderer(this.options)
        await this.renderer.initialize()
    }
    add(child: Node) {
        this.container.add(child)
    }
    remove(child: Node) {
        this.container.remove(child)
    }
    refresh() {
        this.needRefresh = true
        this.ticker.start()
    }

    hitObject(x: number, y: number) {
        const list = this.getInteractionRenderList()
        const len = list.length
        const tmp = Vector2.getPool(0, 0)
        for (let i = len - 1; i >= 0; i--) {
            const obj = list[i]
            // 是否可以响应交互事件
            if (obj.shouldInteraction()) {
                tmp.set(x, y)
                tmp.applyMatrix(obj.worldInverseMatrix)
                if (obj.hit(tmp[0], tmp[1])) {
                    tmp.releasePool()
                    return obj
                }
            }
        }
        tmp.releasePool()
        return null
    }
    getInteractionRenderList() {
        if(this.container._interactionRenderList.length<=0){
            this.updateRenderList()
        }
        return this.container._interactionRenderList
    }
    updateRenderList() {
        const renderObjects = this.container.updateRenderList({
            viewport: this.renderer.viewport,
            delta: this.ticker.delta
        })
        return renderObjects
    }
    update(delta: number) {
        this.emit('update', this)
        if (this.options.alwaysRefresh||this.needRefresh) {
            this.render()
            this.needRefresh = false
        }
    }
    render() {
        const renderObjects = this.updateRenderList()
        this.renderer.render({ renderObjects: renderObjects, delta: this.ticker.delta })
        this.emit('render', this)
    }
    start() {
        this.ticker.start()
    }
    dispose() {
        this.emit('dispose', this)
        this.renderer.dispose()
        this.container.dispose()
        this.pluginService.dispose()
        this.removeAllListeners()
    }

}

