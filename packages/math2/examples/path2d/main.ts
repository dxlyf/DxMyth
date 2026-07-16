
import { SkScalarExp } from 'skia-path2d'
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform } from 'src'

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
            let m = Matrix2D.identity()
            const state = this.state
            m.fromTranslationRotationSkewScaleOriginPivot(
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
            Matrix2D.decomposeTransform(m, t)
            ctx.beginPath()
            ctx.transform(...t.matrix)
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
            ctx.transform(...m.matrix)
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
    init() {
        super.init()

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
    }
    enter(): void {
        super.enter()
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

            newP.toCanvasPath2D(ctx)
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

}
ExampleManager.create({ examples: [MatrixExample, ConicExample, RoundRect, PathStrokeExample] }).init()