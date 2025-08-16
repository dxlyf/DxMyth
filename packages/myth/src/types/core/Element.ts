
import type {TransformableProps} from '@dxyl/math/types/2d/math/transformable'
import type {BoundingRect} from '@dxyl/math/types/2d/math/bounding_rect'
import type {IStateProp} from './StateProps'
import type { IApplication } from './Application';
import { ITransformable } from 'src/math/Transformable';
import {EventTarget} from 'src/events/EventTarget'
export interface ElementProps extends TransformableProps{
    name?:string
    rectOver?:boolean; // 如果为true则忽略rect的区域检测，直接渲染整个元素
    ignore?:boolean; // 是否忽略，忽略则不渲染也不响应事件
    silent?:boolean; // 是否静默，静默则不触发事件
    visible?:boolean // 是否可见，不可见则不渲染，但响应事件
    zIndex?:number // 层级
}


export interface ElementEvents{
    'prop:change':{
        field:string
        current:any
        previous:any
    }
    'child:add':{
        el:IElement<any>
    }
    'child:remove':{
        el:IElement<any>
    }
    'dispose':{}
}
export type ElementStateProps={

}
export interface IElement<Props extends ElementProps> extends ITransformable,EventTarget{
    id:number
    name:string // 元素名称，可以根据名称查找子元素
    type:string 
    props:Props // 属性，可以通过props.xxx访问
    effectFlag:number // effectFlag用于标记元素的状态，在渲染时做特殊处理
    children: IElement<Props>[]|null;
    parent: IElement<Props>|null; // 父元素
    owner:IApplication;// 祖先
    initialize():void; // 初始化，在构造函数中调用
    defaultProps():Partial<Props>[]; // 默认属性，用于初始化时合并到props中
   // getStateProps():Record<string,IStateProp<any,any>>;
    shouldAddToDisplayList():boolean; // 是否应该添加到显示列表中，如ignore,group
    shouldRender():boolean;// 是否可以渲染，如visible ignore opacity==0
    getObjectByName(name:string):IElement<Props>|void;
    calcLocalBounds():BoundingRect;// 计算几何边界框，不应用矩阵变换，仅用于计算边界框
    getLocalBounds(forceReCalc?:boolean):BoundingRect; // 局部边界框，相对于父元素坐标系
    getBounds(forceReCalc?:boolean):BoundingRect;// 全局边界框，相对于舞台坐标系
    insert(el: IElement<Props>, index?: number): boolean // 插入子元素，如果index为-1则添加到末尾
    add(el:IElement<Props>):boolean // 添加子元素
    remove(el:IElement<Props>):boolean // 移除子元素
    removeSelf():boolean // 移除自身元素
    traverse(fn:(el:IElement<Props>)=>void):void; // 遍历子元素，包括自身
    traverseSort(fn:(el:IElement<Props>)=>void):void; // 遍历子元素，包括自身，并且按照层级排序
    getAllEffectFlag():number; // 获取所有子元素的effectFlag总和
    dispose():void;
}
