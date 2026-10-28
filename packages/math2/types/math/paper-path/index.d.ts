/**
 * paper-path-ts：Paper.js 路径几何与文本排版部分的 TypeScript 移植。
 *
 * 统一出口。所有类都是普通 ES class，没有 Base/bean/注入机制。
 */
export { Point } from './basic/Point';
export { Matrix } from './basic/Matrix';
export { Size } from './basic/Size';
export { Rectangle } from './basic/Rectangle';
export { Line } from './basic/Line';
export { Segment } from './path/Segment';
export { SegmentPoint } from './path/SegmentPoint';
export { Curve } from './path/Curve';
export { CurveLocation } from './path/CurveLocation';
export { PathItem } from './path/PathItem';
export { Path } from './path/Path';
export { CompoundPath } from './path/CompoundPath';
export { StrokeProfileStop } from './path/StrokeProfileStop';
export { PathFitter } from './path/PathFitter';
export { PathFlattener } from './path/PathFlattener';
export { createCanvasTextMeasurer, getTextMeasurer, setTextMeasurer } from './text/TextMeasurer';
export { TextStyle } from './text/TextStyle';
export { TextStory, isParagraphKey } from './text/TextStory';
export { TextRange } from './text/TextRange';
export { TextItem } from './text/TextItem';
export { PointText } from './text/PointText';
export { PathText } from './text/PathText';
export { AreaText } from './text/AreaText';
export { Numerical } from './util/Numerical';
export { Formatter } from './util/Formatter';
export { findBoundsCollisions, findCurveBoundsCollisions, findItemBoundsCollisions } from './util/CollisionDetection';
export type { CurveClassification } from './path/Curve';
export type { StrokeProfileStopProps } from './path/StrokeProfileStop';
export type { StrokeProfileEntry, StrokeProfilePart } from './path/Path';
export type { BooleanOptions, OffsetOptions, OutlineOptions, Winding } from './path/PathItem';
export type { BoundsLike } from './util/CollisionDetection';
export type { PathDataTarget } from './path/pathData';
export type { FontMetrics, TextMeasurer } from './text/TextMeasurer';
export type { TextStyleKey, TextStyleOwner, TextStyleValueMap } from './text/TextStyle';
export type { TextRun } from './text/TextStory';
export type { TextItemProps, TextLine, TextPiece } from './text/TextItem';
export type { PathTextProps } from './text/PathText';
export type { AreaTextProps } from './text/AreaText';
