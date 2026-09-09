import { EventEmitter,Stats,PointerEventSystem } from 'src'
import { GUI } from 'lil-gui'

type ExampleState = {
    type?: string
    min?: number
    max?: number
    step?: number
    options?: string[]
}
type ExampleEvent = {x: number, y: number, type: string}
type ExampleEvents = {
    pointerdown: [e:ExampleEvent]
    pointermove: [e:ExampleEvent]
    pointerup: [e:ExampleEvent]
}
export class Example  extends EventEmitter<ExampleEvents>{
    gui: GUI
    name: string
    inited: boolean = false
    owner: ExampleManager
    declare state: Record<string, any>
    declare stateOptions: Record<string, ExampleState>
    constructor(owner: ExampleManager) {
        super()
        this.owner = owner
        this.handlePointer = this.handlePointer.bind(this)
    }
    init() {
    }
    initGui(gui: GUI) {
        this.gui = gui
        if (!this.state) {
            return
        }
        this.buildStateGui(gui, this.state, this.stateOptions)
    }
    handlePointer(e: PointerEvent) {
        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const newE = { x, y, type: e.type }
        this.onPointer(newE);
        (this as any)['on' + e.type[0].toUpperCase() + e.type.slice(1)]?.(newE)
        this.emit(e.type as keyof ExampleEvents, newE)
    }
    onPointer(e: { x: number, y: number, type: string }) {
        // console.log(e)
    }

    attachPointerEvents(dom: HTMLElement) {
        ['pointerdown', 'pointermove', 'pointerup'].forEach(item => {
            dom.addEventListener(item as any, this.handlePointer)
        })
    }
    detachPointerEvents(dom: Element) {
        ['pointerdown', 'pointermove', 'pointerup'].forEach(item => {
            dom.removeEventListener(item as any, this.handlePointer)
        })
    }
    buildStateGui(gui: GUI, state: any, stateOptions: any) {
        Object.keys(state).forEach(key => {
            const value = state[key]
            let valueType = typeof value
            const config: ExampleState = { type: valueType, min: 0, max: 1000, step: 1, ...(stateOptions?.[key] || {}) }
            if (valueType === 'string' && (value as string).startsWith('#')) {
                config.type = 'color'
            }
            if (config.options) {
                config.type = 'select'
            }
            if (Object.prototype.toString.call(value) === '[object Array]') {
                config.type = 'array'
            }
            if (Object.prototype.toString.call(value) === '[object Object]') {
                config.type = 'object'
            }
            if (config.type === 'number') {
                gui.add(state, key, config.min, config.max, config.step)
            } else if (config.type === 'color') {
                gui.addColor(state, key)
            } else if (config.type === 'select') {
                gui.add(state, key, config.options)
            } else if (config.type === 'object') {
                const folder = gui.addFolder(key)
                this.buildStateGui(folder, value, stateOptions?.[key])
            }
            else {
                gui.add(state, key)
            }

        })
    }
    onStateChange(e: {
        object: object;
        property: string;
        value: any;
        controller: any
    }) {

    }
    enter() { }
    exit() { }
    update() { }
    render() { }
    destroy() { }
}

