/**
 * 移植自 paper/src/util/CollisionDetection.js。
 *
 * 轴对齐包围盒的碰撞检测，使用 sweep and prune 算法。这里的实现是几何运算
 * 的基础设施（布尔运算、求交的粗筛）。
 */

/** 只需要这四个边的包围盒形状。 */
export interface BoundsLike {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * 找出两组条目的轴对齐包围盒之间的碰撞。
 *
 * 对 items1 与 items2 中每个条目取其 `bounds`，再调用
 * {@link findBoundsCollisions}。
 *
 * @returns 与 items1 同长度的数组，每一项是 items2 中与它碰撞的下标数组
 */
export function findItemBoundsCollisions(items1: { bounds: BoundsLike }[],
        items2?: { bounds: BoundsLike }[] | null,
        tolerance?: number): (number[] | null)[] {
    function getBounds(items: { bounds: BoundsLike }[]): number[][] {
        const bounds: number[][] = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            const rect = items[i].bounds;
            bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
        }
        return bounds;
    }

    const bounds1 = getBounds(items1),
        bounds2 = !items2 || items2 === items1
            ? bounds1
            : getBounds(items2);
    return findBoundsCollisions(bounds1, bounds2, tolerance || 0);
}

/**
 * 找出两组曲线包围盒之间的碰撞。
 *
 * 为了性能这里用的是曲线的粗略包围盒（由控制点算出），它保证包住整条曲线，
 * 但通常比真实包围盒大。
 *
 * @param curves1 曲线 values 数组的数组
 * @returns 与 curves1 同长度的数组，每一项是 curves2 中碰撞的下标数组
 */
export function findCurveBoundsCollisions(curves1: number[][],
        curves2?: number[][] | null,
        tolerance?: number): (number[] | null)[] {
    function getBounds(curves: number[][]): number[][] {
        const min = Math.min,
            max = Math.max,
            bounds: number[][] = new Array(curves.length);
        for (let i = 0; i < curves.length; i++) {
            const v = curves[i];
            bounds[i] = [
                min(v[0], v[2], v[4], v[6]),
                min(v[1], v[3], v[5], v[7]),
                max(v[0], v[2], v[4], v[6]),
                max(v[1], v[3], v[5], v[7])
            ];
        }
        return bounds;
    }

    const bounds1 = getBounds(curves1),
        bounds2 = !curves2 || curves2 === curves1
            ? bounds1
            : getBounds(curves2);
    return findBoundsCollisions(bounds1, bounds2, tolerance || 0);
}

/**
 * 找出两组包围矩形之间的碰撞。
 *
 * 实现为 sweep and prune 算法:沿 x 或 y 轴（主轴）扫描，并立即在副轴上检查
 * 潜在的配对。
 *
 * bounds 数组中的每一项必须是长度为 4 的数组，依次为 x0、y0、x1、y1。
 *
 * 返回数组与 boundsA 等长，每一项包含 boundsB 中所有重叠包围盒的下标，按
 * 升序排列。若未提供 boundsB（或传入 null），则检测 boundsA 内部的碰撞，
 * 此时每项不会包含它自身的下标。
 *
 * @param boundsA 要检测碰撞的包围盒数组
 * @param boundsB 用来与第一个数组比较的包围盒数组
 * @param tolerance 若提供，检测时会在每个包围盒四边加上该容差
 * @param sweepVertical 为 true 时沿 y 轴扫描
 */
