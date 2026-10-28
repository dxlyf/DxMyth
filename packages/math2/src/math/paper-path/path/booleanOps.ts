/**
 * 移植自 paper/src/path/PathItem.Boolean.js。
 *
 * 原文把这些函数放在 `PathItem.inject(new function() { ... })` 的闭包里，并把
 * 公开方法注入 `PathItem`。这里拆成两部分:
 * - 公开方法（`unite`/`intersect`/`subtract`/`exclude`/`divide`/`resolveCrossings`/
 *   `reorient`/`getInteriorPoint`/`_getWinding`）写在 `PathItem` 类体里；
 * - 算法与内部辅助函数放在本模块，由 `PathItem` 导入。
 *
 * `Path` / `CompoundPath` 的构造函数由这两个类在加载时注册到
 * `PathItem._createPath` / `PathItem._createCompoundPath`。这样本模块只需从
 * 顶部 import `PathItem`，不会出现「`class Path extends PathItem` 执行时
 * PathItem 还没定义完」的初始化循环。
 */

import { Point } from '../basic/Point';
import { Numerical } from '../util/Numerical';
import {
    findBoundsCollisions,
    findCurveBoundsCollisions
} from '../util/CollisionDetection';
import { Curve } from './Curve';
import { CurveLocation } from './CurveLocation';
import { Segment } from './Segment';
import type { Matrix } from '../basic/Matrix';
import type { Rectangle } from '../basic/Rectangle';
import { PathItem } from './PathItem';
import type { Path } from './Path';
import type { CompoundPath } from './CompoundPath';

/** 绕数结果，见 `PathItem#_getWinding()`。 */
export interface Winding {
    winding: number;
    windingL: number;
    windingR: number;
    onPath: boolean;
}

/** 布尔运算的选项，原文里还有 `insert`，这里去掉（不涉及场景图）。 */
export interface BooleanOptions {
    /** 是否用追踪法；为 false 时只把第一个路径在交点处切开。 */
    trace?: boolean;
    /** 是否按描边轮廓做运算。 */
    stroke?: boolean;
    /** 结果是否做简化。 */
    simplify?: boolean;
}

type Operator = (inside1: boolean, inside2: boolean) => boolean;

/** 两个操作数各自是否包含某个区域时，结果是否包含它。 */
const operators: { [name: string]: Operator } = {
    unite: (inside1, inside2) => inside1 || inside2,
    intersect: (inside1, inside2) => inside1 && inside2,
    subtract: (inside1, inside2) => inside1 && !inside2,
    exclude: (inside1, inside2) => inside1 !== inside2
};

const min = Math.min,
    max = Math.max,
    abs = Math.abs;

// -------------------------------------------------------------------------
// 结果对象的创建：构造函数由 `Path` / `CompoundPath` 在加载时注册到 `PathItem`

function createPath(segments: Segment[] = [], closed = false): Path {
    const create = PathItem._createPath;
    if (!create)
        throw new Error('Path 尚未注册：请从包入口导入，或先加载 ./path/Path');
    return create(segments, closed);
}

function createCompoundPath(children: Path[]): CompoundPath {
    const create = PathItem._createCompoundPath;
    if (!create)
        throw new Error('CompoundPath 尚未注册：请从包入口导入，或先加载 ./path/CompoundPath');
    return create(children);
}

function cloneItem(item: PathItem): PathItem {
    return (item as Path).clone();
}

// -------------------------------------------------------------------------
// 操作数

/** 复合路径返回子路径，普通路径返回自身。 */
export function getPaths(item: PathItem): Path[] {
    const children = (item as CompoundPath)._children;
    return children || [item as Path];
}

function isCompound(item: PathItem): item is CompoundPath {
    return !!(item as CompoundPath)._children;
}

/**
 * 克隆出可以自由修改的路径，去掉空子路径；需要时用直线把开放路径闭合。
 */
function preparePath(item: PathItem, close?: boolean): PathItem {
    const res = reducePath(cloneItem(item));
    return close ? closePaths(res) : res;
}

/**
 * 把复合路径化简:去掉空子路径，只剩一个子路径时直接返回它。
 */
export function reducePath(item: PathItem): PathItem {
    if (isCompound(item)) {
        const children = item.children.filter((child) => !child.isEmpty());
        if (children.length === 1)
            return children[0];
        item.children = children;
        return item;
    }
    return item;
}

/**
 * 用直线把开放路径闭合，与填充开放路径的行为一致。
 */
function closePaths(item: PathItem): PathItem {
    const paths = getPaths(item);
    for (let i = 0, l = paths.length; i < l; i++) {
        const path = paths[i];
        if (!path._closed && !path.isEmpty()) {
            // 用 epsilon 容差闭合，避免产生极短的直线而影响求交。若首尾本来就
            // 相接，这一步会把它们合并并保留原本结束在这里的曲线，只有新加的
            // 闭合曲线是直线 (#1929)。
            const count = path._segments.length;
            path.closePath(Numerical.EPSILON);
            if (path._segments.length === count) {
                path.firstSegment!.handleIn = new Point(0, 0);
                path.lastSegment!.handleOut = new Point(0, 0);
            }
        }
    }
    return item;
}

/**
 * 用追踪出来的路径构造结果:装进复合路径后做化简，只有一个子路径时返回该
 * 路径本身。
 */
function createResult(paths: PathItem[], simplify?: boolean): PathItem {
    const result = createCompoundPath(paths as Path[]);
    return simplify ? reducePath(result) : result;
}

/** 交点是否参与运算:重叠也算。 */
function filterIntersection(inter: CurveLocation): boolean {
    return inter.hasOverlap() || inter.isCrossing();
}

/**
 * 对两个路径项做布尔运算，返回结果。
 */
export function traceBoolean(path1: PathItem,
        path2?: PathItem | PathItem[] | null, operation?: string,
        options?: BooleanOptions): PathItem {
    operation = operation || 'unite';
    // 计算描边布尔运算时只支持 subtract 和 intersect。
    if (options && (options.trace == false || options.stroke)
            && /^(subtract|intersect)$/.test(operation))
        return splitBoolean(path1, path2 as PathItem, operation, options);
    // 我们不修改操作数本身，而是追踪它们的副本。
    let paths: PathItem[];
    if (operation === 'exclude' && Array.isArray(path2) && path2.length > 1) {
        // 原文用 even-odd 填充规则一次性处理多个路径。这里没有 fillRule，
        // 改用逐次异或:对称差是可结合的，结果一致。
        let result: PathItem = path1;
        for (let i = 0, l = path2.length; i < l; i++)
            result = traceBoolean(result, path2[i], 'exclude', options);
        return result;
    }
    paths = tracePaths(getOperands(path1,
            combinePaths(path2, operation)),
            operators[operation]);
    return createResult(paths, true);
}

/**
 * 把一组路径两两合并成参与运算的单个操作数，用平衡的合并树，使每一步只与
 * 规模相近的结果相遇。做减法时，减掉的是它们的并集。
 */
