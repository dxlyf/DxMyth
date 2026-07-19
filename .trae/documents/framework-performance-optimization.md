# 框架级渲染性能优化方案

## 摘要

用户反馈"示例这种提升用处不大，我更想是从框架层面提升性能"。目标：让基于引擎元素树（`Rect` 元素 + `Scene` + `Engine` 自动渲染）的正常使用方式下，5000+ 移动矩形在 Canvas 和 CanvasKit 两种渲染器下都能达到 40 FPS+，并尽量逼近 60 FPS。优化必须落在**框架层**，使所有基于框架的应用自动受益，而非示例层的绕过式优化。

## 当前状态分析（瓶颈定位）

### 场景建模
5000 个 `Rect` 元素加入 `Scene`，每帧通过 `rect.position.set(x, y)` 更新位置（边界反弹），由 `Engine` 的 `tick → render` 自动驱动渲染。每帧执行链路：

```
position.set → Transform.onChange → Element.flags.add(TRANSFORM)
  → resolveAllDependencies(TRANSFORM)
  = TRANSFORM | WORLD_BOUNDS | REPAINT | REFLOW   ← 关键问题：TRANSFORM 触发 REFLOW

Engine.tick → Engine.render → Renderer.render(scene)
  → Scene.getRenderElements(viewport, updateElements=true)
      needReflow = root.flags.include(REFLOW)  // 每帧 true
      → renderElements.length = 0
      → root.traverseDescendant(5000 次 onBeforeUpdate/onUpdate/onAfterUpdate)
      → 5000 次 push 到 renderElements
      → renderElements.sort(by zIndex)          // 5000 元素排序
      → rtree.clear() + rtree.load(5000)        // R-tree 全量重建
  → for shape in renderList: shape.render(renderer)
      → Renderer.renderShape(shape) × 5000
```

### 三大瓶颈

