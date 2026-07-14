import { Record } from '../../type-definitions/immutable';
export declare const IS_RECORD_SYMBOL = "@@__IMMUTABLE_RECORD__@@";
/**
 * True if `maybeRecord` is a Record.
 */
export declare function isRecord(maybeRecord: unknown): maybeRecord is Record<object>;
