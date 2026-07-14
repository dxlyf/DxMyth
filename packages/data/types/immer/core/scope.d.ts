import { Patch, PatchListener, Immer, PatchesPlugin, MapSetPlugin, ArrayMethodsPlugin } from '../internal';
/** Each scope represents a `produce` call. */
export interface ImmerScope {
    patches_?: Patch[];
    inversePatches_?: Patch[];
    patchPlugin_?: PatchesPlugin;
    mapSetPlugin_?: MapSetPlugin;
    arrayMethodsPlugin_?: ArrayMethodsPlugin;
    canAutoFreeze_: boolean;
    drafts_: any[];
    parent_?: ImmerScope;
    patchListener_?: PatchListener;
    immer_: Immer;
    unfinalizedDrafts_: number;
    handledSet_: Set<any>;
    processedForPatches_: Set<any>;
}
export declare let getCurrentScope: () => ImmerScope;
export declare function usePatchesInScope(scope: ImmerScope, patchListener?: PatchListener): void;
export declare function revokeScope(scope: ImmerScope): void;
export declare function leaveScope(scope: ImmerScope): void;
export declare let enterScope: (immer: Immer) => ImmerScope;
