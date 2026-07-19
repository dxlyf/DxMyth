/**
 * 渲染器性能测试示例（框架驱动模式）
 *
 * 目标：验证框架级性能优化效果。使用引擎元素树（Rect 元素 + Scene + Engine 自动渲染）
 * 的标准方式，5000+ 移动矩形在 Canvas/CanvasKit 两种渲染器下达到 40 FPS+。
 *
 * 框架优化点（对所有基于框架的应用自动受益）：
 *   1. ElementFlags：TRANSFORM 不再触发 REFLOW，移动元素不每帧重建 renderElements + 排序 + rtree
 *   2. CanvasKit 批量渲染：同色 batchable shape 用 PathBuilder 累积 world 坐标，一次 drawPath
 *      （5000 矩形 10 色 → 10 次 draw call，从 5000 次降下来）
 *   3. Canvas 批量渲染：同色 batchable shape 按颜色分组 fillRect，一次 fillStyle 切换
 *   4. Shape.isBatchable：纯色 fill + 无 stroke/clip/shadow + opacity=1 + worldMatrix 纯平移
 *
 * 运行: npm run dev 后访问 http://localhost:8429/examples/performance/
 */
import { Engine } from '../../src/index'
import { Rect } from '../../src/scene/Rect'

const VIEW_W = 900
const VIEW_H = 600
const MAX_COUNT = 8000
const COLORS = [
    '#ff6b6b', '#f59f00', '#fcc419', '#94d82d', '#51cf66',
    '#20c997', '#22b8cf', '#4dabf7', '#9775fa', '#f783ac',
]
const BG_COLOR = '#0d1117'

// ==================== SoA 数据（TypedArray，存速度） ====================
// 位置由 Rect.position 持有，速度用 TypedArray 存储
const vxs = new Float32Array(MAX_COUNT) // px/ms
const vys = new Float32Array(MAX_COUNT)

// ==================== 状态 ====================
let engine: Engine | null = null
let currentRenderer: 'canvas' | 'canvaskit' = 'canvas'
let currentCount = 1000
let rects: Rect[] = []

// ==================== FPS / 帧耗时统计 ====================
let frameCount = 0
let timeAccum = 0
let curFps = 0
const fpsHistory: number[] = []
let avgFps = 0

let renderTimeAccum = 0
let renderFrameCount = 0
let avgRenderMs = 0

// ==================== UI 引用 ====================
const $fps = document.getElementById('fps')!
const $avgFps = document.getElementById('avg-fps')!
const $renderMs = document.getElementById('render-ms')!
const $countDisplay = document.getElementById('count-display')!
const $status = document.getElementById('status')!
const $stage = document.getElementById('stage')!

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

/**
 * 创建 count 个 Rect 元素加入 Scene，每个矩形颜色随机（不按颜色分组）。
 * shape.x/y 固定为 0，用 position.set 控制世界位置（worldMatrix 纯平移，满足 isBatchable）。
 * 颜色随机分布更贴近真实场景，框架批量渲染仍会自动按颜色聚合同色元素降 draw call。
 */
function createScene(count: number): void {
    for (let idx = 0; idx < count; idx++) {
        const w = rand(8, 24)
        const h = rand(8, 24)
        const color = COLORS[(Math.random() * COLORS.length) | 0]
        const rect = new Rect({
            shape: { x: 0, y: 0, width: w, height: h },
            style: { fillStyle: '#'+Math.random().toString(16).slice(-6) },
        })
        rect.position.set(rand(0, VIEW_W - w), rand(0, VIEW_H - h))
        const speed = rand(0.04, 0.12) // px/ms → 约 40~120 px/s
        const angle = rand(0, Math.PI * 2)
        vxs[idx] = Math.cos(angle) * speed
        vys[idx] = Math.sin(angle) * speed
        engine!.scene.add(rect)
        rects.push(rect)
    }
}

/**
 * 更新所有 Rect 位置，边界镜像反弹。
 * position.set 触发 TRANSFORM flag → WORLD_BOUNDS + REPAINT（不再触发 REFLOW）。
 */
