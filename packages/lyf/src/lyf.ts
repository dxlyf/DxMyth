import { InteractiveEvent } from "./events/InteractiveEvent";
import { LYF_EVENTS, type ILyf, type LyfConfig, type LyfEventMap } from "./interface/ILyf";
import { IPlugin } from "./interface/IPlugin";
import { IRenderer } from "./interface/IRenderer";
import { EventEmitter } from "./utils";
import { mergeConfig } from "./utils/merge";
import CorePlugin from './plugins/CorePlugin'


export class Lyf extends EventEmitter<LyfEventMap> implements ILyf {
    static defaultPlugins: IPlugin[] = [CorePlugin]
    static registerPlugin(plugin: IPlugin) {
        this.defaultPlugins.push(plugin)
    }
    config: LyfConfig
    renderer: IRenderer | null = null
    private renderers: Record<string, IRenderer> = {}
    private promises: Promise<void>[] = [] // 初始化任务，会在initialize时并行执行
    private plugins = new Set<IPlugin>()
    
    constructor() {
        super()
        this.registerPlugin(...Lyf.defaultPlugins)
    }
    registerPlugin(...plugins: IPlugin[]) {
        plugins.forEach((plugin) => {
            this.plugins.add(plugin)
        })
    }
    private installPlugins() {
        this.plugins.forEach((plugin) => {
            plugin(this)
        })
        this.plugins.clear()
    }
    registerRenderer(type: string, renderer: IRenderer) {
        this.renderers[type] = renderer
    }
    // 初始化任务，会在initialize时并行执行
    addInitTask(promise: Promise<void>) {
        this.promises.push(promise)
    }
    get domElement(){
        return this.renderer.domElement
    }
    async initialize(config: LyfConfig) {
        try {
            this.config = mergeConfig({
                dpr: window.devicePixelRatio,
                plugins: [],
            }, config)
            if (this.config.plugins) {
                this.registerPlugin(...this.config.plugins)
            }
            this.installPlugins()
            await Promise.all(this.promises)
            this.emit(LYF_EVENTS.BEFORE_INIT, this)
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
