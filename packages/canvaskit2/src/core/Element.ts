// ============================================================
// Element — 图形元素基类实现
// 使用 Transform 管理矩阵，通过 Point.onChange 自动标记脏
// ============================================================

import type { Element as IElement } from '../types/Element'
import type { ElementEvents } from '../types/Element'
import { ElementFlag } from '../types/Element'
import type { Point } from '../types/Point'
import type { PointLike } from '../types/Point'
import type { Matrix2DLike } from '../types/Matrix2D'
import  { BoundingRect } from '../math/BoundingRect'
import { EventEmitter } from '../events/EventEmitter'
import { Transform } from '../math/Transform'

let _uid = 0

export class Element<P = any> extends EventEmitter<ElementEvents> implements IElement<P> {

}
