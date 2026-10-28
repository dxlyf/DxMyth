/**
 * 移植自 paper/src/basic/Size.js，只保留几何核心。
 *
 * 构造形式只有 `new Size(width, height)`。不移植参数解析机制、序列化，以及
 * 供 Item 边界使用的 LinkedSize。
 */

import { Formatter } from '../util/Formatter';
import { Numerical } from '../util/Numerical';

/** 把数字转成宽高都等于它的尺寸。 */
function toSize(value: Size | number): Size {
    return typeof value === 'number' ? new Size(value, value) : value;
}

export class Size {
    width: number;
    height: number;

    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }

    /** 同时设置两个维度。 */
    _set(width: number, height: number): this {
        this.width = width;
        this.height = height;
        return this;
    }

    equals(size: Size): boolean {
        return this === size
                || !!size && this.width === size.width
                    && this.height === size.height;
    }

    clone(): Size {
        return new Size(this.width, this.height);
    }

    toString(): string {
        const f = Formatter.instance;
        return '{ width: ' + f.number(this.width)
                + ', height: ' + f.number(this.height) + ' }';
    }

    /** 尺寸的维度数组，`[width, height]`。 */
    get values(): number[] {
        return [this.width, this.height];
    }

    add(value: Size | number): Size {
        const size = toSize(value);
        return new Size(this.width + size.width, this.height + size.height);
    }

    subtract(value: Size | number): Size {
        const size = toSize(value);
        return new Size(this.width - size.width, this.height - size.height);
    }

    multiply(value: Size | number): Size {
        const size = toSize(value);
        return new Size(this.width * size.width, this.height * size.height);
    }

    divide(value: Size | number): Size {
        const size = toSize(value);
        return new Size(this.width / size.width, this.height / size.height);
    }

    modulo(value: Size | number): Size {
        const size = toSize(value);
        return new Size(this.width % size.width, this.height % size.height);
    }

    /** 两个维度都取负的新尺寸。 */
    negate(): Size {
        return new Size(-this.width, -this.height);
    }

    /** 两个维度是否都在 1e-12 容差内为 0。 */
    isZero(): boolean {
        const isZero = Numerical.isZero;
        return isZero(this.width) && isZero(this.height);
    }

    /** 是否有一个维度是 NaN。 */
    isNaN(): boolean {
        return isNaN(this.width) || isNaN(this.height);
    }

    round(): Size {
        return new Size(Math.round(this.width), Math.round(this.height));
    }

    ceil(): Size {
        return new Size(Math.ceil(this.width), Math.ceil(this.height));
    }

    floor(): Size {
        return new Size(Math.floor(this.width), Math.floor(this.height));
    }

    abs(): Size {
        return new Size(Math.abs(this.width), Math.abs(this.height));
    }

    /** 取两个尺寸中宽高各自最小的新尺寸。 */
    static min(size1: Size, size2: Size): Size {
        return new Size(
            Math.min(size1.width, size2.width),
            Math.min(size1.height, size2.height));
    }

    /** 取两个尺寸中宽高各自最大的新尺寸。 */
    static max(size1: Size, size2: Size): Size {
        return new Size(
            Math.max(size1.width, size2.width),
            Math.max(size1.height, size2.height));
    }

    /** 宽高为 0 到 1 之间随机值的尺寸。 */
    static random(): Size {
        return new Size(Math.random(), Math.random());
    }
}
