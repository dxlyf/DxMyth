import { BoundingRect } from '../math/BoundingRect';
import { Path2D, IPath2DReadable } from '../math/Path2D';
import { Element, ElementProps } from './Element';
import { Paint, BlendMode, FillRule, LineCap, LineJoin, PaintOrder, PaintSource, ShadowPaint, StrokeAlign } from './Paint';
import { Renderer2D } from './Renderer2D';
/** 图元的绘制样式属性，统一描述填充、描边与合成方式 */
export type DisplayObjectProps = ElementProps & {
    /** 填充源，null 表示不填充 */
    fill: PaintSource | null;
    /** 描边源，null 表示不描边 */
    stroke: PaintSource | null;
    opacity: number;
    fillRule: FillRule;
    lineWidth: number;
    lineCap: LineCap;
    lineJoin: LineJoin;
    miterLimit: number;
    strokeAlign: StrokeAlign;
    /** 虚线模式（数组本身被原地修改时需手动调用 invalidatePaint） */
    lineDash: number[];
    lineDashOffset: number;
    /** 混合模式，与底层画布 globalCompositeOperation 语义一致 */
    blend: BlendMode;
    /** fill / stroke 的绘制顺序，默认先 fill 后 stroke */
    paintOrder: PaintOrder;
    /** 阴影，null 表示无阴影；对象内部字段被原地修改时需手动调用 invalidatePaint */
    shadow: ShadowPaint | null;
    /**
     * 剪切路径，null 表示不剪切。
     *
     * 路径坐标与图元同一局部坐标系；后端需能读取命令流（IPath2DReadable），
     * 才会按路径生成裁剪区域。路径内容被原地修改时需手动调用 invalidateClip。
     */
    clip: IPath2DReadable | null;
};
/**
 * 渲染图元基类。
 *
 * 图元 = 路径（Path2D）+ 样式（Paint）。子类往 `path` 里记录命令，
 * 由后端在 `render` 时把路径转成各自的绘制资源：
 * - Canvas 后端直接把命令重放给原生 Path2D；
 * - WebGL / WebGPU 后端遍历命令做三角化，结果存放在 `geometryCache`。
 *
 * ```ts
 * class Circle extends DisplayObject {
 *     constructor(x: number, y: number, r: number) {
 *         super({ fill: '#f00' })
 *         this.circle(x, y, r)
 *     }
 *     private circle(x: number, y: number, r: number) {
 *         this.path.arc(x, y, r, 0, Math.PI * 2)
 *         this.invalidatePath()
 *     }
 * }
 * ```
 */
export declare class DisplayObject<Props extends DisplayObjectProps = DisplayObjectProps> extends Element<Props> {
    type: string;
    /** 图元持有的路径，子类通过 IPath2D 方法往里面记录命令 */
    readonly path: Path2D;
    /**
     * 几何缓存，由渲染后端按自身规则写入（如 'fill' / 'stroke'）。
     *
     * 后端用 `path.version` 判断缓存是否失效，避免每次绘制都重新三角化。
     */
    readonly geometryCache: Map<string, unknown>;
    /** 由 props 构建的绘制样式，样式属性变化时重建 */
    private _paint;
    /** 当前绘制样式（懒构建） */
    get paint(): Paint;
    getDefaultProps(): Partial<Props>;
    /** 根据 props 创建绘制样式，子类可覆写以追加自定义字段 */
    protected createPaint(): Paint;
    setProp<K extends Extract<keyof Props, string>>(prop: K, value: Props[K]): void;
    /** 样式变化后调用：丢弃 Paint 缓存并标记重绘 */
    invalidatePaint(): void;
    /** 剪切路径内容变化后调用：标记重绘 */
    invalidateClip(): void;
    /** 路径命令变化后调用：包围盒失效并标记重绘 */
    invalidatePath(): void;
    /**
     * 图元局部包围盒。
     *
     * 曲线取控制点包络、圆弧取圆心 ± 半径，属于偏保守的近似值，
     * 足够用于视口裁剪与合批，不作为精确几何范围使用。
     */
    calcBounds(out: BoundingRect): void;
    /** 绘制范围：世界包围盒再按描边宽度、阴影模糊与偏移外扩 */
    calcPaintBounds(out: BoundingRect): void;
    /** 渲染入口：把路径交给后端绘制，有剪切路径时先建立裁剪区域；子类可覆写以绘制多段几何 */
    render(renderer: Renderer2D): void;
    dispose(): void;
}