function combinePaths(paths: PathItem | PathItem[] | null | undefined,
        operation: string): PathItem | null {
    const isUnite = operation === 'unite' || operation === 'subtract';

    interface Entry {
        path: PathItem;
        bounds: Rectangle;
        center: Point;
    }

    function combine(entries: Entry[]): PathItem {
        if (entries.length > 1) {
            if (isUnite) {
                // 沿包围盒较长的一边切分，让每一步合并的路径彼此靠近。
                let bounds = entries[0].bounds;
                for (let i = 1, l = entries.length; i < l; i++)
                    bounds = bounds.unite(entries[i].bounds);
                const key = bounds.width > bounds.height ? 'x' : 'y';
                entries.sort((entry1, entry2) =>
                    entry1.center[key] - entry2.center[key]);
            }
            const middle = entries.length >> 1;
            return traceBoolean(combine(entries.slice(0, middle)),
                    combine(entries.slice(middle)),
                    isUnite ? 'unite' : operation);
        }
        return entries[0].path;
    }

    const list: PathItem[] = paths ? ([] as PathItem[]).concat(paths) : [];
    const entries: Entry[] = list.map((path) => {
        const bounds = path._getBounds();
        return { path: path, bounds: bounds, center: bounds.center };
    });
    return entries.length ? combine(entries) : null;
}

/**
 * 只把第一个路径在交点处切开，按操作决定保留哪些片段。
 */
function splitBoolean(path1: PathItem, path2: PathItem, operation: string,
        options?: BooleanOptions): PathItem {
    const other = combinePaths(path2, operation),
        _path1 = preparePath(path1),
        _path2 = other ? preparePath(other) : null,
        crossings = _path2 ? _path1.getIntersections(_path2, filterIntersection)
            : [],
        subtract = operation === 'subtract',
        divide = operation === 'divide',
        pieces: Path[] = [],
        paths: Path[] = [];

    // 倒序切开，这样前面的位置仍然有效。对闭合路径，split() 返回切开后剩下的
    // 那部分，因此要等全部切完再收集片段 (#1540)。
    for (let i = crossings.length - 1; i >= 0; i--) {
        const crossing = crossings[i],
            split = crossing.path,
            path = crossing.split();
        if (path && split) {
            // 切开处两侧的控制柄可能来自原曲线，清空它们。
            path.firstSegment!.handleIn = new Point(0, 0);
            split.lastSegment!.handleOut = new Point(0, 0);
            if (pieces.indexOf(path) === -1)
                pieces.push(path);
        }
    }
    // 把 path1 剩下没被切到的路径（复合路径则是它的子路径）也加进来 (#1541)。
    const children = getPaths(_path1);
    for (let i = 0, l = children.length; i < l; i++) {
        if (pieces.indexOf(children[i]) === -1)
            pieces.push(children[i]);
    }
    // 看每个片段中点是否在 path2 内，按操作决定保留还是丢弃。
    for (let i = 0, l = pieces.length; i < l; i++) {
        const piece = pieces[i];
        if (divide || !_path2 || _path2.contains(
                piece.getPointAt(piece.length / 2)!) !== subtract)
            paths.unshift(piece);
    }
    return createResult(paths, false);
}

// -------------------------------------------------------------------------
// 绕数

/**
 * 返回点相对于曲线 values 的绕数:从点沿 x 方向发射的射线与之相交的各段，
 * 向上记 +1、向下记 -1 的和。reorientPaths() 和图的分量用它判断谁包含谁。
 */
function getRayWinding(point: Point, v: number[]): number {
    let winding = 0;
    const x = point.x,
        y = point.y;
    // 只考虑能够到射线的曲线。
    if (y >= min(v[1], v[3], v[5], v[7]) && y <= max(v[1], v[3], v[5], v[7])
            && x < max(v[0], v[2], v[4], v[6])) {
        const monoCurves = Curve.getMonoCurves(v),
            roots: number[] = [];
        for (let i = 0, l = monoCurves.length; i < l; i++) {
            const mv = monoCurves[i],
                y0 = mv[1],
                y3 = mv[7],
                dir = y0 < y3 ? 1 : y0 > y3 ? -1 : 0;
            if (dir && y >= min(y0, y3) && y < max(y0, y3)) {
                // 单调曲线只与射线相交一次。靠近端点时 solveCubic() 可能漏掉，
                // 那里它正好在端点上。
                const px = Curve.solveCubic(mv, 1, y, roots, 0, 1) > 0
                        ? Curve.getPoint(mv, roots[0])!.x
                        : abs(y - y0) < abs(y - y3) ? mv[0] : mv[6];
                if (px > x)
                    winding += dir;
            }
        }
    }
    return winding;
}

/**
 * 重新调整一组路径的方向:被包含的路径方向与其容器相反，互不相交的岛屿则与
 * 最大的路径方向一致。
 */
function reorientPaths(paths: (Path | null)[], isInside: (w: number) => boolean,
        clockwise?: boolean): (Path | null)[] {
    const length = paths.length;
    if (length) {
        interface Entry {
            container: Path | null;
            winding: number;
            index: number;
            exclude?: boolean;
        }
        const lookup = new Map<Path, Entry>();
        const list = paths.filter((path): path is Path => !!path);
        for (let i = 0, l = list.length; i < l; i++) {
            const path = list[i];
            lookup.set(path, {
                container: null,
                winding: path.isClockwise() ? 1 : -1,
                index: paths.indexOf(path)
            });
        }
        // 按面积从大到小排序。
        const sorted = list.slice().sort((a, b) =>
                abs(b.getArea()) - abs(a.getArea())),
            first = sorted[0],
            // 用包围盒之间的碰撞，找出可能相互包含的路径。
            bounds = sorted.map((path) => {
                const rect = path._getBounds();
                return [rect.left, rect.top, rect.right, rect.bottom];
            }),
            collisions = findBoundsCollisions(bounds, bounds,
                    Numerical.GEOMETRIC_EPSILON);
        if (clockwise == null)
            clockwise = first.isClockwise();
        // 从大到小确定每个路径的绕数。
        for (let i = 0, l = sorted.length; i < l; i++) {
            const path1 = sorted[i],
                entry1 = lookup.get(path1)!,
                collisionsForI = collisions[i];
            let containerWinding = 0;
            if (collisionsForI) {
                let point: Point | null = null;
                for (let j = collisionsForI.length - 1; j >= 0; j--) {
                    if (collisionsForI[j] < i) {
                        point = point || path1.getInteriorPoint();
                        const path2 = sorted[collisionsForI[j]];
                        // 由于按面积从大到小处理，任何可能包含当前路径的路径
                        // 都已经处理过、方向已经确定。找一个"内部性"不同的容器
                        // 路径，把方向设为相反。
                        const curves = path2.curves;
                        let winding = 0;
                        for (let k = 0, n = curves.length; k < n; k++)
                            winding += getRayWinding(point,
                                    curves[k].getValues());
                        if (winding) {
                            const entry2 = lookup.get(path2)!;
                            containerWinding = entry2.winding;
                            entry1.winding += containerWinding;
                            entry1.container = entry2.exclude
                                ? entry2.container : path2;
                            break;
                        }
                    }
                }
            }
            // 只有穿过该路径时"内部性"发生变化才保留。
            if (isInside(entry1.winding) === isInside(containerWinding)) {
                entry1.exclude = true;
                // 不用删除条目，置空即可，后续处理会忽略空位。
                paths[entry1.index] = null;
            } else {
                const container = entry1.container;
                path1.setClockwise(
                        container ? !container.isClockwise() : clockwise);
            }
        }
    }
    return paths;
}

