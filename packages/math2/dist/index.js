import { appendUnitArcCubics, arcCubicBezierFromPath, arcToOval, buildArc, buildRound, centerToEndpoint, ellipseCubicBezierFromPath, ellipseMatrix, ellipseSvgArcFromPath, ellipseToCubicBezier, ellipseToQuadraticBezier, ellipticalArcToCubicBezier, endpointToCenter, normalizeAngles, pointOnEllipse, quarterArcToCubicBezier } from "./math/Arc.js";
import { arcLength, conicToQuadratic, controlPointsBounds, cubicEvaluate, curvature, curveCurveIntersections, deCasteljau, derivative, derivative1, derivativeControlPoints, derivativeN, elevateDegree, elevateDegreeN, evaluate, evaluateValues, extrema, maxCurvature, maxCurvaturePoint, normal, project, quadraticEvaluate, quadraticToCubic, splitControlPoints } from "./math/Bezier.js";
import { BoundingRect } from "./math/BoundingRect.js";
import { BSpline, getBSplineBasis, getBSplineBasisDerivative, getBSplineDerivative, getBSplineEvaluate, getBSplineSegmentBounds } from "./math/BSpline.js";
import { CatmullRom, getCatmullRomBounds, getCatmullRomDerivative, getCatmullRomEvaluate, getCatmullRomExtremaRoots } from "./math/CatmullRom.js";
import { CachePool } from "./math/CachePool.js";
import { ConicSection, ConicType, getConicType, getDistanceToEllipse, getDistanceToParabola, getEllipseArea, getEllipseBounds, getEllipseDerivative, getEllipseEvaluate, getEllipsePerimeter, getHyperbolaAsymptoteSlope, getHyperbolaDerivative, getHyperbolaEccentricity, getHyperbolaEvaluate, getHyperbolaFoci, getParabolaArcLength, getParabolaDerivative, getParabolaEvaluate, isPointInEllipse, isPointInHyperbola } from "./math/ConicSection.js";
import { Color, ColorIndex, colorMap } from "./math/Color.js";
import { CubicBezier, getCubicBezierBounds, getCubicBezierEvaluate, getCubicBezierExtremaRoots, getCubicCoefficients } from "./math/CubicBezier.js";
import { Hermite, getHermiteBounds, getHermiteDerivative, getHermiteEvaluate, getHermiteExtremaRoots, getHermiteSecondDerivative, hermiteToCubicBezier } from "./math/Hermite.js";
import { Lagrange, getLagrangeBasis, getLagrangeDerivative, getLagrangeEvaluate, getLagrangeEvaluateBarycentric } from "./math/Lagrange.js";
import { AngleType, DEG_TO_RAD, EPSILON, PI, PI_2, PI_4, RAD_TO_DEG, TWO_PI, absSign, arcStepCount, as_signed, as_unsigned, bernstein, binomialCoefficient, calc32Shift, calcArcCubicBezierSteps, calcArcGoldenRatio, calcBitIndex, calcHighBit, calcLowBit, calcStartCoordinateValue, calcStartGraduationValue, calcZoomPan, ceilMod, clamp, dcmp, deCasteljauBezier, degToRad, dotToAngleType, equals, equalsEpsilon, factorial, findIndexRight, floorMod, fract, generateGraduations, getIntersectionGridCell, getRays3D, includeBit, interpolate, inverseLerp, isFinite, isNearlyZero, map, mix, nCr, nPr, radToDeg, random, randomCeil, randomFloor, randomRound, rationalBezier, removeBit, screenToWorld, sign, smoothStep, solveCubicByCardano, solveCubicByShengjin, solveQuadratic, summation, truncMod, wheelToScaleArtboard, worldToScreen, zoomAt } from "./math/MathUtils.js";
import { Matrix2D, MatrixIndex } from "./math/Matrix2D.js";
import { Matrix3, Matrix3Index } from "./math/Matrix3.js";
import { Matrix4, Matrix4Index } from "./math/Matrix4.js";
import { Quaternion } from "./math/Quaternion.js";
import { Euler } from "./math/Euler.js";
import { Vector2 } from "./math/Vector2.js";
import { Vector3 } from "./math/Vector3.js";
import { Vector4 } from "./math/Vector4.js";
import { NURBS, findSpan, generateClampedKnots, getBSplineBasisValue, getBSplineBasisValues, getNURBSDerivative, getNURBSEvaluate } from "./math/NURBS.js";
import { OrientedBoundingRect } from "./math/OrientedBoundingRect.js";
import { fromSvgPath, fromSvgPathToCmds, parseSvgPath } from "./math/ParseSvgPath.js";
import { BoolOp, pathBooleanOp } from "./math/PathBool.js";
import { PathBuilder, PathCmd, PathDirection, PathSegmentType, PathVerb, PathVerbCount } from "./math/PathBuilder.js";
import { tangentConic, tangentCubic, tangentLine, tangentQuad, windingConic, windingCubicBezier, windingLine, windingQuadraticBezier } from "./math/PathIntersection.js";
import { LineCap, LineJoin, PathStroke } from "./math/PathStroke.js";
import { generateOutline, offsetContoursForAlignment, offsetOutlineForAlignment } from "./math/GenerateOutline.js";
import { dashContours, dashPath, normalizeDash } from "./math/PathDash.js";
import { Point } from "./math/Point.js";
import { QuadraticBezier, getQuadraticBezierBounds, getQuadraticBezierEvaluate, getQuadraticBezierExtremaRoots, getQuadraticCoefficients } from "./math/QuadraticBezier.js";
import { RTree } from "./math/RTree.js";
import { Transform } from "./math/Transform.js";
import { Viewport } from "./math/Viewport.js";
import { Entry, LinkedList } from "./math/LRU.js";
import { cubicAt, cubicDerivativeAt, cubicExtrema, cubicLength, cubicProjectPoint, cubicRootAt, cubicSubdivide, quadraticAt, quadraticDerivativeAt, quadraticExtremum, quadraticLength, quadraticProjectPoint, quadraticRootAt, quadraticSubdivide } from "./math/curve.js";
import { Conic } from "./math/Conic.js";
import { circleCircle, circleCircleIntersections, circlePolygon, circlePolygonIntersections, circleRect, circleRectIntersections, closestPointOnLineSegment, distanceToLineSegment, isPointOnLineSegment, lineCircle, lineCircleIntersections, lineCubicBezierIntersections, lineLineIntersection, lineQuadraticBezierIntersections, lineRect, lineRectIntersections, lineSegmentIntersection, pointInCircle, pointInPolygon, pointInRect, polygonPolygon, polygonPolygonIntersections, raycast, rectRect, rectRectIntersections } from "./math/Intersection.js";
import { Struct, StructArray, createLayout, viewTypes } from "./math/StructArray.js";
import { projectStrokeOnPoints } from "./math/misc/projectStroke/index.js";
import { Sphere } from "./math/Sphere.js";
import { Box3 } from "./math/Box3.js";
import { Ray } from "./math/Ray.js";
import { Frustum } from "./math/Frustum.js";
import * as index from "./math/paper-path/index.js";
import * as index$1 from "./math/contain/index.js";
import { normalizeArcAngles } from "./math/PathProxy.js";
import * as bbox from "./math/bbox.js";
import * as index$2 from "./math/pixijs/index.js";
import * as index$3 from "./math/polyclip-ts/index.js";
import * as index$4 from "./data/rbush/index.js";
import { QuadTree } from "./data/quadtree/index.js";
import { default as default2 } from "./data/tinyqueue/index.js";
import { SplayTreeMap, SplayTreeSet } from "./data/splaytree/index.js";
import * as polybool from "./math/polybool/polybool.js";
import * as index$5 from "./math/clipper2/index.js";
import { Path2D } from "./math/Path2D.js";
import { CKPathCMD, ShapePath } from "./math/ShapePath.js";
import * as index$6 from "./math/curve-path/index.js";
import * as index$7 from "./math/tess2-ts/index.js";
import * as earcut from "./math/earcut.js";
import { Delaunator } from "./math/delaunator.js";
import { EventSystem } from "./events/EventSystem.js";
import { PointerEvent, PointerEventSystem } from "./events/PointerEventSystem.js";
import { KeyboardEvent, KeyboardEventSystem, ShortcutRegistry } from "./events/KeyboardEventSystem.js";
import { EventTarget, NodeEvent } from "./events/EventTarget.js";
import { EventEmitter } from "./events/EventEmitter.js";
import * as bezier from "./math/bezier-js/bezier.js";
import * as index$8 from "./gl-matrix/index.js";
import * as wgpuMatrix from "./webgpu-matrix/wgpu-matrix.js";
import { PluginService } from "./PluginService.js";
import { AsyncParallelBailHook, AsyncParallelHook, AsyncSeriesBailHook, AsyncSeriesHook, AsyncSeriesLoopHook, AsyncSeriesWaterfallHook, SyncBailHook, SyncHook, SyncLoopHook, SyncWaterfallHook, equalToOrIn } from "./tapable/index.js";
import * as index$9 from "./renderer2d/index.js";
import * as index$a from "./pretext/index.js";
import * as core from "./utils/fast-json-patch/core.js";
import { StateMachine } from "./utils/StateMachine.js";
import { Option } from "./utils/Options.js";
import { Disposable, DisposableManager, addDisposable, mixinDestroyable, mixinDisposable, popDisposableManager, pushDisposableManager } from "./utils/Disposable.js";
import { Callbacks } from "./utils/callbacks.js";
import { ObservableObject } from "./utils/ObservableObject.js";
import { IdlePriority, ImmediatePriority, LowPriority, NoPriority, NormalPriority, UserBlockingPriority, enableAlwaysYieldScheduler, enableProfiling, enableRequestPaint, frameYieldMs, lowPriorityTimeout, normalPriorityTimeout, IdlePriority as IdlePriority2, ImmediatePriority as ImmediatePriority2, LowPriority as LowPriority2, NormalPriority as NormalPriority2, UserBlockingPriority as UserBlockingPriority2, unstable_cancelCallback, unstable_forceFrameRate, unstable_getCurrentPriorityLevel, unstable_next, unstable_now, unstable_requestPaint, unstable_runWithPriority, unstable_scheduleCallback, unstable_shouldYield, unstable_wrapCallback, userBlockingPriorityTimeout } from "./utils/scheduler.js";
import { PriorityQueue } from "./utils/PriorityQueue.js";
import { createCursor, pop, push } from "./utils/StackCursor.js";
import { Decimal } from "./utils/decimal.js";
import { BigNumber } from "./utils/bignumber.js";
import { loadArrayBuffer, loadAudio, loadBlob, loadImage, loadJSON, loadResources, loadText, loadVideo } from "./utils/loadResource.js";
import { Stats } from "./utils/stats.module.js";
import { parseTemplate, parseTemplate2 } from "./utils/template.js";
import { uid } from "./utils/uid.js";
import { isPrimitive, merge } from "./utils/merge.js";
import { Pixmap, rasterization } from "./utils/Pixmap.js";
import { Ruler } from "./controls/Ruler.js";
import { ZoomTranslate } from "./controls/ZoomTranslate.js";
import { TimelineControl } from "./controls/Timeline.js";
import { Camera2D } from "./controls/Camera2D.js";
import { Geometry, angleDelta, arcSegmentCount, distPointToSegment, distPointToSegmentSquared, isAngleInRange, normalizeAnglePositive, signedDistPointToLine } from "./math/shape/Geometry.js";
import { Line } from "./math/shape/Line.js";
import { Rect } from "./math/shape/Rect.js";
import { Triangle } from "./math/shape/Triangle.js";
import { Polygon, buildStrokePoints, isPointInPolygon, isPolygonClockwise, polygonOffset } from "./math/shape/Polygon.js";
import { Circle } from "./math/shape/Circle.js";
import { Ellipse } from "./math/shape/Ellipse.js";
import { Arc } from "./math/shape/Arc.js";
import { EllipseArc } from "./math/shape/EllipseArc.js";
import { Bezier } from "./math/shape/Bezier.js";
import { RoundRect } from "./math/shape/RoundRect.js";
import { Animation, AnimationDirection, AnimationState } from "./animation/Animation.js";
import { AnimationSystem } from "./animation/AnimationSystem.js";
import { AnimationTrack } from "./animation/AnimationTrack.js";
import { Easing, createCubicBezierEasing, resolveEasing } from "./animation/easing.js";
import { interpolateValue, isNumberArray, isNumberArray2D, isNumberValue, lerp, lerpArray, lerpArray2D, lerpColor, lerpObject } from "./animation/Interpolation.js";
import { buildKeyframes, findKeyframeInterval } from "./animation/Keyframe.js";
import { Ticker } from "./animation/Ticker.js";
import { Timeline } from "./animation/Timeline.js";
export {
  AngleType,
  Animation,
  AnimationDirection,
  AnimationState,
  AnimationSystem,
  AnimationTrack,
  Arc,
  AsyncParallelBailHook,
  AsyncParallelHook,
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesLoopHook,
  AsyncSeriesWaterfallHook,
  BSpline,
  Bezier,
  BigNumber,
  BoolOp,
  BoundingRect,
  Box3,
  CKPathCMD,
  CachePool,
  Callbacks,
  Camera2D,
  CatmullRom,
  Circle,
  Color,
  ColorIndex,
  Conic,
  ConicSection,
  ConicType,
  CubicBezier,
  DEG_TO_RAD,
  Decimal,
  Delaunator,
  Disposable,
  DisposableManager,
  EPSILON,
  Easing,
  Ellipse,
  EllipseArc,
  Entry,
  Euler,
  EventEmitter,
  EventSystem,
  EventTarget,
  Frustum,
  Geometry,
  Hermite,
  IdlePriority,
  ImmediatePriority,
  KeyboardEvent,
  KeyboardEventSystem,
  Lagrange,
  Line,
  LineCap,
  LineJoin,
  LinkedList,
  LowPriority,
  Matrix2D,
  Matrix3,
  Matrix3Index,
  Matrix4,
  Matrix4Index,
  MatrixIndex,
  NURBS,
  NoPriority,
  NodeEvent,
  NormalPriority,
  ObservableObject,
  Option,
  OrientedBoundingRect,
  PI,
  PI_2,
  PI_4,
  Path2D,
  PathBuilder,
  PathCmd,
  PathDirection,
  PathSegmentType,
  PathStroke,
  PathVerb,
  PathVerbCount,
  Pixmap,
  PluginService,
  Point,
  PointerEvent,
  PointerEventSystem,
  Polygon,
  PriorityQueue,
  QuadTree,
  QuadraticBezier,
  Quaternion,
  RAD_TO_DEG,
  index$4 as RBush,
  RTree,
  Ray,
  Rect,
  RoundRect,
  Ruler,
  ShapePath,
  ShortcutRegistry,
  Sphere,
  SplayTreeMap,
  SplayTreeSet,
  StateMachine,
  Stats,
  Struct,
  StructArray,
  SyncBailHook,
  SyncHook,
  SyncLoopHook,
  SyncWaterfallHook,
  TWO_PI,
  Ticker,
  Timeline,
  TimelineControl,
  default2 as TinyQueue,
  Transform,
  Triangle,
  UserBlockingPriority,
  Vector2,
  Vector3,
  Vector4,
  Viewport,
  ZoomTranslate,
  absSign,
  addDisposable,
  angleDelta,
  appendUnitArcCubics,
  arcCubicBezierFromPath,
  arcLength,
  arcSegmentCount,
  arcStepCount,
  arcToOval,
  as_signed,
  as_unsigned,
  bbox,
  bernstein,
  bezier,
  binomialCoefficient,
  buildArc,
  buildKeyframes,
  buildRound,
  buildStrokePoints,
  calc32Shift,
  calcArcCubicBezierSteps,
  calcArcGoldenRatio,
  calcBitIndex,
  calcHighBit,
  calcLowBit,
  calcStartCoordinateValue,
  calcStartGraduationValue,
  calcZoomPan,
  ceilMod,
  centerToEndpoint,
  circleCircle,
  circleCircleIntersections,
  circlePolygon,
  circlePolygonIntersections,
  circleRect,
  circleRectIntersections,
  clamp,
  index$5 as clipper2,
  closestPointOnLineSegment,
  colorMap,
  conicToQuadratic,
  index$1 as contain,
  controlPointsBounds,
  createCubicBezierEasing,
  createCursor,
  createLayout,
  cubicAt,
  cubicDerivativeAt,
  cubicEvaluate,
  cubicExtrema,
  cubicLength,
  cubicProjectPoint,
  cubicRootAt,
  cubicSubdivide,
  curvature,
  curveCurveIntersections,
  index$6 as curvePaths,
  dashContours,
  dashPath,
  dcmp,
  deCasteljau,
  deCasteljauBezier,
  degToRad,
  derivative,
  derivative1,
  derivativeControlPoints,
  derivativeN,
  distPointToSegment,
  distPointToSegmentSquared,
  distanceToLineSegment,
  dotToAngleType,
  earcut,
  elevateDegree,
  elevateDegreeN,
  ellipseCubicBezierFromPath,
  ellipseMatrix,
  ellipseSvgArcFromPath,
  ellipseToCubicBezier,
  ellipseToQuadraticBezier,
  ellipticalArcToCubicBezier,
  enableAlwaysYieldScheduler,
  enableProfiling,
  enableRequestPaint,
  endpointToCenter,
  equalToOrIn,
  equals,
  equalsEpsilon,
  evaluate,
  evaluateValues,
  extrema,
  factorial,
  core as fastJsonPatch,
  findIndexRight,
  findKeyframeInterval,
  findSpan,
  floorMod,
  fract,
  frameYieldMs,
  fromSvgPath,
  fromSvgPathToCmds,
  generateClampedKnots,
  generateGraduations,
  generateOutline,
  getBSplineBasis,
  getBSplineBasisDerivative,
  getBSplineBasisValue,
  getBSplineBasisValues,
  getBSplineDerivative,
  getBSplineEvaluate,
  getBSplineSegmentBounds,
  getCatmullRomBounds,
  getCatmullRomDerivative,
  getCatmullRomEvaluate,
  getCatmullRomExtremaRoots,
  getConicType,
  getCubicBezierBounds,
  getCubicBezierEvaluate,
  getCubicBezierExtremaRoots,
  getCubicCoefficients,
  getDistanceToEllipse,
  getDistanceToParabola,
  getEllipseArea,
  getEllipseBounds,
  getEllipseDerivative,
  getEllipseEvaluate,
  getEllipsePerimeter,
  getHermiteBounds,
  getHermiteDerivative,
  getHermiteEvaluate,
  getHermiteExtremaRoots,
  getHermiteSecondDerivative,
  getHyperbolaAsymptoteSlope,
  getHyperbolaDerivative,
  getHyperbolaEccentricity,
  getHyperbolaEvaluate,
  getHyperbolaFoci,
  getIntersectionGridCell,
  getLagrangeBasis,
  getLagrangeDerivative,
  getLagrangeEvaluate,
  getLagrangeEvaluateBarycentric,
  getNURBSDerivative,
  getNURBSEvaluate,
  getParabolaArcLength,
  getParabolaDerivative,
  getParabolaEvaluate,
  getQuadraticBezierBounds,
  getQuadraticBezierEvaluate,
  getQuadraticBezierExtremaRoots,
  getQuadraticCoefficients,
  getRays3D,
  index$8 as glMatrix,
  hermiteToCubicBezier,
  includeBit,
  interpolate,
  interpolateValue,
  inverseLerp,
  isAngleInRange,
  isFinite,
  isNearlyZero,
  isNumberArray,
  isNumberArray2D,
  isNumberValue,
  isPointInEllipse,
  isPointInHyperbola,
  isPointInPolygon,
  isPointOnLineSegment,
  isPolygonClockwise,
  isPrimitive,
  lerp,
  lerpArray,
  lerpArray2D,
  lerpColor,
  lerpObject,
  lineCircle,
  lineCircleIntersections,
  lineCubicBezierIntersections,
  lineLineIntersection,
  lineQuadraticBezierIntersections,
  lineRect,
  lineRectIntersections,
  lineSegmentIntersection,
  loadArrayBuffer,
  loadAudio,
  loadBlob,
  loadImage,
  loadJSON,
  loadResources,
  loadText,
  loadVideo,
  lowPriorityTimeout,
  map,
  maxCurvature,
  maxCurvaturePoint,
  merge,
  mix,
  mixinDestroyable,
  mixinDisposable,
  nCr,
  nPr,
  normal,
  normalPriorityTimeout,
  normalizeAnglePositive,
  normalizeAngles,
  normalizeArcAngles,
  normalizeDash,
  offsetContoursForAlignment,
  offsetOutlineForAlignment,
  index as paperPath,
  parseSvgPath,
  parseTemplate,
  parseTemplate2,
  pathBooleanOp,
  index$2 as pixijs,
  pointInCircle,
  pointInPolygon,
  pointInRect,
  pointOnEllipse,
  polybool,
  index$3 as polyclip,
  polygonOffset,
  polygonPolygon,
  polygonPolygonIntersections,
  pop,
  popDisposableManager,
  index$a as pretext,
  project,
  projectStrokeOnPoints,
  push,
  pushDisposableManager,
  quadraticAt,
  quadraticDerivativeAt,
  quadraticEvaluate,
  quadraticExtremum,
  quadraticLength,
  quadraticProjectPoint,
  quadraticRootAt,
  quadraticSubdivide,
  quadraticToCubic,
  quarterArcToCubicBezier,
  radToDeg,
  random,
  randomCeil,
  randomFloor,
  randomRound,
  rasterization,
  rationalBezier,
  raycast,
  rectRect,
  rectRectIntersections,
  removeBit,
  index$9 as renderer2d,
  resolveEasing,
  screenToWorld,
  sign,
  signedDistPointToLine,
  smoothStep,
  solveCubicByCardano,
  solveCubicByShengjin,
  solveQuadratic,
  splitControlPoints,
  summation,
  tangentConic,
  tangentCubic,
  tangentLine,
  tangentQuad,
  index$7 as tess2,
  truncMod,
  uid,
  IdlePriority2 as unstable_IdlePriority,
  ImmediatePriority2 as unstable_ImmediatePriority,
  LowPriority2 as unstable_LowPriority,
  NormalPriority2 as unstable_NormalPriority,
  UserBlockingPriority2 as unstable_UserBlockingPriority,
  unstable_cancelCallback,
  unstable_forceFrameRate,
  unstable_getCurrentPriorityLevel,
  unstable_next,
  unstable_now,
  unstable_requestPaint,
  unstable_runWithPriority,
  unstable_scheduleCallback,
  unstable_shouldYield,
  unstable_wrapCallback,
  userBlockingPriorityTimeout,
  viewTypes,
  wgpuMatrix as webgpuMatrix,
  wheelToScaleArtboard,
  windingConic,
  windingCubicBezier,
  windingLine,
  windingQuadraticBezier,
  worldToScreen,
  zoomAt
};
