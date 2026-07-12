import { Int64 } from './intmath';
export type Path = Array<IntPoint>;
export type Paths = Array<Array<IntPoint>>;
export declare enum ClipType {
    ctIntersection = 0,
    ctUnion = 1,
    ctDifference = 2,
    ctXor = 3
}
export declare enum PolyType {
    ptSubject = 0,
    ptClip = 1
}
export declare enum JoinType {
    jtSquare = 0,
    jtRound = 1,
    jtMiter = 2
}
export declare enum PolyFillType {
    pftEvenOdd = 0,
    pftNonZero = 1,
    pftPositive = 2,
    pftNegative = 3
}
export declare enum EndType {
    etClosedPolygon = 0,
    etClosedLine = 1,
    etOpenButt = 2,
    etOpenSquare = 3,
    etOpenRound = 4
}
declare enum EdgeSide {
    esLeft = 0,
    esRight = 1
}
export declare class IntPoint {
    readonly x: Int64;
    readonly y: Int64;
    constructor(x: Int64, y: Int64);
    equals(other: IntPoint): boolean;
    notEquals(other: IntPoint): boolean;
    static copy(other: IntPoint): IntPoint;
    static fromXY(x: number, y: number): IntPoint;
}
export declare class IntRect {
    readonly left: Int64;
    readonly top: Int64;
    readonly right: Int64;
    readonly bottom: Int64;
    constructor(left: Int64, top: Int64, right: Int64, bottom: Int64);
    static copy(other: IntRect): IntRect;
}
export declare class PolyNode {
    parent: PolyNode;
    polygon: Path;
    index: number;
    joinType: JoinType;
    endType: EndType;
    children: Array<PolyNode>;
    isOpen: boolean;
    get isHole(): boolean;
    get childCount(): number;
    get contour(): Path;
    addChild(child: PolyNode): void;
    get next(): PolyNode;
    get nextSiblingUp(): PolyNode;
}
export declare class PolyTree extends PolyNode {
    allPolys: Array<PolyNode>;
    clear(): void;
    get first(): PolyNode;
    get total(): number;
}
declare class TEdge {
    bot: IntPoint;
    curr: IntPoint;
    top: IntPoint;
    delta: IntPoint;
    dx: number;
    polyTyp: PolyType;
    side: EdgeSide;
    windDelta: number;
    windCnt: number;
    windCnt2: number;
    outIdx: number;
    next: TEdge;
    prev: TEdge;
    nextInLML: TEdge;
    nextInAEL: TEdge;
    prevInAEL: TEdge;
    nextInSEL: TEdge;
    prevInSEL: TEdge;
}
declare class LocalMinima {
    readonly y: Int64;
    leftBound: TEdge;
    rightBound: TEdge;
    next: LocalMinima;
    constructor(y: Int64, leftBound: TEdge, rightBound: TEdge);
    clearLeftBound(): void;
    clearRightBound(): void;
}
declare class Scanbeam {
    readonly y: Int64;
    next: Scanbeam;
    constructor(y: Int64);
}
declare class OutPt {
    idx: number;
    pt: IntPoint;
    next: OutPt;
    prev: OutPt;
}
declare class OutRec {
    idx: number;
    isHole: boolean;
    isOpen: boolean;
    firstLeft: OutRec;
    pts: OutPt;
    bottomPt: OutPt;
    polyNode: PolyNode;
    constructor();
}
export declare function Orientation(poly: Path): boolean;
declare class ClipperBase {
    m_MinimaList: LocalMinima;
    m_CurrentLM: LocalMinima;
    m_edges: Array<Array<TEdge>>;
    m_Scanbeam: Scanbeam;
    m_PolyOuts: Array<OutRec>;
    m_ActiveEdges: TEdge;
    m_UseFullRange: boolean;
    m_HasOpenPaths: boolean;
    PreserveCollinear: boolean;
    constructor();
    protected Clear(): void;
    private DisposeLocalMinimaList;
    private InsertLocalMinima;
    protected PopLocalMinima(Y: Int64): LocalMinima;
    private ProcessBound;
    protected Reset(): void;
    protected InsertScanbeam(Y: Int64): void;
    static GetBounds(paths: Paths): IntRect;
    protected PopScanbeam(): {
        Y: Int64;
        r: boolean;
    };
    get LocalMinimaPending(): boolean;
    protected CreateOutRec(): OutRec;
    protected DisposeOutRec(index: number): void;
    protected UpdateEdgeIntoAEL(e: TEdge): TEdge;
    protected SwapPositionsInAEL(edge1: TEdge, edge2: TEdge): void;
    protected DeleteFromAEL(e: TEdge): void;
    AddPath(pg: Path, polyType: PolyType, Closed: boolean): boolean;
    AddPaths(ppg: Paths, polyType: PolyType, closed: boolean): boolean;
}
export declare class Clipper extends ClipperBase {
    private m_ClipType;
    private m_Maxima;
    private m_SortedEdges;
    private m_IntersectList;
    private m_ExecuteLocked;
    private m_ClipFillType;
    private m_SubjFillType;
    private m_Joins;
    private m_GhostJoins;
    private m_UsingPolyTree;
    ReverseSolution: boolean;
    StrictlySimple: boolean;
    constructor(InitOptions?: number);
    private InsertMaxima;
    Execute(clipType: ClipType, solution: PolyTree | Paths, fillType?: PolyFillType): boolean;
    ExecutePaths(clipType: ClipType, solution: Paths, subjFillType: PolyFillType, clipFillType: PolyFillType): boolean;
    ExecutePolyTree(clipType: ClipType, polytree: PolyTree, subjFillType: PolyFillType, clipFillType: PolyFillType): boolean;
    private FixHoleLinkage;
    private ExecuteInternal;
    private DisposeAllPolyPts;
    private AddJoin;
    private AddGhostJoin;
    private InsertLocalMinimaIntoAEL;
    private InsertEdgeIntoAEL;
    private IsEvenOddFillType;
    private IsEvenOddAltFillType;
    private IsContributing;
    private SetWindingCount;
    private AddEdgeToSEL;
    private PopEdgeFromSEL;
    private CopyAELToSEL;
    private SwapPositionsInSEL;
    private AddLocalMaxPoly;
    private AddLocalMinPoly;
    private AddOutPt;
    private GetLastOutPt;
    private SetHoleState;
    private GetOutRec;
    private AppendPolygon;
    private IntersectEdges;
    private DeleteFromSEL;
    private ProcessHorizontals;
    private ProcessHorizontal;
    private ProcessIntersections;
    private BuildIntersectList;
    private FixupIntersectionOrder;
    private ProcessIntersectList;
    private ProcessEdgesAtTopOfScanbeam;
    private DoMaxima;
    private BuildResult;
    private BuildResult2;
    private FixupOutPolyline;
    private FixupOutPolygon;
    private JoinHorz;
    private JoinPoints;
    private FixupFirstLefts1;
    private FixupFirstLefts2;
    private FixupFirstLefts3;
    private JoinCommonEdges;
    private DoSimplePolygons;
    static SimplifyPolygon(poly: Path, fillType?: PolyFillType): Paths;
    static SimplifyPolygons(polys: Paths, fillType?: PolyFillType): Paths;
    static CleanPolygon(path: Path, distance?: number): Path;
    static CleanPolygons(polys: Paths, distance?: number): Paths;
    private static Minkowski;
    static MinkowskiSumPath(pattern: Path, path: Path, pathIsClosed: boolean): Paths;
    static TranslatePath(path: Path, delta: IntPoint): Path;
    static MinkowskiSumPaths(pattern: Path, paths: Paths, pathIsClosed: boolean): Paths;
    static MinkowskiDiff(poly1: Path, poly2: Path): Paths;
    static PolyTreeToPaths(polytree: PolyTree): Paths;
    private static AddPolyNodeToPaths;
    static OpenPathsFromPolyTree(polytree: PolyTree): Paths;
    static ClosedPathsFromPolyTree(polytree: PolyTree): Paths;
}
export declare class ClipperOffset {
    private m_destPolys;
    private m_srcPoly;
    private m_destPoly;
    private m_normals;
    private m_delta;
    private m_sinA;
    private m_sin;
    private m_cos;
    private m_miterLim;
    private m_StepsPerRad;
    private m_lowest;
    private m_polyNodes;
    ArcTolerance: number;
    MiterLimit: number;
    constructor(miterLimit?: number, arcTolerance?: number);
    clear(): void;
    AddPath(path: Path, joinType: JoinType, endType: EndType): void;
    AddPaths(paths: Paths, joinType: JoinType, endType: EndType): void;
    private FixOrientations;
    private DoOffset;
    Execute(solution: Paths | PolyTree, delta: number): void;
    private ExecutePaths;
    private ExecutePolyTree;
    private OffsetPoint;
    private DoSquare;
    private DoMiter;
    private DoRound;
}
export {};
