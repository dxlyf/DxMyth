import { Collection } from './Collection';
import { Record } from './Record';
export declare function toJS(value: Collection | Record): Array<unknown> | {
    [key: string]: unknown;
};
export declare function toJS(value: unknown): unknown;
