import { Transform,type TransformProps } from "src/math/Transform";
import { Matrix2D } from "src/math/Matrix2D";
import { Point } from "src/math/Point";
import { IRenderer } from "./Renderer";
import { BoundingRect } from "src/math/BoundingRect";
import { INodeEventTarget } from "./EventTarget";
/** 节点属性 */
export type NodeProps=TransformProps&{
    /** 节点名称 */
    name?: string;
    /** 节点可见性 不渲染*/
    visible?: boolean;
    /** 节点透明度，范围 0-1 ，0时，不渲染，但事件响应 */
    opacity?: number;
    /** 自定义数据 */
    data?: Record<string, any>;
    /** 裁剪区域 */
    clipPath?: any;
    /** 鼠标指针样式 */
    cursor?: string;
    /** 是否可交互 */
    interactive?: boolean;
}
export type NodeEvents={
    'add:child':{}
    'remove:child':{}
    'prop:change':{prop:string,value:any,old:any},
    click:{}
    mousedown:{}
    mousemove:{}
    mouseup:{}
    wheel:{}
}
export interface INode<Props extends NodeProps=NodeProps> extends INodeEventTarget<NodeEvents> {
    type:string
    props:Props
    parent:INode<Props>|null
    children:INode<Props>[]
    visible:boolean
    opacity:number
    interactive:boolean
    // 脏标记
    dirtyFlags:number
    // 变换矩阵
    position:Point
    scale:Point
    skew:Point
    origin:Point
    rotation:number
    transform:Transform
    matrix:Matrix2D
    worldMatrix:Matrix2D
    worldMatrixInvert:Matrix2D

    // 获取默认属性值
    setProps(props:Props):void
    getDefaultProps():Props
    // ---- 变换操作 ----

    addDirtyFlags(flags:number):void
    removeDirtyFlags(flags:Number):void
    includeDirtyFlags(flags:number):boolean
    hasDirtyFlags(flags:number):boolean
    // ---- 子节点操作 ----
    addChild(child:INode<Props>):void
    removeChild(child:INode<Props>):void
    insertChildAt(child:INode<Props>,index:number):void
    getChildAt(index:number):INode<Props>|null

    // 边界检测
    calculateBounds():void // 计算节点边界
    getBounds():BoundingRect // 获取节点边界
    getGlobalBounds():BoundingRect // 获取节点全局边界，考虑变换矩阵

    /** 点击测试 */
    hitTest(x:number,y:number):boolean
    // 是否应该渲染
    shouldRender():boolean
    /** 更新节点状态 */
    onBeforeUpdate():void
    onUpdate():void
    onAfterUpdate():void
    
    beforeRender(renderer:IRenderer):void
    render(renderer:IRenderer):void
    afterRender(renderer:IRenderer):void
}