/**
 * 返回点相对于一组曲线的绕数贡献。
 *
 * 关于各类边界情况的处理思路，见 #1073#issuecomment-226942348 与
 * #1073#issuecomment-226946965 中 @iconexperience 的描述。
 */
export function getWinding(point: Point, curves: Curve[], dir?: boolean,
        dontFlip?: boolean): Winding {
    // 根据方向确定曲线 values 数组中横坐标/纵坐标的下标。
    const ia = dir ? 1 : 0, // 横坐标下标
        io = ia ^ 1, // 纵坐标下标
        pv = [point.x, point.y],
        pa = pv[ia], // 点的横坐标
        po = pv[io], // 点的纵坐标
        // 绕数计算使用单独的 epsilon。
        windingEpsilon = 1e-9,
        paL = pa - windingEpsilon,
        paR = pa + windingEpsilon;
    let windingL = 0,
        windingR = 0,
        pathWindingL = 0,
        pathWindingR = 0,
        onPath = false,
        onAnyPath = false;
    const roots: number[] = [];
    let vPrev: number[] | null = null,
        vClose: number[] | null = null;

    function addWinding(v: number[]): Winding | undefined {
        const o0 = v[io + 0],
            o3 = v[io + 6];
        if (po < min(o0, o3) || po > max(o0, o3)) {
            // 曲线不在纵坐标范围内，射线不可能与之相交。
            return;
        }
        const a0 = v[ia + 0],
            a1 = v[ia + 2],
            a2 = v[ia + 4],
            a3 = v[ia + 6];
        if (o0 === o3) {
            // 水平曲线不一定位于两条非水平曲线之间，需要处理这类情况:
            //          +-----+
            //     +----+     |
            //          +-----+
            if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
                onPath = true;
            }
            // 曲线在纵坐标方向没有变化，绕数由相邻曲线贡献。
            // 直接返回，不更新 vPrev。
            return;
        }
        // 确定点对应的 curve-time 值。
        const t = po === o0 ? 0
                : po === o3 ? 1
                // 横坐标在曲线之外时，除 0 以外的任意值都可以（0 需要特殊处理）。
                // 用 1，因为它不需要为点做额外计算。
                : paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3)
                ? 1
                : Curve.solveCubic(v, io, po, roots, 0, 1) > 0
                    ? roots[0]
                    : 1,
            a = t === 0 ? a0
                : t === 1 ? a3
                : Curve.getPoint(v, t)![dir ? 'y' : 'x'],
            winding = o0 > o3 ? 1 : -1,
            windingPrev = vPrev![io] > vPrev![io + 6] ? 1 : -1,
            a3Prev = vPrev![ia + 6];
        if (po !== o0) {
            // 标准情况:曲线不是在起始点被穿过。
            if (a < paL) {
                pathWindingL += winding;
            } else if (a > paR) {
                pathWindingR += winding;
            } else {
                onPath = true;
            }
        } else {
            // 曲线在起始点被穿过。
            if (winding !== windingPrev) {
                // 绕数与上一条曲线不同，抵消它的绕数。
                if (a0 < paL) {
                    pathWindingL += winding;
                } else if (a0 > paR) {
                    pathWindingR += winding;
                }
            } else if (a0 != a3Prev) {
                // 处理当前曲线与上一条非水平曲线之间的水平曲线。
                if (a3Prev < paR && a > paR) {
                    // 之前没有加右侧绕数，现在补上。
                    pathWindingR += winding;
                    onPath = true;
                } else if (a3Prev > paL && a < paL) {
                    // 之前没有加左侧绕数，现在补上。
                    pathWindingL += winding;
                    onPath = true;
                }
            }
        }
        vPrev = v;
        // 如果点在曲线上，看切线方向决定是否翻转方向以获得可靠的绕数:
        // 若切线与射线方向平行，翻转方向重新调用 getWinding() 并返回其结果。
        return !dontFlip && a > paL && a < paR
                && Curve.getTangent(v, t)![dir ? 'x' : 'y'] === 0
                && getWinding(point, curves, !dir, true);
    }

    function handleCurve(v: number[]): Winding | undefined {
        // 取出纵坐标。
        const o0 = v[io + 0],
            o1 = v[io + 2],
            o2 = v[io + 4],
            o3 = v[io + 6];
        // 只处理可能穿过该点纵坐标的曲线。
        if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
            // 取出横坐标。
            const a0 = v[ia + 0],
                a1 = v[ia + 2],
                a2 = v[ia + 4],
                a3 = v[ia + 6],
                // 取单调曲线。若曲线完全在点的横坐标之外，可当作单调曲线。
                monoCurves = paL > max(a0, a1, a2, a3)
                        || paR < min(a0, a1, a2, a3)
                    ? [v] : Curve.getMonoCurves(v, dir);
            for (let i = 0, l = monoCurves.length; i < l; i++) {
                // addWinding() 可能触发方向翻转，此时直接返回结果。
                const res = addWinding(monoCurves[i]);
                if (res)
                    return res;
            }
        }
    }

    for (let i = 0, l = curves.length; i < l; i++) {
        const curve = curves[i],
            path = curve._path!,
            v = curve.getValues();
        let res: Winding | undefined;
        if (!i || curves[i - 1]._path !== path) {
            // 进入一条新的（子）路径，需要确定这条路径上最后一条非水平曲线。
            vPrev = null;
            // 路径未闭合时，像填充开放路径那样用一条直线连接首尾。
            if (!path._closed) {
                vClose = Curve.getValues(
                        path.lastCurve!.segment2,
                        curve.segment1,
                        null, true);
                // 这条闭合曲线可能是最后一条非水平曲线。
                if (vClose[io] !== vClose[io + 6]) {
                    vPrev = vClose;
                }
            }

            if (!vPrev) {
                // 沿路径曲线反向查找，直到找到一条非水平曲线。
                // 找不到就退回第一条曲线的 values。
                vPrev = v;
                let prev = path.lastCurve;
                while (prev && prev !== curve) {
                    const v2 = prev.getValues();
                    if (v2[io] !== v2[io + 6]) {
                        vPrev = v2;
                        break;
                    }
                    prev = prev.previous;
                }
            }
        }

        // handleCurve() 可能触发方向翻转，此时直接返回结果。
        if ((res = handleCurve(v)))
            return res;

        if (i + 1 === l || curves[i + 1]._path !== path) {
            // 到达当前（子）路径的最后一条曲线。若开头算出了闭合曲线，
            // 在这里处理它，把路径当作闭合路径对待。
            if (vClose && (res = handleCurve(vClose)))
                return res;
            if (onPath && !pathWindingL && !pathWindingR) {
                // 点在路径上且绕数互相抵消时，把它当作在路径内部。内部点的
                // 绕数为顺时针 [+1,-1]、逆时针 [-1,+1]。若射线沿 y 方向
                // (dir == true)，两侧绕数总是一正一负。
                pathWindingL = pathWindingR = path.isClockwise() !== dir
                        ? 1 : -1;
            }
            windingL += pathWindingL;
            windingR += pathWindingR;
            pathWindingL = pathWindingR = 0;
            if (onPath) {
                onAnyPath = true;
                onPath = false;
            }
            vClose = null;
        }
    }
    // 判断哪些区域属于填充结果时使用无符号绕数。
    windingL = abs(windingL);
    windingR = abs(windingR);
    return {
        winding: max(windingL, windingR),
        windingL: windingL,
        windingR: windingR,
        onPath: onAnyPath
    };
}

