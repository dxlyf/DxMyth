# 实现 CanvasKitRenderer

## 摘要

在 `canvaskit2` 包中新增 `CanvasKitRenderer`——基于 `canvaskit-wasm`（Skia WASM）的渲染器，与现有 `CanvasRenderer` 实现同一套 `Renderer` 抽象契约，使 `Engine` 通过 `renderType: 'canvaskit'` 即可切换到 Skia 渲染。核心工作是新建 `src/renderer/canvaskit/CanvasKitRenderer.ts`，并在 `Engine.renderers` 注册表中登记、在 `src/index.ts` 导出。

## 现状分析

- **抽象契约** ([Renderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Renderer.ts))：抽象方法 `init / updateViewSize / render / renderShape / renderImage / renderText / drawPath / applyTextStyle / fillText / measureText / strokeText`，以及路径方法 `arc / arcTo / bezierCurveTo / closePath / ellipse / lineTo / moveTo / quadraticCurveTo / rect / roundRect`。具体方法 `setSize / createPath / createLinearGradient…`。
- **参考实现** ([CanvasRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvas/CanvasRenderer.ts))：`renderBefore`（clear + save + `dpr*viewportMatrix` transform）→ 遍历 `renderList` 调 `shape.render(this)` → `renderAfter`（restore + 可选背景 `destination-atop`）。`_drawShape`：transform → opacity → `applyShapeStyle` → `_applyClipPath` → `shape.draw(this)` → `ctx.fill/stroke`（`_strokeWithAlign` 用 clip 技巧处理 inner/outer）。
- **CanvasKit 绑定已就绪**：
  - [lib.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/ck/lib.ts) 导出 `ck` 单例与 `getCanvasKit()`；[Engine.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Engine.ts) 在 `initialize()` 中 `await getCanvasKit()` 后才 `new renderers[…]()`，故渲染器构造时 `ck` 已初始化。
  - [CKPath2D](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/ck/CKPath2D.ts)：`fillPath` / `strokePath` getter 返回**原生 `CanvasKit.Path`**，`strokePath` 已通过 `PathOp` 处理 `strokeAlign`（center=`makeStroked`，outside=`Difference`，inside=`Intersect`）。`applyFillPath(ctx)` 是 Canvas 专用，**CanvasKit 渲染器不可使用**。
  - [convert.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/ck/convert.ts)：`toCKFillRule / toCKLineCap / toCKLineJoin` 可复用。
  - [CKPathBuilder](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/ck/CKPathBuilder.ts)：`moveTo/lineTo/quadTo/cubicTo/conicTo/arcTo/arc/ellipse/rect/roundRect/closePath/transform`，`detach()` 返回 `Path`。
