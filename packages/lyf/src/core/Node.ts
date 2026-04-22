import { NODE_EVENTS, type INode, type NodeEventMap,type NodeProps } from "src/interface/INode";
import { InteractiveEventEmitter } from "src/events/InteractiveEventEmitter";
import { NODE_TYPES } from "src/constanst";
import { InteractiveEvent } from "src/events/InteractiveEvent";
import { mergeConfig } from "src/utils/merge";

let nodeUid=0

export class Node<Props extends NodeProps,Events extends NodeEventMap> extends InteractiveEventEmitter<Events> implements INode<Props,Events>{
    type:string=NODE_TYPES.Node
    uid:number
    parent?: INode<Props,Events>=null
    children: INode<Props,Events>[];
    props:Props
    constructor(props?:Props){
        super()
        this.uid=nodeUid++
        this.props=mergeConfig({},this.getDefaultProps(),props)
    }
    getDefaultProps(): Partial<Props> {
        return {}
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
    dispose(): void {
         (this as INode<Props,NodeEventMap>).emit(InteractiveEvent.create(NODE_EVENTS.DISPOSE))
    }
}
