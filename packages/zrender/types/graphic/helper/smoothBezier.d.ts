import { VectorArray } from '../../core/vector';
/**
 * 贝塞尔平滑曲线
 * @param points 线段顶点数组
 * @param smooth 平滑等级, 0-1
 * @param isLoop
 * @param constraint 将计算出来的控制点约束在一个包围盒内
 *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
 *                           整个折线的包围盒做一个并集用来约束控制点。
 * @param 计算出来的控制点数组
 */
export default function smoothBezier(points: VectorArray[], smooth?: number, isLoop?: boolean, constraint?: VectorArray[]): any[];
