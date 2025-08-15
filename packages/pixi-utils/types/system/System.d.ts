/**
 * A system is a generic interface for a renderer system.
 * It is used to define the methods that a system should implement.
 * @category rendering
 * @advanced
 */
export interface System<INIT_OPTIONS, DESTROY_OPTIONS> {
    init?: (options: INIT_OPTIONS) => void;
    /** Generic destroy methods to be overridden by the subclass */
    destroy?: (options?: DESTROY_OPTIONS) => void;
}