// -------------------------------------------------------------------------
// 平面图

interface Vertex {
    x: number;
    y: number;
    isEnd: boolean;
    /** 对应 xs/ys 中的下标。 */
    point: number;
    /** 离开该顶点的半边下标。 */
    outgoing: number[];
}

interface Cut {
    time: number;
    point: number;
}

interface Edge {
    values: number[];
    from: number;
    to: number;
    isStraight: boolean;
    /** 每条操作数的绕数变化。 */
    windings: number[];
    /** 来源曲线在 curves 中的下标。 */
    curve: number;
    time1: number;
    time2: number;
    reversed?: number[];
    length?: number;
}

interface HalfEdge {
    edge: Edge;
    values: number[];
    from: number;
    to: number;
    directions?: { start: number; width: number } | null;
    point?: Point;
    angle?: number;
    position?: number;
    next?: number;
    face?: Face;
}

interface Face {
    halfEdges: number[];
    area: number;
    windings: number[] | null;
    component: Component | null;
    isInside?: boolean;
}

interface Component {
    edges: Edge[];
    bounds: number[];
    outside: Face;
}

interface Graph {
    curves: Curve[];
    values: number[][];
    vertices: Vertex[];
    edges: Edge[];
    halfEdges: HalfEdge[];
    faces: Face[];
    nonZeros: boolean[];
    epsilon: number;
}

/**
 * 返回曲线 values 在时间区间内的部分，两端移动到给定点（连同控制柄）。
 * 直线段保持直线。
 */
function getPart(v: number[], hasHandles: boolean, time1: number,
        time2: number, point1: { x: number; y: number },
        point2: { x: number; y: number }): number[] {
    let part: number[];
    if (hasHandles) {
        part = Curve.getPart(v, time1, time2).slice();
        const dx1 = point1.x - part[0],
            dy1 = point1.y - part[1],
            dx2 = point2.x - part[6],
            dy2 = point2.y - part[7];
        part[0] += dx1;
        part[1] += dy1;
        part[2] += dx1;
        part[3] += dy1;
        part[4] += dx2;
        part[5] += dy2;
        part[6] += dx2;
        part[7] += dy2;
    } else {
        part = [point1.x, point1.y, point1.x, point1.y,
                point2.x, point2.y, point2.x, point2.y];
    }
    return part;
}

/**
 * 建立操作数曲线的平面图:所有交点成为顶点，交点之间的曲线片段成为边，
 * 边围成的面记录每条操作数上的绕数。
 */
