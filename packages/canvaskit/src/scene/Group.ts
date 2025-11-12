
import type { NodeOptions } from "src/types/Node";
import { Node } from "./Node";
interface ISpatialIndex<T> {
    insert(item: T): void;
    remove(item: T): void;
    update(item: T): void; // 当节点位置或大小改变
    queryRange(rect: { x: number, y: number, width: number, height: number }): T[];
}

export class Group extends Node {
     type: string='Group'
     isGroup=true
     constructor(options?:NodeOptions){
          super(options)
     }
     shouldAddToPendingRenderList(){
        return false
     }
     innerCalcLocalBounds(): void {
         
     }

}
