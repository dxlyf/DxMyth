import { BoundingBox, Box, Projection } from './types';
export declare const projection: () => Projection;
export declare const box: () => Box;
export declare const convertBoundingBox: ({ top, left, right, bottom, }: BoundingBox) => Box;
