import { InteractiveHandle, InteractiveEventMap } from './InteractiveEvent';
import { IInteractiveEventEmitter } from '../interface/IInteractiveEventEmitter';
export declare class InteractiveEventEmitter<T extends InteractiveEventMap> implements IInteractiveEventEmitter<T> {
    private interactiveEmit;
    constructor();
    on<Type extends Extract<keyof T, string>>(type: Type, listener: InteractiveHandle<T[Type]>): this;
    once<Type extends Extract<keyof T, string>>(type: Type, listener: InteractiveHandle<T[Type]>): this;
    off<Type extends Extract<keyof T, string>>(type: Type, listener?: InteractiveHandle<T[Type]>): this;
    _emit<Type extends Extract<keyof T, string>>(e: T[Type]): void;
    emit<Type extends Extract<keyof T, string>>(e: T[Type]): boolean;
}
