import type { PathArray, PathSegment } from '../types';

export function clonePath(path: PathArray | PathSegment): PathArray {
  return path.map((x:any) => (Array.isArray(x) ? [].concat(x as any) : x)) as PathArray;
}
