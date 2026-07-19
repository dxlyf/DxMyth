export declare class ZoomTranslate {
    x: number;
    y: number;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    get scaleFactor(): number;
    scale(zoom: number): void;
    scaleOrigin(zoom: number, x: number, y: number): void;
    translate(x: number, y: number): void;
}