function createGraph(operands: PathItem[]): Graph {
    const curves: Curve[] = [],
        curveOperands: number[] = [],
        offsets = new Map<PathItem, number>(),
        nonZeros: boolean[] = [];
    let bounds: Rectangle | null = null;
    for (let i = 0, l = operands.length; i < l; i++) {
        const operand = operands[i],
            paths = getPaths(operand);
        // 没有 fillRule，统一按非零绕数处理。
        nonZeros.push(true);
        const operandBounds = operand._getBounds();
        bounds = bounds ? bounds.unite(operandBounds) : operandBounds;
        for (let j = 0, k = paths.length; j < k; j++) {
            const pathCurves = paths[j].curves;
            offsets.set(paths[j], curves.length);
            for (let m = 0, n = pathCurves.length; m < n; m++) {
                curves.push(pathCurves[m]);
                curveOperands.push(i);
            }
        }
    }
    // 距离小于 epsilon 的点视为同一个顶点。epsilon 与操作数大小相关，但不会
    // 低于坐标本身的分辨率。
    const graphBounds = bounds!,
        epsilon = Numerical.getEpsilon(max(
                abs(graphBounds.left), abs(graphBounds.right),
                abs(graphBounds.top), abs(graphBounds.bottom)),
            graphBounds.topLeft.getDistance(graphBounds.bottomRight)
                * Numerical.GEOMETRIC_EPSILON),
        values: number[][] = [],
        cuts: Cut[][] = [],
        xs: number[] = [],
        ys: number[] = [],
        isEnds: boolean[] = [];

    function addCut(index: number, time: number, point: Point,
            isEnd: boolean): void {
        cuts[index].push({ time: time, point: xs.length });
        xs.push(point.x);
        ys.push(point.y);
        isEnds.push(isEnd);
    }

    // 1. 在各曲线两端以及所有交点处切开，包括同一操作数内部的交点与重叠的
    // 端点。
    for (let i = 0, l = curves.length; i < l; i++) {
        const curve = curves[i];
        values.push(curve.getValues());
        cuts.push([]);
        addCut(i, 0, curve._segment1._point, true);
        addCut(i, 1, curve._segment2._point, true);
    }
    // 找出包围盒相距 2 epsilon 以内的曲线，用于下面的求交与"热像素"。
    const collisions = findCurveBoundsCollisions(values, values, 2 * epsilon),
        locations = CurveLocation.expand(Curve.getIntersections(curves,
                null, null, null, null, false, epsilon, collisions));
    for (let i = 0, l = locations.length; i < l; i++) {
        const loc = locations[i],
            curve = loc.curve!;
        addCut(offsets.get(curve._path!)! + curve.index!, loc.time!,
                loc.point, false);
    }
    // 控制点共线的曲线可能沿着这条线反向，与自身或其它曲线重叠。在反向处
    // 切开，使片段只朝一个方向走，后面的热像素会在相同的顶点处切断重叠的
    // 曲线。
    for (let i = 0, l = curves.length; i < l; i++) {
        const times = Curve.getReversals(values[i], epsilon);
        for (let j = 0, k = times.length; j < k; j++) {
            addCut(i, times[j], Curve.getPoint(values[i], times[j])!, false);
        }
    }

    // 2. 按 x 排序后用并查集把相距 epsilon 以内的点合并成顶点。若合并的点中
    // 有曲线端点，顶点采用该端点的位置，这样操作数自身的顶点保持不动。
    const count = xs.length,
        parents: number[] = new Array(count),
        order: number[] = new Array(count);
    for (let i = 0; i < count; i++)
        parents[i] = order[i] = i;

    function getRoot(i: number): number {
        while (parents[i] !== i)
            i = parents[i] = parents[parents[i]];
        return i;
    }

    order.sort((a, b) => xs[a] - xs[b]);
    for (let i = 0; i < count; i++) {
        const a = order[i];
        for (let j = i + 1; j < count && xs[order[j]] - xs[a] <= epsilon;
                j++) {
            const b = order[j],
                dx = xs[b] - xs[a],
                dy = ys[b] - ys[a];
            if (dx * dx + dy * dy <= epsilon * epsilon)
                parents[getRoot(a)] = getRoot(b);
        }
    }
    let vertexIndices: { [key: number]: number } = {},
        vertices: Vertex[] = [];

    function createVertices(): void {
        vertexIndices = {};
        vertices = [];
        for (let i = 0; i < count; i++) {
            const root = getRoot(i);
            let index = vertexIndices[root];
            if (index === undefined) {
                index = vertexIndices[root] = vertices.length;
                vertices.push({ x: xs[i], y: ys[i], isEnd: isEnds[i],
                        point: i, outgoing: [] });
            } else if (isEnds[i] && !vertices[index].isEnd) {
                vertices[index] = { x: xs[i], y: ys[i], isEnd: true,
                        point: i, outgoing: [] };
            }
        }
    }

    createVertices();

    function getVertex(point: number): number {
        return vertexIndices[getRoot(point)];
    }

    // 曲线 i 在两个 cut 之间的片段，两端移动到对应的顶点（连同控制柄）。
    function getPiece(i: number, cut1: Cut, cut2: Cut): number[] {
        return getPart(values[i], curves[i].hasHandles(), cut1.time,
                cut2.time, vertices[getVertex(cut1.point)],
                vertices[getVertex(cut2.point)]);
    }

    function sortCuts(list: Cut[]): Cut[] {
        return list.sort((a, b) => a.time - b.time);
    }

    // 记录 last 上次为哪个顶点做过热像素检测的曲线，保证每条曲线只测一次。
    let marks: number[];

    // 2b. 在曲线经过距某顶点 epsilon 以内处切开，这就是 snap rounding 的
    // "热像素"。把片段移动到顶点可能让它又靠近别的顶点，所以要反复检测每个
    // 切出的片段，直到没有片段再经过顶点。由于只在已有顶点处切，这个过程
    // 一定结束。
    function getHotPixels(i: number): number[] {
        const v = values[i],
            left = min(v[0], v[2], v[4], v[6]) - 2 * epsilon,
            top = min(v[1], v[3], v[5], v[7]) - 2 * epsilon,
            right = max(v[0], v[2], v[4], v[6]) + 2 * epsilon,
            bottom = max(v[1], v[3], v[5], v[7]) + 2 * epsilon,
            indices = collisions[i]!,
            hotPixels: number[] = [];
        for (let j = 0, k = indices.length; j < k; j++) {
            const list = cuts[indices[j]];
            for (let m = 0, n = list.length; m < n; m++) {
                const index = getVertex(list[m].point);
                if (marks[index] !== i) {
                    const vertex = vertices[index];
                    marks[index] = i;
                    if (vertex.x >= left && vertex.x <= right
                            && vertex.y >= top && vertex.y <= bottom)
                        hotPixels.push(index);
                }
            }
        }
        return hotPixels.sort((a, b) => a - b);
    }

    // 顶点可能切到的片段:不以该顶点为端点，且包围盒进入 epsilon 以内。
    function isNearPiece(piece: { values: number[]; cut1: Cut; cut2: Cut },
            index: number, vertex: Vertex): boolean {
        const v = piece.values,
            x = vertex.x,
            y = vertex.y;
        return getVertex(piece.cut1.point) !== index
                && getVertex(piece.cut2.point) !== index
                && x >= min(v[0], v[2], v[4], v[6]) - epsilon
                && x <= max(v[0], v[2], v[4], v[6]) + epsilon
                && y >= min(v[1], v[3], v[5], v[7]) - epsilon
                && y <= max(v[1], v[3], v[5], v[7]) + epsilon;
    }

    function addPiece(pieces: { values: number[]; cut1: Cut; cut2: Cut }[],
            i: number, cut1: Cut, cut2: Cut): void {
        pieces.push({
            values: getPiece(i, cut1, cut2),
            cut1: cut1,
            cut2: cut2
        });
    }

    function cutAtHotPixels(i: number): void {
        const candidates = getHotPixels(i);
        if (candidates.length) {
            const list = sortCuts(cuts[i]),
                pieces: { values: number[]; cut1: Cut; cut2: Cut }[] = [];
            for (let j = 1, k = list.length; j < k; j++)
                addPiece(pieces, i, list[j - 1], list[j]);
            while (pieces.length) {
                const piece = pieces.pop()!;
                for (let j = 0, k = candidates.length; j < k; j++) {
                    const index = candidates[j],
                        vertex = vertices[index];
                    if (isNearPiece(piece, index, vertex)) {
                        const point = new Point(vertex.x, vertex.y),
                            t = Curve.getNearestTime(piece.values, point);
                        if (t > 0 && t < 1 && point.isClose(
                                Curve.getPoint(piece.values, t)!, epsilon)) {
                            const cut1 = piece.cut1,
                                cut2 = piece.cut2,
                                cut: Cut = {
                                    time: curves[i].hasHandles()
                                        ? cut1.time
                                            + (cut2.time - cut1.time) * t
                                        : Curve.getNearestTime(values[i], point),
                                    point: vertex.point
                                };
                            cuts[i].push(cut);
                            addPiece(pieces, i, cut1, cut);
                            addPiece(pieces, i, cut, cut2);
                            break;
                        }
                    }
                }
            }
        }
    }

    // 2c. 合并由短于 4 epsilon 的片段连接的顶点。由于热像素的影响范围可达
    // 2 epsilon，这类顶点周围的边顺序无法区分。合并后的顶点跨度约 5 epsilon，
    // 也就是结果的精度。合并过顶点时返回 true，因为移动顶点可能让片段又靠近
    // 其它顶点。
    function mergeShortPieces(): boolean {
        const pieces: number[][] = [];
        let isMerged = false;
        for (let i = 0, l = curves.length; i < l; i++) {
            const list = sortCuts(cuts[i]);
            for (let j = 1, k = list.length; j < k; j++) {
                const cut1 = list[j - 1],
                    cut2 = list[j];
                if (getVertex(cut1.point) !== getVertex(cut2.point)
                        && Curve.getLength(getPiece(i, cut1, cut2))
                            < 4 * epsilon)
                    pieces.push([cut1.point, cut2.point]);
            }
        }
        for (let i = 0, l = pieces.length; i < l; i++) {
            const root1 = getRoot(pieces[i][0]),
                root2 = getRoot(pieces[i][1]);
            if (root1 !== root2) {
                parents[root1] = root2;
                isMerged = true;
            }
        }
        if (isMerged)
            createVertices();
        return isMerged;
    }

    // 反复在热像素处切开并合并，直到顶点不再移动为止（每次合并都会减少顶点，
    // 所以一定结束）。
    do {
        marks = new Array(vertices.length);
        for (let i = 0, l = curves.length; i < l; i++)
            cutAtHotPixels(i);
    } while (mergeShortPieces());

    // 3. 沿每条曲线在顶点之间建立边，记录从右向左穿过它时每条操作数的绕数
    // 变化。完全重合的片段合并成一条边，绕数相加。
    const edges: Edge[] = [],
        edgesByVertex: Edge[][] = [];

    function getCoincidence(edge1: Edge, edge2: Edge): number {
        // 沿 edge1 比较 edge2 上的点，若重合则返回 edge2 相对 edge1 的方向，
        // 否则返回 0。
        const v1 = edge1.values,
            v2 = edge2.values,
            times: number[] = [];
        for (let i = 1; i <= 3; i++) {
            const point = Curve.getPoint(v2, i / 4)!,
                time = Curve.getNearestTime(v1, point);
            if (!point.isClose(Curve.getPoint(v1, time)!, epsilon))
                return 0;
            times.push(time);
        }
        return times[0] < times[2] ? 1 : -1;
    }

    function addEdge(edge: Edge): void {
        // 按较小的顶点编号索引同一对顶点之间的边。
        const first = min(edge.from, edge.to),
            last = max(edge.from, edge.to),
            list = edgesByVertex[first] || (edgesByVertex[first] = []);
        for (let i = 0, l = list.length; i < l; i++) {
            const other = list[i],
                direction = max(other.from, other.to) === last
                    && getCoincidence(other, edge);
            if (direction) {
                for (let j = 0; j < 2; j++)
                    other.windings[j] += direction * edge.windings[j];
                return;
            }
        }
        list.push(edge);
        edges.push(edge);
    }

    for (let i = 0, l = curves.length; i < l; i++) {
        const list = cuts[i], // 已在 2c 中排序。
            isStraight = !curves[i].hasHandles();
        let prev = list[0];
        for (let j = 1, k = list.length; j < k; j++) {
            const cut = list[j],
                from = getVertex(prev.point),
                to = getVertex(cut.point),
                part = getPiece(i, prev, cut);
            // 丢弃起止于同一顶点的片段，除非它形成的环比顶点合并的片段更长。
            if (from !== to || Curve.getLength(part) >= 4 * epsilon) {
                const windings = [0, 0];
                windings[curveOperands[i]] = 1;
                addEdge({
                    values: part,
                    from: from,
                    to: to,
                    isStraight: isStraight,
                    windings: windings,
                    curve: i,
                    time1: prev.time,
                    time2: cut.time
                });
            }
            prev = cut;
        }
    }

    // 4. 按角度排列每个顶点出发的半边。第 i 条边对应两条半边:2 * i 从起点
    // 出发，2 * i + 1 从终点出发。角度用一个沿线方向短距离处的点来度量，那里
    // 相切的曲线已经分开，但还没到达另一个顶点。
    const halfEdges: HalfEdge[] = [];

    // 沿半边距离 distance 处的点。直线边的控制柄在两端，参数并不均匀。
    function getPointAt(halfEdge: HalfEdge, distance: number): Point {
        const v = halfEdge.values,
            edge = halfEdge.edge,
            t = distance / edge.length!;
        return edge.isStraight
                ? new Point(v[0] + (v[6] - v[0]) * t,
                    v[1] + (v[7] - v[1]) * t)
                : Curve.getPoint(v, Curve.getTimeAt(v, distance)!)!;
    }

    function getSide(halfEdge1: HalfEdge, halfEdge2: HalfEdge): number {
        // 两条在顶点处相切、在量角处无法区分的半边:在较短的一半处判断第二条
        // 位于第一条的哪一侧（它们结束之前不会相交），若那里不平行则返回 0。
        const v1 = halfEdge1.values,
            point = getPointAt(halfEdge2, min(halfEdge1.edge.length!,
                    halfEdge2.edge.length!) / 2),
            time = Curve.getNearestTime(v1, point);
        return time > 0 && time < 1
                ? Curve.getTangent(v1, time)!.cross(
                    point.subtract(Curve.getPoint(v1, time)!)) > 0 ? -1 : 1
                : 0;
    }

    // 半边控制多边形的角度范围，它包含半边离开顶点时的所有方向；范围不在
    // 半平面内时返回 null。
    function getDirections(v: number[]): { start: number; width: number } | null {
        const angles: number[] = [];
        for (let i = 0; i < 6; i += 2) {
            const dx = v[i + 2] - v[i],
                dy = v[i + 3] - v[i + 1];
            if (dx || dy)
                angles.push(Math.atan2(dy, dx));
        }
        const first = angles[0];
        let from = 0,
            to = 0;
        for (let i = 1, l = angles.length; i < l; i++) {
            const difference = (angles[i] - first + 3 * Math.PI)
                    % (2 * Math.PI) - Math.PI;
            from = min(from, difference);
            to = max(to, difference);
        }
        return to - from < Math.PI
                ? { start: (first + from + 2 * Math.PI) % (2 * Math.PI),
                    width: to - from }
                : null;
    }

    // 按方向范围排列半边。若这些范围相距足够远，使下面量角所用的点相距超过
    // 2 epsilon，就直接排好并返回 true。
    function sortByDirections(outgoing: number[]): boolean {
        let distance = Infinity;
        for (let j = 0, k = outgoing.length; j < k; j++) {
            const halfEdge = halfEdges[outgoing[j]],
                v = halfEdge.values;
            halfEdge.directions = getDirections(v);
            if (!halfEdge.directions)
                return false;
            distance = min(distance,
                    Math.sqrt((v[6] - v[0]) * (v[6] - v[0])
                        + (v[7] - v[1]) * (v[7] - v[1])) / 2);
        }
        const sorted = outgoing.slice().sort((a, b) =>
                halfEdges[a].directions!.start - halfEdges[b].directions!.start);
        let gap = Infinity,
            width = 0;
        for (let j = 0, k = sorted.length; j < k; j++) {
            const directions1 = halfEdges[sorted[j]].directions!,
                directions2 = halfEdges[sorted[(j + 1) % k]].directions!;
            gap = min(gap, directions2.start - directions1.start
                    - directions1.width + (j + 1 < k ? 0 : 2 * Math.PI));
            width = max(width, directions1.width);
        }
        if (gap > 0 && distance * Math.cos(width / 2)
                * Math.sin(min(gap, Math.PI / 2)) > 2 * epsilon) {
            for (let j = 0, k = sorted.length; j < k; j++)
                outgoing[j] = sorted[j];
            return true;
        }
        return false;
    }

    for (let i = 0, l = edges.length; i < l; i++) {
        const edge = edges[i],
            v = edge.values;
        edge.reversed = [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]];
        halfEdges.push(
            { edge: edge, values: v, from: edge.from, to: edge.to },
            { edge: edge, values: edge.reversed, from: edge.to,
                to: edge.from });
        vertices[edge.from].outgoing.push(2 * i);
        vertices[edge.to].outgoing.push(2 * i + 1);
    }
    for (let i = 0, l = vertices.length; i < l; i++) {
        const vertex = vertices[i],
            outgoing = vertex.outgoing;
        // 两条半边的循环顺序总是一致的，方向范围足够分开时已经给出了顺序。
        if (outgoing.length > 2 && !sortByDirections(outgoing)) {
            let distance = Infinity;
            for (let j = 0, k = outgoing.length; j < k; j++) {
                const edge = halfEdges[outgoing[j]].edge;
                edge.length = edge.length || Curve.getLength(edge.values);
                distance = min(distance, edge.length / 2);
            }
            for (let j = 0, k = outgoing.length; j < k; j++) {
                const halfEdge = halfEdges[outgoing[j]],
                    point = getPointAt(halfEdge, distance);
                halfEdge.point = point;
                halfEdge.angle = Math.atan2(point.y - vertex.y,
                        point.x - vertex.x);
            }
            // 从最大的角度间隙之后开始排序，避免难以区分的半边被 pi 到 -pi 的
            // 跳变分开。
            outgoing.sort((a, b) => halfEdges[a].angle! - halfEdges[b].angle!);
            let start = -Math.PI,
                gap = 0;
            for (let j = 0, k = outgoing.length; j < k; j++) {
                const angle = halfEdges[outgoing[j]].angle!,
                    previous = halfEdges[outgoing[(j || k) - 1]].angle!,
                    difference = (angle - previous + 2 * Math.PI)
                        % (2 * Math.PI) || 2 * Math.PI;
                if (difference > gap) {
                    gap = difference;
                    start = angle;
                }
            }
            for (let j = 0, k = outgoing.length; j < k; j++) {
                const halfEdge = halfEdges[outgoing[j]];
                halfEdge.angle = (halfEdge.angle! - start + 2 * Math.PI)
                        % (2 * Math.PI);
            }
            outgoing.sort((a, b) => {
                const halfEdge1 = halfEdges[a],
                    halfEdge2 = halfEdges[b];
                return halfEdge1.point!.isClose(halfEdge2.point!, epsilon)
                        && getSide(halfEdge1, halfEdge2)
                        || halfEdge1.angle! - halfEdge2.angle!;
            });
        }
        for (let j = 0, k = outgoing.length; j < k; j++)
            halfEdges[outgoing[j]].position = j;
    }
    // 沿面行走（面在左侧）时，下一条半边是回到当前顶点时那条边在逆时针方向
    // 上的前一条。
    for (let i = 0, l = halfEdges.length; i < l; i++) {
        const outgoing = vertices[halfEdges[i].to].outgoing,
            position = halfEdges[i ^ 1].position!;
        halfEdges[i].next = outgoing[(position || outgoing.length) - 1];
    }

    // 5. 收集面（每条半边左侧），以及它们的有符号面积:每个连通分量外部的
    // 面积为负。
    const faces: Face[] = [];
    for (let i = 0, l = halfEdges.length; i < l; i++) {
        if (halfEdges[i].face === undefined) {
            const face: Face = { halfEdges: [], area: 0, windings: null,
                component: null };
            let index = i;
            do {
                const halfEdge = halfEdges[index];
                halfEdge.face = face;
                face.halfEdges.push(index);
                face.area += Curve.getArea(halfEdge.values);
                index = halfEdge.next!;
            } while (index !== i);
            faces.push(face);
        }
    }

    // 6. 从每个连通分量的外部出发，跨过边传播绕数。位于其它分量内部的分量，
    // 其外部绕数由一条与它们的边求交的射线确定。
    const components: Component[] = [],
        rays: number[][] = [],
        boundsList: number[][] = [];
    for (let i = 0, l = faces.length; i < l; i++) {
        const face = faces[i];
        if (!face.component) {
            const component: Component = {
                    edges: [],
                    bounds: [Infinity, Infinity, -Infinity, -Infinity],
                    outside: face
                },
                list: Face[] = [face];
            face.component = component;
            for (let j = 0; j < list.length; j++) {
                const indices = list[j].halfEdges;
                if (list[j].area < component.outside.area)
                    component.outside = list[j];
                for (let k = 0, n = indices.length; k < n; k++) {
                    const other = halfEdges[indices[k] ^ 1].face!;
                    if (!other.component) {
                        other.component = component;
                        list.push(other);
                    }
                }
            }
            const vertex = vertices[
                halfEdges[component.outside.halfEdges[0]].from];
            components.push(component);
            rays.push([vertex.x, vertex.y, Infinity, vertex.y]);
            boundsList.push(component.bounds);
        }
    }
    // 记录每个分量的边与范围，使每条射线只与它够得着的分量求交。
    for (let i = 0, l = edges.length; i < l; i++) {
        const edge = edges[i],
            v = edge.values,
            component = halfEdges[2 * i].face!.component!,
            b = component.bounds;
        component.edges.push(edge);
        b[0] = min(b[0], v[0], v[2], v[4], v[6]);
        b[1] = min(b[1], v[1], v[3], v[5], v[7]);
        b[2] = max(b[2], v[0], v[2], v[4], v[6]);
        b[3] = max(b[3], v[1], v[3], v[5], v[7]);
    }
    const rayCollisions = findBoundsCollisions(rays, boundsList, 0, true);
    for (let i = 0, l = components.length; i < l; i++) {
        const outside = components[i].outside,
            point = new Point(rays[i][0], rays[i][1]),
            indices = rayCollisions[i]!,
            windings = [0, 0];
        for (let j = 0, k = indices.length; j < k; j++) {
            if (indices[j] !== i) {
                const list = components[indices[j]].edges;
                for (let m = 0, n = list.length; m < n; m++) {
                    const edge = list[m],
                        winding = getRayWinding(point, edge.values);
                    windings[0] += winding * edge.windings[0];
                    windings[1] += winding * edge.windings[1];
                }
            }
        }
        outside.windings = windings;
        const queue: Face[] = [outside];
        for (let j = 0; j < queue.length; j++) {
            const face = queue[j],
                indices = face.halfEdges;
            for (let k = 0, n = indices.length; k < n; k++) {
                const index = indices[k],
                    other = halfEdges[index ^ 1].face!;
                if (!other.windings) {
                    // 沿边方向行进时，半边左侧的面绕数更高。
                    const edgeWindings = halfEdges[index].edge.windings,
                        sign = index & 1 ? -1 : 1;
                    other.windings = [
                        face.windings![0] - sign * edgeWindings[0],
                        face.windings![1] - sign * edgeWindings[1]
                    ];
                    queue.push(other);
                }
            }
        }
    }
    return {
        curves: curves,
        values: values,
        vertices: vertices,
        edges: edges,
        halfEdges: halfEdges,
        faces: faces,
        nonZeros: nonZeros,
        epsilon: epsilon
    };
}

