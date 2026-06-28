import GUI from 'lil-gui'

/**
 * 示例基类。
 *
 * 与 canvaskit 版不同，canvas 包没有 scene-graph 引擎，
 * 示例直接在 CanvasRenderingContext2D 上绘制。
 * 子类需实现 enter / onChange / onUpdate（如需每帧动画）。
 */
export class ExampleBase {
    static uid = 0
    static title: string
    title: string
    owner: ExampleManager
    gui: GUI
    uid: number
    active = false
    state: Record<string, any> = {}
    stateOptions: Record<string, any> = {}

    constructor() {
        this.uid = ExampleBase.uid++
        this.state = this.getDefaultState()
    }

    createTransformState(position = [0, 0], scale = [1, 1], angle = 0) {
        return { position, scale, angle }
    }

    getDefaultState() {
        return { ...this.state }
    }

    /** 把 state 注册到 gui，数组展开为 x/y，颜色用 addColor，其余按类型推断 */
    initGuiState() {
        const state = this.state
        for (const [key, value] of Object.entries(state)) {
            if (Array.isArray(value)) {
                const folder = this.gui.addFolder(key)
                if (value.length === 2) {
                    folder.add(value, 0).name('x')
                    folder.add(value, 1).name('y')
                } else if (value.length === 4) {
                    folder.add(value, 0).name('x')
                    folder.add(value, 1).name('y')
                    folder.add(value, 2).name('w')
                    folder.add(value, 3).name('h')
                }
            } else if (this.stateOptions[key]) {
                this.gui.add(state, key, this.stateOptions[key])
            } else if (typeof value === 'string' && value.startsWith('#')) {
                this.gui.addColor(state, key)
            } else {
                this.gui.add(state, key)
            }
        }
    }

    /** 示例被激活时调用，子类在此创建初始状态并触发首次渲染 */
    enter() { }

    /** 示例被切换走时调用，子类可在此清理资源 */
    exit() { }

    /** gui 控件变化时调用，子类在此把 state 应用到画布 */
    onChange(property: string, value: any) { }

    /** 每帧调用（仅当 owner 启用 raf 时） */
    onUpdate() { }

    refresh() {
        this.owner.refresh()
    }

    destroy() { }
}

/**
 * 示例管理器：维护示例列表、提供共享 Canvas2D 上下文、切换激活示例。
 *
 * 与 canvaskit 版相比：
 * - 不依赖 CKEngine / scene-graph，直接在 ctx 上绘制；
 * - 渲染驱动由示例自行调用 refresh() 触发（同步重绘），
 *   或通过 startRaf 进入 requestAnimationFrame 循环（动画类示例）。
 */
export class ExampleManager {
    static getSingleInstance() {
        if (!this._instance) {
            this._instance = new ExampleManager()
        }
        return this._instance
    }
    static examples: typeof ExampleBase[] = []
    private static _instance: ExampleManager = null

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    gui: GUI
    examples: Map<string, ExampleBase> = new Map()
    currentExample: ExampleBase = null

    private rafId = 0
    private rafRunning = false

    constructor() {
        if (ExampleManager.examples.length > 0) {
            this.addExamples(ExampleManager.examples)
        }
    }

    /** 初始化：绑定 canvas、创建 gui、注册示例列表 */
    async init(options: { canvas: HTMLCanvasElement } = { canvas: document.querySelector('#canvas') }) {
        this.canvas = options.canvas
        this.ctx = this.canvas.getContext('2d')!
        this.gui = new GUI()
        this.gui.onChange(({ property, value }) => {
            if (property !== 'currentExampleName' && this.currentExample) {
                this.currentExample.onChange(property, value)
                this.refresh()
            }
        })
        await this.initExamples()
        const select = this.gui.add(this, 'currentExampleName', Array.from(this.examples.keys())).name('examples')
        if (this.examples.size > 0) {
            const arr = Array.from(this.examples.values())
            const cur = arr.find(d => d.active) || arr[0]
            select.setValue(cur.title)
        }
        return this
    }

    async initExamples() {
        // 仅做一次性初始化（如加载资源）；enter() 在 activeExample 时才调用
        for (const ex of this.examples.values()) {
            await (ex as any).init?.()
        }
    }

    get currentExampleName() {
        return this.currentExample?.title
    }
    set currentExampleName(name: string) {
        this.activeExample(name)
    }

    addExamples(examples: typeof ExampleBase[]) {
        examples.forEach(E => this.addExample(E))
    }
    addExample(Example: typeof ExampleBase) {
        const name = Example.title || (Example as any).prototype.title
        if (this.examples.has(name)) return
        const ex = new Example()
        ex.owner = this
        ex.title = name
        this.examples.set(name, ex)
    }
    hasExample(name: string) {
        return this.examples.has(name)
    }

    activeExample(name: string) {
        const ex = this.examples.get(name)
        if (!ex || ex === this.currentExample) return
        if (this.currentExample) {
            this.currentExample.gui?.destroy()
            this.currentExample.gui = null
            this.currentExample.exit()
        }
        ex.gui?.destroy()
        ex.gui = this.gui.addFolder(ex.title)
        ex.initGuiState()
        ex.enter()
        this.currentExample = ex
        this.refresh()
    }

    /** 同步重绘当前示例（清空画布后调用 onUpdate） */
    refresh() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.currentExample?.onUpdate()
    }

    /** 启动 requestAnimationFrame 循环，适合动画类示例 */
    startRaf() {
        if (this.rafRunning) return
        this.rafRunning = true
        const loop = () => {
            if (!this.rafRunning) return
            this.refresh()
            this.rafId = requestAnimationFrame(loop)
        }
        this.rafId = requestAnimationFrame(loop)
    }
    stopRaf() {
        this.rafRunning = false
        if (this.rafId) cancelAnimationFrame(this.rafId)
        this.rafId = 0
    }

    destroy() {
        this.stopRaf()
        this.examples.forEach(e => e.destroy())
        this.examples.clear()
        this.gui.destroy()
    }
}
