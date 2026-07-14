import { Seq } from '../../type-definitions/immutable';
export declare const IS_SEQ_SYMBOL = "@@__IMMUTABLE_SEQ__@@";
/**
 * True if `maybeSeq` is a Seq.
 */
export declare function isSeq(maybeSeq: unknown): maybeSeq is Seq.Indexed<unknown> | Seq.Keyed<unknown, unknown> | Seq.Set<unknown>;
