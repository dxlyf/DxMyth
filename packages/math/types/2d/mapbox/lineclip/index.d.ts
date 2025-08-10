type Point = number[];
type BBox = [number, number, number, number];
declare function lineclip(points: Point[], bbox: BBox, result?: Point[][]): Point[][];
declare namespace lineclip {
    var polyline: typeof lineclip;
    var polygon: typeof polygonclip;
}
declare function polygonclip(points: Point[], bbox: BBox): Point[];
export { lineclip, polygonclip };
