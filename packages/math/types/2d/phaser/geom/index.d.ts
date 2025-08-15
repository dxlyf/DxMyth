export default Geom;
/**
 * @namespace Phaser.Geom
 */
declare var Geom: {
    CIRCLE: number;
    ELLIPSE: number;
    LINE: number;
    POINT: number;
    POLYGON: number;
    RECTANGLE: number;
    TRIANGLE: number;
    Circle: import('../utils/Class').default;
    Ellipse: import('../utils/Class').default;
    Intersects: {
        CircleToCircle: (circleA: Phaser.Geom.Circle, circleB: Phaser.Geom.Circle) => boolean;
        CircleToRectangle: (circle: Phaser.Geom.Circle, rect: Phaser.Geom.Rectangle) => boolean;
        GetCircleToCircle: (circleA: Phaser.Geom.Circle, circleB: Phaser.Geom.Circle, out?: array) => array;
        GetCircleToRectangle: (circle: Phaser.Geom.Circle, rect: Phaser.Geom.Rectangle, out?: array) => array;
        GetLineToCircle: (line: Phaser.Geom.Line, circle: Phaser.Geom.Circle, out?: array) => array;
        GetLineToLine: (line1: Phaser.Geom.Line, line2: Phaser.Geom.Line, isRay?: boolean, out?: Phaser.Math.Vector3) => Phaser.Math.Vector3;
        GetLineToPoints: (line: Phaser.Geom.Line, points: Phaser.Math.Vector2[] | Phaser.Geom.Point[], isRay?: boolean, out?: Phaser.Math.Vector3) => Phaser.Math.Vector3;
        GetLineToPolygon: (line: Phaser.Geom.Line, polygons: Phaser.Geom.Polygon | Phaser.Geom.Polygon[], isRay?: boolean, out?: Phaser.Math.Vector4) => Phaser.Math.Vector4;
        GetLineToRectangle: (line: Phaser.Geom.Line, rect: (Phaser.Geom.Rectangle | object), out?: array) => array;
        GetRaysFromPointToPolygon: (x: number, y: number, polygons: Phaser.Geom.Polygon | Phaser.Geom.Polygon[]) => Phaser.Math.Vector4[];
        GetRectangleIntersection: (rectA: Phaser.Geom.Rectangle, rectB: Phaser.Geom.Rectangle, output?: Phaser.Geom.Rectangle) => Phaser.Geom.Rectangle;
        GetRectangleToRectangle: (rectA: Phaser.Geom.Rectangle, rectB: Phaser.Geom.Rectangle, out?: array) => array;
        GetRectangleToTriangle: (rect: Phaser.Geom.Rectangle, triangle: Phaser.Geom.Triangle, out?: array) => array;
        GetTriangleToCircle: (triangle: Phaser.Geom.Triangle, circle: Phaser.Geom.Circle, out?: array) => array;
        GetTriangleToLine: (triangle: Phaser.Geom.Triangle, line: Phaser.Geom.Line, out?: array) => array;
        GetTriangleToTriangle: (triangleA: Phaser.Geom.Triangle, triangleB: Phaser.Geom.Triangle, out?: array) => array;
        LineToCircle: (line: Phaser.Geom.Line, circle: Phaser.Geom.Circle, nearest?: (Phaser.Geom.Point | any)) => boolean;
        LineToLine: (line1: Phaser.Geom.Line, line2: Phaser.Geom.Line, out?: Phaser.Types.Math.Vector2Like) => boolean;
        LineToRectangle: (line: Phaser.Geom.Line, rect: (Phaser.Geom.Rectangle | object)) => boolean;
        PointToLine: (point: (Phaser.Geom.Point | any), line: Phaser.Geom.Line, lineThickness?: number) => boolean;
        PointToLineSegment: (point: Phaser.Geom.Point, line: Phaser.Geom.Line) => boolean;
        RectangleToRectangle: (rectA: Phaser.Geom.Rectangle, rectB: Phaser.Geom.Rectangle) => boolean;
        RectangleToTriangle: (rect: Phaser.Geom.Rectangle, triangle: Phaser.Geom.Triangle) => boolean;
        RectangleToValues: (rect: Phaser.Geom.Rectangle, left: number, right: number, top: number, bottom: number, tolerance?: number) => boolean;
        TriangleToCircle: (triangle: Phaser.Geom.Triangle, circle: Phaser.Geom.Circle) => boolean;
        TriangleToLine: (triangle: Phaser.Geom.Triangle, line: Phaser.Geom.Line) => boolean;
        TriangleToTriangle: (triangleA: Phaser.Geom.Triangle, triangleB: Phaser.Geom.Triangle) => boolean;
    };
    Line: import('../utils/Class').default;
    Mesh: {
        Face: import('../utils/Class').default;
        GenerateGridVerts: (config: Phaser.Types.Geom.Mesh.GenerateGridConfig) => Phaser.Types.Geom.Mesh.GenerateGridVertsResult;
        GenerateObjVerts: (data: Phaser.Types.Geom.Mesh.OBJData, mesh?: Phaser.GameObjects.Mesh, scale?: number, x?: number, y?: number, z?: number, rotateX?: number, rotateY?: number, rotateZ?: number, zIsUp?: boolean) => Phaser.Types.Geom.Mesh.GenerateVertsResult;
        GenerateVerts: (vertices: number[], uvs: number[], indicies?: number[], containsZ?: boolean, normals?: number[], colors?: number | number[], alphas?: number | number[], flipUV?: boolean) => Phaser.Types.Geom.Mesh.GenerateVertsResult;
        ParseObj: (data: string, flipUV?: boolean) => Phaser.Types.Geom.Mesh.OBJData;
        ParseObjMaterial: (mtl: string) => object;
        RotateFace: (face: Phaser.Geom.Mesh.Face, angle: number, cx?: number, cy?: number) => void;
        Vertex: import('../utils/Class').default;
    };
    Point: import('../utils/Class').default;
    Polygon: import('../utils/Class').default;
    Rectangle: import('../utils/Class').default;
    Triangle: import('../utils/Class').default;
};
