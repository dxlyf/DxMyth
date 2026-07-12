import { Color, ColorLike } from '../math/Color'
import { Matrix2D, Matrix2DLike } from '../math/Matrix2D'
import { ColorStop } from '../math/Gradient'

// ============================================================
// PaintShader — 参考 Skia SkShader 设计
//
// 着色器基类，定义如何为绘制区域生成颜色。
// 通过静态工厂方法创建，而不是直接 new。
//
// Skia 对应关系:
//   SkShader::MakeColor       → PaintShader.makeColor
//   SkGradientShader::MakeLinear → PaintShader.makeLinearGradient
//   SkGradientShader::MakeRadial → PaintShader.makeRadialGradient
//   SkGradientShader::MakeSweep  → PaintShader.makeSweepGradient
//   SkShader::MakeImage       → PaintShader.makeImage
//   SkShader::makeWithLocalMatrix → shader.withLocalMatrix
// ============================================================

/** 平铺模式（对应 Skia SkTileMode） */
export enum TileMode {
    Clamp = 'clamp',
    Repeat = 'repeat',
    Mirror = 'mirror',
    Decal = 'decal',
}

/** shader 类型判别 */
export const enum ShaderKind {
    Color = 0,
    LinearGradient = 1,
    RadialGradient = 2,
    SweepGradient = 3,
    Image = 4,
}

// ---- 内部存储的数据类型 ----

interface ColorShaderData {
    kind: ShaderKind.Color
    color: ColorLike
}

interface LinearGradientData {
    kind: ShaderKind.LinearGradient
    startX: number
    startY: number
    endX: number
    endY: number
    stops: ColorStop[]
}

interface RadialGradientData {
    kind: ShaderKind.RadialGradient
    centerX: number
    centerY: number
    radius: number
    stops: ColorStop[]
}

interface SweepGradientData {
    kind: ShaderKind.SweepGradient
    centerX: number
    centerY: number
    startAngle: number
    stops: ColorStop[]
}

interface ImageShaderData {
    kind: ShaderKind.Image
    image: CanvasImageSource
    tileModeX: TileMode
    tileModeY: TileMode
}

type ShaderData =
    | ColorShaderData
    | LinearGradientData
    | RadialGradientData
    | SweepGradientData
    | ImageShaderData

/**
 * PaintShader — 着色器。
 *
 * 不可变设计：所有修改方法返回新的 PaintShader 实例。
 * 通过静态工厂创建，不直接使用 constructor。
 *
 * @example
 * ```ts
 * // 纯色 shader
 * const red = PaintShader.makeColor([1, 0, 0, 1])
 *
 * // 线性渐变
 * const grad = PaintShader.makeLinearGradient(0, 0, 100, 100, [
 *     { offset: 0, color: [1, 0, 0, 1] },
 *     { offset: 1, color: [0, 0, 1, 1] },
 * ])
 *
 * // 带矩阵变换
 * const scaled = grad.withLocalMatrix(Matrix2D.scale(0.5, 0.5))
 *
 * // 应用到 Paint
 * paint.setShader(scaled)
 * ```
 */
export class PaintShader {
    // ---- 静态工厂 ----

    /** 纯色着色器 */
    static makeColor(color: ColorLike): PaintShader {
        return new PaintShader({
            kind: ShaderKind.Color,
            color: [color[0], color[1], color[2], color[3] ?? 1],
        })
    }

    /** 线性渐变着色器 */
    static makeLinearGradient(
        startX: number, startY: number,
        endX: number, endY: number,
        stops: ColorStop[],
    ): PaintShader {
        return new PaintShader({
            kind: ShaderKind.LinearGradient,
            startX, startY, endX, endY,
            stops: stops.slice(),
        })
    }

    /** 径向渐变着色器（圆心 + 半径） */
    static makeRadialGradient(
        centerX: number, centerY: number, radius: number,
        stops: ColorStop[],
    ): PaintShader {
        return new PaintShader({
            kind: ShaderKind.RadialGradient,
            centerX, centerY, radius,
            stops: stops.slice(),
        })
    }

    /** 扫描渐变（锥形渐变）着色器 */
    static makeSweepGradient(
        centerX: number, centerY: number,
        startAngle: number,
        stops: ColorStop[],
    ): PaintShader {
        return new PaintShader({
            kind: ShaderKind.SweepGradient,
            centerX, centerY, startAngle,
            stops: stops.slice(),
        })
    }

    /** 图片着色器 */
    static makeImage(
        image: CanvasImageSource,
        tileModeX: TileMode = TileMode.Clamp,
        tileModeY: TileMode = TileMode.Clamp,
    ): PaintShader {
        return new PaintShader({
            kind: ShaderKind.Image,
            image,
            tileModeX,
            tileModeY,
        })
    }

    // ---- 实例 ----

    private constructor(
        public _data: ShaderData,
        public _localMatrix: Matrix2D | null = null,
    ) {}

    /** 着色器类型 */
    get kind(): ShaderKind {
        return this._data.kind
    }

    /** 本地变换矩阵（没有则为 null） */
    get localMatrix(): Matrix2D | null {
        return this._localMatrix
    }
    
    // ---- Skia 风格 API ----
    setMatrix(matrix:Matrix2DLike){
        if(!this._localMatrix){
            this._localMatrix=Matrix2D.identity()
        }
        this._localMatrix.fromArray(matrix)
    }
    /**
     * 返回一个新的 shader，将给定矩阵作为其本地变换。
     * 本地矩阵在 shader 生成的坐标空间中生效。
     */
    withLocalMatrix(matrix: Matrix2DLike): PaintShader {
        const m = this._localMatrix
            ? this._localMatrix.clone().multiply(matrix)
            : Matrix2D.fromArray(matrix)
        return new PaintShader(this._data, m)
    }

