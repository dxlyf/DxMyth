/**
 * mini3d — a small three.js-like WebGL / WebGL2 / WebGPU rendering library.
 *
 * ```ts
 * import { Scene, PerspectiveCamera, Mesh, BoxGeometry, MeshStandardMaterial,
 *          WebGLRenderer, AmbientLight, DirectionalLight } from 'mini3d';
 *
 * const renderer = new WebGLRenderer({ antialias: true });
 * const scene = new Scene();
 * const camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
 * camera.position.set(0, 1.5, 4);
 *
 * const cube = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: 0x44aa88 }));
 * scene.add(cube, new AmbientLight(0xffffff, 0.4));
 * const sun = new DirectionalLight(0xffffff, 1.6);
 * sun.position.set(3, 6, 4);
 * scene.add(sun, sun.target);
 *
 * renderer.setSize(innerWidth, innerHeight);
 * document.body.append(renderer.canvas);
 * renderer.render(scene, camera);
 * ```
 */

// ------------------------------------------------------------------- math --
export * from './math/index';
export * from './curves/index';

// ------------------------------------------------------------------- core --
export { EventDispatcher, type Listener } from './core/EventDispatcher';
export {
  BufferAttribute,
  InterleavedBufferAttribute,
  inferVertexFormat,
  vertexFormatComponents,
  type TypedArray,
  type VertexFormat,
  type AttributeSemantic,
} from './core/BufferAttribute';
export {
  BufferGeometry,
  DRAW_MODE_VALUES,
  type DrawMode,
  type GeometryGroup,
} from './core/BufferGeometry';
export type { Face, RaycastCamera } from './core/BufferGeometryTypes';
export { Object3D, generateUuid, type Object3DEventMap } from './core/Object3D';
export { Scene } from './core/Scene';
export { Fog, FogExp2 } from './core/Fog';
export { Camera } from './core/Camera';
export { PerspectiveCamera } from './core/PerspectiveCamera';
export { OrthographicCamera } from './core/OrthographicCamera';
export { Mesh, Line, LineSegments, LineLoop, Points, Sprite, Group } from './core/Mesh';
export {
  Light,
  AmbientLight,
  HemisphereLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  RectAreaLight,
  LightProbe,
  LightShadow,
  isRectAreaLight,
  type LightShadowOptions,
} from './core/Lights';
export {
  LightState,
  collectLights,
  lightUniforms,
  MAX_DIRECTIONAL_LIGHTS,
  MAX_POINT_LIGHTS,
  MAX_SPOT_LIGHTS,
} from './core/LightState';
export { Raycaster, type Intersection } from './core/Raycaster';
export { rayDistanceToPoint } from './core/RaycastUtils';
export type {
  Renderer,
  RendererBackend,
  RendererCapabilities,
  RendererInfo,
  RendererParameters,
  ResolvedRendererParameters,
} from './core/types';

// --------------------------------------------------------------- constants --
export * from './constants';

// ---------------------------------------------------------------- geometry --
export * from './geometries/index';

// -------------------------------------------------------------- materials ---
export * from './materials/index';

// --------------------------------------------------------------- textures ---
export * from './textures/index';

// ---------------------------------------------------------------- shaders ---
export * from './shaders/index';

// -------------------------------------------------------------- renderers ---
export {
  WebGLRenderer,
  type WebGLRendererParameters,
  type GLContextLike,
} from './renderers/webgl/WebGLRenderer';
export { GLProgram, programCacheKey, resolveMaterialShader } from './renderers/webgl/GLProgram';
export type { GL } from './renderers/webgl/GLTypes';
export {
  WebGLUniforms,
  SingleUniform,
  PureArrayUniform,
  StructuredUniform,
  type UniformNode,
  type UniformValue,
  type UniformValues,
} from './renderers/webgl/WebGLUniforms';
export {
  getSingularSetter,
  getPureArraySetter,
  isSamplerType,
  type UniformSetter,
  type UniformTextureBinder,
  type SetterContext,
} from './renderers/webgl/WebGLUniformsSetters';
export { WebGLState } from './renderers/webgl/WebGLState';
export { WebGLTextures } from './renderers/webgl/WebGLTextures';
export { WebGLGeometries, ATTRIBUTE_LOCATIONS } from './renderers/webgl/WebGLGeometries';
export {
  createRenderer,
  detectBackends,
  autoRenderer,
  type CreateRendererOptions,
  type BackendSupport,
} from './renderers/createRenderer';