- **Shape 体系** ([Shape.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Shape.ts))：每个 shape 有 `path: CKPath2D`，`render()` 先 `updateBuildPath()`（调 `buildPath(this.path)`）再 `renderShape(this)`；`_cache: any`（来自 Element）可自由挂载 CanvasKit 对象；`style.fillStyle/strokeStyle/shadowColor` 经 `setStyle` 归一化为 `{type:'color',value:Color}` 对象；`STROKE_STATE_PROPERTIES` 变更时同步到 `path.setStroke`。`getClipPath2D()` 返回 Canvas `Path2D`（Canvas 专用），CanvasKit 需直接用 `clipPath.fillPath`。
- **Shape.draw 契约**：路径型 shape（Rect/Ellipse/Star/Polygon/Line/Polyline/GraphicPath）的 `draw(renderer)` 通过 `renderer.rect/ellipse/...` 或 `renderer.drawPath(this.path)` 触发路径构建；Text/Image 的 `draw` 通过 `renderer.fillText/strokeText/drawImage` 直接绘制。**关键**：路径型 shape 的几何在 `buildPath` 阶段已写入 `shape.path`，`draw()` 只是再发一遍命令。
- **Color** ([math2 Color.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/math2/src/math/Color.ts))：继承 `Float32Array`，布局 `[r,g,b,a]` 0-1，与 CanvasKit `Color = Float32Array` / `Color4f` 完全兼容。
- **Engine 注册** ([Engine.ts:16-18](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Engine.ts#L16-L18))：`renderers = { canvas: CanvasRenderer }`，`renderType?: 'canvas' | 'canvaskit' | 'svg'` 已声明。
- **canvaskit-wasm 0.41 API 已核实**（`node_modules/canvaskit-wasm/types/index.d.ts`）：
  - `MakeCanvasSurface(canvas): Surface | null`（已 deprecated 但可用；会优先 WebGL 回退 CPU）
  - `Surface.getCanvas(): Canvas`、`Surface.flush()`
  - `Canvas.clear(InputColor)`、`Canvas.save/restore/saveLayer(paint?)`、`Canvas.concat(InputMatrix)`、`Canvas.clipPath(path, ClipOp, doAntiAlias)`、`Canvas.drawPath(path, paint)`、`Canvas.drawImage(img, x, y, paint?)`、`Canvas.drawImageRect(img, src, dest, paint)`、`Canvas.drawText(str, x, y, paint, font)`、`Canvas.drawRect(rect, paint)`
  - `Paint`：`new ck.Paint()`、`setAntiAlias/setStyle(setStrokeWidth/setStrokeCap/setStrokeJoin/setStrokeMiter/setPathEffect/setShader/setBlendMode/setColor4f/setAlphaf`
  - `PathEffect.MakeDash(intervals, phase?)`
  - `Shader.MakeLinearGradient(start, end, colors, pos, mode, localMatrix?)`、`MakeTwoPointConicalGradient(start, r0, end, r1, …)`、`MakeSweepGradient(cx, cy, colors, pos, mode, localMatrix?, flags?, startAngle?, endAngle?)`——**注意 sweep 的 startAngle/endAngle 在末尾参数**
  - `Image.makeShaderOptions(tx, ty, fm, mm)`、`MakeImageFromCanvasImageSource(src): Image`、`Image.width()/height()`
  - `new ck.Font(face: Typeface|null, size?)`——**无 `setLetterSpacing`、无 `measureText`**；`Font.getGlyphIDs(str)` + `Font.getGlyphWidths(glyphs)` 求宽；`Font.getMetrics(): {ascent<0, descent>0, …}`
  - `ck.Color4f(r,g,b,a?)`、`ck.LTRBRect(l,t,r,b)`；常量有 `BLACK/WHITE`，**无 `Transparent`**（用 `Color4f(0,0,0,0)`）
  - 类型：`Color=Float32Array`、`InputFlexibleColorArray = Float32Array | Uint32Array | Float32Array[]`、`InputPoint = Point|number[]`、`InputMatrix = …|Matrix3x3|Matrix3x2|number[]`
- **目录现状**：`src/renderer/canvaskit/` 已存在但为空，无任何既有实现。

## 方案设计

### 1. 新建 `src/renderer/canvaskit/CanvasKitRenderer.ts`

继承 `Renderer<CanvasKitRendererProps>`，实现全部抽象方法。核心设计如下。

#### 1.1 类骨架与字段

```typescript
import { Scene } from "src/core/Scene"
import { ElementFlag } from "src/core/ElementFlags"
import { ConicGradient, LinearGradient, RadialGradient } from "src/core/Gradient"
import { ImagePattern } from "src/core/Pattern"
import { FillRule, FillStyle, Renderer, StrokeStyle, type RendererProps } from "src/core/Renderer"
import { Shape } from "src/core/Shape"
import { Color, ColorValue, Matrix2D } from "@dxyl/math2"
import { ck, type CanvasKit } from "src/ck"
import { CKPath2D } from "src/ck"
import { toCKLineCap, toCKLineJoin } from "src/ck/convert"

export type CanvasKitRendererProps = RendererProps & {
    canvas?: HTMLCanvasElement
    backgroundColor?: ColorValue
}

export class CanvasKitRenderer extends Renderer<CanvasKitRendererProps> {
    type = "CanvasKitRenderer"
    declare domElement: HTMLCanvasElement
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas

    // 路径累积器：shape.draw() 通过 renderer.rect/ellipse 等方法构建到这里
    private _currentPath: CKPath2D
    // drawPath() 显式指定路径（GraphicPath 走此分支）
    private _explicitPath: CKPath2D | null = null
    // 当前正在渲染的 shape（供 drawPath/fillText/drawImage 读取 style）
    private _currentShape: Shape | null = null
    // 当前 paint（每个 shape 按 style 构建并缓存到 shape._cache）
    private _fillPaint: CanvasKit.Paint
    private _strokePaint: CanvasKit.Paint
    // 当前字体（文本用）
    private _font: CanvasKit.Font
    private _transparent: CanvasKit.Color  // 缓存 clear 用透明色
}
```

#### 1.2 init / updateViewSize / dispose

- `async init()`：
  1. `this.domElement = this.props.canvas || document.createElement('canvas')`，设置 `margin/padding/display:block`。
  2. `this.surface = ck.MakeCanvasSurface(this.domElement)`；为 null 则抛错（WebGL 不可用）。
  3. `this.canvas = this.surface.getCanvas()`。
  4. `this._currentPath = new CKPath2D()`、`this._transparent = ck.Color4f(0,0,0,0)`。
  5. 无父节点时 `this.engine.containerDom.appendChild(this.domElement)`。
- `updateViewSize(w,h)`：`domElement.width/height = this.width/height`（dpr 缩放后的像素），`style.width/height = ${w/h}px`。CanvasKit WebGL surface 在 `flush()` 时自适应 canvas 尺寸，**无需重建 surface**。
- `dispose()`：`this._currentPath?.delete()`、`this.surface?.delete()`。（Engine.destroy 暂不调用，见下文「Engine 修改」。）

#### 1.3 矩阵转换 `Matrix2D → CanvasKit Matrix3x3`

`Matrix2D = [a,b,c,d,e,f] = [scaleX, skewY, skewX, scaleY, tx, ty]`。
CanvasKit `Matrix3x3`（行优先）= `[scaleX, skewX, tx, skewY, scaleY, ty, 0, 0, 1]`。

```typescript
private _toCKMatrix(m: Matrix2D): CanvasKit.Matrix3x3 {
    return [m[0], m[2], m[4], m[1], m[3], m[5], 0, 0, 1]
}
```

#### 1.4 路径方法（累积器模型）

所有抽象路径方法委托给 `_currentPath`（一个复用的 `CKPath2D` 实例）：

```typescript
arc(...)              { this._currentPath.arc(...) }
arcTo(...)            { this._currentPath.arcTo(...) }
bezierCurveTo(...)    { this._currentPath.bezierCurveTo(...) }
closePath()           { this._currentPath.closePath() }
ellipse(...)          { this._currentPath.ellipse(...) }
lineTo(x,y)           { this._currentPath.lineTo(x,y) }
moveTo(x,y)           { this._currentPath.moveTo(x,y) }
quadraticCurveTo(...) { this._currentPath.quadraticCurveTo(...) }
rect(x,y,w,h)         { this._currentPath.rect(x,y,w,h) }
roundRect(...)        { this._currentPath.roundRect(...) }
```

`drawPath(path: CKPath2D)`：`this._explicitPath = path`（GraphicPath 走此分支，直接复用其已缓存的 `fillPath/strokePath`，不重建）。

> **为什么用累积器而非直接用 `shape.path`**：保持与 `CanvasRenderer` 相同的 `draw()` 契约——shape 通过 `renderer.rect/ellipse` 发命令。累积器在 `renderShape` 开头 `reset()` 并按 style 配置 `setStroke`，渲染后用 `fillPath/strokePath`。对 GraphicPath，`drawPath` 设 `_explicitPath` 跳过累积器直接用 shape 自有 path。

#### 1.5 render 主循环

```typescript
render(scene: Scene): void {
    const renderList = scene.getRenderElements(this.viewport, true) as Shape[]
    this._renderBefore()
    for (let i = 0, len = renderList.length; i < len; i++) {
        renderList[i].render(this)
    }
    this._renderAfter()
}
```

- `_renderBefore()`：`canvas.clear(this._transparent)` → `canvas.save()` → 组合 `dpr * viewportMatrix`（用 `Matrix2D.pool.get()` + `fromScale(dpr,dpr)` + `multiply(viewport.getWorldToScreenMatrix())`，复刻 CanvasRenderer）→ 非单位时 `canvas.concat(this._toCKMatrix(vm))` → `pool.release(vm)`。
- `_renderAfter()`：`canvas.restore()` → 若 `props.backgroundColor`：建临时 `Paint`（Fill、`setColor4f` 背景、`setBlendMode(ck.BlendMode.DstATOP)`）→ `canvas.drawRect(ck.LTRBRect(0,0,this.width,this.height), paint)` → `paint.delete()`。→ `surface.flush()`。

#### 1.6 renderShape / _renderCurrentPath（strokeAlign 统一处理）

```typescript
renderShape(shape: Shape): void {
    const canvas = this.canvas
    canvas.save()
    // transform
    const m = shape.worldMatrix
    if (!m.isIdentity()) canvas.concat(this._toCKMatrix(m))
    // opacity: 用 saveLayer + alphaf paint
    const opacity = shape.style.opacity ?? 1
    if (opacity < 1) {
        const lp = new ck.Paint(); lp.setAlphaf(opacity)
        canvas.saveLayer(lp); lp.delete()
    }
    this._applyClipPath(shape)
    // 配置累积器
    this._currentShape = shape
    this._explicitPath = null
    this._currentPath.reset()
    this._currentPath.setFillRule(shape.style.fillRule)
    this._currentPath.setStroke({
        lineWith: shape.style.lineWidth, lineCap: shape.style.lineCap,
        lineJoin: shape.style.lineJoin, miterLimit: shape.style.miterLimit,
        strokeAlign: shape.style.strokeAlign,
    })
    this._buildPaints(shape)
    shape.draw(this)  // 路径型 shape 在此构建路径或设 _explicitPath
    this._renderCurrentPath(shape)
    if (opacity < 1) canvas.restore()
    canvas.restore()
}

private _renderCurrentPath(shape: Shape): void {
    const path = this._explicitPath || this._currentPath
    const st = shape.style
    const hasFill = !!st.fillStyle
    const hasStroke = !!st.strokeStyle && (st.lineWidth ?? 0) > 0
    if (!hasFill && !hasStroke) return
    const fillPath = path.fillPath
    const center = st.strokeAlign !== 'inside' && st.strokeAlign !== 'outside'
    const drawFill = () => this.canvas.drawPath(fillPath, this._fillPaint)
    const drawStroke = () => {
        if (center) this.canvas.drawPath(fillPath, this._strokePaint)        // _strokePaint: Stroke 样式
        else        this.canvas.drawPath(path.strokePath, this._strokePaint) // _strokePaint: Fill 样式，画预计算区域
    }
    if (st.firstStroke) { if (hasStroke) drawStroke(); if (hasFill) drawFill() }
    else                { if (hasFill) drawFill();     if (hasStroke) drawStroke() }
}
```

> **strokeAlign 处理**：`center` → 用 Stroke 样式 paint 直接画 `fillPath`（支持 dash/cap/join/miter）；`inside/outside` → 用 Fill 样式 paint 画 `CKPath2D.strokePath`（已由 PathOp 预计算的填充区域）。两种 paint 在 `_buildPaints` 按 align 一次性构建。

#### 1.7 _buildPaints / _applyFillToPaint（缓存到 shape._cache）

```typescript
private _buildPaints(shape: Shape): void {
    const cache = shape._cache
    const st = shape.style
    const dirty = shape.flags.has(ElementFlag.STYLE) || !cache._ckFillPaint
    if (dirty) {
        cache._ckFillPaint?.delete();   cache._ckStrokePaint?.delete()
        cache._ckFillShader?.delete();  cache._ckFillShader = null
        cache._ckStrokeShader?.delete();cache._ckStrokeShader = null

        // fill paint
        const fp = new ck.Paint(); fp.setAntiAlias(true); fp.setStyle(ck.PaintStyle.Fill)
        this._applyFillToPaint(fp, st.fillStyle, cache, '_ckFillShader')
        cache._ckFillPaint = fp

        // stroke paint（按 align 决定样式）
        const sp = new ck.Paint(); sp.setAntiAlias(true)
        const center = st.strokeAlign !== 'inside' && st.strokeAlign !== 'outside'
        if (center) {
            sp.setStyle(ck.PaintStyle.Stroke)
            sp.setStrokeWidth(st.lineWidth)
            sp.setStrokeCap(toCKLineCap(st.lineCap))
            sp.setStrokeJoin(toCKLineJoin(st.lineJoin))
            sp.setStrokeMiter(st.miterLimit)
            if (st.lineDash?.length) {
                const pe = ck.PathEffect.MakeDash(st.lineDash, st.lineDashOffset || 0)
                if (pe) { sp.setPathEffect(pe); pe.delete() }
            }
        } else {
            sp.setStyle(ck.PaintStyle.Fill)  // 画预计算 strokePath 区域
        }
        this._applyFillToPaint(sp, st.strokeStyle, cache, '_ckStrokeShader')
        cache._ckStrokePaint = sp
    }
    this._fillPaint = cache._ckFillPaint
    this._strokePaint = cache._ckStrokePaint
}

private _applyFillToPaint(paint, fillStyle, cache, shaderKey): void {
    if (!fillStyle) { paint.setColor4f(0,0,0,0); return }
    if (fillStyle.type === 'color') {
        const c = fillStyle.value as Color
        paint.setColor4f(c[0], c[1], c[2], c[3])
    } else if (fillStyle.type === 'gradient') {
        const s = this._makeGradientShader(fillStyle as LinearGradient | RadialGradient | ConicGradient)
        if (s) { cache[shaderKey] = s; paint.setShader(s) }
    } else if (fillStyle.type === 'pattern' && (fillStyle as ImagePattern).source) {
        const s = this._makePatternShader(fillStyle as ImagePattern)
        if (s) { cache[shaderKey] = s; paint.setShader(s) }
    }
}
```

#### 1.8 _makeGradientShader / _makePatternShader

```typescript
private _makeGradientShader(g): CanvasKit.Shader | null {
    const stops = g.stops; if (!stops.length) return null
    const colors = stops.map(s => s.color as Float32Array)  // Float32Array[] 符合 InputFlexibleColorArray
    const pos = stops.map(s => s.offset)
    let shader: CanvasKit.Shader
    if (g.elementType === 'linear-gradient')
        shader = ck.Shader.MakeLinearGradient([g.x0, g.y0], [g.x1, g.y1], colors, pos, ck.TileMode.Clamp)
    else if (g.elementType === 'radial-gradient')
        shader = ck.Shader.MakeTwoPointConicalGradient([g.x0, g.y0], g.r0, [g.x1, g.y1], g.r1, colors, pos, ck.TileMode.Clamp)
    else // conic-gradient：startAngle/endAngle 在末尾
        shader = ck.Shader.MakeSweepGradient(g.x, g.y, colors, pos, ck.TileMode.Clamp, null, 0, g.startAngle, g.startAngle + 360)
    if (g.matrix && !g.matrix.isIdentity()) {
        const wrapped = shader.makeWithLocalMatrix(this._toCKMatrix(g.matrix))
        shader.delete(); return wrapped
    }
    return shader
}

private _makePatternShader(p: ImagePattern): CanvasKit.Shader | null {
    let img = (p as any)._ckImage
    if (!img) {
        img = ck.MakeImageFromCanvasImageSource(p.source)
        if (!img) return null
        ;(p as any)._ckImage = img  // 缓存在 pattern 对象上
    }
    const r = p.repeat || 'repeat'
    const tmx = (r === 'repeat' || r === 'repeat-x') ? ck.TileMode.Repeat : ck.TileMode.Decal
    const tmy = (r === 'repeat' || r === 'repeat-y') ? ck.TileMode.Repeat : ck.TileMode.Decal
    return img.makeShaderOptions(tmx, tmy, ck.FilterMode.Linear, ck.MipmapMode.None)
}
```

#### 1.9 _applyClipPath（CanvasKit 原生）

```typescript
private _applyClipPath(shape: Shape): void {
    const clip = shape.props.clipPath as any
    if (!clip) return
    let ckPath: CKPath2D | null = null
    if (clip instanceof CKPath2D) ckPath = clip
    else if (clip instanceof Shape) { clip.updateBuildPath(); ckPath = clip.path }
    if (ckPath) this.canvas.clipPath(ckPath.fillPath, ck.ClipOp.Intersect, true)
}
```

> **clipRule 限制**：v1 直接用 clipPath 自身 `fillRule`（即 `fillPath` 的 FillType），不单独应用 `shape.props.clipRule`。多数场景 `nonzero` 即默认，影响可忽略。

#### 1.10 renderImage / drawImage

```typescript
renderImage(shape: Shape): void {
    const canvas = this.canvas
    canvas.save()
    const m = shape.worldMatrix
    if (!m.isIdentity()) canvas.concat(this._toCKMatrix(m))
    const opacity = shape.style.opacity ?? 1
    if (opacity < 1) { const lp = new ck.Paint(); lp.setAlphaf(opacity); canvas.saveLayer(lp); lp.delete() }
    this._applyClipPath(shape)
    this._currentShape = shape
    shape.draw(this)  // 调 renderer.drawImage
    if (opacity < 1) canvas.restore()
    canvas.restore()
}

// 三种重载，按 CanvasRenderer 签名实现
drawImage(image, dx, dy): void
drawImage(image, dx, dy, dw, dh): void
drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh): void
drawImage(image, sx, sy, sw?, sh?, dx?, dy?, dw?, dh?): void {
    const cache = this._currentShape._cache
    let img = cache._ckImage
    if (!img || cache._ckImageSrc !== image) {
        img?.delete()
        img = ck.MakeImageFromCanvasImageSource(image as CanvasImageSource)
        cache._ckImage = img; cache._ckImageSrc = image
    }
    if (!img) return
    const paint = new ck.Paint(); paint.setAntiAlias(true)
    const iw = img.width(), ih = img.height()
    if (sw === undefined) {
        canvas.drawImage(img, sx, sy, paint)                       // 3-arg：原尺寸
    } else if (dx === undefined) {
        canvas.drawImageRect(img, ck.LTRBRect(0,0,iw,ih), ck.LTRBRect(sx, sy, sx+sw, sy+sh), paint)  // 5-arg
    } else {
        canvas.drawImageRect(img, ck.LTRBRect(sx, sy, sx+sw, sy+sh), ck.LTRBRect(dx, dy, dx+dw, dy+dh), paint)  // 9-arg
    }
    paint.delete()
}
```

#### 1.11 renderText / applyTextStyle / measureText / fillText / strokeText

```typescript
renderText(shape: Shape): void {
    canvas.save()
    // transform + opacity + clipPath（同 renderImage）
    this._currentShape = shape
    this._buildPaints(shape)   // 文本颜色用 fill/stroke paint
    this.applyTextStyle(shape) // 构建 _font
    shape.draw(this)           // 调 renderer.fillText/strokeText
    // restore
}

applyTextStyle(shape: Shape): void {
    const cache = shape._cache
    const st = shape.style
    const dirty = shape.flags.has(ElementFlag.STYLE) || !cache._ckFont
    if (dirty) {
        cache._ckFont?.delete()
        // v1：默认 typeface（null）。fontFamily/fontWeight/italic 需加载字体文件，v1 不支持。
        cache._ckFont = new ck.Font(null, st.fontSize || 16)
        // letterSpacing：canvaskit-wasm 0.41 的 Font 无 setLetterSpacing，v1 忽略（限制）
    }
    this._font = cache._ckFont
}

measureText(text: string): TextMetrics {
    if (!this._font || !text) return { width: 0 } as TextMetrics
    const glyphs = this._font.getGlyphIDs(text)
    const widths = this._font.getGlyphWidths(glyphs)
    let w = 0; for (let i = 0; i < widths.length; i++) w += widths[i]
    return { width: w } as TextMetrics
}

fillText(text, x, y, maxWidth?) { this._drawText(text, x, y, maxWidth, this._fillPaint) }
strokeText(text, x, y, maxWidth?) { this._drawText(text, x, y, maxWidth, this._strokePaint) }

private _drawText(text, x, y, maxWidth, paint): void {
    if (!text || !this._font || !paint) return
    const st = this._currentShape?.style
    const font = this._font
    let dx = 0, dy = 0
    if (st) {
        const w = this._measureWidth(font, text)
        if (st.textAlign === 'center') dx = -w/2
        else if (st.textAlign === 'right' || st.textAlign === 'end') dx = -w
        const fm = font.getMetrics()  // ascent<0, descent>0
        const tb = st.textBaseline
        if (tb === 'top') dy = -fm.ascent
        else if (tb === 'middle') dy = (fm.descent - fm.ascent) / 2 - fm.descent  // 居中
        else if (tb === 'bottom') dy = -fm.descent
        else if (tb === 'hanging') dy = -fm.ascent * 0.7
        // alphabetic/ideographic: dy = 0
    }
    // maxWidth：水平缩放（粗略实现）
    if (maxWidth && maxWidth > 0) {
        const tw = this._measureWidth(font, text)
        if (tw > maxWidth) {
            const s = maxWidth / tw
            canvas.save(); canvas.scale(s, 1)
            canvas.drawText(text, (x + dx) / s, y + dy, paint, font)
            canvas.restore(); return
        }
    }
    canvas.drawText(text, x + dx, y + dy, paint, font)
}

private _measureWidth(font, text): number {
    const g = font.getGlyphIDs(text); const w = font.getGlyphWidths(g)
    let sum = 0; for (let i = 0; i < w.length; i++) sum += w[i]; return sum
}
```

> **文本限制（v1）**：`fontFamily/fontWeight/fontStyle(italic)/letterSpacing` 不生效（需加载 Typeface 或用 Paragraph API）；`textBaseline` 用 `getMetrics` 近似映射；`maxWidth` 用水平缩放近似。`Text.ts` 的换行/多行/`calcLocalBounds` 通过 `measureText` 与 `applyTextStyle` 正常工作。

### 2. 修改 `src/core/Engine.ts`

- 顶部新增 `import { CanvasKitRenderer } from 'src/renderer/canvaskit/CanvasKitRenderer'`。
- `renderers` 注册表新增 `canvaskit: CanvasKitRenderer`：
  ```typescript
  export const renderers = {
      canvas: CanvasRenderer,
      canvaskit: CanvasKitRenderer,
  }
  ```
- `destroy()` 末尾新增渲染器清理（安全可选调用）：
  ```typescript
  ;(this.renderer as any).dispose?.()
  ```
- `renderType?: 'canvas' | 'canvaskit' | 'svg'` 已声明，无需改动。

### 3. 修改 `src/index.ts`

- 新增 `export * from './renderer/canvaskit/CanvasKitRenderer'`（与现有 `CanvasRenderer` 导出对称）。

## 关键设计决策

1. **累积器 + 显式路径双模型**：路径型 shape 经 `renderer.rect/ellipse` 累积到 `_currentPath: CKPath2D`；GraphicPath 经 `drawPath` 设 `_explicitPath` 直接复用其缓存 path。两者在 `_renderCurrentPath` 统一取 `fillPath/strokePath`，与 `CanvasRenderer` 的 `current path + ctx.fill/stroke` 模型语义对齐。
2. **strokeAlign 双 paint 策略**：`center` 用 Stroke 样式 paint 直画 `fillPath`（支持 dash/cap/join/miter）；`inside/outside` 用 Fill 样式 paint 画 `CKPath2D.strokePath` 预计算区域。避免重做 PathOp 逻辑，复用 `CKPath2D` 既有能力。
3. **opacity 用 `saveLayer(alphaf paint)`**：CanvasKit 无 `globalAlpha`，通过 `saveLayer` + `setAlphaf` paint 实现图层级透明度，restore 时按 alpha 合成。
4. **paint/font 缓存到 `shape._cache`**：按 `ElementFlag.STYLE` 脏标记重建，复刻 `CanvasRenderer` 的 `_canvasFillStyle` 缓存策略；重建前 `delete()` 旧对象防内存泄漏。
5. **矩阵直接转 Matrix3x3**：`[a,c,e,b,d,f,0,0,1]`，避免引入额外依赖。
6. **Surface 不随 resize 重建**：`MakeCanvasSurface` 绑定 GL 上下文，`canvas.width/height` 变更后 `flush()` 自适应。
7. **文本 measureText 用 `getGlyphIDs + getGlyphWidths`**：canvaskit-wasm 0.41 的 `Font` 无 `measureText`，手动求和。`Text.ts` 的换行测量与 `calcLocalBounds` 由此正常工作。
8. **clipPath 用原生 `clipPath(fillPath, Intersect, aa)`**：不走 `getClipPath2D()`（Canvas 专用），直接用 `CKPath2D.fillPath`。

## 假设与限制（v1）

- **字体**：仅默认 Typeface；`fontFamily/fontWeight/fontStyle/letterSpacing` 暂不生效（需后续加载字体文件或接入 Paragraph API）。
- **clipRule**：用 clipPath 自身 `fillRule`，不单独应用 `shape.props.clipRule`。
- **lineDash**：仅 `strokeAlign='center'` 支持；`inside/outside` 因 strokePath 是预计算填充区域，dash 不生效。
- **maxWidth（文本）**：用水平 `scale` 近似，非原生缩放。
- **textBaseline**：用 `FontMetrics.ascent/descent` 近似映射 `top/middle/bottom/hanging`。
- **Pattern**：`MakeImageFromCanvasImageSource` 假定 source 已加载；未加载时返回 null 跳过。
- **blend（混合模式）**：v1 不实现 `renderShapeWithBlend` 等价物（`CanvasRenderer` 用离屏 canvas + `globalCompositeOperation`）；`shape.style.blend` 暂按 `source-over` 渲染。可作为后续增强（用 `saveLayer` + paint blendMode）。
- **dispose**：`CanvasKitRenderer.dispose()` 已实现；Engine.destroy 末尾安全调用 `renderer.dispose?.()`。

## 验证步骤

1. **类型检查**：在 `packages/canvaskit2` 下执行 `npx tsc --noEmit`，确认 0 错误（重点关注 `ck.Font` 构造、`Shader.MakeSweepGradient` 末尾角度参数、`InputFlexibleColorArray` 接受 `Float32Array[]`、`concat(InputMatrix)` 接受 `number[]`）。
2. **导入验证**：确认 `src/index.ts` 导出 `CanvasKitRenderer`，`Engine.renderers` 含 `canvaskit` 键。
3. **冒烟测试（手动，可选）**：在 `examples/` 下新建最小示例或在现有 Engine 接入点传 `renderType: 'canvaskit'`，渲染一个 `Rect`（fill + stroke + strokeAlign='inside'）、一个 `Ellipse`、一段 `Text`、一张 `Image`、带 `clipPath` 的 `GraphicPath`，与 `canvas` 渲染器视觉对照。
4. **内存检查（可选）**：长时间运行/频繁改 style，确认无 CanvasKit 对象泄漏（paint/font/shader 重建前已 delete）。

## 实施顺序

1. 新建 `src/renderer/canvaskit/CanvasKitRenderer.ts`（按 1.1–1.11 实现）。
2. 修改 `src/core/Engine.ts`（注册 + destroy 调 dispose）。
3. 修改 `src/index.ts`（导出）。
4. `npx tsc --noEmit` 验证类型。
