import type { InteractiveEventMap,InteractiveHandle } from "src/events/InteractiveEvent";

export interface IInteractiveEventEmitter<Events extends InteractiveEventMap>{
    on<Type extends  Extract<keyof Events,string>>(type:Type,listener:InteractiveHandle<Events[Type]>): this;
    once<Type extends  Extract<keyof Events,string>>(type:Type,listener:InteractiveHandle<Events[Type]>): this;
    off<Type extends  Extract<keyof Events,string>>(type:Type, listener?: InteractiveHandle<Events[Type]>): this;
    emit<Type extends  Extract<keyof Events,string>>(event:Events[Type]): boolean;
}