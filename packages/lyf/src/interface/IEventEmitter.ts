
export type EventMap = Record<string,any[]>;

export type EventHandle<T>=(...args:ParameterToArray<T>)=>void


export interface IEventEmitter<Events extends EventMap>{
    on<EventName extends Extract<keyof Events,string>>(event: EventName, listener: (...args: Events[EventName]) => void): this;
    once<EventName extends Extract<keyof Events,string>>(event: EventName, listener: (...args: Events[EventName]) => void): this;
    off<EventName extends Extract<keyof Events,string>>(event: EventName, listener?: (...args: Events[EventName]) => void): this;
    emit<EventName extends Extract<keyof Events,string>>(event: EventName, ...args: Events[EventName]): void;
}