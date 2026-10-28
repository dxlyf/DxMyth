/**
 * 移植自 paper/src/path/StrokeProfileStop.js，只保留几何核心。
 *
 * 路径描边轮廓的一个停靠点:笔触沿路径在某个偏移处绘制，形状是一个带宽度、
 * 纵横比和角度的椭圆。一个停靠点可以只设置其中一部分，其余交给相邻停靠点。
 *
 * 不移植序列化:没有 `_class`、`_compactSerialize`，也没有 `_serialize()`。
 */

import type { Path } from './Path';

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

export class StrokeProfileStop {
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

    constructor(props: StrokeProfileStopProps = {}) {
        this._path = null;
        this._index = props.index != null ? props.index : null;
        this._offset = props.offset || 0;
        this._width = props.width != null ? props.width : null;
        this._aspect = props.aspect != null ? props.aspect : null;
        this._angle = props.angle != null ? props.angle : null;
        this._smooth = props.smooth !== false;
    }

    /** 返回停靠点的副本，不带路径。 */
    clone(): StrokeProfileStop {
        return new StrokeProfileStop({
            offset: this.offset,
            width: this._width,
            aspect: this._aspect,
            angle: this._angle,
            smooth: this._smooth
        });
    }

    _changed(): void {
        if (this._path)
            this._path._changed();
    }

    /** 该停靠点所属的路径。 */
    get path(): Path | null {
        return this._path;
    }

    /**
     * 停靠点沿路径的偏移，与 `Path#getPointAt(offset)` 一致。
     * 它是长度而不是比例。段移动时停靠点仍停留在相同的段之间，因此偏移会
     * 随它之前那些曲线的长度变化。
     */
    get offset(): number {
        const path = this._path;
        return path ? path._getOffsetAtIndex(this._index as number)
                : this._offset;
    }

    set offset(offset: number) {
        const path = this._path;
        if (path) {
            this._index = path._getIndexAt(offset);
            path._sortStrokeProfile();
            this._changed();
        } else {
            this._offset = offset;
        }
    }

    /**
     * 停靠点处笔触的宽度，作为描边宽度的倍数:
     * `1` 表示与描边同宽，`2` 表示两倍宽。
     */
    get width(): number | null {
        return this._width;
    }

    set width(width: number | null) {
        this._width = width;
        this._changed();
    }

    /**
     * 停靠点处笔触的纵横比:高度相对宽度的倍数，
     * `1` 表示圆头，更小表示扁头。
     */
    get aspect(): number | null {
        return this._aspect;
    }

    set aspect(aspect: number | null) {
        this._aspect = aspect;
        this._changed();
    }

    /** 停靠点处笔触的角度，单位为度，使用路径坐标系。 */
    get angle(): number | null {
        return this._angle;
    }

    set angle(angle: number | null) {
        this._angle = angle;
        this._changed();
    }

    /** 数值是否在停靠点处平滑地进入和离开。 */
    get smooth(): boolean {
        return this._smooth;
    }

    set smooth(smooth: boolean) {
        this._smooth = !!smooth;
        this._changed();
    }

    /** 判断与传入的停靠点是否相等。 */
    equals(stop: StrokeProfileStop): boolean {
        return stop === this || stop instanceof StrokeProfileStop
                && this._width === stop._width
                && this._aspect === stop._aspect
                && this._angle === stop._angle
                && this._smooth === stop._smooth
                && (this._path
                    ? this._index === stop._index
                    : this._offset === stop._offset)
                || false;
    }
}
