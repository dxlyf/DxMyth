import { type CanvasKit, getCanvasKit } from 'src/ck'
import { EventEmitter } from 'src/event/EventEmitter'
import { EventSystem } from 'src/event/EventSystem'
import { PluginConstructor, PluginSystem } from 'src/plugin/PluginSystem'
import { merge } from 'src/utils/merge'
import { Container } from './Container'
import { Element } from './Element'
import { Renderer, type RendererProps } from './Renderer'
import { CanvasRenderer } from 'src/renderer/canvas/CanvasRenderer'
import { Color, ColorValue } from 'src/math/Color'

export const renderers = {
    canvas: CanvasRenderer,
}
export type EngineProps = RendererProps & {
    container?: HTMLElement
    backgroundColor?:ColorValue
    renderType?: 'canvas' | 'canvaskit' | 'svg'
    plugins?: PluginConstructor[]
}
export type EngineEvents = {
    'initialize:before': [engne: Engine]
    initialize: [engne: Engine]
    destroy: [engne: Engine]
}
export class Engine extends EventEmitter<EngineEvents> {
    static defaultPlugins: PluginConstructor[] = []
    engine: Engine
    ck: CanvasKit.CanvasKit
    props: EngineProps
    eventSystem: EventSystem
    pluginSystem: PluginSystem
    scene: Container
    renderer: Renderer
    private rendering: boolean = false
    private resizeObserver: ResizeObserver | null = null
    private onResize: () => void
    constructor() {
        super()
        this.render=this.render.bind(this)
        this.scene = new Container()
        this.eventSystem = new EventSystem(this)
        this.pluginSystem = new PluginSystem(this)
    }
    async initialize(config: EngineProps) {
        this.emit('initialize:before', this)
        this.props = merge({ plugins: [], renderType: 'canvas', resizeMode: 'fixed' }, config)
        if(this.props.backgroundColor){
            this.props.backgroundColor=Color.fromInput(this.props.backgroundColor).toRGBAString()
        }
        this.ck = await getCanvasKit()
        this.initContainerDom()
        this.renderer = new renderers[this.props.renderType as keyof typeof renderers](config as any)
        this.renderer.engine = this
        await this.renderer.init()
        this.setupResize()
        this.pluginSystem.registerPlugins(Engine.defaultPlugins.concat(this.props.plugins))
        this.emit('initialize', this)
    }
    get containerDom() {
        return this.props.container ?? (this.props.container = document.createElement('div'))
    }
    private isFixedSize() {
        return Number.isFinite(this.props.width) && Number.isFinite(this.props.height)
    }
    initContainerDom() {

        const style = this.containerDom.style
        style.position = 'relative'
        style.boxSizing='border-box'
        style.overflow='hidden'
        style.margin='0'
        style.padding='0'
        if (!this.containerDom.parentNode) {
            this.containerDom.ownerDocument.body.appendChild(this.containerDom)
        }
    }
    setupResize() {
        const { width, height } = this.props
        const style = this.containerDom.style
    
        if (!this.isFixedSize()) {
            style.width = '100%'
            style.height = '100%'
            
            let lastWidth=0
            let lastHeight=0
            this.onResize = () => {
                const width = this.containerDom.clientWidth
                const height = this.containerDom.clientHeight
                if (Math.abs(width-lastWidth)>1||Math.abs(height-lastHeight)>1) {
                    lastWidth=width
                    lastHeight=height
                    this.renderer.setSize(width, height)
                }
            }
            
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver(this.onResize)
                this.resizeObserver.observe(this.containerDom)
            } else {
                window.addEventListener('resize', this.onResize)
            }
            this.onResize()
            this.on('destroy',()=>{
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect()
                    this.resizeObserver = null
                } else if (this.onResize) {
                    window.removeEventListener('resize', this.onResize)
                }
                this.onResize = undefined as any
            })
        } else {
            style.width = `${width}px`
            style.height = `${height}px`
            this.renderer.setSize(width, height)
        }

    }

    destroy() {
        this.emit('destroy', this)
    }
    add(child: Element) {
        this.scene.add(child)
    }
    remove(child: Element) {
        this.scene.remove(child)
    }
    public render() {
        this.renderer.render(this.scene)
        this.rendering = false
    }
    public requestRender() {
        if (this.rendering) {
            return
        }
        this.rendering = true
        requestAnimationFrame(this.render)
    }
}