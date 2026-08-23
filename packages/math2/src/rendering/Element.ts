import { EventEmitter } from "src/events/EventEmitter";
import { Vector2, Vector2Like } from "src/math/Vector2";
import { Matrix2D } from "src/math/Matrix2D";
import { Transform,TransformProps } from "src/math/Transform";



export type ElementEvents = {
    'transform:change': [transform: Transform]
}

export type ElementProps=TransformProps&{

}
export const ElementDirtyFlag={
    transform:1<<1,
    props:1<<2,
    children:1<<3,
}
export abstract class Element extends Transform<ElementEvents> {
    //元素层级关系
    parent: Element|null = null
    children:Element[] = []
    dirtyFlag:number=0
    constructor(props?:ElementProps) {
        super(props)
    }

    updateBefore(){

    }
    update(){
        this.updateMatrix()
        this.updateWorldMatrix()
    }
    updateAfter(){

    }
    traverse(callback:((element:Element)=>boolean|void)){
        callback(this)
        const children=this.children
        for(let i=0,len=children.length;i<len;i++){
            const child=children[i];
            const result=child.traverse(callback)
            if(result===true){
                return
            }
        }
        return false
    }

}