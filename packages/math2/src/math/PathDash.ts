import { PathBuilder,type FlattenedContour ,type FlattenOptions} from './PathBuilder.js';
import {type Vector2Like} from './Vector2.js'


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
export function normalizeDash(dash: DashStyle | null | undefined): ResolvedDash | null {
  if (dash == null) return null;
  const raw = dash.intervals;
  if (raw.length === 0) return null;

  for (const v of raw) {
    if (!Number.isFinite(v) || v < 0) {
      throw new RangeError(`DashStyle: 虚线段长度必须是非负有限数 (${v})`);
    }
  }

  const intervals = raw.length % 2 === 1 ? raw.concat(raw) : raw.slice();
  let total = 0;
  for (const v of intervals) total += v;
  if (!(total > 0)) return null;

  let phase = (dash.phase ?? 0) % total;
  if (phase < 0) phase += total;
  if (!Number.isFinite(phase)) phase = 0;

  return { intervals, total, phase };
}


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
export function dashContours(
  contours: readonly FlattenedContour[],
  dash: DashStyle | null | undefined,
  resetPhasePerContour = true,
): DashFragment[] {
  const nd = normalizeDash(dash);
  if (nd === null) {
    return contours.map((c) => ({ points: c.points.slice(), closed: c.closed }));
  }

  const intervals = nd.intervals;
  const count = intervals.length;

  // 相位状态可以跨子轮廓延续，所以放在循环外。
  let idx = 0;
  let remaining = 0;
  let on = true;

  const resetPhase = (): void => {
    let acc = 0;
    let i = 0;
    // 前进到「包含 phase 的那一段」
    while (i < count - 1 && acc + (intervals[i] ?? 0) <= nd.phase) {
      acc += intervals[i] ?? 0;
      i++;
    }
    idx = i;
    remaining = (intervals[i] ?? 0) - (nd.phase - acc);
    on = i % 2 === 0;
  };
  resetPhase();

  const out: DashFragment[] = [];

  for (const contour of contours) {
    if (!resetPhasePerContour) {
      // 沿用上一条子轮廓结束时的相位状态。
    } else {
      resetPhase();
    }

    const pts = contour.points;
    const n = pts.length;
    if (n < 2) {
      // 退化子轮廓无法虚化：只有「on」时才原样保留。
      if (on && n === 1) out.push({ points: pts.slice(), closed: contour.closed });
      continue;
    }

    const segCount = contour.closed ? n : n - 1;
    let cur: Vector2Like[] = [];
    let anyOff = false;
    let startedAtLoopStart = false;

    const pushPoint = (x: number, y: number): void => {
      const m = cur.length;
      if (m >= 1 && cur[m-1].x === x && cur[m - 1].y === y) return;
      cur.push({x,y});
    };

    for (let s = 0; s < segCount; s++) {
      const ax = pts[s].x;
      const ay = pts[s].y;
      const j = (s + 1) % n;
      const bx = pts[j].x;
      const by = pts[j].y;
      const segLen = Math.hypot(bx - ax, by - ay);
      if (segLen === 0) continue;

      let travelled = 0;
      while (travelled < segLen) {
        const step = Math.min(remaining, segLen - travelled);
        const t0 = travelled / segLen;
        const t1 = (travelled + step) / segLen;

        if (on) {
          if (cur.length === 0) {
            pushPoint(ax + (bx - ax) * t0, ay + (by - ay) * t0);
            if (s === 0 && t0 === 0) startedAtLoopStart = true;
          }
          pushPoint(ax + (bx - ax) * t1, ay + (by - ay) * t1);
        }

        travelled += step;
        remaining -= step;
        if (remaining <= 1e-12) {
          idx = (idx + 1) % count;
          remaining = intervals[idx] ?? 0;
          on = idx % 2 === 0;
          if (!on) {
            anyOff = true;
            if (cur.length >= 4) {
              out.push({ points: cur, closed: false });
              cur = [];
              startedAtLoopStart = false;
            }
          }
        }
      }
    }

    if (cur.length >= 4) {
      // 整条闭合子轮廓从头到尾都处于 on（例如间隔里有 0 长度的空隙）→ 保持闭合。
      const full = contour.closed && !anyOff && startedAtLoopStart;
      out.push({ points: cur, closed: full });
    }
  }

  return out;
}

/**
 * 对路径施加虚线，返回**只含直线**的开放子路径集合。
 *
 * 管线顺序固定为 **dash → stroke → fill(nonzero)**：虚线作用于中线，描边负责给每个
 * 虚线段加端帽，最后由非零填充生成的轮廓。
 */
export function dashPath(
  path: PathBuilder,
  dash: DashStyle | null | undefined,
  options: DashPathOptions = {},
): PathBuilder {
  const contourFlattenOptions: FlattenOptions = {
    tolerance: options.tolerance ?? 0.25,
    autoClose: options.autoClose ?? false,
    skipDegenerate: options.skipDegenerate ?? false,
  };
  const contours = path.getSubPaths(contourFlattenOptions);
  const fragments = dashContours(contours, dash, options.resetPhasePerContour ?? true);

  const out = new PathBuilder();
  for (const frag of fragments) {
    const n = frag.points.length >> 1;
    if (n === 0) continue;
    out.moveTo(frag.points[0].x, frag.points[0].y);
    for (let i = 1; i < n; i++) {
      out.lineTo(frag.points[i].x, frag.points[i].y);
    }
    if (frag.closed) out.closePath();
  }
  return out;
}
