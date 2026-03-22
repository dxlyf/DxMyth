import type { InteractiveEvent } from "src/events/InteractiveEvent";
import { IInteractiveEventEmitter } from "./IInteractiveEventEmitter";
import { PointLike } from "./IPoint";
import { IDispose } from "./IDispose";

export const NODE_EVENTS={
    CLICK:'click', // 点击事件
    DOUBLE_CLICK:'dblclick', // 双击事件
    MOUSE_DOWN:'pointerdown', // 鼠标按下事件
    MOUSE_UP:'pointerup', // 鼠标松开事件
    MOUSE_MOVE:'pointermove', // 鼠标移动事件
    MOUSE_OUT:'pointerout', // 鼠标移出元素事件
    MOUSE_OVER:'pointerover', // 鼠标移入元素内部
    MOUSE_LEAVE:'pointerleave', // 鼠标离开元素事件
    MOUSE_ENTER:'pointerenter', // 鼠标进入元素事件
    MOUSE_WHEEL:'mousewheel', // 鼠标滚轮事件
    ADD_CHILD:'add:child', 
    REMOVE_CHILD:'remove:child',
    DISPOSE:'dispose'
} as const
export type NodeEventMap={
    [NODE_EVENTS.CLICK]:InteractiveEvent<MouseEvent>
    [NODE_EVENTS.MOUSE_DOWN]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_UP]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_MOVE]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_OUT]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_OVER]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_LEAVE]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_ENTER]:InteractiveEvent<PointerEvent>
    [NODE_EVENTS.MOUSE_WHEEL]:InteractiveEvent<WheelEvent>
    [NODE_EVENTS.ADD_CHILD]:InteractiveEvent
    [NODE_EVENTS.REMOVE_CHILD]:InteractiveEvent
    [NODE_EVENTS.DISPOSE]:any
}
export type NodeProps={
    position:PointLike // 位置
    rotation:number // 旋转角度
    skew:PointLike  // 倾斜角度
    scale:PointLike // 缩放因子
    origin:PointLike // 原点，用于计算旋转和缩放
    visible:boolean // 是否可见
    opacity:number // 透明度
    zIndex:number // 层级索引，用于控制渲染顺序
}

export interface INode<Props extends NodeProps=any,Events extends NodeEventMap=NodeEventMap> extends IInteractiveEventEmitter<Events>,IDispose{
    type:string
    uid:number
    owner?:any
    props:Props
    parent?:INode<Props,Events>;
    children?:INode<Props,Events>[];
    add(child:INode<Props,Events>):void
    remove(child:INode<Props,Events>):void
}