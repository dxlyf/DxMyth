declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }

    namespace ZenObservable {
        interface SubscriptionObserver<T> {
            closed: boolean;
            next(value: T): void;
            error(errorValue: any): void;
            complete(): void;
        }

        interface Subscription {
            closed: boolean;
            unsubscribe(): void;
        }

        interface Observer<T> {
            start?(subscription: Subscription): any;
            next?(value: T): void;
            error?(errorValue: any): void;
            complete?(): void;
        }

        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        type Subscriber<T> = (observer: SubscriptionObserver<T>) => void | (() => void) | Subscription;

        interface ObservableLike<T> {
            subscribe?: Subscriber<T> | undefined;
            [Symbol.observable](): Observable<T> | ObservableLike<T>;
        }
    }
}

declare class Observable<T> {
    constructor(subscriber: ZenObservable.Subscriber<T>);

    subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription;
    subscribe(
        onNext: (value: T) => void,
        onError?: (error: any) => void,
        onComplete?: () => void,
    ): ZenObservable.Subscription;

    [Symbol.observable](): Observable<T>;

    forEach(callback: (value: T) => void): Promise<void>;
    map<R>(callback: (value: T) => R): Observable<R>;
    filter<S extends T>(callback: (value: T) => value is S): Observable<S>;
    filter(callback: (value: T) => boolean): Observable<T>;
    reduce(callback: (previousValue: T, currentValue: T) => T, initialValue?: T): Observable<T>;
    reduce<R>(callback: (previousValue: R, currentValue: T) => R, initialValue?: R): Observable<R>;
    flatMap<R>(callback: (value: T) => ZenObservable.ObservableLike<R>): Observable<R>;
    concat<R>(...observable: Array<Observable<R>>): Observable<R>;

    static from<R>(observable: Observable<R> | ZenObservable.ObservableLike<R> | ArrayLike<R>): Observable<R>;
    static of<R>(...items: R[]): Observable<R>;
}

declare namespace Observable {}


export function merge(): Observable<never>;
export function merge<A>(a: ZenObservable.ObservableLike<A>): Observable<A>;
export function merge<A, B>(a: ZenObservable.ObservableLike<A>, b: ZenObservable.ObservableLike<B>): Observable<A | B>;
export function merge<A, B, C>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
): Observable<A | B | C>;
export function merge<A, B, C, D>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
): Observable<A | B | C | D>;
export function merge<A, B, C, D, E>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
): Observable<A | B | C | D | E>;
export function merge<A, B, C, D, E, F>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
    f: ZenObservable.ObservableLike<F>,
): Observable<A | B | C | D | E | F>;
export function merge<T>(...observables: Array<ZenObservable.ObservableLike<T>>): Observable<T>;

export function combineLatest(): Observable<never>;
export function combineLatest<A>(a: ZenObservable.ObservableLike<A>): Observable<[A]>;
export function combineLatest<A, B>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
): Observable<[A, B]>;
export function combineLatest<A, B, C>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
): Observable<[A, B, C]>;
export function combineLatest<A, B, C, D>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
): Observable<[A, B, C, D]>;
export function combineLatest<A, B, C, D, E>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
): Observable<[A, B, C, D, E]>;
export function combineLatest<A, B, C, D, E, F>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
    f: ZenObservable.ObservableLike<F>,
): Observable<[A, B, C, D, E, F]>;
export function combineLatest<T>(...observables: Array<ZenObservable.ObservableLike<T>>): Observable<T[]>;

export function zip(): Observable<never>;
export function zip<A>(a: ZenObservable.ObservableLike<A>): Observable<[A]>;
export function zip<A, B>(a: ZenObservable.ObservableLike<A>, b: ZenObservable.ObservableLike<B>): Observable<[A, B]>;
export function zip<A, B, C>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
): Observable<[A, B, C]>;
export function zip<A, B, C, D>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
): Observable<[A, B, C, D]>;
export function zip<A, B, C, D, E>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
): Observable<[A, B, C, D, E]>;
export function zip<A, B, C, D, E, F>(
    a: ZenObservable.ObservableLike<A>,
    b: ZenObservable.ObservableLike<B>,
    c: ZenObservable.ObservableLike<C>,
    d: ZenObservable.ObservableLike<D>,
    e: ZenObservable.ObservableLike<E>,
    f: ZenObservable.ObservableLike<F>,
): Observable<[A, B, C, D, E, F]>;
export function zip<T>(...observables: Array<ZenObservable.ObservableLike<T>>): Observable<T[]>;
export  {
    Observable
};