import { Path } from './Path';
/** {@link StrokeProfileStop} 接受的对象属性。 */
export interface StrokeProfileStopProps {
    /** 停靠点之前那一段的索引。 */
    index?: number | null;
    /** 沿路径的偏移。 */
    offset?: number;
    /** 笔触宽度，相对描边宽度的倍数。 */
    width?: number | null;
    /** 笔触高度相对其宽度的倍数。 */
    aspect?: number | null;
    /** 笔触角度，单位为度。 */
    angle?: number | null;
    /** 数值是否在停靠点处平滑过渡。 */
    smooth?: boolean;
}
export declare class StrokeProfileStop {
    /** 该停靠点所属的路径，可能为空。 */
    _path: Path | null;
    /** 停靠点之前那一段的索引，见 `Path#_getOffsetAtIndex`。 */
    _index: number | null;
    /** 停靠点不在路径上时使用的偏移。 */
    _offset: number;
    /** 停靠点没有设置的值为 null。 */
    _width: number | null;
    _aspect: number | null;
    _angle: number | null;
    _smooth: boolean;
    constructor(props?: StrokeProfileStopProps);
    /** 返回停靠点的副本，不带路径。 */
    clone(): StrokeProfileStop;
    _changed(): void;
    /** 该停靠点所属的路径。 */
    get path(): Path | null;
    /**
     * 停靠点沿路径的偏移，与 `Path#getPointAt(offset)` 一致。
     * 它是长度而不是比例。段移动时停靠点仍停留在相同的段之间，因此偏移会
     * 随它之前那些曲线的长度变化。
     */
    get offset(): number;
    set offset(offset: number);
    /**
     * 停靠点处笔触的宽度，作为描边宽度的倍数:
     * `1` 表示与描边同宽，`2` 表示两倍宽。
     */
    get width(): number | null;
    set width(width: number | null);
    /**
     * 停靠点处笔触的纵横比:高度相对宽度的倍数，
     * `1` 表示圆头，更小表示扁头。
     */
    get aspect(): number | null;
    set aspect(aspect: number | null);
    /** 停靠点处笔触的角度，单位为度，使用路径坐标系。 */
    get angle(): number | null;
    set angle(angle: number | null);
    /** 数值是否在停靠点处平滑地进入和离开。 */
    get smooth(): boolean;
    set smooth(smooth: boolean);
    /** 判断与传入的停靠点是否相等。 */
    equals(stop: StrokeProfileStop): boolean;
}
