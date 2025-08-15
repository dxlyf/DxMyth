import { Tween } from './Tween';
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
export default class Group {
    private _tweens;
    private _tweensAddedDuringUpdate;
    constructor(...tweens: Tween[]);
    getAll(): Array<Tween>;
    removeAll(): void;
    add(...tweens: Tween[]): void;
    remove(...tweens: Tween[]): void;
    /** Return true if all tweens in the group are not paused or playing. */
    allStopped(): boolean;
    update(time?: number): void;
    /**
     * @deprecated The `preserve` parameter is now defaulted to `true` and will
     * be removed in a future major release, at which point all tweens of a
     * group will always be preserved when calling update. To migrate, always
     * use `group.add(tween)` or `group.remove(tween)` to manually add or remove
     * tweens, and do not rely on tweens being automatically added or removed.
     */
    update(time?: number, preserve?: boolean): void;
    onComplete(callback: (object: Tween[]) => void): void;
}
