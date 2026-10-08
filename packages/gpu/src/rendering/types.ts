// // figma-types.ts
// // 从@figma/plugin-typings提取的核心类型

// export type NodeType = 
//   | 'DOCUMENT' 
//   | 'CANVAS' 
//   | 'FRAME' 
//   | 'GROUP' 
//   | 'VECTOR' 
//   | 'BOOLEAN_OPERATION'
//   | 'STAR' 
//   | 'LINE' 
//   | 'ELLIPSE' 
//   | 'REGULAR_POLYGON'
//   | 'RECTANGLE' 
//   | 'TEXT' 
//   | 'SLICE' 
//   | 'COMPONENT' 
//   | 'COMPONENT_SET'
//   | 'INSTANCE';

// export interface RGBA {
//   readonly r: number;
//   readonly g: number;
//   readonly b: number;
//   readonly a: number;
// }

// export interface Paint {
//   readonly type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 
//                 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
//   readonly color?: RGBA;
//   readonly gradientStops?: readonly ColorStop[];
//   readonly gradientTransform?: Transform;
//   readonly imageRef?: string;
//   readonly opacity?: number;
//   readonly visible?: boolean;
//   readonly blendMode?: BlendMode;
// }

// export interface ColorStop {
//   readonly position: number;
//   readonly color: RGBA;
// }

// export interface Transform {
//   readonly matrix: readonly [
//     readonly [number, number, number],
//     readonly [number, number, number]
//   ];
// }

// export interface Effect {
//   readonly type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
//   readonly visible: boolean;
//   readonly radius: number;
//   readonly color?: RGBA;
//   readonly offset?: { readonly x: number; readonly y: number };
//   readonly spread?: number;
//   readonly blendMode?: BlendMode;
// }

// export interface BaseNode {
//   readonly id: string;
//   readonly name: string;
//   readonly type: NodeType;
//   readonly visible: boolean;
//   readonly locked: boolean;
//   readonly opacity: number;
//   readonly blendMode: BlendMode;
//   readonly effects: readonly Effect[];
//   readonly constraints?: Constraints;
// }

// export interface RectangleNode extends BaseNode {
//   readonly type: 'RECTANGLE';
//   readonly x: number;
//   readonly y: number;
//   readonly width: number;
//   readonly height: number;
//   readonly cornerRadius: number;
//   readonly rectangleCornerRadii: readonly number[];
//   readonly fills: readonly Paint[];
//   readonly strokes: readonly Paint[];
//   readonly strokeWeight: number;
// }

// export interface FrameNode extends BaseNode {
//   readonly type: 'FRAME';
//   readonly x: number;
//   readonly y: number;
//   readonly width: number;
//   readonly height: number;
//   readonly layoutMode: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
//   readonly children: readonly SceneNode[];
// }

// export interface TextNode extends BaseNode {
//   readonly type: 'TEXT';
//   readonly characters: string;
//   readonly fontSize: number;
//   readonly fontName: { readonly family: string; readonly style: string };
//   readonly textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
//   readonly textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
//   readonly letterSpacing: number;
//   readonly lineHeight: {
//     readonly value: number;
//     readonly unit: 'PIXELS' | 'PERCENT' | 'AUTO';
//   };
// }

// export type SceneNode = 
//   | RectangleNode 
//   | FrameNode 
//   | TextNode 
//   | VectorNode 
//   | EllipseNode 
//   | GroupNode 
//   | ComponentNode 
//   | InstanceNode;