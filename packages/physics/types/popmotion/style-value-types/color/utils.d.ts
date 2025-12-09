import { Color } from '../types';
/**
 * Returns true if the provided string is a color, ie rgba(0,0,0,0) or #000,
 * but false if a number or multiple colors
 */
export declare const isColorString: (type: string, testProp?: string) => (v: any) => boolean;
export declare const splitColor: (aName: string, bName: string, cName: string) => (v: string | Color) => import('..').RGBA | import('..').HSLA | {
    [x: string]: number;
    alpha: number;
};
