export class Collection {
    constructor(value: any);
}
export namespace Collection {
    export { KeyedCollection as Keyed };
    export { IndexedCollection as Indexed };
    export { SetCollection as Set };
}
export class KeyedCollection extends Collection {
}
export class IndexedCollection extends Collection {
}
export class SetCollection extends Collection {
}