export class ExampleManager {
    static create(examples: { new(owner: ExampleManager): Example }[]) {
        return new ExampleManager(examples)
    }
    examples: Example[] = []
    gui: GUI = new GUI()
    stats: Stats = new Stats()
    currentExample: Example = null!
    animationId: number = -1
    needsUpdateRender: boolean = false
    constructor(examples: { new(owner: ExampleManager): Example }[]) {
        document.body.appendChild(this.gui.domElement)
        this.tick = this.tick.bind(this)
        this.onStateChange = this.onStateChange.bind(this)
        this.examples = examples.map(item => new item(this))
        const exampleControl = this.gui.add(this, 'example', this.examples.map(item => item.name))
        this.activeExample(this.examples[0].name)
        exampleControl.updateDisplay()
        this.gui.onChange(this.onStateChange)
        document.body.appendChild(this.stats.dom)
    }
    get example() {
        return this.currentExample?.name || ''
    }
    set example(value: string) {
        this.activeExample(value)
    }
    activeExample(name: string) {
        if (this.currentExample) {
            this.currentExample.gui.destroy()
            this.currentExample.gui = null
            this.currentExample.exit()
        }
        this.currentExample = this.examples.find(item => item.name === name)
        if (!this.currentExample.inited) {
            this.currentExample.inited = true
            this.currentExample.init()
        }
        this.currentExample.initGui(this.gui.addFolder(this.currentExample.name))
        this.currentExample.enter()
        this.refresh()
        this.startTick()
    }
    startTick() {
        if (this.animationId > -1) {
            cancelAnimationFrame(this.animationId)
        }
        this.animationId = requestAnimationFrame(this.tick)
    }
    stopTick() {
        if (this.animationId > -1) {
            cancelAnimationFrame(this.animationId)
            this.animationId = -1
        }
    }
    tick() {
        this.stats.update()
        this.update()
        if (this.needsUpdateRender) {
            this.render()
            this.needsUpdateRender = false
        }
        requestAnimationFrame(this.tick)
    }
    update() {
        this.currentExample.update()
    }
    render() {
        this.currentExample.render()
    }
    refresh() {
        this.needsUpdateRender = true
    }
    onStateChange(e: { object: object; property: string; value: any; controller: any; }): void {
        this.currentExample.onStateChange(e)
        this.refresh()
    }
    destroy() {
        this.stopTick()
        this.gui.destroy()
        this.examples.forEach(item => item.exit())
        this.examples.forEach(item => item.destroy())
    }
}


export class CanvasExample extends Example {
    name: string = 'Canvas'
    createCanvas(width: number, height: number, dpr: number = 1) {
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        return canvas
    }
    leftCanvas: HTMLCanvasElement = null!
    rightCanvas: HTMLCanvasElement = null!
    leftCtx: CanvasRenderingContext2D = null!
    rightCtx: CanvasRenderingContext2D = null!
    dpr: number = window.devicePixelRatio
    init() {
    }
    enter(): void {
        const nativeCanvas = this.createCanvas(400, 400, this.dpr)
        const pathkitCanvas = this.createCanvas(400, 400, this.dpr)
        document.body.appendChild(nativeCanvas)
        document.body.appendChild(pathkitCanvas)
        this.leftCanvas = nativeCanvas
        this.rightCanvas = pathkitCanvas
        this.leftCtx = nativeCanvas.getContext('2d')!
        this.rightCtx = pathkitCanvas.getContext('2d')!
        this.attachPointerEvents(this.leftCanvas)
        this.attachPointerEvents(this.rightCanvas)

    }
    clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    save(ctx: CanvasRenderingContext2D) {
        ctx.save()
    }
    restore(ctx: CanvasRenderingContext2D) {
        ctx.restore()
    }
    draw(id: string, ctx: CanvasRenderingContext2D) {

    }
    render(): void {
        this.clear(this.leftCtx)
        this.clear(this.rightCtx)
        this.save(this.leftCtx)
        this.save(this.rightCtx)
        this.leftCtx.scale(this.dpr, this.dpr)
        this.rightCtx.scale(this.dpr, this.dpr)
        this.draw('left', this.leftCtx)
        this.draw('right', this.rightCtx)

        this.restore(this.leftCtx)
        this.restore(this.rightCtx)
    }
    onStateChange(e: { object: object; property: string; value: any; controller: any; }): void {

    }
    exit(): void {
        this.detachPointerEvents(this.leftCanvas)
        this.detachPointerEvents(this.rightCanvas)
        document.body.removeChild(this.leftCtx.canvas)
        document.body.removeChild(this.rightCtx.canvas)
    }
    destroy(): void {

    }
}
