import { INode, NodeEventMap, NodeProps } from '../interface/INode';
import { InteractiveEventEmitter } from '../events/InteractiveEventEmitter';
export declare class Node<Props extends NodeProps, Events extends NodeEventMap> extends InteractiveEventEmitter<Events> implements INode<Props, Events> {
    type: string;
    uid: number;
    parent?: INode<Props, Events>;
    children: INode<Props, Events>[];
    props: Props;
    constructor(props?: Props);
    getDefaultProps(): Props[];
    add(child: INode<Props, Events>): void;
    remove(child: INode<Props, Events>): void;
    dispose(): void;
}
