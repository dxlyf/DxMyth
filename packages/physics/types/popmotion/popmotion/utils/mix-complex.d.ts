import { RGBA, HSLA } from 'style-value-types';
type MixComplex = (p: number) => string;
type BlendableArray = Array<number | RGBA | HSLA | string>;
type BlendableObject = {
    [key: string]: string | number | RGBA | HSLA;
};
export declare const mixArray: (from: BlendableArray, to: BlendableArray) => (v: number) => any[];
export declare const mixObject: (origin: BlendableObject, target: BlendableObject) => (v: number) => {
    [x: string]: any;
};
export declare const mixComplex: (origin: string | number, target: string | number) => MixComplex;
export {};
