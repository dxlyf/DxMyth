import { Dictionary, WithThisType } from './types';
export type EventCallbackSingleParam<EvtParam = any> = EvtParam extends any ? (params: EvtParam) => boolean | void : never;
export type EventCallback<EvtParams = any[]> = EvtParams extends any[] ? (...args: EvtParams) => boolean | void : never;
export type EventQuery = string | Object;
type CbThis<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
type DefaultEventDefinition = Dictionary<EventCallback<any[]>>;
export interface EventProcessor<EvtDef = DefaultEventDefinition> {
    normalizeQuery?: (query: EventQuery) => EventQuery;
    filter?: (eventType: keyof EvtDef, query: EventQuery) => boolean;
    afterTrigger?: (eventType: keyof EvtDef) => void;
}
/**
 * Event dispatcher.
 *
 * Event can be defined in EvtDef to enable type check. For example:
 * ```ts
 * interface FooEvents {
 *     // key: event name, value: the first event param in `trigger` and `callback`.
 *     myevent: {
 *        aa: string;
 *        bb: number;
 *     };
 * }
 * class Foo extends Eventful<FooEvents> {
 *     fn() {
 *         // Type check of event name and the first event param is enabled here.
 *         this.trigger('myevent', {aa: 'xx', bb: 3});
 *     }
 * }
 * let foo = new Foo();
 * // Type check of event name and the first event param is enabled here.
 * foo.on('myevent', (eventParam) => { ... });
 * ```
 *
 * @param eventProcessor The object eventProcessor is the scope when
 *        `eventProcessor.xxx` called.
 * @param eventProcessor.normalizeQuery
 *        param: {string|Object} Raw query.
 *        return: {string|Object} Normalized query.
 * @param eventProcessor.filter Event will be dispatched only
 *        if it returns `true`.
 *        param: {string} eventType
 *        param: {string|Object} query
 *        return: {boolean}
 * @param eventProcessor.afterTrigger Called after all handlers called.
 *        param: {string} eventType
 */
export default class Eventful<EvtDef extends DefaultEventDefinition = DefaultEventDefinition> {
    private _$handlers;
    protected _$eventProcessor: EventProcessor<EvtDef>;
    constructor(eventProcessors?: EventProcessor<EvtDef>);
    on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, handler: WithThisType<EvtDef[EvtNm], CbThis<Ctx, this>>, context?: Ctx): this;
    on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, query: EventQuery, handler: WithThisType<EvtDef[EvtNm], CbThis<Ctx, this>>, context?: Ctx): this;
    /**
     * Whether any handler has bound.
     */
    isSilent(eventName: keyof EvtDef): boolean;
    /**
     * Unbind a event.
     *
     * @param eventType The event name.
     *        If no `event` input, "off" all listeners.
     * @param handler The event handler.
     *        If no `handler` input, "off" all listeners of the `event`.
     */
    off(eventType?: keyof EvtDef, handler?: Function): this;
    /**
     * Dispatch a event.
     *
     * @param {string} eventType The event name.
     */
    trigger<EvtNm extends keyof EvtDef>(eventType: EvtNm, ...args: Parameters<EvtDef[EvtNm]>): this;
    /**
     * Dispatch a event with context, which is specified at the last parameter.
     *
     * @param {string} type The event name.
     */
    triggerWithContext(type: keyof EvtDef, ...args: any[]): this;
}
export {};
