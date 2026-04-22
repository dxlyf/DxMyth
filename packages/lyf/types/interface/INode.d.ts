import { InteractiveEvent } from '../events/InteractiveEvent';
import { IInteractiveEventEmitter } from './IInteractiveEventEmitter';
import { PointLike } from './IPoint';
import { IDispose } from './IDispose';
export declare const NODE_EVENTS: {
    readonly CLICK: "click";
    readonly DOUBLE_CLICK: "dblclick";
    readonly MOUSE_DOWN: "pointerdown";
    readonly MOUSE_UP: "pointerup";
    readonly MOUSE_MOVE: "pointermove";
    readonly MOUSE_OUT: "pointerout";
    readonly MOUSE_OVER: "pointerover";
    readonly MOUSE_LEAVE: "pointerleave";
    readonly MOUSE_ENTER: "pointerenter";
    readonly MOUSE_WHEEL: "mousewheel";
    readonly ADD_CHILD: "add:child";
    readonly REMOVE_CHILD: "remove:child";
    readonly DISPOSE: "dispose";
};
export type NodeEventMap = {
    [NODE_EVENTS.CLICK]: InteractiveEvent<MouseEvent>;
    [NODE_EVENTS.MOUSE_DOWN]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_UP]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_MOVE]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_OUT]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_OVER]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_LEAVE]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_ENTER]: InteractiveEvent<PointerEvent>;
    [NODE_EVENTS.MOUSE_WHEEL]: InteractiveEvent<WheelEvent>;
    [NODE_EVENTS.ADD_CHILD]: InteractiveEvent;
    [NODE_EVENTS.REMOVE_CHILD]: InteractiveEvent;
    [NODE_EVENTS.DISPOSE]: any;
};
export type NodeProps = {
    position: PointLike;
    rotation: number;
    skew: PointLike;
    scale: PointLike;
    origin: PointLike;
    visible: boolean;
    opacity: number;
    zIndex: number;
};
export interface INode<Props extends NodeProps = any, Events extends NodeEventMap = NodeEventMap> extends IInteractiveEventEmitter<Events>, IDispose {
    type: string;
    uid: number;
    owner?: any;
    props: Props;
    parent?: INode<Props, Events>;
    children?: INode<Props, Events>[];
    add(child: INode<Props, Events>): void;
    remove(child: INode<Props, Events>): void;
}
