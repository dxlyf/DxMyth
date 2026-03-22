import { INode } from '../interface/INode';
export type InteractiveEventMap = Record<string, InteractiveEvent>;
export type InteractiveHandle<E extends InteractiveEvent> = (e: E) => void;
export declare class InteractiveEvent<E extends Event = Event, Data = any> {
    type: string;
    data?: Data;
    nativeEvent: E;
    target?: INode;
    currentTarget?: INode;
    cancelable?: boolean;
    bubbles?: boolean;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    isImmediateCancelBubble: boolean;
    constructor();
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    composedPath(): INode<any, import('../interface/INode').NodeEventMap>[];
}
export declare namespace InteractiveEvent {
    const create: <Data = any>(type: string, data?: Data) => InteractiveEvent<Event, Data>;
    const formEvent: <E extends Event, Data = any>(e: E, data?: Data) => InteractiveEvent<E, Data>;
}
