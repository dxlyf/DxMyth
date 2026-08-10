import { PathBuilder } from '../path/PathBuilder';
type FillRule = "evenodd" | "nonzero";
type SetPixel = (x: number, y: number, cover: number) => void;
export declare function fillPath(path: PathBuilder, setPixel: SetPixel, fillRule?: FillRule): void;
export {};
