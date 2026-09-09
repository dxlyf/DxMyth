
import { ExampleManager, CanvasExample } from '../lib/Example2'
import { Stats, Ruler, isPointInPolygon, ZoomTranslate, polygonOffset, buildStrokePoints, CanvasRenderer, random, Path2D as SPath2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath, Vector2 } from 'src'


export class StrokeExample extends CanvasExample {
    name: string = 'StrokeExample'
    enter(): void {
        super.enter()
    }
    strokePoints: { x: number, y: number }[] = []
    state = {
        width: 20,
        join: 'miter',
        cap: 'butt',
        miterLimit: 10,
        fill: false,
        closed: false,
        align: 'center'
    }
    stateOptions: Record<string, { type?: string; min?: number; max?: number; step?: number; options?: string[] }> = {
        width: { type: 'number', min: 1, max: 100, step: 1 },
        join: { options: ['miter', 'round', 'bevel'] },
        cap: { options: ['round', 'butt', 'square'] },
        align: { options: ['outside', 'inside', 'center'] },
    }
    circles: { x: number, y: number, r: number }[] = [
        {
            x: 100,
            y: 100,
            r: 5,
        }, {
            x: 200,
            y: 100,
            r: 5,
        },
        {
            x: 200,
            y: 200,
            r: 5,
        },
        {
            x: 100,
            y: 200,
            r: 5,
        }
    ]
    hitCircle: { x: number, y: number, r: number } | null = null
    startOffset: { x: number, y: number } | null = null
    hitStrokePoint: boolean = false
    onPointer(e: PointerEvent): void {

        if (e.type === 'pointerdown') {

            if (this.hitCircle) {
                this.startOffset = {
                    x: e.x - this.hitCircle.x,
                    y: e.y - this.hitCircle.y
                }
            }
        } else if (e.type == 'pointermove') {
            if (isPointInPolygon(this.strokePoints, e.x, e.y)) {
                this.hitStrokePoint = true
                this.owner.refresh()
            } else if (this.hitStrokePoint) {
                this.hitStrokePoint = false
                this.owner.refresh()
            }
            if (this.startOffset) {
                this.hitCircle.x = e.x - this.startOffset.x
                this.hitCircle.y = e.y - this.startOffset.y
                this.owner.refresh()
                return
            }
            const hitCircle = this.circles.find(item => Math.sqrt((e.x - item.x) * (e.x - item.x) + (e.y - item.y) * (e.y - item.y)) <= item.r)

            if (hitCircle) {
                if (this.hitCircle !== hitCircle) {
                    this.hitCircle = hitCircle
                    this.owner.refresh()
                }
            } else if (this.hitCircle) {
                this.hitCircle = null
                this.owner.refresh()
            }
        } else if (e.type === 'pointerup') {
            this.hitCircle = null
            this.startOffset = null
        }
    }
    draw(id: string, ctx: CanvasRenderingContext2D): void {
        if (id == 'left') {


            const points = this.circles.map(item => ({ x: item.x, y: item.y }))
            if (this.state.closed) {
                points.push({ x: points[0].x, y: points[0].y })
            }
            const strokePoints = buildStrokePoints(points, {
                align: this.state.align as any,
                width: this.state.width,
                join: this.state.join as any,
                cap: this.state.cap as any,
                miterLimit: this.state.miterLimit
            })
            this.strokePoints = strokePoints
            //    console.log('strokePoints',strokePoints)
            ctx.save()
            ctx.beginPath()
            if (this.state.fill) {
                ctx.lineWidth = this.state.width
                ctx.strokeStyle = 'rgba(255, 0, 0, 1)'

                ctx.lineCap = this.state.cap as 'round'
                ctx.lineJoin = this.state.join as 'round'
            } else {
                ctx.lineWidth = 1
                ctx.strokeStyle = '#000'
            }
            points.forEach((item, i) => {

                if (i === 0) {
                    ctx.moveTo(item.x, item.y)
                } else {
                    ctx.lineTo(item.x, item.y)
                }
            })
            ctx.stroke()
            ctx.restore()
            if (!this.state.fill) {
                this.circles.forEach(item => {
                    ctx.beginPath()
                    ctx.fillStyle = this.hitCircle === item ? 'blue' : 'red'
                    ctx.arc(item.x, item.y, item.r * 0.5, 0, Math.PI * 2)
                    ctx.fill()
                })
            }


            ctx.save()
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = this.hitStrokePoint ? 'red' : '#0000ff'
            ctx.fillStyle = '#0000ff'
            strokePoints.forEach((item, i) => {
                if (i === 0) {
                    ctx.moveTo(item.x, item.y)
                } else {
                    ctx.lineTo(item.x, item.y)
                }
            })
            if (this.state.fill) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
            ctx.restore()

        //     const offsetPoints = polygonOffset(points, this.state.align === 'outside' ? this.state.width : -this.state.width)
        //   //  console.log('offsetPoints',offsetPoints)
        //     ctx.beginPath()
        //     ctx.strokeStyle='green'
        //     offsetPoints.forEach((item, i) => {
        //         if (i === 0) {
        //             ctx.moveTo(item.x, item.y)
        //         } else {
        //             ctx.lineTo(item.x, item.y)
        //         }
        //     })
        //     ctx.stroke()


        }
    }
}

ExampleManager.create([StrokeExample])