/**
 * 沿图中"左侧属于结果、右侧不属于结果"的边追踪出结果轮廓。在每个顶点处，
 * 沿结果内部转到下一条这样的边，从而让只在一点接触的轮廓彼此分开。
 */
function tracePaths(operands: PathItem[], operator: Operator): Path[] {
    const graph = createGraph(operands),
        halfEdges = graph.halfEdges,
        faces = graph.faces,
        nonZeros = graph.nonZeros;
    for (let i = 0, l = faces.length; i < l; i++) {
        const face = faces[i],
            windings = face.windings!;
        face.isInside = !!operator(
                nonZeros[0] ? !!windings[0] : !!(windings[0] & 1),
                nonZeros[1] ? !!windings[1] : !!(windings[1] & 1));
    }

    function isBoundary(index: number): boolean {
        return halfEdges[index].face!.isInside!
                && !halfEdges[index ^ 1].face!.isInside!;
    }

    // 半边上的 curve-time，以及下一条半边是否沿同一条曲线延续它。
    function getTimes(index: number): number[] {
        const edge = halfEdges[index].edge;
        return index & 1 ? [edge.time2, edge.time1]
                : [edge.time1, edge.time2];
    }

    function isContinued(index: number, next: number): boolean {
        return halfEdges[index].edge.curve === halfEdges[next].edge.curve
                && getTimes(index)[1] === getTimes(next)[0];
    }

    const paths: Path[] = [],
        isVisited: boolean[] = [];
    for (let i = 0, l = halfEdges.length; i < l; i++) {
        if (!isVisited[i] && isBoundary(i)) {
            const contour: number[] = [];
            let index = i;
            do {
                isVisited[index] = true;
                contour.push(index);
                index = halfEdges[index].next!;
                while (!isBoundary(index))
                    index = halfEdges[index ^ 1].next!;
            } while (index !== i);
            // 从"不延续前一段"的地方开始，因为闭合曲线的片段不会跨过它的
            // 端点延续。
            const length = contour.length;
            let start = 0;
            while (start < length && isContinued(
                    contour[(start || length) - 1], contour[start]))
                start++;
            // 把同一条曲线上前后相接的片段重新拼成一段。
            const segments: Segment[] = [];
            let handleIn: Point | null = null;
            for (let j = 0; j < length;) {
                const first = contour[(start + j) % length];
                let last = first;
                while (++j < length && isContinued(last,
                        contour[(start + j) % length]))
                    last = contour[(start + j) % length];
                const edge = halfEdges[first].edge,
                    isStraight = edge.isStraight,
                    v = first === last
                        ? halfEdges[first].values
                        : getPart(graph.values[edge.curve], !isStraight,
                            getTimes(first)[0], getTimes(last)[1],
                            graph.vertices[halfEdges[first].from],
                            graph.vertices[halfEdges[last].to]);
                segments.push(new Segment(new Point(v[0], v[1]),
                        handleIn || undefined,
                        isStraight ? undefined
                            : new Point(v[2] - v[0], v[3] - v[1])));
                handleIn = isStraight ? null
                        : new Point(v[4] - v[6], v[5] - v[7]);
            }
            if (handleIn)
                segments[0].handleIn = handleIn;
            const path = createPath(segments, true);
            // 只把覆盖面积的路径加入结果。
            if (path.getArea() !== 0)
                paths.push(path);
        }
    }
    return paths;
}

