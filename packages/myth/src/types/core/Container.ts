
import {ElementEvents,ElementProps, IElement} from './Element'
import {IDisplayObject} from './DisplayObject'
export type ContainerProps={

}&ElementProps

export interface ContainerEvents extends ElementEvents{
 
}
export interface IContainer<Props extends ContainerProps> extends IElement<Props>{
    getDisplayList():IDisplayObject<Props>[];
}
