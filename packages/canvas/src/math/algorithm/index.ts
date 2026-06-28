/**
 * 多边形布尔运算算法集合（统一导出）。
 *
 * 提供四种经典裁剪算法，输入输出统一为 Polygon[] / ClipResult：
 *   - weilerAthertonClip：进出点标记 + 链表遍历（WA 原版思想）
 *   - greinerHormannClip：WA 的稳健改进，双链表 + entry/exit 标记
 *   - vattiClip         ：扫描线 + 事件分裂 + 子段分类（支持自相交/孔洞）
 *   - bspClip           ：二叉空间分割，递归用裁剪边线分割空间
 *
 * 公共类型与几何工具见 types.ts。
 *
 * 选型建议：
 *   - 通用、稳健、需孔洞/自相交 → vattiClip
 *   - 边界清晰、无共线退化      → greinerHormannClip
 *   - 教学演示                  → weilerAthertonClip / bspClip
 */

export * from './types'

export { weilerAthertonClip } from './WeilerAtherton'
export { greinerHormannClip } from './GreinerHormann'
export { vattiClip } from './Vatti'
export { bspClip } from './BspClip'
