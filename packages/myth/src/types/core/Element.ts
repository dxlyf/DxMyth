
import type {TransformableProps} from '@dxyl/math/types/2d/math/transformable'
import type {BoundingRect} from '@dxyl/math/types/2d/math/bounding_rect'
import type {IStateProp} from './StateProps'
import type { IApplication } from './Application';
import { ITransformable } from 'src/math/Transformable';
import {EventEmitter4,Emitter4Event} from 'src/events'
import { InteractivePointerEvents } from '../events/InteractivePointerEvent';
export interface ElementProps extends TransformableProps{
    name?:string
    draggable?:boolean; // 是否可拖拽
    rectOver?:boolean; // 如果为true则忽略rect的区域检测，直接渲染整个元素
    ignore?:boolean; // 是否忽略，忽略则不渲染也不响应事件
    silent?:boolean; // 是否静默，静默则不触发事件
    visible?:boolean // 是否可见，不可见则不渲染，但响应事件
    zIndex?:number // 层级
}
export type MergeEvents<A extends Record<string, any[]>, B extends Record<string, any[]>> = {
    [K in keyof A | keyof B]: K extends keyof A
      ? K extends keyof B
        ? A[K] | B[K]  // 两边都有 → 联合
        : A[K]         // 只有 A
      : K extends keyof B
        ? B[K]         // 只有 B
        : never;
  };

export type ElementEvents={
    'child:add':[{
        el:IElement<any>
    }]
    'child:remove':[{
        el:IElement<any>
    }]
}&InteractivePointerEvents
export type ElementStateProps={

}
export interface IElement<Props extends ElementProps,E extends ElementEvents=ElementEvents> extends ITransformable,EventEmitter4<E>{
    id:number
    name:string // 元素名称，可以根据名称查找子元素
    type:string 
    props:Props // 属性，可以通过props.xxx访问
    effectFlag:number // effectFlag用于标记元素的状态，在渲染时做特殊处理
    children: IElement<Props>[]|null;
    parent: IElement<Props>|null; // 父元素
    owner:IApplication;// 祖先
    defaultProps():Partial<Props>[]; // 默认属性，用于初始化时合并到props中
   // getStateProps():Record<string,IStateProp<any,any>>;
    shouldInteractive():boolean; // 是否可以交互，如silent
    shouldAddToDisplayList():boolean; // 是否应该添加到显示列表中，如ignore,group
    shouldRender():boolean;// 是否可以渲染，如visible ignore opacity==0
    getObjectByName(name:string):IElement<Props>|void;
    calcLocalBounds():BoundingRect;// 计算几何边界框，不应用矩阵变换，仅用于计算边界框
    getLocalBounds(forceReCalc?:boolean):BoundingRect; // 边界框，不应用矩阵变换，仅用于计算边界框，缓存calcLocalBounds
    getGlobalBounds(forceReCalc?:boolean):BoundingRect;// 全局边界框，相对于舞台坐标系
    insert(el: IElement<Props>, index?: number): boolean // 插入子元素，如果index为-1则添加到末尾
    add(el:IElement<Props>):boolean // 添加子元素
    remove(el:IElement<Props>):boolean // 移除子元素
    removeSelf():boolean // 移除自身元素
    traverse(fn:(el:IElement<Props>)=>void):void; // 遍历子元素，包括自身
    traverseSort(fn:(el:IElement<Props>)=>void):void; // 遍历子元素，包括自身，并且按照层级排序
    getAllEffectFlag():number; // 获取所有子元素的effectFlag总和
    removeAllEffectFlag(flag:number):void; // 移除所有子元素的effectFlag
    resetAllEffectFlag():void; // 重置所有子元素的effectFlag

    dispose():void;
}
