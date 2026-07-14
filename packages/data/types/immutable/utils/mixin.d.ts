type Constructor<T = object> = new (...args: unknown[]) => T;
/**
 * Contributes additional methods to a constructor
 */
export default function mixin<C extends Constructor>(ctor: C, methods: Record<string, Function>): C;
export {};
