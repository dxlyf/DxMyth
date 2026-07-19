
import { SkScalarExp } from 'skia-path2d'
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Path2D as SPath2D,pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, BoolOp } from 'src'

class BaseExample extends Example {
    name: string = "PathExample"
    nativeCanvas: Canvas
    testCanvas: Canvas
    init(): void {
        super.init()
        this.nativeCanvas = new Canvas(document.querySelector('#native'), 500, 500)
        this.testCanvas = new Canvas(document.querySelector('#test'), 500, 500)
    }
    draw(ctx: CanvasRenderingContext2D) {

    }
    render() {
        this.testCanvas.draw((ctx) => {
            this.draw(ctx)
        })
        this.nativeCanvas.draw((ctx) => {
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
class MatrixExample extends BaseExample {
    getState() {
        return {
            x: {
                value: 100,
                min: 0,
                max: 300
            },
            y: {
                value: 100,
                min: 0,
                max: 300
            },
            rotation: {
                value: 0,
                min: -Math.PI * 2,
                max: Math.PI * 2,
                step: 0.1
            },
            skewX: {
                value: 0,
                min: -Math.PI * 2,
                max: Math.PI * 2,
                step: 0.1
            },
            skewY: {
                value: 0,
                min: -Math.PI * 2,
                max: Math.PI * 2,
                step: 0.1
            },
            scaleX: {
                value: 1,
                min: -2,
                max: 2,
                step: 0.1
            },
            scaleY: {
                value: 1,
                min: -2,
                max: 2,
                step: 0.1
            },
            ox: {
                value: 0,
                min: -300,
                max: 300,
                step: 1
            },
            oy: {
                value: 0,
                min: -300,
                max: 300,
                step: 1
            },
            pivotX: {
                value: 0,
                min: -300,
                max: 300,
                step: 1
            },
            pivotY: {
                value: 0,
                min: -300,
                max: 300,
                step: 1
            }

        }
    }
    render() {
        this.testCanvas.draw((ctx) => {
            let m2 = Matrix2D.identity()
            const state = this.state
            m2.fromTranslationRotationSkewScaleOriginPivot(
                {
                    x: state.x,
                    y: state.y
                },
                state.rotation,
                {
                    x: state.skewX,
                    y: state.skewY
                },
                {
                    x: state.scaleX,
                    y: state.scaleY
                },
                {
                    x: state.ox,
                    y: state.oy
                },
                {
                    x: state.pivotX,
                    y: state.pivotY
                }
            )
            const t = new Transform()
            const m=t.worldMatrix
            Matrix2D.decomposeTransform(m, t)
            ctx.beginPath()
            ctx.transform(m[0],m[1],m[2],m[3],m[4],m[5])
            console.log('dd', t)
            ctx.rect(0, 0, 100, 100)
            ctx.fill()
        })
        this.nativeCanvas.draw((ctx) => {
            let m = new Transform()
            const state = this.state

            m.setTransform(
                {
                    position: {
                        x: state.x,
                        y: state.y
                    },
                    rotation: state.rotation,
                    skew: {
                        x: state.skewX,
                        y: state.skewY
                    },
                    scale: {
                        x: state.scaleX,
                        y: state.scaleY
                    },
                    origin: {
                        x: state.ox,
                        y: state.oy
                    },
                    pivot: {
                        x: state.pivotX,
                        y: state.pivotY
                    }
                }
            )

            ctx.beginPath()
            ctx.transform(...(m.matrix as unknown as [number, number, number, number, number, number]))
            ctx.rect(0, 0, 100, 100)
            ctx.fill()
        })
    }
    draw(ctx: CanvasRenderingContext2D) {

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
                max: 1
            }
        }
    }
    render() {
        this.testCanvas.draw((ctx) => {
            const p = new PathBuilder()
            const conic = new Conic([Point.create(this.state.x0, this.state.y0), Point.create(this.state.x1, this.state.y1), Point.create(this.state.x2, this.state.y2)], this.state.w)

            const quadraticBeziers = conic.toQuadraticBeziers()
            ctx.beginPath()
            console.log('quadraticBeziers', quadraticBeziers)
            p.moveTo(this.state.x0, this.state.y0)
            for (let i = 0; i < quadraticBeziers.length; i++) {
                const [p0, p1, p2] = quadraticBeziers[i]
                p.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y)
            }
            p.applyContext(ctx)
            ctx.stroke()
        })
        this.nativeCanvas.draw((ctx) => {
            ctx.beginPath()
            const p = new PathBuilder()
            p.moveTo(this.state.x0, this.state.y0)
            p.conicTo(this.state.x1, this.state.y1, this.state.x2, this.state.y2, this.state.w)
            //this.buildPath(p)
            p.applyContext(ctx)
            ctx.stroke()
        })
    }
    buildPath(path: PathBuilder | CanvasRenderingContext2D): void {
        const { x, y, width, height, topleft, topright, bottomleft, bottomright } = this.state
        //[top-left, top-right, bottom-right, bottom-left]
        const radii = [topleft, topright, bottomright, bottomleft]
        path.roundRect(x, y, width, height, radii)
    }

}

class RoundRect extends BaseExample {
    getState() {
        return {
            x: {
                value: 100
            },
            y: {
                value: 100
            },
            width: {
                value: 100
            },
            height: {
                value: 100
            },
            topleft: {
                value: 10,
                min: 0,
                max: 100
            },
            topright: {
                value: 10,
                min: 0,
                max: 100
            },
            bottomleft: {
                value: 10,
                min: 0,
                max: 100
            },
            bottomright: {
                value: 10,
                min: 0,
                max: 100
            }
        }
    }
    render() {
        this.testCanvas.draw((ctx) => {
            const p = new PathBuilder()

            ctx.beginPath()
            this.buildPath(p)
            p.applyContext(ctx)
            ctx.stroke()
        })
        this.nativeCanvas.draw((ctx) => {
            ctx.beginPath()
            this.buildPath(ctx)
            ctx.stroke()
        })
    }
    buildPath(path: PathBuilder | CanvasRenderingContext2D): void {
        const { x, y, width, height, topleft, topright, bottomleft, bottomright } = this.state
        //[top-left, top-right, bottom-right, bottom-left]
        const radii = [topleft, topright, bottomright, bottomleft]
        path.roundRect(x, y, width, height, radii)
    }

}


class PathStrokeExample extends BaseExample {
    getState() {

        return {
            lineWidth: {
                value: 10,
                min: 1,
                max: 20
            },
            lineCap: {
                value: 'round',
                options: ['round', 'butt', 'square']
            },
            lineJoin: {
                value: 'round',
                options: ['round', 'bevel', 'miter']
            },
            closePath: {
                value: false
            },
            clear: {
                value: () => {
                    this.points = []
                    this.render()
                }
            }
        }

    }
    points: Point[] = []
    p: PointerEventSystem | null = null
    init() {
        super.init()
    }
    enter(): void {
        super.enter()
         let p = new PointerEventSystem({
            target: this.testCanvas.canvas,
            screenToWorld: (out: Point, x: number, y: number, element: HTMLElement) => {
                const rect = element.getBoundingClientRect()
                out.set(x - rect.left, y - rect.top)
                return out
            },
            hitTest: (x: number, y: number) => {
                return false
            }
        })
        p.attachEvents()
        p.on('pointerdown', e => {
            console.log('point', e.downPoint.toString())
            this.points.push(e.downPoint.clone())
            this.render()
        })
        this.p=p
        this.render()
    }
    render() {
        this.testCanvas.draw((ctx) => {
            const p = new PathBuilder()
            this.buildPath(p)
            const stroke = new PathStroke()
            const newP = stroke.stroke(p, {
                lineWidth: this.state.lineWidth,
                lineCap: this.state.lineCap,
                lineJoin: this.state.lineJoin,
            })
            ctx.beginPath()
            ctx.lineWidth = 1

            newP.applyContext(ctx)
            ctx.stroke()
        })
        this.nativeCanvas.draw((ctx) => {
            ctx.beginPath()
            ctx.lineWidth = this.state.lineWidth
            ctx.lineCap = this.state.lineCap
            ctx.lineJoin = this.state.lineJoin
            this.buildPath(ctx)
            ctx.stroke()
        })
    }
    buildPath(path: PathBuilder | CanvasRenderingContext2D): void {
        if (this.points.length < 2) {
            return
        }
        path.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
            path.lineTo(this.points[i].x, this.points[i].y)
        }
        this.state.closePath && path.closePath()
    }
    exit(): void {
         super.exit()
         this.p&& this.p.detachEvents()
         this.p=null
    }

}
class Path2DExample extends BaseExample {
    getState() {

        return {
            lineWidth: {
                value: 10,
                min: 1,
                max: 20
            },
            lineCap: {
                value: 'round',
                options: ['round', 'butt', 'square']
            },
            lineJoin: {
                value: 'round',
                options: ['round', 'bevel', 'miter']
            },
            closePath: {
                value: false
            },
            clear: {
                value: () => {
                    this.points = []
                    this.render()
                }
            }
        }

    }
    points: Point[] = []
    p: PointerEventSystem | null = null
    init() {
        super.init()

       
    }
    enter(): void {
        super.enter()
         let p = new PointerEventSystem({
            target: this.testCanvas.canvas,
            screenToWorld: (out: Point, x: number, y: number, element: HTMLElement) => {
                const rect = element.getBoundingClientRect()
                out.set(x - rect.left, y - rect.top)
                return out
            },
            hitTest: (x: number, y: number) => {
                return false
            }
        })
        p.attachEvents()
        p.on('pointerdown', e => {
            console.log('point', e.downPoint.toString())
            this.points.push(e.downPoint.clone())
            this.render()
        })
        this.p=p
        this.render()
    }
    render() {
        this.testCanvas.draw((ctx) => {
            const p = new PathBuilder()
          //  p.ellipse(100,100,50,50,0,0,Math.PI*2)
            this.buildPath(p)

            ctx.beginPath()
            ctx.lineWidth = 1
            p.applyContext(ctx)
            ctx.stroke()
        })
        this.nativeCanvas.draw((ctx) => {

        })
    }
    buildPath(path: PathBuilder): void {
        if (this.points.length < 2) {
            if(this.points.length>0){
                path.reset()
                path.rect(this.points[0].x, this.points[0].y, 100, 100)
            }
            return
        }
        path.reset()
        let p = new SPath2D()
        let p2 = new SPath2D()
       //x
         p.rect(this.points[0].x, this.points[0].y, 100, 100)
        p2.rect(this.points[1].x, this.points[1].y, 100, 100)

        path.addPath(pathBooleanOp(p as unknown as PathBuilder, p2 as unknown as PathBuilder, BoolOp.Intersect))
      // path.addPath(p.opFillPath(p2,clipper2.ClipType.Intersection))
       // let p3=clipper2.inflatePaths(p.toPolygons(),10,clipper2.JoinType.Miter,clipper2.EndType.Butt,10)
      // console.log(path.fromPolygons(p3))
    }
 exit(): void {
        super.exit()
         this.p&& this.p.detachEvents()
         this.p=null
    }
}
class PathBoolExample extends BaseExample {
    static readonly SHAPE_TYPES = ['rect', 'roundRect', 'ellipse', 'circle', 'star', 'polygon'] as const
    static readonly BOOL_OPS: BoolOp[] = [BoolOp.Union, BoolOp.Intersect, BoolOp.Difference, BoolOp.Xor]

