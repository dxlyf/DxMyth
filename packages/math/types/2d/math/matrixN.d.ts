type MatrixNData = Float32Array | number[];
export declare class MatrixN {
    readonly n: number;
    readonly elements: Float32Array;
    private static readonly EPSILON;
    constructor(n: number, elements?: MatrixNData);
    static identity(n: number): MatrixN;
    multiply(other: MatrixN): MatrixN;
    transpose(): MatrixN;
    determinant(): number;
    adjoint(): MatrixN;
    invertByDeterminant(): MatrixN;
    invertByRowOperations(): MatrixN;
    rank(): number;
    private get;
    private createAugmentedMatrixN;
    private swapRows;
    private scaleRow;
    private addRow;
    private set;
    private cofactor;
    private clone;
}
export {};
