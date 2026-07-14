import { Action } from '../types/actions';
export default function isAction(action: unknown): action is Action<string>;
