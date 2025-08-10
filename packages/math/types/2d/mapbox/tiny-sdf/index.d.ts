export default class TinySDF {
    constructor({ fontSize, buffer, radius, cutoff, fontFamily, fontWeight, fontStyle }?: {
        fontSize?: number | undefined;
        buffer?: number | undefined;
        radius?: number | undefined;
        cutoff?: number | undefined;
        fontFamily?: string | undefined;
        fontWeight?: string | undefined;
        fontStyle?: string | undefined;
    });
    buffer: number;
    cutoff: number;
    radius: number;
    size: number;
    ctx: CanvasRenderingContext2D | null;
    gridOuter: Float64Array<ArrayBuffer>;
    gridInner: Float64Array<ArrayBuffer>;
    f: Float64Array<ArrayBuffer>;
    z: Float64Array<ArrayBuffer>;
    v: Uint16Array<ArrayBuffer>;
    _createCanvas(size: any): HTMLCanvasElement;
    draw(char: any): {
        data: Uint8ClampedArray<ArrayBuffer>;
        width: number;
        height: number;
        glyphWidth: number;
        glyphHeight: number;
        glyphTop: number;
        glyphLeft: number;
        glyphAdvance: number;
    };
}
