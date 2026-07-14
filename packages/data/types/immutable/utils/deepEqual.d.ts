import { Collection } from '../../type-definitions/immutable';
import { Range } from '../Range';
import { Repeat } from '../Repeat';
export default function deepEqual(a: Range | Repeat | Collection<unknown, unknown>, b: unknown): boolean;
