/**
 * Shared enumerations for mini3d.
 *
 * Everything here is deliberately string-typed (rather than numeric, as in
 * three.js) so that the WebGL, WebGL2 and WebGPU backends can map a single
 * value onto their own native constants without a numeric translation table.
 * The *names* of the constants follow three.js so that ported code reads the
 * same.
 */

// --------------------------------------------------------------------- side --

export type Side = 'front' | 'back' | 'double';
export const FrontSide: Side = 'front';
export const BackSide: Side = 'back';
export const DoubleSide: Side = 'double';

// ----------------------------------------------------------------- blending --

export type Blending = 'none' | 'normal' | 'additive' | 'subtractive' | 'multiply';
export const NoBlending: Blending = 'none';
export const NormalBlending: Blending = 'normal';
export const AdditiveBlending: Blending = 'additive';
export const SubtractiveBlending: Blending = 'subtractive';
export const MultiplyBlending: Blending = 'multiply';

// --------------------------------------------------------------- depth func --

export type DepthFunc =
  | 'never'
  | 'less'
  | 'equal'
  | 'le-Equal'
  | 'greater'
  | 'not-equal'
  | 'ge-Equal'
  | 'always';

export const NeverDepth: DepthFunc = 'never';
export const LessDepth: DepthFunc = 'less';
export const EqualDepth: DepthFunc = 'equal';
export const LessEqualDepth: DepthFunc = 'le-Equal';
export const GreaterDepth: DepthFunc = 'greater';
export const NotEqualDepth: DepthFunc = 'not-equal';
export const GreaterEqualDepth: DepthFunc = 'ge-Equal';
export const AlwaysDepth: DepthFunc = 'always';

// ------------------------------------------------------------------ material --

/** Discriminator stored on every `Material`; keys of `ShaderLib`/`WgslLib`. */
export type MaterialKind =
  | 'basic'
  | 'lambert'
  | 'phong'
  | 'standard'
  | 'normal'
  | 'depth'
  | 'line'
  | 'points'
  | 'shader'
  | 'raw-shader';

/** Kinds that have a built-in entry in `ShaderLib` / `WgslLib`. */
export type BuiltInMaterialKind =
  | 'basic'
  | 'lambert'
  | 'phong'
  | 'standard'
  | 'normal'
  | 'depth'
  | 'line'
  | 'points';

export type DepthPacking = 'basic' | 'rgba';
export const BasicDepthPacking: DepthPacking = 'basic';
export const RGBADepthPacking: DepthPacking = 'rgba';

/** How an environment map is combined with the lit surface colour. */
export type CombineOperation = 'multiply' | 'mix' | 'add';
export const MultiplyOperation: CombineOperation = 'multiply';
export const MixOperation: CombineOperation = 'mix';
export const AddOperation: CombineOperation = 'add';

/** GLSL dialect a `ShaderMaterial` source is written in. */
export type GlslVersion = '100 es' | '300 es';

export type ToneMappingMode = 'none' | 'linear' | 'reinhard' | 'cineon' | 'aces';

// ------------------------------------------------------------------ texture --

export type FilterMode =
  | 'nearest'
  | 'linear'
  | 'nearest-mipmap-nearest'
  | 'linear-mipmap-nearest'
  | 'nearest-mipmap-linear'
  | 'linear-mipmap-linear';

export type WrapMode = 'repeat' | 'clamp' | 'mirror';

export type TextureFormat =
  | 'rgba'
  | 'rgb'
  | 'rgba-float'
  | 'rgb-float'
  | 'r'
  | 'rg'
  | 'depth'
  | 'depth-stencil';

export type TextureDataType = 'uint8' | 'float16' | 'float32';

/** Working-space tag for a texture's texel values. */
export type ColorSpace = 'srgb' | 'linear';

/** Filter modes that require mipmaps to be generated/uploaded. */
export const MIPMAP_FILTER_MODES: ReadonlySet<FilterMode> = new Set<FilterMode>([
  'nearest-mipmap-nearest',
  'linear-mipmap-nearest',
  'nearest-mipmap-linear',
  'linear-mipmap-linear',
]);

/** GL `unpackAlignment` values accepted by the backends. */
export type UnpackAlignment = 1 | 2 | 4 | 8;
