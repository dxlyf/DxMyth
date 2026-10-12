import { ExampleManager, Example, Canvas } from '../lib/Example'
import { PathBuilder } from 'src'

/** 形状构建参数 */
type ShapeParams = {
    sides: number
    points: number
    innerRatio: number
    petals: number
    height: number
    rotation: number
}

/** 画廊中展示的形状顺序 */
const GALLERY_SHAPES = ['rect', 'roundRect', 'ellipse', 'polygon', 'star', 'rose', 'heart', 'droplet'] as const

/** 交互示例可选形状 */
const DEMO_SHAPES = ['polygon', 'star', 'rose', 'heart', 'droplet', 'ellipse'] as const

/** 默认参数（旋转 0 表示使用各方法的默认朝向：往上） */
const DEFAULT_PARAMS: ShapeParams = {
    sides: 6,
    points: 5,
    innerRatio: 0.45,
    petals: 5,
    height: 1.6,
    rotation: 0,
}

class PathBuilderExample extends Example {
    name: string = 'PathBuilder'
    galleryCanvas: Canvas
    demoCanvas: Canvas

    init(): void {
        super.init()
        this.galleryCanvas = new Canvas(document.querySelector('#gallery') as HTMLCanvasElement, 500, 500)
        this.demoCanvas = new Canvas(document.querySelector('#demo') as HTMLCanvasElement, 500, 500)
    }

    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {
            shape: {
                label: 'shape',
                value: 'star',
                options: [...DEMO_SHAPES],
            },
            radius: {
                label: 'radius',
                value: 120,
                min: 20,
                max: 220,
                step: 1,
            },
            rotation: {
                label: 'rotation',
                value: 0,
                min: -Math.PI,
                max: Math.PI,
                step: 0.01,
            },
            // 以下参数按形状生效
            sides: {
                label: 'polygon sides',
                value: DEFAULT_PARAMS.sides,
                min: 3,
                max: 12,
                step: 1,
            },
            points: {
                label: 'star points',
                value: DEFAULT_PARAMS.points,
                min: 2,
                max: 12,
                step: 1,
            },
            innerRatio: {
                label: 'star inner ratio',
                value: DEFAULT_PARAMS.innerRatio,
                min: 0.1,
                max: 0.95,
                step: 0.01,
            },
            petals: {
                label: 'rose petals',
                value: DEFAULT_PARAMS.petals,
                min: 1,
                max: 16,
                step: 1,
            },
            height: {
                label: 'droplet height',
                value: DEFAULT_PARAMS.height,
                min: 1,
                max: 3,
                step: 0.05,
            },
            fillColor: {
                label: 'fill',
                value: '#4f8cff',
            },
            strokeColor: {
                label: 'stroke',
                value: '#1b2a4a',
            },
            showBounds: {
                label: 'show bounds',
                value: true,
            },
            showPoints: {
                label: 'show points',
                value: false,
            },
        }
    }

    /**
     * 根据形状名和参数构建路径
     *
     * 旋转约定：rotation = 0 时使用各方法的默认朝向（polygon/star/rose 朝上），
     * 因此这里对需要“朝上基准”的形状额外叠加 -Math.PI / 2。
     */
    private buildShape(path: PathBuilder, shape: string, cx: number, cy: number, radius: number, p: ShapeParams): void {
        switch (shape) {
            case 'rect':
                path.rect(cx - radius, cy - radius, radius * 2, radius * 2)
                break
            case 'roundRect':
                path.roundRect(cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.3)
                break
            case 'ellipse':
                path.ellipse(cx, cy, radius, radius * 0.7, 0, 0, Math.PI * 2)
                break
            case 'polygon':
                path.polygon(cx, cy, radius, p.sides, -Math.PI / 2 + p.rotation)
                break
            case 'star':
                path.star(cx, cy, radius, radius * p.innerRatio, p.points, -Math.PI / 2 + p.rotation)
                break
            case 'rose':
                path.rose(cx, cy, radius, p.petals, -Math.PI / 2 + p.rotation)
                break
            case 'heart':
                path.heart(cx, cy, radius, p.rotation)
                break
            case 'droplet':
                path.droplet(cx, cy, radius, radius * p.height)
                break
        }
    }

    /** 左侧画布：所有形状方法的静态画廊 */
    private drawGallery(ctx: CanvasRenderingContext2D): void {
        const cols = 4
        const rows = 2
        const cellW = 500 / cols
        const cellH = 500 / rows
        const radius = Math.min(cellW, cellH) * 0.32

        GALLERY_SHAPES.forEach((shape, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const cx = cellW * (col + 0.5)
            const cy = cellH * (row + 0.5)

            const path = new PathBuilder()
            this.buildShape(path, shape, cx, cy, radius, DEFAULT_PARAMS)

            const hue = Math.round((360 / GALLERY_SHAPES.length) * i)
            ctx.save()
            ctx.beginPath()
            path.applyContext(ctx)
            ctx.fillStyle = `hsl(${hue}, 70%, 62%)`
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = `hsl(${hue}, 65%, 35%)`
            ctx.stroke()
            ctx.restore()

            ctx.save()
            ctx.fillStyle = '#333'
            ctx.font = '13px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(shape, cx, cy + radius + 24)
            ctx.restore()
        })
    }

    /** 右侧画布：GUI 控制单个形状，展示 fill / stroke / 包围盒 / 采样点 */
    private drawDemo(ctx: CanvasRenderingContext2D): void {
        const s = this.state
        const cx = 250
        const cy = 250

        const path = new PathBuilder()
        this.buildShape(path, s.shape, cx, cy, s.radius, {
            sides: s.sides,
            points: s.points,
            innerRatio: s.innerRatio,
            petals: s.petals,
            height: s.height,
            rotation: s.rotation,
        })

        ctx.save()
        ctx.beginPath()
        path.applyContext(ctx)
        ctx.fillStyle = s.fillColor
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = s.strokeColor
        ctx.stroke()
        ctx.restore()

        if (s.showBounds) {
            const b = path.computeBounds()
            if (b && !b.isEmpty()) {
                ctx.save()
                ctx.setLineDash([5, 5])
                ctx.lineWidth = 1
                ctx.strokeStyle = '#ff3b30'
                ctx.strokeRect(b.x, b.y, b.width, b.height)
                ctx.restore()
            }
        }

        if (s.showPoints) {
            const polygons = path.toPolygons()
            ctx.save()
            ctx.fillStyle = '#0a84ff'
            polygons.forEach(poly => {
                poly.forEach(pt => {
                    ctx.beginPath()
                    ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2)
                    ctx.fill()
                })
            })
            ctx.restore()
        }
    }

    render(): void {
        this.galleryCanvas.draw((ctx) => this.drawGallery(ctx))
        this.demoCanvas.draw((ctx) => this.drawDemo(ctx))
    }

    onChange(): void {
        this.render()
    }

    enter(): void {
        super.enter()
        this.render()
    }
}

ExampleManager.create({ examples: [PathBuilderExample] }).init()
