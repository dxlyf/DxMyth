/**
 * Do not mount those modules on 'src/zrender' for better tree shaking.
 */

import * as zrUtil from './core/util';
import * as matrix from './core/matrix';
import * as vector from './core/vector';
import * as colorTool from './tool/color';
import * as pathTool from './tool/path';
import {parseSVG} from './tool/parseSVG';

import * as morphPathTool from './tool/morphPath';

export {default as Point,type PointLike} from './core/Point';

export {
    default as Element,
} from './Element';
export type {
    ElementAnimateConfig,
    ElementTextConfig,
    ElementTextGuideLineConfig,
    ElementEvent,
    ElementEventCallback,
    ElementProps
} from './Element';

export {default as Displayable,type DisplayableProps} from './graphic/Displayable';
export {default as Group,type GroupProps} from './graphic/Group';
export {default as Path,type PathStyleProps, type PathProps, type PathStatePropNames, type PathState} from './graphic/Path';
export {default as Image,type ImageStyleProps,type ImageProps,type ImageState} from './graphic/Image';
export {default as CompoundPath,type CompoundPathShape} from './graphic/CompoundPath';
export {default as TSpan,type TSpanStyleProps,type TSpanProps,type TSpanState} from './graphic/TSpan';
export {default as IncrementalDisplayable} from './graphic/IncrementalDisplayable';
export {default as Text,type TextStylePropsPart,type TextStyleProps,type TextProps,type TextState} from './graphic/Text';

export {default as Arc,type ArcProps, ArcShape} from './graphic/shape/Arc';
export {default as BezierCurve,type BezierCurveProps, BezierCurveShape} from './graphic/shape/BezierCurve';
export {default as Circle,type CircleProps, CircleShape} from './graphic/shape/Circle';
export {default as Droplet,type DropletProps, DropletShape} from './graphic/shape/Droplet';
export {default as Ellipse,type EllipseProps, EllipseShape} from './graphic/shape/Ellipse';
export {default as Heart,type HeartProps, HeartShape} from './graphic/shape/Heart';
export {default as Isogon,type IsogonProps, IsogonShape} from './graphic/shape/Isogon';
export {default as Line,type LineProps, LineShape} from './graphic/shape/Line';
export {default as Polygon,type PolygonProps, PolygonShape} from './graphic/shape/Polygon';
export {default as Polyline,type PolylineProps, PolylineShape} from './graphic/shape/Polyline';
export {default as Rect,type RectProps, RectShape} from './graphic/shape/Rect';
export {default as Ring,type RingProps, RingShape} from './graphic/shape/Ring';
export {default as Rose,type RoseProps, RoseShape} from './graphic/shape/Rose';
export {default as Sector,type SectorProps, SectorShape} from './graphic/shape/Sector';
export {default as Star,type StarProps, StarShape} from './graphic/shape/Star';
export {default as Trochoid,type TrochoidProps, TrochoidShape} from './graphic/shape/Trochoid';

export {default as LinearGradient,type LinearGradientObject} from './graphic/LinearGradient';
export {default as RadialGradient,type RadialGradientObject} from './graphic/RadialGradient';
export {
    default as Pattern,
   type PatternObjectBase,
   type PatternObject,
   type ImagePatternObject,
   type SVGPatternObject
} from './graphic/Pattern';
export {default as BoundingRect,type RectLike} from './core/BoundingRect';
export {default as OrientedBoundingRect} from './core/OrientedBoundingRect';

export {matrix};
export {vector};
export {colorTool as color};
export {pathTool as path};
export {zrUtil as util};

export {morphPathTool as morph};

export {parseSVG};

export {default as showDebugDirtyRect} from './debug/showDebugDirtyRect';

export {setPlatformAPI} from './core/platform';