function updatePositions(delta: number): void {
    const n = currentCount
    for (let i = 0; i < n; i++) {
        const r = rects[i]
        const w = r.props.shape.width
        const h = r.props.shape.height
        let nx = r.position.x + vxs[i] * delta
        let ny = r.position.y + vys[i] * delta
        if (nx < 0) {
            nx = -nx
            vxs[i] = -vxs[i]
        } else if (nx + w > VIEW_W) {
            nx = 2 * (VIEW_W - w) - nx
            vxs[i] = -vxs[i]
        }
        if (ny < 0) {
            ny = -ny
            vys[i] = -vys[i]
        } else if (ny + h > VIEW_H) {
            ny = 2 * (VIEW_H - h) - ny
            vys[i] = -vys[i]
        }
        r.position.set(nx, ny)
    }
}

/**
 * 初始化 engine + 场景元素 + tick 回调。
 */
async function setupEngine(): Promise<void> {
    engine = new Engine()
    await engine.initialize({
        renderType: currentRenderer,
        container: $stage,
        width: VIEW_W,
        height: VIEW_H,
        backgroundColor: BG_COLOR,
    })

    createScene(currentCount)

    // tick：更新位置 + 触发重绘 + FPS 统计
    // refresh 设置 needRender=true，Engine.tick 同一帧内检查 needRender 后调用 render()
    engine.on('tick', (delta: number) => {
        updatePositions(delta)
        engine!.refresh()

        // FPS 统计（基于 tick 间隔，反映真实帧率）
        frameCount++
        timeAccum += delta
        if (timeAccum >= 500) {
            curFps = (frameCount * 1000) / timeAccum
            fpsHistory.push(curFps)
            if (fpsHistory.length > 60) fpsHistory.shift()
            let sum = 0
            for (let i = 0; i < fpsHistory.length; i++) sum += fpsHistory[i]
            avgFps = sum / fpsHistory.length
            frameCount = 0
            timeAccum = 0
        }
        updateStats()
    })

    // 精确测量 render 耗时（render:before / render:after 之间）
    let renderStart = 0
    engine.on('render:before', () => { renderStart = performance.now() })
    engine.on('render:after', () => {
        const ms = performance.now() - renderStart
        renderTimeAccum += ms
        renderFrameCount++
        if (renderFrameCount >= 30) {
            avgRenderMs = renderTimeAccum / renderFrameCount
            renderTimeAccum = 0
            renderFrameCount = 0
        }
    })

    $status.textContent = `运行中 · ${currentRenderer} · ${currentCount}`
    updateStats()
}

function updateStats(): void {
    $fps.textContent = Math.round(curFps).toString()
    $avgFps.textContent = Math.round(avgFps).toString()
    $renderMs.innerHTML = `${avgRenderMs.toFixed(1)}<span class="unit">ms</span>`
    $countDisplay.textContent = currentCount.toString()
}

/**
 * 销毁旧 engine + 清理 Rect 引用，重置统计，重建。
 */
async function rebuild(): Promise<void> {
    if (engine) {
        engine.destroy()
        engine = null
    }
    rects = []
    $stage.innerHTML = ''
    // 重置统计
    frameCount = 0
    timeAccum = 0
    curFps = 0
    fpsHistory.length = 0
    avgFps = 0
    renderTimeAccum = 0
    renderFrameCount = 0
    avgRenderMs = 0
    $status.textContent = `加载中 · ${currentRenderer} · ${currentCount}...`
    try {
        await setupEngine()
    } catch (e: any) {
        $status.textContent = `错误: ${e?.message || e}`
        console.error(e)
    }
}

function bindUI(): void {
    const rendererBtns = document.querySelectorAll<HTMLButtonElement>('button[data-renderer]')
    rendererBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const r = btn.dataset.renderer as 'canvas' | 'canvaskit'
            if (r === currentRenderer) return
            currentRenderer = r
            rendererBtns.forEach((b) => b.classList.toggle('active', b === btn))
            rebuild()
        })
    })
    const countBtns = document.querySelectorAll<HTMLButtonElement>('button[data-count]')
    countBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const c = parseInt(btn.dataset.count!, 10)
            if (c === currentCount) return
            currentCount = c
            countBtns.forEach((b) => b.classList.toggle('active', b === btn))
            rebuild()
        })
    })
    rendererBtns.forEach((b) => b.classList.toggle('active', b.dataset.renderer === currentRenderer))
    countBtns.forEach((b) => b.classList.toggle('active', parseInt(b.dataset.count!, 10) === currentCount))
}

bindUI()
rebuild().catch((e) => {
    console.error('性能测试初始化失败:', e)
    $status.textContent = `初始化失败: ${e?.message || e}`
})
