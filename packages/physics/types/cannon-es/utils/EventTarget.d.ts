/**
 * Base class for objects that dispatches events.
 */
export declare class EventTarget {
    private _listeners;
    /**
     * Add an event listener
     * @return The self object, for chainability.
     */
    addEventListener(type: string, listener: Function): EventTarget;
    /**
     * Check if an event listener is added
     */
    hasEventListener(type: string, listener: Function): boolean;
    /**
     * Check if any event listener of the given type is added
     */
    hasAnyEventListener(type: string): boolean;
    /**
     * Remove an event listener
     * @return The self object, for chainability.
     */
    removeEventListener(type: string, listener: Function): EventTarget;
    /**
     * Emit an event.
     * @return The self object, for chainability.
     */
    dispatchEvent(event: any): EventTarget;
}