export function findBoundsCollisions(boundsA: number[][],
        boundsB?: number[][] | null, tolerance = 0,
        sweepVertical?: boolean): (number[] | null)[] {
    const self = !boundsB || boundsA === boundsB,
        allBounds = self ? boundsA : boundsA.concat(boundsB),
        lengthA = boundsA.length,
        lengthAll = allBounds.length;

    // 二分查找工具函数。存在多个相同项时返回最右边的那个。
    // https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure_for_finding_the_rightmost_element
    function binarySearch(indices: number[], coord: number,
            value: number): number {
        let lo = 0,
            hi = indices.length;
        while (lo < hi) {
            const mid = (hi + lo) >>> 1; // 等价于 Math.floor((hi + lo) / 2)
            if (allBounds[indices[mid]][coord] < value) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo - 1;
    }

    // 根据扫描方向设置主轴与副轴的坐标下标。默认水平扫描，即 x 为主轴。
    const pri0 = sweepVertical ? 1 : 0,
        pri1 = pri0 + 2,
        sec0 = sweepVertical ? 0 : 1,
        sec1 = sec0 + 2;
    // 生成按主轴下界排序的所有下标。
    const allIndicesByPri0: number[] = new Array(lengthAll);
    for (let i = 0; i < lengthAll; i++) {
        allIndicesByPri0[i] = i;
    }
    allIndicesByPri0.sort((i1, i2) => allBounds[i1][pri0] - allBounds[i2][pri0]);
    // 沿主轴扫描。活动包围盒的下标保存在一个按主轴上界排序的数组里。
    const activeIndicesByPri1: number[] = [],
        allCollisions: (number[] | null)[] = new Array(lengthA);
    for (let i = 0; i < lengthAll; i++) {
        const curIndex = allIndicesByPri0[i],
            curBounds = allBounds[curIndex],
            // 在 boundsA 或 boundsB 中的原始下标:
            origIndex = self ? curIndex : curIndex - lengthA,
            isCurrentA = curIndex < lengthA,
            isCurrentB = self || !isCurrentA,
            curCollisions = isCurrentA ? [] : null;
        if (activeIndicesByPri1.length) {
            // 修剪掉不再活动的下标。
            const pruneCount = binarySearch(activeIndicesByPri1, pri1,
                    curBounds[pri0] - tolerance) + 1;
            activeIndicesByPri1.splice(0, pruneCount);
            // 为当前下标添加碰撞。
            const curSec1 = curBounds[sec1],
                curSec0 = curBounds[sec0];
            for (let j = 0; j < activeIndicesByPri1.length; j++) {
                const activeIndex = activeIndicesByPri1[j],
                    activeBounds = allBounds[activeIndex],
                    isActiveA = activeIndex < lengthA,
                    isActiveB = self || activeIndex >= lengthA;

                // 检查副轴上的包围盒。
                if ((
                        isCurrentA && isActiveB ||
                        isCurrentB && isActiveA
                    ) && (
                        curSec1 >= activeBounds[sec0] - tolerance &&
                        curSec0 <= activeBounds[sec1] + tolerance
                    )) {
                    // 把当前下标加入活动下标的碰撞列表，反之亦然。
                    if (isCurrentA && isActiveB) {
                        curCollisions!.push(
                            self ? activeIndex : activeIndex - lengthA);
                    }
                    if (isCurrentB && isActiveA) {
                        allCollisions[activeIndex]!.push(origIndex);
                    }
                }
            }
        }
        if (isCurrentA) {
            if (boundsA === boundsB) {
                // 两个数组相同时，加上自身碰撞。
                curCollisions!.push(curIndex);
            }
            // 记录当前下标的碰撞。
            allCollisions[curIndex] = curCollisions;
        }
        // 把当前下标加入活动下标，并保持数组按主轴上界排序。
        if (activeIndicesByPri1.length) {
            const curPri1 = curBounds[pri1],
                index = binarySearch(activeIndicesByPri1, pri1, curPri1);
            activeIndicesByPri1.splice(index + 1, 0, curIndex);
        } else {
            activeIndicesByPri1.push(curIndex);
        }
    }
    // 把碰撞下标按升序排序。
    for (let i = 0; i < allCollisions.length; i++) {
        const collisions = allCollisions[i];
        if (collisions) {
            collisions.sort((i1, i2) => i1 - i2);
        }
    }
    return allCollisions;
}
