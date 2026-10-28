/**
 * 移植自 paper/src/path/SegmentPoint.js，只保留几何核心。
 *
 * Point 的内部版本：每次变化都会通知它所属的 segment。不移植选中状态。
 */

import { Point } from '../basic/Point';
import { Numerical } from '../util/Numerical';
import type { Segment } from './Segment';

export class SegmentPoint extends Point {
    /** 该点所属的 segment。 */
    _owner: Segment;

    constructor(point: Point | undefined, owner: Segment) {
        super();
        if (point) {
            this._x = point.x;
            this._y = point.y;
        }
        this._owner = owner;
    }

    _set(x: number, y: number, dontNotify?: boolean): this {
        this._x = x;
        this._y = y;
        if (!dontNotify)
            this._owner._changed(this);
        return this;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
        this._owner._changed(this);
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
        this._owner._changed(this);
    }

    isZero(): boolean {
        // 这是内部高频调用，直接读内部属性而不走访问器，以提升性能。
        const isZero = Numerical.isZero;
        return isZero(this._x) && isZero(this._y);
    }
}
