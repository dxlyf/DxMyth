# 完成 CanvasKitRenderer 实现

## 摘要

CanvasKitRenderer.ts 已在前序上下文中创建并包含完整实现，但经对照 `canvaskit-wasm@0.41` 类型定义验证，发现 **3 处 API 误用** 会导致 TypeScript 编译失败。此外还需在 Engine.ts 注册渲染器、在 index.ts 导出，并运行 `tsc --noEmit` 验证。

本计划聚焦：修复 API 误用 → 注册 + 导出 → 类型验证。

---

## 当前状态分析

### 已完成
- [CanvasKitRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts) — 已创建，579 行，完整实现 Renderer 抽象契约（init/render/renderShape/renderImage/renderText/路径方法/drawPath/applyTextStyle/fillText/strokeText/measureText）

### 经 API 验证发现的 3 处编译级错误

对照 `node_modules/canvaskit-wasm/types/index.d.ts` 验证后发现：

#### 错误 1：`Paint.setColor4f()` 不存在（3 处）
`Paint` 接口无 `setColor4f` 方法。可用替代：
- `setColor(color: InputColor, colorSpace?)` — 接受 `Color | number[] | MallocObj`
- `setColorComponents(r, g, b, a, colorSpace?)` — 接受 4 个数字

受影响位置：
- [CanvasKitRenderer.ts#L183](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L183): `bgPaint.setColor4f(bg[0], bg[1], bg[2], bg[3])` → `bgPaint.setColor(bg)`（bg 是 math2.Color，继承 Float32Array，兼容 InputColor）
- [CanvasKitRenderer.ts#L314](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L314): `paint.setColor4f(0, 0, 0, 0)` → `paint.setColorComponents(0, 0, 0, 0)`
- [CanvasKitRenderer.ts#L319](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L319): `paint.setColor4f(c[0], c[1], c[2], c[3])` → `paint.setColor(c)`（c 是 Color/Float32Array）

#### 错误 2：`BlendMode.DstATOP` 大小写错误（1 处）
类型定义中枚举值为 `DstATop`（驼峰），不是 `DstATOP`。
- [CanvasKitRenderer.ts#L184](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L184): `ck.BlendMode.DstATOP` → `ck.BlendMode.DstATop`

#### 错误 3：`Shader.makeWithLocalMatrix()` 不存在（1 处）
`Shader` 类型是 `EmbindObject<"Shader">` 的别名，除 delete 外无其他方法。需将 localMatrix 直接传入 gradient 工厂方法的 `localMatrix?` 参数。

受影响位置：[CanvasKitRenderer.ts#L335-367](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L335-367) `_makeGradientShader` 方法。

修复方式：移除尾部 `if (shader && g.matrix && !g.matrix.isIdentity()) { ... makeWithLocalMatrix ... }` 块，改为在 3 个工厂方法调用时直接传入 localMatrix 参数：
```typescript
const lm = (g.matrix && !g.matrix.isIdentity()) ? this._toCKMatrix(g.matrix) : undefined
// linear
shader = ck.Shader.MakeLinearGradient([lg.x0, lg.y0], [lg.x1, lg.y1], colors, pos, ck.TileMode.Clamp, lm)
// radial
shader = ck.Shader.MakeTwoPointConicalGradient([rg.x0, rg.y0], rg.r0, [rg.x1, rg.y1], rg.r1, colors, pos, ck.TileMode.Clamp, lm)
// conic (localMatrix 类型为 InputMatrix | null，接受 undefined)
shader = ck.Shader.MakeSweepGradient(cg.x, cg.y, colors, pos, ck.TileMode.Clamp, lm, 0, startDeg, startDeg + 360)
```

### 已验证正确的 API（无需修改）
- `ck.MakeCanvasSurface(canvas)` — 返回 `Surface | null`（标记 @deprecated 但仍可用）
- `Surface.getCanvas()/flush()/delete()` ✓
- `Canvas.clear/save/restore/saveLayer/concat/clipPath/drawPath/drawImage/drawImageRect/drawText/drawRect` ✓
- `Paint` 的 `setAntiAlias/setStyle/setStrokeWidth/setStrokeCap/setStrokeJoin/setStrokeMiter/setPathEffect/setShader/setAlphaf/setBlendMode` ✓
- `PathEffect.MakeDash(intervals, phase?)` ✓
- `Shader.MakeLinearGradient/MakeTwoPointConicalGradient/MakeSweepGradient` ✓（pos 参数为 `number[] | null`，传入 number[] 兼容）
- `Image.makeShaderOptions(tx, ty, fm, mm)` ✓；`FilterMode.Linear`/`MipmapMode.None` 枚举值 ✓
- `ck.MakeImageFromCanvasImageSource(src)` — 返回 `Image`（非空）
- `new ck.Font(null, size)` ✓；`Font.getGlyphIDs/getGlyphWidths/getMetrics` ✓
- `FontMetrics.ascent/descent` ✓
- `ck.Color4f(r,g,b,a?)` — 返回 `Color`（= Float32Array）✓
- `ck.LTRBRect(l,t,r,b)` ✓
- `BlendMode.DstATop`、`PaintStyle.Fill/Stroke`、`TileMode.Clamp/Repeat/Decal`、`ClipOp.Intersect` ✓
- `InputMatrix` 接受 `number[]` ✓；`InputFlexibleColorArray` 接受 `Float32Array[]` ✓
- `InputColor = MallocObj | Color | number[]`，math2.Color 继承 Float32Array，兼容 ✓

### 未完成
- Engine.ts 未注册 `canvaskit` 渲染器
- index.ts 未导出 CanvasKitRenderer
- 未运行类型验证

---

## 实施步骤

### 步骤 1：修复 CanvasKitRenderer.ts 的 3 处 API 误用

**文件**：[CanvasKitRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts)

**1a. 修复 `_renderAfter` 中的 setColor4f + BlendMode 大小写**（约 L183-184）
```typescript
// 修改前
bgPaint.setColor4f(bg[0], bg[1], bg[2], bg[3])
bgPaint.setBlendMode(ck.BlendMode.DstATOP)
// 修改后
bgPaint.setColor(bg)
bgPaint.setBlendMode(ck.BlendMode.DstATop)
```

**1b. 修复 `_applyFillToPaint` 中的 setColor4f**（约 L314, L319）
```typescript
// 修改前（透明色分支）
paint.setColor4f(0, 0, 0, 0)
// 修改后
paint.setColorComponents(0, 0, 0, 0)

// 修改前（color 分支）
const c = (fillStyle as any).value as Color
paint.setColor4f(c[0], c[1], c[2], c[3])
// 修改后
const c = (fillStyle as any).value as Color
paint.setColor(c)
```

**1c. 修复 `_makeGradientShader` 中的 makeWithLocalMatrix**（约 L335-367）

将 localMatrix 直接传入工厂方法，移除尾部包装逻辑：
```typescript
private _makeGradientShader(g: LinearGradient | RadialGradient | ConicGradient): CanvasKit.Shader | null {
    const stops = g.stops
    if (!stops || !stops.length) return null
    const colors = stops.map(s => s.color as Float32Array)
    const pos = stops.map(s => s.offset)
    const lm = (g.matrix && !g.matrix.isIdentity()) ? this._toCKMatrix(g.matrix) : undefined
    let shader: CanvasKit.Shader | null = null
    if (g.elementType === 'linear-gradient') {
        const lg = g as LinearGradient
        shader = ck.Shader.MakeLinearGradient([lg.x0, lg.y0], [lg.x1, lg.y1], colors, pos, ck.TileMode.Clamp, lm)
    } else if (g.elementType === 'radial-gradient') {
        const rg = g as RadialGradient
        shader = ck.Shader.MakeTwoPointConicalGradient([rg.x0, rg.y0], rg.r0, [rg.x1, rg.y1], rg.r1, colors, pos, ck.TileMode.Clamp, lm)
    } else {
        const cg = g as ConicGradient
        const startDeg = cg.startAngle * 180 / Math.PI
        shader = ck.Shader.MakeSweepGradient(cg.x, cg.y, colors, pos, ck.TileMode.Clamp, lm, 0, startDeg, startDeg + 360)
    }
    return shader
}
```

### 步骤 2：修改 Engine.ts 注册 canvaskit 渲染器 + destroy 调 dispose

**文件**：[Engine.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Engine.ts)

**2a. 顶部新增 import**（L9 后）
```typescript
import { CanvasKitRenderer } from 'src/renderer/canvaskit/CanvasKitRenderer'
```

**2b. `renderers` 注册表新增 canvaskit**（L16-18）
```typescript
export const renderers = {
    canvas: CanvasRenderer,
    canvaskit: CanvasKitRenderer,
}
```

**2c. `destroy()` 末尾新增渲染器清理**（L145-150）
```typescript
destroy() {
    this.eventSystem.stop()
    this.animationSystem.stop()
    this.pluginSystem.unregisterPlugins()
    this.emit('destroy', this)
    ;(this.renderer as any).dispose?.()
}
```

说明：用 `as any` + 可选链 `?.` 安全调用，CanvasRenderer 无 dispose 方法也不会报错。

### 步骤 3：修改 index.ts 导出 CanvasKitRenderer

**文件**：[index.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/index.ts)

在 `export * from './renderer/canvas/CanvasRenderer'`（L3）后新增：
```typescript
export * from './renderer/canvaskit/CanvasKitRenderer'
```

### 步骤 4：运行 `npx tsc --noEmit` 验证类型

```powershell
cd e:\fanyonglong\projects\private\dxMyth\packages\canvaskit2; npx tsc --noEmit
```

预期：0 errors。如有残留错误，按错误信息逐个修复（可能涉及类型窄化、`as` 断言等）。

---

## 假设与限制

1. **`ck` 单例已初始化**：Engine.initialize() 中 `await getCanvasKit()` 在 `new renderers[...]` 之前执行，故 CanvasKitRenderer 构造时 `ck` 已就绪。
2. **math2.Color 与 CanvasKit.Color 兼容**：math2.Color 继承 Float32Array，CanvasKit.Color = Float32Array，结构兼容，可直接传给接受 InputColor 的 API。
3. **v1 限制（沿用前序计划）**：
   - 字体仅默认 Typeface（fontFamily/fontWeight/italic 不生效）
   - letterSpacing 忽略（canvaskit-wasm 0.41 的 Font 无 setLetterSpacing）
   - clipRule 用 clipPath 自身 fillRule
   - lineDash 仅 center align 支持（inside/outside 走预计算 strokePath，不应用 dash）
   - blend 混合模式暂按 source-over（未实现 renderShapeWithBlend 对应逻辑）
   - maxWidth 用水平缩放近似
4. **dispose 安全调用**：CanvasRenderer 无 dispose 方法，用 `(this.renderer as any).dispose?.()` 安全调用。

---

## 验证步骤

1. **tsc 类型验证**：`npx tsc --noEmit` 输出 0 errors
2. **导出验证**：`import { CanvasKitRenderer } from '@dxyl/canvaskit2'` 可解析
3. **注册验证**：`new Engine().initialize({ renderType: 'canvaskit' })` 能正确实例化 CanvasKitRenderer（运行时验证，需手动测试）

---

## 实施顺序

1. ✅ 新建 CanvasKitRenderer.ts（前序已完成）
2. ⬜ 步骤 1：修复 3 处 API 误用
3. ⬜ 步骤 2：修改 Engine.ts（注册 + dispose）
4. ⬜ 步骤 3：修改 index.ts（导出）
5. ⬜ 步骤 4：tsc 验证
