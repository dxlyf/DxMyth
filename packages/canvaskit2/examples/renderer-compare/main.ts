/**
 * CanvasRenderer vs CanvasKitRenderer 渲染对比示例
 *
 * 创建两个 Engine 实例：
 *   - 左侧: renderType='canvas'   （原生 Canvas 2D）
 *   - 右侧: renderType='canvaskit' （Skia WASM）
 * 两侧通过 createScene() 工厂构建完全相同的场景，用于视觉对比。
 *
 * 运行: npm run dev 后访问 http://localhost:8428/examples/renderer-compare/
 */
import {
    Engine,
    Group,
    Rect,
    Ellipse,
    Star,
    Polyline,
    Text,
} from '../../src/index'
import { LinearGradient } from '../../src/core/Gradient'
import type { Element } from '../../src/core/Element'

const VIEW_W = 420
const VIEW_H = 420

/**
 * 构建一份场景元素（每次调用返回全新实例，供单个 engine 使用）。
 * 包含各类渲染特性以充分对比两种渲染器：
 *   1. strokeAlign: center / outside / inside
 *   2. 圆角矩形 (roundRect)
 *   3. 椭圆 (描边)
 *   4. 五角星 (路径型 fill+stroke)
 *   5. 线性渐变填充
 *   6. 文本 (fill)
 *   7. 虚线折线 (lineDash)
 *   8. 旋转动画组 (transform + tick 更新)
 *   9. 半透明元素 (opacity)
 */
function createScene(): { elements: Element[]; animated: Element[] } {
    const elements: Element[] = []
    const animated: Element[] = []

    // ---- 行1: strokeAlign 三种对齐 ----
    const aligns: Array<{ x: number; align: 'center' | 'outside' | 'inside' }> = [
        { x: 24, align: 'center' },
        { x: 116, align: 'outside' },
        { x: 208, align: 'inside' },
    ]
    for (const a of aligns) {
        elements.push(new Rect({
            position: { x: a.x, y: 24 },
            style: {
                fillStyle: '#ff6b6b',
                strokeStyle: '#1a1a2e',
                lineWidth: 8,
                strokeAlign: a.align,
            },
            shape: { width: 72, height: 56 },
        }))
        elements.push(new Text({
            position: { x: a.x, y: 96 },
            style: { fillStyle: '#888', fontSize: 11, textAlign: 'center' },
            shape: { text: a.align, x: 36, y: 0 },
        }))
    }

    // ---- 行1 右: 圆角矩形 ----
    elements.push(new Rect({
        position: { x: 300, y: 24 },
        style: { fillStyle: '#51cf66', strokeStyle: '#1a1a2e', lineWidth: 3 },
        shape: { width: 72, height: 56, radius: 16 },
    }))
    elements.push(new Text({
        position: { x: 300, y: 96 },
        style: { fillStyle: '#888', fontSize: 11, textAlign: 'center' },
        shape: { text: 'roundRect', x: 36, y: 0 },
    }))

    // ---- 行2: 椭圆 ----
    elements.push(new Ellipse({
        position: { x: 60, y: 150 },
        style: { fillStyle: '#ffe066', strokeStyle: '#1a1a2e', lineWidth: 4 },
        shape: { radiusX: 36, radiusY: 48 },
    }))
    elements.push(new Text({
        position: { x: 24, y: 214 },
        style: { fillStyle: '#888', fontSize: 11 },
        shape: { text: 'ellipse', x: 0, y: 0 },
    }))

    // ---- 行2: 五角星 ----
    elements.push(new Star({
        position: { x: 168, y: 150 },
        style: { fillStyle: '#ff922b', strokeStyle: '#1a1a2e', lineWidth: 3 },
        shape: { outerRadius: 44, innerRadius: 18, points: 5 },
    }))

    // ---- 行2: 线性渐变 ----
    const grad = new LinearGradient(0, 0, 72, 72)
    grad.addColorStop(0, '#ff006e')
    grad.addColorStop(0.5, '#8338ec')
    grad.addColorStop(1, '#3a86ff')
    elements.push(new Rect({
        position: { x: 232, y: 120 },
        style: { fillStyle: grad, strokeStyle: '#1a1a2e', lineWidth: 2 },
        shape: { width: 72, height: 72 },
    }))
    elements.push(new Text({
        position: { x: 232, y: 214 },
        style: { fillStyle: '#888', fontSize: 11 },
        shape: { text: 'gradient', x: 0, y: 0 },
    }))

    // ---- 行2 右: 文本 ----
    elements.push(new Text({
        position: { x: 320, y: 150 },
        style: {
            fillStyle: '#74c0fc',
            strokeStyle: '#1a1a2e',
            lineWidth: 1,
            fontSize: 28,
            fontWeight: 'bold',
            textBaseline: 'middle',
        },
        shape: { text: 'Skia', x: 0, y: 0 },
    }))

    // ---- 行3: 虚线折线 ----
    elements.push(new Polyline({
        position: { x: 24, y: 250 },
        style: {
            fillStyle: 'none',
            strokeStyle: '#e64980',
            lineWidth: 4,
            lineDash: [10, 6],
            lineCap: 'round',
            lineJoin: 'round',
        },
        shape: { points: [0, 0, 50, 30, 100, -10, 150, 20] },
    }))
    elements.push(new Text({
        position: { x: 24, y: 292 },
        style: { fillStyle: '#888', fontSize: 11 },
        shape: { text: 'dash polyline', x: 0, y: 0 },
    }))

    // ---- 行3: 旋转动画组 ----
    const spinGroup = new Group()
    spinGroup.position.set(300, 280)
    spinGroup.add(new Rect({
        position: { x: -28, y: -28 },
        style: { fillStyle: '#20c997', strokeStyle: '#1a1a2e', lineWidth: 2 },
        shape: { width: 56, height: 56, radius: 8 },
    }))
    spinGroup.add(new Ellipse({
        position: { x: 40, y: 0 },
        style: { fillStyle: '#cc5de8', strokeStyle: '#1a1a2e', lineWidth: 2 },
        shape: { radiusX: 16, radiusY: 24 },
    }))
    elements.push(spinGroup)
    animated.push(spinGroup)
    elements.push(new Text({
        position: { x: 260, y: 332 },
        style: { fillStyle: '#888', fontSize: 11 },
        shape: { text: 'rotating group', x: 0, y: 0 },
    }))

    // ---- 行4: 半透明叠加 ----
    elements.push(new Rect({
        position: { x: 24, y: 330 },
        style: { fillStyle: '#ff6b6b', opacity: 0.5 },
        shape: { width: 50, height: 50 },
    }))
    elements.push(new Rect({
        position: { x: 54, y: 350 },
        style: { fillStyle: '#4dabf7', opacity: 0.5 },
        shape: { width: 50, height: 50 },
    }))
    elements.push(new Text({
        position: { x: 120, y: 360 },
        style: { fillStyle: '#888', fontSize: 11 },
        shape: { text: 'opacity 0.5', x: 0, y: 0 },
    }))

    return { elements, animated }
}