/**
 * 准备布尔运算的操作数。没有 path2 时，运算就在 path1 自身上求解。
 */
function getOperands(path1: PathItem, path2?: PathItem | null): PathItem[] {
    const operands = [preparePath(path1, true)];
    if (path2)
        operands.push(preparePath(path2, true));
    return operands;
}

/**
 * 用指定路径切开一个路径项:相当于把 subtract 与 intersect 的结果合成一个
 * 复合路径。`options.trace` 为 false 或按描边计算时，改成只切开第一个路径。
 */
export function divideBoolean(path1: PathItem, path2: PathItem,
        options?: BooleanOptions): PathItem {
    return options && (options.trace == false || options.stroke)
            ? splitBoolean(path1, path2, 'divide', options)
            : createResult([
                traceBoolean(path1, path2, 'subtract', options),
                traceBoolean(path1, path2, 'intersect', options)
            ], true);
}

/**
 * 解析一个路径项自身的绕数（用于 `PathItem#resolveCrossings()`）：按它的
 * 填充规则追踪所围区域的外轮廓，丢掉内部曲线。
 */
export function resolveCrossings(item: PathItem): PathItem {
    const paths = tracePaths([closePaths(cloneItem(item))],
        (inside) => !!inside);
    const result = createResult(paths, true);
    if (result === item)
        return item;
    // 尽量原地回收:复合路径换子路径，普通路径换 segments。
    if (isCompound(item) && result instanceof Object
            && (result as CompoundPath)._children) {
        item.children = (result as CompoundPath).children;
        return item;
    }
    if (!isCompound(item) && !(result as CompoundPath)._children) {
        item.segments = (result as Path).segments;
        item.closed = (result as Path).closed;
        return item;
    }
    return result;
}

