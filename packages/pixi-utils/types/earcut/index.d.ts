export declare function earcut(data: ArrayLike<number>, holeIndices: ArrayLike<number>, dim?: number): number[];
export declare function deviation(data: any, holeIndices: any, dim: any, triangles: any): number;
export declare function flatten(data: any): {
    vertices: any[];
    holes: number[];
    dimensions: any;
};
export default earcut;
