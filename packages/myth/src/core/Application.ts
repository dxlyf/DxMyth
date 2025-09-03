import { ApplicationHooks,ApplicationEvents, ApplicationOptions, IApplication } from "src/types/core/Application";
import { PluginManager } from "./PluginManager";
import { IBaseRenderer } from "src/types/core/BaseRenderer";
import { AsyncSeriesBailHook } from '@dxyl/tapable'
import { PluginConstructor } from "src/types/core/Plugin";
import { Container } from "./Container";
import { IElement } from "src/types/core/Element";
import { Ticker } from "src/ticker";
import { Viewport } from "./Viewport";
import { getRendertList } from "./Paint";
import { extensions,ExtensionType } from "src/extensions";
import { EventEmitter } from "src/events";
import { FontMap } from "src/font";

let currentViewport=new Viewport()
const plugins:PluginConstructor<IApplication>[] = []
extensions.handleByList(ExtensionType.ApplicationPlugin,plugins)
export class Application extends EventEmitter<ApplicationEvents> implements IApplication {
    static defaultPlugins=plugins
    options: ApplicationOptions
    pluginManager!: PluginManager<IApplication>
    renderer!: IBaseRenderer
    hooks: ApplicationHooks
    needToReRender = false
    container: Container<any, any>
    ticker: Ticker
    constructor(options: ApplicationOptions) {
        super()
        this.hooks = {
            fonts:new AsyncSeriesBailHook(), // 初始化字体opentype.Font对象
            renderer: new AsyncSeriesBailHook() // 初始化渲染器，返回一个渲染器实例
        }
        this.options = Object.assign({ plugins: [] }, options) as ApplicationOptions;
        // this.options.canvas.style.display='block'
        this.container = new Container() // 元素容器，所有元素都添加到这个容器中
        this.container.owner = this
        this.ticker = Ticker.shared
        // 插件管理
        this.pluginManager = new PluginManager<IApplication>(this, Application.defaultPlugins.concat(this.options.plugins))
    }
    async init() {
        this.pluginManager.install() // 安装插件，执行插件的create方法
        await this.initFonts()
        await this.initRenderer()
        this.initPlugins()// 初始化插件，执行插件的init方法
        this.ticker.add(this.update)

    }
    async initFonts(){
        this.fonts=await this.hooks.fonts.promise() as FontMap
    }
    async initRenderer() {
        this.renderer = (await this.hooks.renderer.promise(this))!
    }
    get domElement() {
        return this.options.canvas
    }
    initPlugins() {
        this.pluginManager.callPluginHook('init')
    }
    add(el: IElement<any>): void {
        this.container.add(el)
    }
    remove(el: IElement<any>): void {
        this.container.remove(el)
    }
    dispose() {
        this.pluginManager.uninstall()
        this.removeAllListeners()
    }
    update = () => {
        this.emit('update', this.ticker.deltaTime)
        if (this.needToReRender) {
            this.prerender()
            this.render()
            this.postrender()
        }
    }
    prerender(){

    }
    render() {
        const container = this.container
        const renderer = this.renderer
        const viewport = renderer.viewport as Viewport
        const dpr=renderer.dpr
        currentViewport.copy(viewport).multiptyScalar(renderer.dpr)
        const displayList = container.getDisplayList()
        const renderObjects = getRendertList({ objects: displayList, viewport: currentViewport, dpr: dpr })
        this.renderer.render({ renderObjects:renderObjects })
        this.needToReRender = false
    }
    postrender(){
        this.container.resetAllEffectFlag()
    }
    refresh() {
        this.needToReRender = true
    }
}