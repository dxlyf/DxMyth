import { IInteractiveEventEmitter } from './IInteractiveEventEmitter';
import { PointLike } from './IPoint';
export declare const NODE_EVENTS: {
    CLICK: string;
    DOUBLE_CLICK: string;
    MOUSE_DOWN: string;
    MOUSE_UP: string;
    MOUSE_MOVE: string;
    MOUSE_OUT: string;
    MOUSE_OVER: string;
    MOUSE_LEAVE: string;
    MOUSE_ENTER: string;
    MOUSE_WHEEL: string;
    ADD_CHILD: string;
    REMOVE_CHILD: string;
};
export type NodeEventMap = {};
export type NodeProps = {
    position: PointLike;
    rotation: number;
    scale: PointLike;
    origin: PointLike;
    pivot: PointLike;
    visible: boolean;
    opacity: number;
};
export interface INode<Props extends NodeProps = any, Events extends NodeEventMap = NodeEventMap> extends IInteractiveEventEmitter<Events> {
    type: string;
    uid: number;
    owner?: any;
    props: Props;
    parent?: INode<Props, Events>;
    children?: INode<Props, Events>[];
    add(child: INode<Props, Events>): void;
    remove(child: INode<Props, Events>): void;
}
