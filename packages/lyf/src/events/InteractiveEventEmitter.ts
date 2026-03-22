import {EventEmitter} from "src/utils/EventEmitter";
import type {  InteractiveHandle, InteractiveEventMap } from "./InteractiveEvent";
import type { IInteractiveEventEmitter } from "src/interface/IInteractiveEventEmitter";


export class InteractiveEventEmitter<T extends InteractiveEventMap> implements IInteractiveEventEmitter<T>{
    private interactiveEmit=new EventEmitter<Record<string,any>>();
    constructor(){
       
    }
    on<Type extends  Extract<keyof T,string>>(type:Type,listener:InteractiveHandle<T[Type]>){
        this.interactiveEmit.on(type,listener);
        return this
    }
    once<Type extends  Extract<keyof T,string>>(type:Type,listener:InteractiveHandle<T[Type]>) {
        this.interactiveEmit.once(type,listener);
        return this
    }
    off<Type extends  Extract<keyof T,string>>(type:Type,listener?:InteractiveHandle<T[Type]>) {
        this.interactiveEmit.off(type,listener);
        return this
    }
    _emit<Type extends  Extract<keyof T,string>>(e:T[Type]) {
        const listeners=this.interactiveEmit.listeners(e.type);
        if(listeners.length>0){
            for(let i=0;i<listeners.length;i++){
                const listener=listeners[i];
                listener(e);
                if(e.isImmediateCancelBubble){
                    break;
                }
            }
        }
    }
    emit<Type extends  Extract<keyof T,string>>(e:T[Type]) {
        const paths=e.composedPath();
        e.target=this as any;
        for(let i=0;i<paths.length;i++){
            const node=paths[i] as any;
            e.currentTarget=node
            node._emit(e);
            // 如果事件取消冒泡，则直接跳出循环
            if(e.cancelBubble){
                break;
            }
        }
        return e.defaultPrevented
    }
}

