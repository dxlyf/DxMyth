
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Line, CKPath2D, getCanvasKit, ck } from 'src'
import { Conic, PaintStyle, PathBuilder, Point, } from '@dxyl/math2'
import mitt from 'node_modules/@dxyl/math2/types/events/mitt'
import { toFillRule } from 'src/ck/convert'
class BaseExample extends Example {
    canvas: Canvas
    async init() {
        super.init()
        await getCanvasKit()
        this.canvas = new Canvas(document.querySelector('#canvas'), 500, 500)
    }
    draw(ctx: CanvasRenderingContext2D) {

    }
    render() {
        this.canvas.draw((ctx) => {
            this.draw(ctx)
        })
    }
    onChange(): void {
        this.render()
    }
    enter(): void {
        super.enter()
        this.render()
    }
}
class ConicExample extends BaseExample {
    getState() {
        return {
            x0: {
                value: 50,
                min: 0,
                max: 300
            },
            y0: {
                value: 200,
                min: 0,
                max: 300
            },
            x1: {
                value: 150,
                min: 0,
                max: 300
            },
            y1: {
                value: 100,
                min: 0,
                max: 300
            }, x2: {
                value: 250,
                min: 0,
                max: 300
            },
            y2: {
                value: 200,
                min: 0,
                max: 300
            },
            w: {
                value: 1,
                step: 0.1,
                min: 0,
                max: 2
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        const p = new PathBuilder()

        const conic = new Conic([Point.create(this.state.x0, this.state.y0), Point.create(this.state.x1, this.state.y1), Point.create(this.state.x2, this.state.y2)], this.state.w)

        const quadraticBeziers = conic.toQuadraticBeziers()
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle='#ff0000'
        console.log('quadraticBeziers', quadraticBeziers)
        p.moveTo(this.state.x0, this.state.y0)
        for (let i = 0; i < quadraticBeziers.length; i++) {
            const [p0, p1, p2] = quadraticBeziers[i]
            p.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y)
        }
        p.applyContext(ctx)
        ctx.stroke()
        ctx.restore()

        ctx.save()
        const p2 = new PathBuilder()
        ctx.beginPath()
          ctx.strokeStyle='#0000ff'
        p2.moveTo(this.state.x0, this.state.y0)
        p2.conicTo(this.state.x1, this.state.y1, this.state.x2, this.state.y2, this.state.w)

        p2.applyContext(ctx)
        ctx.stroke()
        ctx.restore()



           const p3 = new CKPath2D()
           ctx.save()
        ctx.beginPath()
          ctx.strokeStyle='#00ff00'
        p3.moveTo(this.state.x0, this.state.y0)
        p3.conicTo(this.state.x1, this.state.y1, this.state.x2, this.state.y2, this.state.w)

        console.log('p3',p3.fillPath.toSVGString())
        ctx.stroke(new Path2D(p3.fillPath.toSVGString()))
        ctx.restore()
    }

}

class CKPathBuildExample extends BaseExample {
    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; value?: any; options?: any[] }> {
        return {
            strokeAlign: { label: '边框对齐', value: 'center', options: ['center', 'outside', 'inside'] },
            lineWidth: { label: '线宽', value: 10, min: 1, max: 20 },
            lineJoin: { label: '线帽', value: 'miter', options: ['miter', 'round', 'butt'] },
            lineCap: { label: '线帽', value: 'butt', options: ['round', 'butt', 'square'] },
            miterLimit: { label: 'miterLimit', value: 10, min: 1, max: 20 },
            fillStyle: { label: '填充颜色', value: '#00ffff' },
            strokeStyle: { label: '边框颜色', value: '#ff0000' },
            paintStyle: { value: 'fill', options: ['fill', 'stroke', 'fillAndStroke'] },
            fillRule: { label: '填充规则', value: 'nonzero', options: ['evenodd', 'nonzero'] },
            showBounds: { label: '显示边界', value: false },
            showStrokeBounds: { label: '显示边框边界', value: false },
            rect: {
                floder: true,
                value: {
                    x: { label: 'x', value: 100, min: 0, max: 500 },
                    y: { label: 'y', value: 100, min: 0, max: 500 },
                    width: { label: 'width', value: 100, min: 1, max: 500 },
                    height: { label: 'height', value: 100, min: 1, max: 500 },
                }
            },
            circle: {
                floder: true,
                value: {
                    startAngle: { label: 'startAngle', value: 0, min: 0, max: Math.PI * 2 },
                    endAngle: { label: 'endAngle', value: Math.PI * 2, min: 0, max: Math.PI * 2 },
                    x: { label: 'x', value: 100, min: 0, max: 500 },
                    y: { label: 'y', value: 100, min: 0, max: 500 },
                    radiusX: { label: 'radiusX', value: 50, min: 1, max: 500 },
                    radiusY: { label: 'radiusY', value: 50, min: 1, max: 500 },
                    rotation: { label: 'rotation', value: 0, min: -Math.PI, max: Math.PI },
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        const builder = new CKPath2D()
        const circle = this.state.circle
        const rect = this.state.rect
        builder.setFillType(this.state.fillRule)
        builder.setStroke({
            lineWith: this.state.lineWidth,
            lineJoin: this.state.lineJoin,
            lineCap: this.state.lineCap,
            strokeAlign: this.state.strokeAlign,
            miterLimit: this.state.miterLimit,
        })
        ctx.save()
        ctx.beginPath()
        ctx.translate(circle.x, circle.y)
        builder.ellipse(0, 0, circle.radiusX, circle.radiusY, circle.rotation, circle.startAngle, circle.endAngle, false)
        ctx.fillStyle = this.state.fillStyle
        ctx.strokeStyle = this.state.strokeStyle
        if (this.state.paintStyle === 'fill' || this.state.paintStyle === 'fillAndStroke') {
            ctx.fill(builder.getFillPath2D())
        }
        if (this.state.paintStyle === 'stroke' || this.state.paintStyle === 'fillAndStroke') {
            ctx.stroke(builder.getStrokePath2D())
        }

        ctx.restore()
        const builder2 = new CKPath2D()
        builder2.setFillType(this.state.fillRule)
        builder2.setStroke({
            lineWith: this.state.lineWidth,
            lineJoin: this.state.lineJoin,
            lineCap: this.state.lineCap,
            miterLimit: this.state.miterLimit,
            strokeAlign: this.state.strokeAlign,
        })
        ctx.save()
        ctx.beginPath()
        ctx.translate(rect.x, rect.y)
        builder2.rect(0, 0, rect.width, rect.height)
        ctx.fillStyle = this.state.fillStyle
        ctx.strokeStyle = this.state.strokeStyle
        if (this.state.paintStyle === 'fill' || this.state.paintStyle === 'fillAndStroke') {
            ctx.fill(builder2.getFillPath2D())
        }
        if (this.state.paintStyle === 'stroke' || this.state.paintStyle === 'fillAndStroke') {
            ctx.stroke(builder2.getStrokePath2D())
        }
        ctx.restore()
        if (this.state.showBounds) {
            ctx.save()
            ctx.beginPath()
            ctx.translate(circle.x, circle.y)
            ctx.strokeStyle = '#0000ff'
            const rect = builder.computeTightBounds()
            ctx.rect(rect.x, rect.y, rect.width, rect.height)
            ctx.stroke()
            ctx.restore()
        }
        if (this.state.showStrokeBounds) {
            ctx.save()
            ctx.beginPath()
            ctx.translate(circle.x, circle.y)
            ctx.strokeStyle = '#00ff00'
            const rect = builder.computeStrokeTightBounds()
            ctx.rect(rect.x, rect.y, rect.width, rect.height)
            ctx.stroke()
            ctx.restore()
        }
        //     ctx.translate(circle.x+100,circle.y)

        //    const newPath=ck.Path.MakeFromOp(builder.fillPath,builder2.fillPath,ck.PathOp.ReverseDifference)
        //    //builder.fillPath.makeCombined(builder2.fillPath,ck.PathOp.Intersect)
        //    ctx.fill(new Path2D(newPath.toSVGString()))
        //     ctx.restore()
        //     newPath.delete()


        builder.delete()
        builder2.delete()
    }
}
class LinearGradientExample extends BaseExample {
    draw(ctx: CanvasRenderingContext2D) {


        ctx.beginPath()
        ctx.transform(1, 0, 0, 1, 100, 100)
        const gradient = ctx.createLinearGradient(0, 0.5, 1, 0.5)
        gradient.addColorStop(0, 'red')
        gradient.addColorStop(0.5, 'green')
        gradient.addColorStop(1, 'blue')

        ctx.fillStyle = gradient
        ctx.rect(0, 0, 100, 100)
        ctx.transform(100, 0, 0, 100, 0, 0)
        ctx.fill()

    }
}
class ShadowExample extends BaseExample {
    draw(ctx: CanvasRenderingContext2D) {

        ctx.beginPath()
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, 500, 500)
        ctx.beginPath()
        ctx.strokeStyle = 'blue'
        ctx.fillStyle = '#00ffff'
        ctx.lineWidth = 20
        ctx.lineJoin = 'round'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 40
        ctx.shadowOffsetY = 40

        ctx.rect(100, 100, 100, 100)
        ctx.transform(1, 0, 0, 1, 100, 0)

        ctx.shadowColor = '#ffff00'
        ctx.stroke()
        ctx.shadowColor = 'red'
        ctx.fill()
    }
}
ExampleManager.create({ examples: [ConicExample, CKPathBuildExample, LinearGradientExample, ShadowExample] }).init()