    getState() {
        return {
            shapeA: {
                value: 'rect',
                options: [...PathBoolExample.SHAPE_TYPES],
                label: 'Shape A'
            },
            shapeB: {
                value: 'circle',
                options: [...PathBoolExample.SHAPE_TYPES],
                label: 'Shape B'
            },
            boolOp: {
                value: BoolOp.Intersect,
                options: PathBoolExample.BOOL_OPS,
                label: 'Boolean Op'
            },
            // Shape A params
            a_cx: { value: 200, min: 0, max: 500, label: 'A cx' },
            a_cy: { value: 200, min: 0, max: 500, label: 'A cy' },
            a_w: { value: 150, min: 10, max: 400, label: 'A width/rx' },
            a_h: { value: 100, min: 10, max: 400, label: 'A height/ry' },
            a_r: { value: 30, min: 0, max: 200, label: 'A radius' },
            a_points: { value: 5, min: 3, max: 12, step: 1, label: 'A points' },
            a_innerR: { value: 0.5, min: 0.1, max: 0.9, step: 0.05, label: 'A inner ratio' },
            a_sides: { value: 6, min: 3, max: 12, step: 1, label: 'A sides' },
            a_rotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: 'A rotation' },
            // Shape B params
            b_cx: { value: 300, min: 0, max: 500, label: 'B cx' },
            b_cy: { value: 250, min: 0, max: 500, label: 'B cy' },
            b_w: { value: 120, min: 10, max: 400, label: 'B width/rx' },
            b_h: { value: 120, min: 10, max: 400, label: 'B height/ry' },
            b_r: { value: 20, min: 0, max: 200, label: 'B radius' },
            b_points: { value: 5, min: 3, max: 12, step: 1, label: 'B points' },
            b_innerR: { value: 0.5, min: 0.1, max: 0.9, step: 0.05, label: 'B inner ratio' },
            b_sides: { value: 6, min: 3, max: 12, step: 1, label: 'B sides' },
            b_rotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1, label: 'B rotation' },
        }
    }

    /** 根据类型和前缀参数构建形状路径 */
    private buildShape(path: PathBuilder, type: string, prefix: string): void {
        const s = this.state
        const cx = s[prefix + '_cx']
        const cy = s[prefix + '_cy']
        const w = s[prefix + '_w']
        const h = s[prefix + '_h']
        const r = s[prefix + '_r']
        const rotation = s[prefix + '_rotation']

        path.reset()
        switch (type) {
            case 'rect':
                path.rect(cx - w / 2, cy - h / 2, w, h)
                break
            case 'roundRect':
                path.roundRect(cx - w / 2, cy - h / 2, w, h, r)
                break
            case 'ellipse':
                path.ellipse(cx, cy, w, h, rotation, 0, Math.PI * 2)
                break
            case 'circle':
                path.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2)
                break
            case 'star': {
                const points = s[prefix + '_points'] | 0
                const outerR = r
                const innerR = r * s[prefix + '_innerR']
                this.buildStar(path, cx, cy, outerR, innerR, points, rotation)
                break
            }
            case 'polygon': {
                const sides = s[prefix + '_sides'] | 0
                this.buildPolygon(path, cx, cy, r, sides, rotation)
                break
            }
        }
    }

    private buildStar(path: PathBuilder, cx: number, cy: number, outerR: number, innerR: number, points: number, rotation: number): void {
        const step = Math.PI / points
        for (let i = 0; i < points * 2; i++) {
            const angle = rotation - Math.PI / 2 + i * step
            const r = i % 2 === 0 ? outerR : innerR
            const x = cx + Math.cos(angle) * r
            const y = cy + Math.sin(angle) * r
            if (i === 0) path.moveTo(x, y)
            else path.lineTo(x, y)
        }
        path.closePath()
    }

    private buildPolygon(path: PathBuilder, cx: number, cy: number, r: number, sides: number, rotation: number): void {
        const step = (Math.PI * 2) / sides
        for (let i = 0; i < sides; i++) {
            const angle = rotation + i * step - Math.PI / 2
            const x = cx + Math.cos(angle) * r
            const y = cy + Math.sin(angle) * r
            if (i === 0) path.moveTo(x, y)
            else path.lineTo(x, y)
        }
        path.closePath()
    }

    render() {
        const s = this.state
        const shapeAType = s.shapeA
        const shapeBType = s.shapeB
        const boolOp = s.boolOp

        const pathA = new PathBuilder()
        const pathB = new PathBuilder()
        this.buildShape(pathA, shapeAType, 'a')
        this.buildShape(pathB, shapeBType, 'b')

        const resultPath = pathBooleanOp(pathA, pathB, boolOp)

        // 左边 canvas：显示 A(红) 和 B(蓝) 的轮廓
        this.nativeCanvas.draw((ctx) => {
            ctx.save()
            ctx.setLineDash([4, 4])
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)'
            ctx.lineWidth = 2
            ctx.beginPath()
            pathA.applyContext(ctx)
            ctx.stroke()

            ctx.strokeStyle = 'rgba(50, 100, 255, 0.8)'
            ctx.beginPath()
            pathB.applyContext(ctx)
            ctx.stroke()
            ctx.setLineDash([])

            // 标注文字
            ctx.font = '14px sans-serif'
            ctx.fillStyle = '#e55'
            ctx.fillText('A (' + shapeAType + ')', 10, 20)
            ctx.fillStyle = '#55e'
            ctx.fillText('B (' + shapeBType + ')', 10, 40)
            ctx.restore()
        })

        // 右边 canvas：显示布尔运算结果
        this.testCanvas.draw((ctx) => {
            ctx.save()
            ctx.fillStyle = 'rgba(100, 200, 100, 0.6)'
            ctx.strokeStyle = '#333'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            resultPath.applyContext(ctx)
            ctx.fill()
            ctx.stroke()

            ctx.font = '14px sans-serif'
            ctx.fillStyle = '#333'
            ctx.fillText('Result: ' + boolOp, 10, 20)
            ctx.restore()
        })
    }

    draw(ctx: CanvasRenderingContext2D) { }
}

ExampleManager.create({ examples: [PathBoolExample, Path2DExample, MatrixExample, ConicExample, RoundRect, PathStrokeExample] }).init()