/**
 * 重新调整路径项的方向，见 `PathItem#reorient()`。
 */
export function reorient(item: PathItem, nonZero?: boolean,
        clockwise?: boolean): PathItem {
    if (isCompound(item) && item.children.length) {
        const paths = reorientPaths(item.removeChildren(),
            (w) => !!(nonZero ? w : w & 1), clockwise);
        item.children = paths.filter((path): path is Path => !!path);
    } else if (clockwise !== undefined) {
        item.setClockwise(clockwise);
    }
    return item;
}

/**
 * 返回一个保证位于路径内部的点。
 */
export function getInteriorPoint(item: PathItem): Point {
    const bounds = item._getBounds(),
        point = bounds.center;
    // contains() 把边界也算作内部，但路径上的点并不算内部，例如与另一条路径
    // 共享的顶点 (#1837)。
    const nearest = item.getNearestPoint(point);
    if (!item.contains(point) || nearest
            && nearest.isClose(point, Numerical.GEOMETRIC_EPSILON)) {
        // 多段贝塞尔曲线不一定包含其包围盒中心，因此沿 x 方向发射射线，取左侧
        // 前两个相邻交点之间的点。射线穿过中心附近没有 y 单调曲线起止的带状
        // 区域，因此是真正穿过路径，而不是相切或沿着它走 (#1837)。
        const curves = item.curves,
            monoCurves: number[][] = [],
            ys: number[] = [],
            intercepts: number[] = [],
            roots: number[] = [];
        for (let i = 0, l = curves.length; i < l; i++)
            monoCurves.push(...Curve.getMonoCurves(curves[i].getValues()));
        for (let i = 0, l = monoCurves.length; i < l; i++)
            ys.push(monoCurves[i][1], monoCurves[i][7]);
        ys.sort((a, b) => a - b);
        // 中心位于边界的上下界之间，这两个值都在 ys 里，除非路径是平的。
        let y = point.y,
            below = y,
            above = y;
        for (let i = 0, l = ys.length; i < l && above === y; i++) {
            if (ys[i] <= y) {
                below = ys[i];
            } else {
                above = ys[i];
            }
        }
        y = point.y = (below + above) / 2;
        for (let i = 0, l = monoCurves.length; i < l; i++) {
            const mv = monoCurves[i],
                mo0 = mv[1],
                mo3 = mv[7];
            if (y > min(mo0, mo3) && y < max(mo0, mo3)) {
                intercepts.push(
                        Curve.solveCubic(mv, 1, y, roots, 0, 1) === 1
                            ? Curve.getPoint(mv, roots[0])!.x
                            : (mv[0] + mv[6]) / 2);
            }
        }
        if (intercepts.length > 1) {
            intercepts.sort((a, b) => a - b);
            point.x = (intercepts[0] + intercepts[1]) / 2;
        }
    }
    return point;
}
