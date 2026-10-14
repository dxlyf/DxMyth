import { PathBuilder, FlattenedContour, FlattenOptions } from './PathBuilder.js';
import { Vector2Like } from './Vector2.js';
/** 一小段「实线」折线。`closed` 表示它完整覆盖了一条闭合子轮廓。 */
interface DashFragment {
    readonly points: Vector2Like[];
    readonly closed: boolean;
}
/**
 * 虚线与相位。
 *
 * `intervals` 是用户空间的长度序列（**不随线宽缩放** —— 这一点与 SVG 不同，
 * Canvas 的 `setLineDash` 值就是用户单位长度）。
 */
export interface DashStyle {
    readonly intervals: readonly number[];
    /**
     * 从图案起点起、开始绘制的偏移量，对应 Canvas 的 `lineDashOffset`。
     *
     * 例如 `intervals = [5, 5]`、`phase = 5` 表示从「空白段」中间开始，
     * 因此该子路径以 5 单位长的**空隙**开头。
     */
    readonly phase?: number;
}
/** 归一化之后的虚线：间隔数为偶数、总长 > 0、相位落在 `[0, total)`。 */
interface ResolvedDash {
    readonly intervals: readonly number[];
    readonly total: number;
    readonly phase: number;
}
/**
 * 归一化虚线参数。
 *
 * 规则：
 * - `null` / `undefined` / 空数组 → 不虚化（返回 null）；
 * - 负数或非有限值 → 抛 RangeError（对应 `setLineDash` 的非法输入）；
 * - **奇数长度会整段复制一遍**；
 * - 全部为 0 → 视为实线（返回 null）；
 * - `phase` 对总长取模归一到 `[0, total)`。
 */
export declare function normalizeDash(dash: DashStyle | null | undefined): ResolvedDash | null;
export interface DashPathOptions extends FlattenOptions {
    /**
     * 相位是否在每条子轮廓处重置。默认 `true`。
     *
     * 这是一个**被刻意钉死的选择**：Canvas / SVG 生态里两种行为都出现过，upstream
     * `SkDashPath::filterPath` 对每个 contour 的处理需要单独核实。默认取「每条子轮廓
     * 独立虚化」（SVG 1.1 的表述），因为它更符合「每条子路径是独立图形」的直觉。
     * 若日后核实为跨子路径连续，只需把这个开关默认值翻转，并有测试固定当前行为。
     */
    readonly resetPhasePerContour?: boolean;
}
/**
 * 对已扁平化的子轮廓施加虚线，输出若干段折线。
 *
 * 输入应当已经在**中线**上（虚线作用于中线，之后才描边），并且 `autoClose` 为 false，
 * 这样开放子路径的端点才能正确产生端帽。
 */
export declare function dashContours(contours: readonly FlattenedContour[], dash: DashStyle | null | undefined, resetPhasePerContour?: boolean): DashFragment[];
/**
 * 对路径施加虚线，返回**只含直线**的开放子路径集合。
 *
 * 管线顺序固定为 **dash → stroke → fill(nonzero)**：虚线作用于中线，描边负责给每个
 * 虚线段加端帽，最后由非零填充生成的轮廓。
 */
export declare function dashPath(path: PathBuilder, dash: DashStyle | null | undefined, options?: DashPathOptions): PathBuilder;
export {};
