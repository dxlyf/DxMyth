import { ImmerState, Patch, Drafted, ImmerBaseState, AnyMap, AnySet, ArchType, ImmerScope, ProxyArrayState } from '../internal';
export declare const PluginMapSet = "MapSet";
export declare const PluginPatches = "Patches";
export declare const PluginArrayMethods = "ArrayMethods";
export type PatchesPlugin = {
    generatePatches_(state: ImmerState, basePath: PatchPath, rootScope: ImmerScope): void;
    generateReplacementPatches_(base: any, replacement: any, rootScope: ImmerScope): void;
    applyPatches_<T>(draft: T, patches: readonly Patch[]): T;
    getPath: (state: ImmerState) => PatchPath | null;
};
export type MapSetPlugin = {
    proxyMap_<T extends AnyMap>(target: T, parent?: ImmerState): [T, ImmerState];
    proxySet_<T extends AnySet>(target: T, parent?: ImmerState): [T, ImmerState];
    fixSetContents: (state: ImmerState) => void;
};
export type ArrayMethodsPlugin = {
    createMethodInterceptor: (state: ProxyArrayState, method: string) => Function;
    isArrayOperationMethod: (method: string) => boolean;
    isMutatingArrayMethod: (method: string) => boolean;
};
/** Plugin utilities */
declare const plugins: {
    Patches?: PatchesPlugin;
    MapSet?: MapSetPlugin;
    ArrayMethods?: ArrayMethodsPlugin;
};
type Plugins = typeof plugins;
export declare function getPlugin<K extends keyof Plugins>(pluginKey: K): Exclude<Plugins[K], undefined>;
export declare let isPluginLoaded: <K extends keyof Plugins>(pluginKey: K) => boolean;
export declare let clearPlugin: <K extends keyof Plugins>(pluginKey: K) => void;
export declare function loadPlugin<K extends keyof Plugins>(pluginKey: K, implementation: Plugins[K]): void;
/** Map / Set plugin */
export interface MapState extends ImmerBaseState {
    type_: ArchType.Map;
    copy_: AnyMap | undefined;
    base_: AnyMap;
    revoked_: boolean;
    draft_: Drafted<AnyMap, MapState>;
}
export interface SetState extends ImmerBaseState {
    type_: ArchType.Set;
    copy_: AnySet | undefined;
    base_: AnySet;
    drafts_: Map<any, Drafted>;
    revoked_: boolean;
    draft_: Drafted<AnySet, SetState>;
}
/** Patches plugin */
export type PatchPath = (string | number)[];
export {};
