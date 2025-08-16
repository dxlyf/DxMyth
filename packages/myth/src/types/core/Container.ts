
import {ElementEvents,ElementProps, IElement} from './Element'
import {IDisplayObject} from './DisplayObject'
import { IViewport } from './Viewport'
export type ContainerProps={

}&ElementProps

export interface ContainerEvents extends ElementEvents{
 
}
export type DisplayListConfig={
    viewport:IViewport
}
export interface IContainer<Props extends ContainerProps> extends IElement<Props>{
    getDisplayList():IDisplayObject<Props>[];
}
