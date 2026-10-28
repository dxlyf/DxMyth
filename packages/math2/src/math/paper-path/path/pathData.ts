/**
 * SVG path data 解析器，从 `Path#setPathData()` 中抽出。
 *
 * 这样 `Path` 和 `CompoundPath` 可以共用同一套解析逻辑:解析器只依赖下面这个
 * 最小接口，由调用方决定 `moveTo()` 是新建 segment 还是新建子路径。
 *
 * 支持 `m/l/h/v/c/s/q/t/z` 以及 `a`（椭圆弧）。
 */

import { Point } from '../basic/Point';
import { Numerical } from '../util/Numerical';
import { Size } from '../basic/Size';

/** 解析器要求目标对象提供的绘图命令。 */
export interface PathDataTarget {
    /** 清空已有内容。 */
    clear(): void;
    moveTo(point: Point): void;
    lineTo(point: Point): void;
    cubicCurveTo(handle1: Point, handle2: Point, to: Point): void;
    quadraticCurveTo(handle: Point, to: Point): void;
    /** 椭圆弧，参数顺序同 `Path#arcTo` 的 SVG 形式。 */
    arcTo(to: Point, radius: Size, rotation: number, clockwise: boolean,
            large: boolean): void;
    closePath(tolerance?: number): void;
}

/** 按 SVG path data 重建目标对象的几何。 */
export function parsePathData(target: PathDataTarget, data: string): void {
    const parts = data && data.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
        number = '([+-]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][+-]?\\d+)?)',
        numbers = new RegExp(number, 'g'),
        // 弧的两个标志是单字符，允许紧跟后面的数字，如 'a1 1 0 011 1'。
        flag = '([01])',
        // 一组弧参数:rx ry rotation large-arc sweep x y。
        arcs = new RegExp([number, number, number, flag, flag, number, number]
            .join('[\\s,]*'), 'g');
    let coords: string[] | null,
        relative = false,
        previous = '',
        control = new Point(),
        current = new Point(),
        start = new Point();
    // 先清空原有内容。
    target.clear();
    for (let i = 0, l = parts && parts.length; i < l; i++) {
        const part = parts![i],
            command = part[0],
            lower = command.toLowerCase();
        coords = part.match(numbers);
        const length = coords && coords.length;
        relative = command === lower;

        const getCoord = (index: number, coord: 'x' | 'y'): number => {
            let val = +coords![index];
            if (relative)
                val += current[coord];
            return val;
        };
        const getPoint = (index: number): Point =>
            new Point(getCoord(index, 'x'), getCoord(index + 1, 'y'));

        // 处理 SVG 数据中间出现 z 且后面不是 m 的情况。
        if (previous === 'z' && !/[mz]/.test(lower))
            target.moveTo(current);
        switch (lower) {
        case 'm':
        case 'l': {
            let move = lower === 'm';
            for (let j = 0; j < length!; j += 2) {
                current = getPoint(j);
                if (move) {
                    target.moveTo(current);
                    start = current;
                    move = false;
                } else {
                    target.lineTo(current);
                }
            }
            control = current;
            break;
        }
        case 'h':
        case 'v': {
            const coord = lower === 'h' ? 'x' : 'y';
            current = current.clone();
            for (let j = 0; j < length!; j++) {
                current[coord] = getCoord(j, coord);
                target.lineTo(current);
            }
            control = current;
            break;
        }
        case 'c':
            for (let j = 0; j < length!; j += 6) {
                target.cubicCurveTo(getPoint(j), control = getPoint(j + 2),
                        current = getPoint(j + 4));
            }
            break;
        case 's':
            for (let j = 0; j < length!; j += 4) {
                target.cubicCurveTo(
                        /[cs]/.test(previous)
                                ? current.multiply(2).subtract(control)
                                : current,
                        control = getPoint(j),
                        current = getPoint(j + 2));
                previous = lower;
            }
            break;
        case 'q':
            for (let j = 0; j < length!; j += 4) {
                target.quadraticCurveTo(control = getPoint(j),
                        current = getPoint(j + 2));
            }
            break;
        case 't':
            for (let j = 0; j < length!; j += 2) {
                target.quadraticCurveTo(
                        control = (/[qt]/.test(previous)
                                ? current.multiply(2).subtract(control)
                                : current),
                        current = getPoint(j));
                previous = lower;
            }
            break;
        case 'a': {
            // 每组参数按 rx ry rotation large-arc sweep x y 解析；注意
            // arcTo() 的参数顺序是 (to, radius, rotation, clockwise, large)，
            // 其中 clockwise 对应 sweep 标志。
            let match: RegExpExecArray | null;
            arcs.lastIndex = 0;
            while ((match = arcs.exec(part))) {
                coords = match;
                target.arcTo(
                        current = getPoint(6),
                        new Size(+coords[1], +coords[2]),
                        +coords[3],
                        !!+coords[5],
                        !!+coords[4]);
            }
            break;
        }
        case 'z':
            target.closePath(Numerical.EPSILON);
            current = start;
            break;
        }
        previous = lower;
    }
}