#### 瓶颈 1：TRANSFORM → REFLOW 依赖导致每帧全量重排
- [ElementFlags.ts:31](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/ElementFlags.ts#L31) `FLAG_DEPENDENCIES` 中 `TRANSFORM: WORLD_BOUNDS | REPAINT | REFLOW`
- `Element.onAfterUpdate` 调用 `flags.clear()` 清除所有 flag，所以每帧 `position.set` 都重新触发 TRANSFORM → REFLOW
- `Scene.getRenderElements` 在 `needReflow=true` 时执行：`renderElements.length=0` + `traverseDescendant` + `sort` + `rtree.load`
- 5000 元素每帧执行这套流程，开销巨大且无意义（元素数量、zIndex 未变，仅位置变化）

#### 瓶颈 2：CanvasKit renderShape 每元素重建 Path + 高 draw call
- [CanvasKitRenderer.ts:294](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L294) `this._currentPath.reset()` → `markDirty()` → `_fillPath` 缓存失效
- [CanvasKitRenderer.ts:319](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts#L319) `path.fillPath` getter 因 `_fillPath=null` 调 `detach()` 重建 Path
- [CKPath2D.ts:69-75](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/ck/CKPath2D.ts#L69-L75) `fillPath` getter 缓存被 `reset()` 触发的 `markDirty` 失效
- 每个 shape 一次 `drawPath` → 5000 次 JS→WASM→GPU draw call（CanvasKit 最大瓶颈，实测 8000 矩形 ~6 FPS）

#### 瓶颈 3：Canvas renderShape 每元素 save/beginPath/fill/restore
- [CanvasRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvas/CanvasRenderer.ts) 每 shape 一次完整路径构建 + fill
- Canvas 2D `fillRect` 极快，但走元素树流程仍有 save/transform/applyStyle/clipPath 开销
- 实测 Canvas 5000 矩形接近 60 FPS，优化空间小但应保持一致

### 关键发现（设计意图）
- [Rect.ts:55-57](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/scene/Rect.ts#L55-L57) `Rect` 重写 `render` 跳过 `updateBuildPath()`，直接调 `renderer.renderShape(this)`
- 路径型 shape（Rect/Ellipse/Star 等）通过 `draw()` 累积到 `renderer._currentPath`，不使用 `shape.path`
- 仅 `GraphicPath` 通过 `drawPath(this.path)` 走 `_explicitPath` 分支，复用 `shape.path` 缓存
- **结论**：原框架设计意图是路径型 shape 不缓存 shape.path，所以"复用 shape.path 缓存"方案不适用，需走批量渲染

## 提议改动

### 改动 1：解除 TRANSFORM → REFLOW 依赖（核心）

**文件**：[packages/canvaskit2/src/core/ElementFlags.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/ElementFlags.ts)

**改什么**：修改 `FLAG_DEPENDENCIES`，`TRANSFORM` 不再触发 `REFLOW`，只触发 `WORLD_BOUNDS | REPAINT`。

**为什么**：`REFLOW` 的语义是"需要重新布局/重排"——即元素列表结构变化（增删、zIndex 变化、shape 几何变化导致包围盒变化）。位置变化只是世界坐标变化，不应触发列表重建。解除后，5000 移动矩形不再每帧重建 `renderElements` + 排序 + `rtree.load`。

**怎么改**：
```typescript
const FLAG_DEPENDENCIES: Record<number, number> = {
    [ElementFlag.SHAPE]: ElementFlag.PATH | ElementFlag.REPAINT,
    [ElementFlag.STYLE]: ElementFlag.PAINT_BOUNDS | ElementFlag.REPAINT,
    // TRANSFORM 不再触发 REFLOW：位置变化只影响 worldBounds 和重绘，
    // 不影响元素列表结构（增删/zIndex/几何）。REFLOW 由 CHILDREN/PATH/SHAPE 触发。
    [ElementFlag.TRANSFORM]: ElementFlag.WORLD_BOUNDS | ElementFlag.REPAINT,
    [ElementFlag.PATH]: ElementFlag.BOUNDS | ElementFlag.PAINT_BOUNDS | ElementFlag.REFLOW,
    [ElementFlag.BOUNDS]: ElementFlag.WORLD_BOUNDS,
    [ElementFlag.CHILDREN]: ElementFlag.REFLOW | ElementFlag.REPAINT,
}
```

**风险与缓解**：
- `worldBounds` 变化后 `rtree` 中的元素位置过期 → 视口剔除/picker 可能不准
- 缓解：`rtree` 主要服务于 `PickerSystem`（点击检测）。渲染流程使用 `renderElements` 列表（按 zIndex 排序，稳定），不依赖 `rtree`。对于"全屏可见"的移动矩形场景，视口剔除本来全部可见，`rtree` 失效无影响
- 若 `PickerSystem` 需要准确 rtree，可在 picker 查询时按需重建（或对移动元素禁用 rtree 索引，picker 走线性遍历）。本方案暂不处理 picker，保持 rtree 仅在 REFLOW 时重建的行为
- `viewport.isVisible` 在 `getRenderElements` 中只在 `needReflow` 时调用，解除依赖后不再每帧剔除——这是期望行为（移动元素不会因移动而消失出列表）

### 改动 2：CanvasKit 批量渲染（核心）

**文件**：[packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvaskit/CanvasKitRenderer.ts)

**改什么**：在 `render(scene)` 中，先扫描 `renderList` 收集 batchable 元素按颜色分组批量绘制，剩余非 batchable 元素走原 `renderShape` 路径。

**为什么**：CanvasKit draw call 数量是核心瓶颈（JS→WASM→GPU 提交开销）。5000 矩形 10 种颜色，按颜色分组用 `PathBuilder.addRect` 累积 world 坐标，每组一次 `drawPath`，将 5000 次 draw call 降到 10 次。实测示例层批量方案 8000 矩形从 6 FPS → 24 FPS（4 倍），5000 矩形稳定 42-44 FPS。

**怎么改**：

1. 新增 `_batchPathBuilder: CanvasKit.PathBuilder` 和 `_batchPaint: CanvasKit.Paint` 成员（`init` 中创建，`dispose` 中释放），复用避免 GC

2. 新增 `isBatchable(shape: Shape): boolean` 方法，判断条件：
   - `shape.style.opacity === 1`
   - `!shape.props.clipPath`（无裁剪）
   - `shape.style.fillStyle?.type === 'color'`（纯色填充）
   - `!shape.style.strokeStyle` 或 `lineWidth === 0`（无描边）
   - `shape.style.shadowBlur === 0`（无阴影）
   - `shape.type === 'Rect'` 且 `!shape.props.shape.radius`（矩形且无圆角；圆角走 PathBuilder.addRRect 也可批量，但首版仅支持直角矩形简化）
   - `shape.worldMatrix` 仅平移（无旋转/缩放/倾斜）——平移可烘焙到坐标，非平移需走原路径
   
3. 修改 `render(scene)`：
```typescript
render(scene: Scene): void {
    const renderList = scene.getRenderElements(this.viewport, true) as Shape[]
    this._renderBefore()
    // 分区：前段 batchable（按颜色分组批量），后段 non-batchable（逐个 renderShape）
    // 首次遍历收集 batchable，记录到 _batchGroups: Map<color, Array<Shape>>
    // 同时收集 non-batchable 到 _deferredList
    this._collectBatches(renderList)
    // 先绘制 batchable（按颜色分组）
    this._flushBatches()
    // 再绘制 non-batchable
    for (let i = 0; i < this._deferredList.length; i++) {
        try { this._deferredList[i].render(this) }
        catch (err) { console.error(...); break }
    }
    this._renderAfter()
}
```

4. `_collectBatches`：遍历 renderList，batchable 的按 `fillStyle.value`（Color 对象）做 key 分组（Color 相等性需用 RGBA 值比较，可缓存 key 字符串到 `shape._cache._batchKey`）。non-batchable 入 `_deferredList`。**注意批次顺序**：同色 batchable 之间无顺序要求（z-index 相同），但 batchable 与 non-batchable 的相对顺序需保持（non-batchable 在 batchable 之后绘制，覆盖在上层）。若场景中 batchable 与 non-batchable 交错且 z-index 混合，首版接受"所有 batchable 先画、所有 non-batchable 后画"的简化（移动矩形场景全是 batchable，无影响）

5. `_flushBatches`：遍历 `_batchGroups`，每组：
   - `pb = this._batchPathBuilder`
   - 对组内每个 shape：`worldMatrix` 平移量 `(tx, ty)` 烘焙到 rect 坐标，`pb.addRect([x+tx, y+ty, x+w+tx, y+h+ty])`（用 LTRB 或 XYWH 视 addRect 签名）
   - `path = pb.detach()`（取出 Path，PathBuilder 自动重置）
   - `_batchPaint.setColor(color)`，`canvas.drawPath(path, _batchPaint)`
   - `path.delete()`（detach 出来的 Path 需手动释放）

6. `dispose` 中释放 `_batchPathBuilder` 和 `_batchPaint`

**为什么用 LTRB 而非 XYWH**：`PathBuilder.addRect` 接受 `[l, t, r, b]`（LTRB），与示例层批量方案一致，已验证可行。

**worldMatrix 平移烘焙**：对于纯平移矩阵 `[1,0,0,1,tx,ty]`，rect 的 local 坐标 `(x,y,w,h)` 烘焙后为 `(x+tx, y+ty, w, h)`。需在 `isBatchable` 中校验 `worldMatrix` 是纯平移（a===1 && b===0 && c===0 && d===1）。若 Group 嵌套导致 worldMatrix 非纯平移，则该 shape 不 batchable。

### 改动 3：CanvasRenderer 批量渲染（次要，保持一致性）

**文件**：[packages/canvaskit2/src/renderer/canvas/CanvasRenderer.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/renderer/canvas/CanvasRenderer.ts)

**改什么**：类似 CanvasKit，在 `render(scene)` 中收集 batchable 按颜色分组 `fillRect`。

**为什么**：Canvas 2D `fillRect` 性能极佳，但走元素树流程仍有 save/transform/applyStyle/clipPath 开销。批量后 5000 矩形从 ~50 FPS 提升到满帧 60 FPS，保持与 CanvasKit 一致的优化路径。

**怎么改**：

1. 新增 `_batchGroups: Map<string, Array<Shape>>` 和 `_deferredList: Array<Shape>` 成员

2. 复用 `CanvasKitRenderer.isBatchable` 的判断逻辑（可抽到 `Renderer` 基类或 `Shape` 静态方法，避免重复）。首版在两个 renderer 各自实现，逻辑相同

3. 修改 `render(scene)`：
```typescript
render(scene: Scene): void {
    const renderList = scene.getRenderElements(this.viewport, true) as Shape[]
    this._renderBefore()
    this._collectBatches(renderList)
    this._flushBatches()  // ctx.fillStyle = color; for shape in group: ctx.fillRect(...)
    for (const shape of this._deferredList) shape.render(this)
    this._renderAfter()
}
```

4. `_flushBatches`：每组 `ctx.fillStyle = cssColor`，组内每个 shape `ctx.fillRect(x+tx, y+ty, w, h)`（worldMatrix 平移烘焙）

5. `ctx.fillStyle` 缓存：用 `shape._cache._canvasFillStyle`（已有缓存逻辑）作为 batch key

### 改动 4：抽取 isBatchable 到 Shape 基类（复用）

**文件**：[packages/canvaskit2/src/core/Shape.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/src/core/Shape.ts)

**改什么**：在 `Shape` 基类新增 `isBatchable(): boolean` 方法，默认 `false`。在 `Rect` 中重写返回 `true`（当满足批量条件时）。

**为什么**：批量判断逻辑需要访问 `style`/`props`/`worldMatrix`，放在 `Shape` 基类更自然，避免 renderer 重复实现。具体 shape 决定自己是否支持批量（`Rect` 支持，`GraphicPath`/`Text`/`Image` 不支持）。

**怎么改**：
```typescript
// Shape.ts
isBatchable(): boolean {
    if (this.props.clipPath) return false
    const st = this.style
    if (st.opacity !== 1) return false
    if (st.shadowBlur && st.shadowBlur > 0) return false
    if (st.strokeStyle && (st.lineWidth ?? 0) > 0) return false
    if (!st.fillStyle || st.fillStyle.type !== 'color') return false
    // worldMatrix 必须纯平移
    const m = this.worldMatrix
    if (m[0] !== 1 || m[1] !== 0 || m[2] !== 0 || m[3] !== 1) return false
    return true
}
```
```typescript
// Rect.ts
isBatchable(): boolean {
    if (this.props.shape.radius) return false  // 圆角首版不批量
    return super.isBatchable()
}
```

Renderer 的 `isBatchable` 调用改为 `shape.isBatchable()`。

### 改动 5：更新性能示例为框架驱动模式

**文件**：[packages/canvaskit2/examples/performance/main.ts](file:///e:/fanyonglong/projects/private/dxMyth/packages/canvaskit2/examples/performance/main.ts)

**改什么**：删除绕过框架的批量绘制代码，改为使用 `Rect` 元素 + `Scene` + `Engine` 自动渲染的标准模式。

**为什么**：验证框架层优化效果，让用户在"正常使用方式"下达到 40 FPS+。

**怎么改**：
```typescript
// 创建 Rect 元素加入 Scene，每帧 position.set 更新位置
const rects: Rect[] = []
for (let i = 0; i < count; i++) {
    const rect = new Rect({ shape: { x: 0, y: 0, width: w, height: h }, style: { fillStyle: color } })
    engine.scene.add(rect)
    rects.push(rect)
}
// tick 中更新位置
engine.on('tick', (delta) => {
    for (let i = 0; i < rects.length; i++) {
        const r = rects[i]
        // 更新 vx/vy，边界反弹
        r.position.set(nx, ny)
    }
    engine.refresh()  // 触发重绘
})
```

保留 FPS 统计和 UI 切换逻辑。删除 `ckPathBuilder`/`ckPaint`/`drawCanvasKit`/`drawCanvas` 等绕过框架的代码。

## 假设与决策

### 假设
1. 5000 移动矩形场景中，所有矩形满足 batchable 条件（纯色 fill、无 stroke、无 clip、opacity=1、纯平移）
2. `Color` 对象的相等性可通过 RGBA 值比较（同为 `Color.fromInput` 生成的同色对象，RGBA 值相等）。batch key 用 `color.toRGBAString()` 或缓存到 `shape._cache._batchKey`
3. `PathBuilder.addRect` 接受 LTRB 格式 `[l, t, r, b]`（与示例层验证一致）
4. 解除 TRANSFORM → REFLOW 依赖后，picker 系统的 rtree 失效可接受（首版不处理，移动矩形场景无 picker 需求）

### 决策
1. **批量顺序简化**：首版"所有 batchable 先画、所有 non-batchable 后画"，不做 z-index 混合排序。理由：移动矩形场景全是 batchable，无影响；混合场景首版接受视觉偏差，后续可按 z-index 分段批量
2. **Rect 圆角不批量**：首版仅直角矩形批量，圆角走原路径。`PathBuilder.addRRect` 支持但增加复杂度，后续可扩展
3. **worldMatrix 纯平移才批量**：旋转/缩放/倾斜的 shape 不批量，避免矩阵变换复杂性。Group 嵌套导致 worldMatrix 非纯平移的 shape 也不批量
4. **不修改 Rect.render 跳过 updateBuildPath 的设计**：保持现有路径型 shape 用 `_currentPath` 累积的设计，批量渲染在 renderer 层短路，不改变 shape 的 render 契约
5. **CanvasRenderer 也实施批量**：保持两个 renderer 优化路径一致，避免性能差异误导用户

## 验证步骤

1. **类型检查**：`cd packages/canvaskit2 && npx tsc --noEmit`，要求 0 错误
2. **框架驱动性能测试**：访问 `http://localhost:8429/examples/performance/`，切换 Canvas/CanvasKit 渲染器，测试 1000/3000/5000/8000 矩形：
   - CanvasKit 5000 矩形 ≥ 40 FPS（目标）
   - CanvasKit 8000 矩形 ≥ 25 FPS（从原 ~6 FPS 提升）
   - Canvas 任意数量满帧 60 FPS
3. **视觉一致性**：批量渲染与原逐元素渲染视觉一致（颜色、位置、层级）
4. **功能回归**：现有示例（examples 下其他 demo）正常渲染，无元素丢失/错位
5. **内存检查**：`dispose` 正确释放 `_batchPathBuilder`/`_batchPaint`，无 CanvasKit 对象泄漏

## 实施顺序

1. 改动 1（ElementFlags 解除依赖）→ 单独验证 renderElements 不再每帧重建
2. 改动 4（Shape.isBatchable）→ 提供 batchable 判断基础设施
3. 改动 2（CanvasKit 批量渲染）→ 核心性能提升
4. 改动 3（Canvas 批量渲染）→ 保持一致性
5. 改动 5（示例改为框架驱动）→ 验证端到端效果
6. 全量 tsc + 浏览器测试

## 预期收益

- CanvasKit 5000 移动矩形：~6 FPS → 40+ FPS（批量渲染降 draw call）
- CanvasKit 8000 移动矩形：~6 FPS → 25+ FPS
- Canvas 5000 移动矩形：~50 FPS → 60 FPS（满帧）
- 框架层优化，所有基于引擎的应用自动受益（无需用户改代码）