/**
 * 初始化一个 engine 并把场景加入其 scene。
 * 返回 animated 元素列表供外部驱动动画。
 */
async function setupEngine(
    renderType: 'canvas' | 'canvaskit',
    container: HTMLElement,
): Promise<{ engine: Engine; animated: Element[] }> {
    const engine = new Engine()
    await engine.initialize({
        renderType,
        container,
        width: VIEW_W,
        height: VIEW_H,
        backgroundColor: '#f8f9fa',
    })
    const { elements, animated } = createScene()
    for (const el of elements) engine.add(el)
    return { engine, animated }
}

const init = async () => {
    const canvasPanel = document.getElementById('canvas-panel')!
    const ckPanel = document.getElementById('canvaskit-panel')!

    // 同时初始化两个引擎
    const [left, right] = await Promise.all([
        setupEngine('canvas', canvasPanel),
        setupEngine('canvaskit', ckPanel),
    ])

    // 旋转动画：每 tick 更新两个引擎中对应 group 的 rotation
    let angle = 0
    left.engine.on('tick', (delta: number) => {
        angle += delta * 0.001 // 弧度/ms
        for (const el of left.animated) el.rotation = angle
        for (const el of right.animated) el.rotation = angle
        left.engine.refresh()
        right.engine.refresh()
    })
}

init().catch((e) => {
    console.error('对比示例初始化失败:', e)
    document.body.innerHTML += `<pre style="color:#ff6b6b;padding:12px;">初始化失败: ${e?.message || e}</pre>`
})
