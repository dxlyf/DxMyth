/*******************************************************************************
*                                                                              *
* This is a translation of the C# Clipper library.                             *
* Translation copyright(c) 2017 Venelin Efremov                                *
*                                                                              *
* The license and copyright from the original code follows                     *
*                                                                              *
*******************************************************************************/
/*******************************************************************************
*                                                                              *
* Author    :  Angus Johnson                                                   *
* Version   :  6.4.2                                                           *
* Date      :  27 February 2017                                                *
* Website   :  http://www.angusj.com                                           *
* Copyright :  Angus Johnson 2010-2017                                         *
*                                                                              *
* License:                                                                     *
* Use, modification & distribution is subject to Boost Software License Ver 1. *
* http://www.boost.org/LICENSE_1_0.txt                                         *
*                                                                              *
* Attributions:                                                                *
* The code in this library is an extension of Bala Vatti's clipping algorithm: *
* "A generic solution to polygon clipping"                                     *
* Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
* http://portal.acm.org/citation.cfm?id=129906                                 *
*                                                                              *
* Computer graphics and geometric modeling: implementation and algorithms      *
* By Max K. Agoston                                                            *
* Springer; 1 edition (January 4, 2005)                                        *
* http://books.google.com/books?q=vatti+clipping+agoston                       *
*                                                                              *
* See also:                                                                    *
* "Polygon Offsetting by Computing Winding Numbers"                            *
* Paper no. DETC2005-85513 pp. 565-575                                         *
* ASME 2005 International Design Engineering Technical Conferences             *
* and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
* September 24-28, 2005 , Long Beach, California, USA                          *
* http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
*                                                                              *
*******************************************************************************/
export type Path = Array<Point>;
export type Paths = Array<Array<Point>>;
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
export declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    equals(other: Point): boolean;
    notEquals(other: Point): boolean;
    static copy(other: Point): Point;
}
export declare class Rect {
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    constructor(left: number, top: number, right: number, bottom: number);
    static copy(other: Rect): Rect;
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
    bot: Point;
    curr: Point;
    top: Point;
    delta: Point;
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
    readonly y: number;
    leftBound: TEdge;
    rightBound: TEdge;
    next: LocalMinima;
    constructor(y: number, leftBound: TEdge, rightBound: TEdge);
    clearLeftBound(): void;
    clearRightBound(): void;
}
declare class Scanbeam {
    readonly y: number;
    next: Scanbeam;
    constructor(y: number);
}
declare class OutPt {
    idx: number;
    pt: Point;
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
declare class ClipperBase {
    m_MinimaList: LocalMinima;
    m_CurrentLM: LocalMinima;
    m_edges: Array<Array<TEdge>>;
    m_Scanbeam: Scanbeam;
    m_PolyOuts: Array<OutRec>;
    m_ActiveEdges: TEdge;
    m_HasOpenPaths: boolean;
    PreserveCollinear: boolean;
    constructor();
    protected Clear(): void;
    private DisposeLocalMinimaList;
    private InsertLocalMinima;
    protected PopLocalMinima(Y: number): LocalMinima;
    private ProcessBound;
    protected Reset(): void;
    protected InsertScanbeam(Y: number): void;
    static GetBounds(paths: Paths): Rect;
    protected PopScanbeam(): {
        Y: number;
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
    static TranslatePath(path: Path, delta: Point): Path;
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
