/**
 * 移植自 paper/src/util/Formatter.js。
 *
 * 用于序列化和 toString() 的数值格式化：按给定精度渲染数字与点/尺寸类值。
 */

/** {@link Formatter#point} 接受的形状。 */
export interface PointLike {
    x: number;
    y: number;
}

/** {@link Formatter#size} 接受的形状。 */
export interface SizeLike {
    width: number;
    height: number;
}

export class Formatter {
    /** 未指定精度时使用的格式化器。 */
    static instance: Formatter;

    /** 小数位数。 */
    precision: number;
    /** 缓存 `10 ^ precision`，供 {@link #number} 使用。 */
    multiplier: number;

    constructor(precision?: number) {
        // 原代码为 Base.pick(precision, 5)：只有 undefined 才回退到 5。
        this.precision = precision !== undefined ? precision : 5;
        this.multiplier = Math.pow(10, this.precision);
    }

    /**
     * 按本格式化器的精度渲染数字。
     * 不使用 Number#toFixed()，因为它会补零；这里直接四舍五入。
     * 精度 >= 16 时原样返回，因为那已接近数字精度的极限（具体会浮动）。
     */
    number(val: number): number {
        return this.precision < 16
                ? Math.round(val * this.multiplier) / this.multiplier
                : val;
    }

    pair(val1: number, val2: number, separator?: string): string {
        return this.number(val1) + (separator || ',') + this.number(val2);
    }

    point(val: PointLike, separator?: string): string {
        return this.number(val.x) + (separator || ',') + this.number(val.y);
    }

    size(val: SizeLike, separator?: string): string {
        return this.number(val.width) + (separator || ',')
                + this.number(val.height);
    }

    rectangle(val: PointLike & SizeLike, separator?: string): string {
        return this.point(val, separator) + (separator || ',')
                + this.size(val, separator);
    }
}

Formatter.instance = new Formatter();
