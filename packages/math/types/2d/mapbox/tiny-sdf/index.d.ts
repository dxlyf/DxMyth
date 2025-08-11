export default class TinySDF {
    constructor({ fontSize, buffer, radius, cutoff, fontFamily, fontWeight, fontStyle }?: {
        fontSize?: number;
        buffer?: number;
        radius?: number;
        cutoff?: number;
        fontFamily?: string;
        fontWeight?: string;
        fontStyle?: string;
    });
    buffer: number;
    cutoff: number;
    radius: number;
    size: number;
    ctx: CanvasRenderingContext2D;
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
