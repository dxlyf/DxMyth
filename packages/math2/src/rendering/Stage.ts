import { EventEmitter } from "src/events/EventEmitter"
import { Renderer, type RendererConstructor,type RendererProps } from './Renderer'
import { PointerEventSystem } from 'src/events/PointerEventSystem'
import { Ticker } from "src/animation"
import { CanvasRenderer } from "./renderer/canvas/CanvasRenderer"
import { WebGLRenderer } from "./renderer/webgl/WebGLRenderer"
import { Viewport } from "src/math/Viewport"


export type StageEvents = {
    tick: [delta: number]
    preInit: [stage: Stage]
    postInit: [stage: Stage]
    beforeFrame: [delta:number,stage: Stage]
    afterFrame: [delta:number,stage: Stage]
}

export type StageInitializeProps = {
    width?: number
    height?: number
    dpr?: number
    container?: HTMLElement
    renderer: 'canvas' | 'webgl' | 'webgpu'
    rendererConfig?:Partial<RendererProps>
}
export class Stage extends EventEmitter<StageEvents> {
    static renderers: Map<string, RendererConstructor> = new Map([
        ['canvas',CanvasRenderer],
        ['webgl',WebGLRenderer],
    ])
    private needRendering: boolean = false
    private delta:number=0.0
    domElement: HTMLElement
    renderer: Renderer
    eventSystem: PointerEventSystem

    constructor() {
        super()
    }
    async init(props: StageInitializeProps) {

        this.emit('preInit', this)
        this.domElement = props.container
        if(!this.domElement){
            this.domElement = document.createElement('div')
            document.body.appendChild(this.domElement)
        }
        this.domElement.style.position='relative'
        this.domElement.style.overflow='hidden'
        this.domElement.style.padding='0'
        this.domElement.style.margin='0'

        if (props.width && props.height) {
            this.updateDomElementSize(props.width, props.height)
        }
        const RendererCls = Stage.renderers.get(props.renderer)
        if (RendererCls) {
            this.renderer = new RendererCls()
            await this.renderer.init({
                width: props.width ?? this.domElement.clientWidth,
                height: props.height ?? this.domElement.clientHeight,
                dpr: props.dpr ?? window.devicePixelRatio,
                ...(props.rendererConfig??{})
            })
            this.domElement.appendChild(this.renderer.domElement)
        }
        this.eventSystem = new PointerEventSystem({
            target: this.domElement,
            screenToWorld: (out, x, y, element) => {
                const rect = element.getBoundingClientRect()
                out.set(x - rect.left, y - rect.top)
                return out
            },
            hitTest: (e) => {
                return false
            }
        })
        this.eventSystem.attachEvents()
        this.emit('postInit', this)
        this.tick = this.tick.bind(this)
    }
    get width() {
        return this.renderer.width
    }
    get height() {
        return this.renderer.height
    }
    start() {
        Ticker.shared.add(this.tick)
        Ticker.shared.start()
    }
    stop() {
        Ticker.shared.remove(this.tick)
    }
    private updateDomElementSize(width: number, height: number) {
        this.domElement.style.width = width + 'px'
        this.domElement.style.height = height + 'px'
    }
    setSize(width: number, height: number, dpr?: number) {
        this.updateDomElementSize(width, height)
        this.renderer.setSize(width, height, dpr)
    }
    refresh() {
        this.needRendering = true
    }
    private render() {
        const delta=this.delta
        this.emit('beforeFrame', delta, this)
        this.renderer.render({})
        this.emit('afterFrame', delta, this)
        this.needRendering = false
    }
    private tick(delta: number) {
        this.delta=delta
        this.emit('tick', delta)
        if (this.needRendering) {
            this.render()
        }
    }
}