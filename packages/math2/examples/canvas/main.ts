
import { SkScalarExp } from 'skia-path2d'
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { Stats, Ruler,ZoomTranslate, CanvasRenderer, random, Path2D as SPath2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath } from 'src'

class CanvasExample extends Example {
    constructor() {
        super()
    }
    canvas: CanvasRenderer
    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {

        }
    }
    enter(): void {
        super.enter()
        
    }
    onChange(): void {

    }
    render() {

    }
}
ExampleManager.create({ examples: [CanvasExample] }).init()