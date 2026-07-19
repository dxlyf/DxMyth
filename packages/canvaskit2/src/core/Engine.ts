import { type CanvasKit, getCanvasKit } from 'src/ck'
import { EventEmitter } from 'src/event/EventEmitter'
import { EventSystem } from 'src/event/EventSystem'
import { PluginConstructor, PluginSystem } from 'src/plugin/PluginSystem'
import { merge } from 'src/utils/merge'
import { Scene } from './Scene'
import { Element } from './Element'
import { Renderer, type RendererProps } from './Renderer'
import { CanvasRenderer } from 'src/renderer/canvas/CanvasRenderer'
import { CanvasKitRenderer } from 'src/renderer/canvaskit/CanvasKitRenderer'
import { Color, ColorValue } from '@dxyl/math2'
import { type InputType } from 'src/event/EventSystem'
import { AnimationSystem } from 'src/animation/AnimationSystem'
import { ElementFlag } from './ElementFlags'
import { PickerSystem } from 'src/picker/PickerSystem'

export const renderers = {
    canvas: CanvasRenderer,
    canvaskit: CanvasKitRenderer,
}
export type EngineProps = RendererProps & {
    container?: HTMLElement
    backgroundColor?: ColorValue
    renderType?: 'canvas' | 'canvaskit' | 'svg'
    plugins?: PluginConstructor[]
    /** 事件输入模式，默认 'auto'（环境支持则用 PointerEvent，否则降级 mouse/touch） */
    inputType?: InputType
}
export type EngineEvents = {
    'initialize:before': [engne: Engine]
    initialize: [engne: Engine]
    'add:element':[engine:Engine,el:Element]
    'remove:element':[engine:Engine,el:Element]
    'render:before': [engine: Engine]
    'render:after': [engine: Engine]
    'tick': [delta: number]
    destroy: [engne: Engine]
}
export class Engine extends EventEmitter<EngineEvents> {
    static defaultPlugins: PluginConstructor[] = []
    static activeEngine: Engine | null = null
    engine: Engine
    ck: CanvasKit.CanvasKit
    props: EngineProps
    eventSystem: EventSystem
    animationSystem: AnimationSystem
    pluginSystem: PluginSystem
    pickerSystem: PickerSystem
    scene: Scene
    renderer: Renderer
    private needRender: boolean = true
    private rendering: boolean = false
    private resizeObserver: ResizeObserver | null = null
    private onResize: () => void
    constructor() {
        super()
        this.scene = new Scene(this)
        this.pickerSystem=new PickerSystem(this)
        this.eventSystem = new EventSystem(this)
        this.animationSystem = new AnimationSystem()
        this.pluginSystem = new PluginSystem(this)
        this.render = this.render.bind(this)
    }
    async initialize(config: EngineProps) {
        this.emit('initialize:before', this)
        this.props = merge({ plugins: [], renderType: 'canvas', resizeMode: 'fixed' }, config)
        if (this.props.backgroundColor) {
            this.props.backgroundColor = Color.fromInput(this.props.backgroundColor).toRGBAString()
        }
        this.ck = await getCanvasKit()
        this.initContainerDom()
        this.renderer = new renderers[this.props.renderType as keyof typeof renderers](config as any)
        this.renderer.engine = this
        await this.renderer.init()
        this.setupResize()
        this.pluginSystem.registerPlugins(Engine.defaultPlugins.concat(this.props.plugins))
        // 启动事件系统
        this.eventSystem.start(this.props.inputType)
        // 启动动画系统
        this.tick = this.tick.bind(this)
        this.animationSystem.on('tick', this.tick)
        this.animationSystem.start()
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
        style.boxSizing = 'border-box'
        style.overflow = 'hidden'
        style.margin = '0'
        style.padding = '0'
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

            let lastWidth = 0
            let lastHeight = 0
            this.onResize = () => {
                const width = this.containerDom.clientWidth
                const height = this.containerDom.clientHeight
                if (Math.abs(width - lastWidth) > 1 || Math.abs(height - lastHeight) > 1) {
                    lastWidth = width
                    lastHeight = height
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
            this.on('destroy', () => {
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
        this.eventSystem.stop()
        this.animationSystem.stop()
        this.pluginSystem.unregisterPlugins()
        this.emit('destroy', this)
        ;(this.renderer as any).dispose?.()
    }
    add(child: Element) {
        this.scene.add(child)
    }
    remove(child: Element) {
        this.scene.remove(child)
    }
    refresh() {
        this.needRender = true
    }
    public render() {
        const scene = this.scene
        this.emit('render:before', this)
        this.renderer.render(scene)
        this.emit('render:after', this)

        scene.flags.clear()
        this.rendering = false
    }
    private tick(delta: number) {
        this.emit('tick', delta)
        if (this.needRender||this.scene.flags.include(ElementFlag.REPAINT)) {
            this.needRender = false
            this.render()
        }
    }
    public requestRender() {
        if (this.rendering) {
            return
        }
        this.rendering = true
        requestAnimationFrame( this.render)
    }
}