    /**
     * 返回一个新的 shader，重置本地矩阵为单位矩阵。
     */
    resetLocalMatrix(): PaintShader {
        return this._localMatrix
            ? new PaintShader(this._data, null)
            : this
    }

    // ---- 转换到 Canvas ----

    /**
     * 将 shader 转换为 Canvas fillStyle / strokeStyle 可接受的值。
     * 如果 shader 无法应用（如图片未加载），回退到 fallbackColor。
     */
    toCanvasStyle(
        ctx: CanvasRenderingContext2D,
        fallbackColor: ColorLike,
    ): string | CanvasGradient | CanvasPattern {
        // 应用 localMatrix（通过 ctx save/restore + setTransform）
        const needsMatrix = this._localMatrix !== null
        if (needsMatrix) {
            ctx.save()
            const m = this._localMatrix!
            ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
        }

        let result: string | CanvasGradient | CanvasPattern

        switch (this._data.kind) {
            case ShaderKind.Color: {
                result = Color.toCSS_RGBA(this._data.color)
                break
            }
            case ShaderKind.LinearGradient: {
                const d = this._data
                const grad = ctx.createLinearGradient(d.startX, d.startY, d.endX, d.endY)
                for (const s of d.stops) {
                    grad.addColorStop(s.offset, Color.toCSS_RGBA(s.color))
                }
                result = grad
                break
            }
            case ShaderKind.RadialGradient: {
                const d = this._data
                const grad = ctx.createRadialGradient(d.centerX, d.centerY, 0, d.centerX, d.centerY, d.radius)
                for (const s of d.stops) {
                    grad.addColorStop(s.offset, Color.toCSS_RGBA(s.color))
                }
                result = grad
                break
            }
            case ShaderKind.SweepGradient: {
                const d = this._data
                const ctxExtended = ctx as CanvasRenderingContext2D & {
                    createConicGradient?(startAngle: number, x: number, y: number): CanvasGradient
                }
                let grad: CanvasGradient
                if (ctxExtended.createConicGradient) {
                    grad = ctxExtended.createConicGradient(d.startAngle, d.centerX, d.centerY)
                } else {
                    // 回退为径向渐变
                    grad = ctx.createRadialGradient(d.centerX, d.centerY, 0, d.centerX, d.centerY,
                        Math.max(ctx.canvas.width, ctx.canvas.height))
                }
                for (const s of d.stops) {
                    grad.addColorStop(s.offset, Color.toCSS_RGBA(s.color))
                }
                result = grad
                break
            }
            case ShaderKind.Image: {
                const d = this._data
                const repeat = tileModeToCanvasRepeat(d.tileModeX, d.tileModeY)
                const pattern = ctx.createPattern(d.image, repeat)
                if (!pattern) {
                    result = Color.toCSS_RGBA(fallbackColor)
                } else {
                    result = pattern
                }
                break
            }
            default:
                result = Color.toCSS_RGBA(fallbackColor)
        }

        if (needsMatrix) {
            ctx.restore()
        }

        return result
    }

    // ---- 复制 ----

    /** 深拷贝 */
    clone(): PaintShader {
        return new PaintShader(this._cloneData(), this._localMatrix?.clone() ?? null)
    }

    private _cloneData(): ShaderData {
        const d = this._data
        switch (d.kind) {
            case ShaderKind.Color:
                return { kind: d.kind, color: [d.color[0], d.color[1], d.color[2], d.color[3] ?? 1] }
            case ShaderKind.LinearGradient:
                return {
                    kind: d.kind, startX: d.startX, startY: d.startY,
                    endX: d.endX, endY: d.endY, stops: d.stops.map(s => ({
                        offset: s.offset, color: s.color.slice() as ColorLike,
                    })),
                }
            case ShaderKind.RadialGradient:
                return {
                    kind: d.kind, centerX: d.centerX, centerY: d.centerY,
                    radius: d.radius, stops: d.stops.map(s => ({
                        offset: s.offset, color: s.color.slice() as ColorLike,
                    })),
                }
            case ShaderKind.SweepGradient:
                return {
                    kind: d.kind, centerX: d.centerX, centerY: d.centerY,
                    startAngle: d.startAngle, stops: d.stops.map(s => ({
                        offset: s.offset, color: s.color.slice() as ColorLike,
                    })),
                }
            case ShaderKind.Image:
                return { kind: d.kind, image: d.image, tileModeX: d.tileModeX, tileModeY: d.tileModeY }
        }
    }
}

// ---- 内部工具 ----

/**
 * 将 TileMode 对转换为 Canvas createPattern 的 repeat 参数。
 *
 * TileMode 映射:
 *   Clamp  → repeat (Canvas: 'no-repeat' 仅 pattern 支持有限，用 'repeat' + 截断逻辑近似)
 *   Repeat → 'repeat'
 *   Mirror → 'repeat' (Canvas 不支持镜像模式，降级为 repeat)
 *   Decal  → 'no-repeat'
 */
function tileModeToCanvasRepeat(tx: TileMode, ty: TileMode): string {
    // Canvas pattern 只支持 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
    // 且不支持分别设置 xy 的平铺模式
    const xRepeat = tx === TileMode.Repeat || tx === TileMode.Mirror
    const yRepeat = ty === TileMode.Repeat || ty === TileMode.Mirror

    if (xRepeat && yRepeat) return 'repeat'
    if (xRepeat && !yRepeat) return 'repeat-x'
    if (!xRepeat && yRepeat) return 'repeat-y'
    return 'no-repeat'
}
