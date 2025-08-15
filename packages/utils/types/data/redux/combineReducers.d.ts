import { ActionFromReducersMapObject, PreloadedStateShapeFromReducersMapObject, Reducer, StateFromReducersMapObject } from './types/reducers';
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @template S Combined state object type.
 *
 * @param reducers An object whose values correspond to different reducer
 *   functions that need to be combined into one. One handy way to obtain it
 *   is to use `import * as reducers` syntax. The reducers may never
 *   return undefined for any action. Instead, they should return their
 *   initial state if the state passed to them was undefined, and the current
 *   state for any unrecognized action.
 *
 * @returns A reducer function that invokes every reducer inside the passed
 *   object, and builds a state object with the same shape.
 */
export default function combineReducers<M>(reducers: M): M[keyof M] extends Reducer<any, any, any> | undefined ? Reducer<StateFromReducersMapObject<M>, ActionFromReducersMapObject<M>, Partial<PreloadedStateShapeFromReducersMapObject<M>>> : never;
