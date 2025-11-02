import type {ContainerOptions,ContainerOptionsEvents,IContainer} from 'src/interface/Container'
import { Node } from "./Node";
import { ICanvaskitRenderer } from "src/interface/Renderer";

interface ISpatialIndex<T> {
    insert(item: T): void;
    remove(item: T): void;
    update(item: T): void; // 当节点位置或大小改变
    queryRange(rect: { x: number, y: number, width: number, height: number }): T[];
}

class Group extends Node {
     type: string='Group'
     isGroup=true
     constructor(options?:ContainerOptions){
          super(options)
     }

}
export {
    Group
}