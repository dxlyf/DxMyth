import { ImmerScope, ImmerState } from '../internal';
export declare function processResult(result: any, scope: ImmerScope): any;
export declare function updateDraftInParent(parent: ImmerState, draftValue: any, finalizedValue: any, originalKey?: string | number | symbol): void;
export declare function registerChildFinalizationCallback(parent: ImmerState, child: ImmerState, key: string | number | symbol): void;
export declare function handleCrossReference(target: ImmerState, key: string | number | symbol, value: any): void;
export declare function handleValue(target: any, handledSet: Set<any>, rootScope: ImmerScope): any;
