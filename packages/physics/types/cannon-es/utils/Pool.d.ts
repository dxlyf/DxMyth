/**
 * For pooling objects that can be reused.
 */
export declare class Pool {
    /**
     * The objects array.
     */
    objects: any[];
    /**
     * The type of the objects.
     */
    type: any;
    /**
     * Release an object after use
     */
    release(...args: any[]): Pool;
    /**
     * Get an object
     */
    get(): any;
    /**
     * Construct an object. Should be implemented in each subclass.
     */
    constructObject(): void;
    /**
     * @return Self, for chaining
     */
    resize(size: number): Pool;
}
