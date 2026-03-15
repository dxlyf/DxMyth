import { NODE_EVENTS, type INode, type NodeEventMap,type NodeProps } from "src/interface/INode";
import { InteractiveEventEmitter } from "./InteractiveEventEmitter";
import { NODE_TYPES } from "src/constanst";
import { InteractiveEvent } from "src/core/InteractiveEvent";

let nodeUid=0

export class Node<Props extends NodeProps,Events extends NodeEventMap> extends InteractiveEventEmitter<Events> implements INode<Props,Events>{
    type=NODE_TYPES.Node
    uid:number
    parent?: INode<Props,Events>=null
    children: INode<Props,Events>[];
    props:Props
    constructor(props?:Props){
        super()
        this.uid=nodeUid++
        this.props=props
    }
    
    add(child: INode<Props,Events>): void {
        if(child.parent){
            child.parent.remove(child)
        }
        this.children?.push(child)
        child.parent=this;
        (this as INode<Props,NodeEventMap>).emit(InteractiveEvent.create(NODE_EVENTS.ADD_CHILD,child))
    }
    remove(child: INode<Props,Events>): void {
        const index = this.children?.indexOf(child)
        if(index!==undefined){
            this.children[index].parent=null
            this.children?.splice(index,1);
            (this as INode<Props,NodeEventMap>).emit(InteractiveEvent.create(NODE_EVENTS.REMOVE_CHILD,child))
        }
    }
}
