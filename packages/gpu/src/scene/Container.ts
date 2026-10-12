// ============================================================
// Container — 场景根容器
//
// 作为一棵场景树的顶层容器使用：自身无父节点，世界坐标系即其本地坐标系，
// 用于承载 Layer / Group / Element 等节点。
//
// 继承链：Element → Group → Container
// 相比 Group 仅补充「根」语义标识（type='Container'、isRoot=true），
// 不含视口尺寸 / 背景 / 裁剪 —— 这些属于 Layer 的职责。
// ============================================================

import { Group, type GroupProps } from './Group'

export type ContainerProps = GroupProps

export class Container<Props extends ContainerProps = ContainerProps> extends Group<Props> {

    type: string = 'Container'
    /** 场景根标识 */
    isRoot: boolean = true

    constructor(props: Partial<Props> = {}) {
        super(props)
    }
}
