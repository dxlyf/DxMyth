import { FlattenedContour } from './PathBuilder';
import { StrokeOptions } from './PathStroke';
/**
 * 多边形描边选项：在通用描边选项（StrokeOptions）基础上增加 offset 对齐参数。
 */
export type PolygonStrokerOptions = StrokeOptions & {
    /**
     * 描边相对路径中心线的偏移比例，取值 [0,1]。
     * 0.5 为居中（默认）；0 表示整体偏向一侧，1 表示偏向另一侧。
     */
    alignment?: number;
};
/**
 * 生成描边轮廓。
 *
 * 与 PathStroke 输出「一条合并轮廓」不同，这里把描边区域按图元拆成一组彼此独立的多边形：
 *   - 每段折线        -> 一个四边形（线段主体）；
 *   - 每个拐点        -> 一个 join 多边形（miter / bevel / round，只补在凸角外侧的缺口处）；
 *   - 每个开放端点    -> 一个 cap 多边形（butt / round / square）。
 *
 * 每个输出多边形都尽量保持凸性，便于后续直接三角化（earcut / 扇形展开）。
 *
 * @param contours 展平后的折线轮廓（PathBuilder.getSubPaths 的产物）
 * @param options  描边选项
 * @returns 一组闭合多边形，每项形如 { points, closed:true }
 */
export declare function generateOutline(contours: FlattenedContour[], options?: PolygonStrokerOptions): FlattenedContour[];
/**
     * 把中心线整体沿法向平移，使「原生居中描边」等价于 generateOutline 的 alignment 描边。
     *
     * alignment=0.5 时不平移；band 中线相对中心线的偏移为 lineWidth*(alignment-0.5)。
     * 内部顶点沿角平分线平移，使到相邻两段法向的垂直距离都等于该偏移量：
     *   offsetVec = (n0 + n1) * shift / (1 + n0·n1)
     * 开放路径的首末顶点用所在段的单侧法向平移。
     */
export declare function offsetOutlineForAlignment(contour: FlattenedContour, shift: number): {
    x: number;
    y: number;
}[];
export declare function offsetContoursForAlignment(contours: FlattenedContour[], shift: number): FlattenedContour[];
