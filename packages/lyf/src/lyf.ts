import { InteractiveEvent } from "./core/InteractiveEvent";
import { LYF_EVENTS, type ILyf, type LyfConfig, type LyfEventMap } from "./interface/ILyf";
import { IPlugin } from "./interface/IPlugin";
import { IRenderer } from "./interface/IRenderer";
import { EventEmitter } from "./utils";
import { mergeConfig } from "./utils/merge";
import LoadAssetPlugin from './plugins/LoadAssetPlugin'
export class Lyf extends EventEmitter<LyfEventMap> implements ILyf {
    static defaultPlugins: IPlugin[] = [LoadAssetPlugin]

    config: LyfConfig
    renderer: IRenderer | null = null
    private renderers: Record<string, IRenderer> = {}
    private promises: Promise<void>[] = [] // 初始化任务，会在initialize时并行执行
    constructor() {
        super()

    }
    setRenderer(type: string, renderer: IRenderer) {
        this.renderers[type] = renderer
    }
    // 初始化任务，会在initialize时并行执行
    addInitTask(promise: Promise<void>) {
        this.promises.push(promise)
    }
    async initialize(config: LyfConfig) {
        try {
            this.config = mergeConfig({
                dpr: window.devicePixelRatio,
                plugins: [...Lyf.defaultPlugins],
            }, config)
            this.config.plugins.forEach(plugin => plugin(this))
            this.emit(LYF_EVENTS.BEFORE_INIT, this)
            await Promise.all(this.promises)
            this.renderer = this.renderers[this.config.rendererType]
            this.emit(LYF_EVENTS.INIT, this)
        } catch (e) {
            console.error('initialize error', e)
        }
    }
    dispose() {
        this.emit(LYF_EVENTS.DISPOSE, this)
    }
}
