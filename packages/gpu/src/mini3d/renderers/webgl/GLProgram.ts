import type { Material, ShaderSource } from '../../materials/Material';
import { ShaderLib, type ShaderLibName } from '../../shaders/ShaderLib';
import { ShaderChunk, resolveIncludes } from '../../shaders/ShaderChunk';
import {
  MAX_DIRECTIONAL_LIGHTS,
  MAX_POINT_LIGHTS,
  MAX_SPOT_LIGHTS,
  DIRECTIONAL_LIGHT_FLOATS,
  POINT_LIGHT_FLOATS,
  SPOT_LIGHT_FLOATS,
} from '../../core/LightState';
import { WebGLUniforms, type UniformNode } from './WebGLUniforms';
import type { GL } from './GLTypes';

export type { GL };

/**
 * Marker emitted by the `common` chunk. `GLProgram` replaces it with the
 * tangent-space normal-map helper when the context supports derivatives, so
 * derivative built-ins are never present in a shader that cannot use them.
 */
const MINI3D_SPLICE_MARKER = 'void mini3dShaderPassthrough() {}';

export interface ProgramParameters {
  /** Material kind resolved to a built-in shader name, or `null` for custom. */
  shaderName: ShaderLibName | null;
  defines: Record<string, string | number | boolean>;
  vertexShader: string;
  fragmentShader: string;
  /** `true` disables the standard prologue (RawShaderMaterial). */
  raw: boolean;
  /** GLSL dialect requested by the material. */
  glslVersion: '100 es' | '300 es';
  /**
   * GLSL ES 1.00 only: emit `#extension GL_OES_standard_derivatives : enable`
   * so `dFdx`/`dFdy` compile. Set from `WebGLRenderer` when the extension was
   * successfully acquired.
   */
  standardDerivatives?: boolean;
}

/**
 * A linked GLSL program.
 *
 * Handles the GLSL ES 1.00 vs 3.00 differences (attribute/varying keywords,
 * `gl_FragColor` vs `out`) by rewriting the source, so a single shader body
 * runs on a WebGL1 and a WebGL2 context unchanged. Uniform reflection and
 * upload live in `WebGLUniforms`, exposed here as `uniforms`.
 */
export class GLProgram {
  readonly program: WebGLProgram;
  readonly vertexShader: WebGLShader;
  readonly fragmentShader: WebGLShader;
  /** Reflected uniform table; see `WebGLUniforms`. */
  readonly uniforms: WebGLUniforms;
  /** Cache key that produced this program. */
  readonly cacheKey: string;

  private readonly gl: GL;
  private _used = true;

  constructor(gl: GL, parameters: ProgramParameters, cacheKey: string) {
    this.gl = gl;
    this.cacheKey = cacheKey;

    const isGLSL3 = parameters.glslVersion === '300 es';
    const derivatives = parameters.standardDerivatives === true;
    const body = parameters.raw
      ? ''
      : buildPrefix(parameters.defines, isGLSL3, derivatives, false);
    const fragmentBody = parameters.raw
      ? ''
      : buildPrefix(parameters.defines, isGLSL3, derivatives, true);
    const directives = buildDirectives(isGLSL3, derivatives);
    const spliceDerivatives = (source: string): string => {
      if (derivatives && source.includes(MINI3D_SPLICE_MARKER)) {
        return source.replace(MINI3D_SPLICE_MARKER, ShaderChunk.normalmap_perturb_fragment);
      }
      return source;
    };

    let vertexSource = parameters.raw
      ? parameters.vertexShader
      : directives + body + resolveIncludes(parameters.vertexShader);
    let fragmentSource = parameters.raw
      ? parameters.fragmentShader
      : directives + fragmentBody + spliceDerivatives(resolveIncludes(parameters.fragmentShader));

    if (!parameters.raw && !isGLSL3) {
      vertexSource = compatVertex(vertexSource);
      fragmentSource = compatFragment(fragmentSource);
    } else if (!parameters.raw) {
      fragmentSource = modernFragment(fragmentSource);
    }

    this.vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource, cacheKey);
    this.fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, cacheKey);
    const program = gl.createProgram();
    if (!program) throw new Error('mini3d: gl.createProgram() returned null');
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    this.program = program;

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? '(no log)';
      gl.deleteProgram(program);
      throw new Error(`mini3d: program link failed for ${cacheKey}\n${log}`);
    }

    this.uniforms = new WebGLUniforms(gl, program);
  }

  /** Active attribute names reported by the linker. */
  get attributes(): Set<string> {
    return this.uniforms.attributes;
  }

  /** Number of sampler units this program needs. */
  get samplerCount(): number {
    return this.uniforms.unitsRequired;
  }

  hasUniform(name: string): boolean {
    return this.uniforms.has(name);
  }

  /** The reflected node for `name`; see `WebGLUniforms`. */
  getUniform(name: string): UniformNode | undefined {
    return this.uniforms.entry(name);
  }

  markUsed(): void {
    this._used = true;
  }

  markUnused(): void {
    this._used = false;
  }

  get used(): boolean {
    return this._used;
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteShader(this.vertexShader);
    gl.deleteShader(this.fragmentShader);
    this.uniforms.dispose();
  }
}

/**
 * `#version` must precede every other token, so it is emitted as a separate
 * block ahead of the prologue.
 *
 * Note: `#extension GL_OES_standard_derivatives : enable` is deliberately never
 * emitted. Some ANGLE/driver combinations accept the directive but then reject
 * any shader that uses `dFdx`/`dFdy` — which makes a capability probe succeed
 * while every real shader fails. Derivatives are therefore gated purely on
 * whether `dFdx`/`dFdy` compile *without* the directive (WebGL2 always can;
 * WebGL1 contexts that expose the built-ins directly also can).
 */
export function buildDirectives(glsl3: boolean, _standardDerivatives: boolean): string {
  return glsl3 ? '#version 300 es\n' : '';
}

/** Body of the prologue: precision, built-in uniforms, light data. */
export function buildPrefix(
  defines: Record<string, string | number | boolean>,
  glsl3: boolean,
  standardDerivatives: boolean,
  isFragment: boolean,
): string {
  const lines: string[] = [];
  if (glsl3) {
    // GLSL ES 3.00 has no `attribute`/`varying` keywords; the compat rewriter
    // below converts them, and the output variable is declared here.
    lines.push('#define MINI3D_GLSL3 1');
  }
  if (standardDerivatives) lines.push('#define MINI3D_DERIVATIVES 1');
  lines.push('precision highp float;');
  lines.push('precision highp int;');
  lines.push('precision mediump sampler2D;');
  lines.push('');

  for (const [key, value] of Object.entries(defines)) {
    if (value === false || value === undefined || value === null) continue;
    lines.push(value === true ? `#define ${key}` : `#define ${key} ${value}`);
  }
  lines.push('');
  lines.push('// ---- vertex attributes (locations fixed by ATTRIBUTE_LOCATIONS) ----');
  // `attribute` is only legal in a vertex shader; declaring it in the fragment
  // prologue is a compile error on a real driver.
  if (!isFragment) {
    lines.push('attribute vec3 position;');
    lines.push('attribute vec3 normal;');
    lines.push('attribute vec2 uv;');
    lines.push('#ifdef USE_COLOR');
    lines.push('attribute vec3 color;');
    lines.push('#endif');
    lines.push('#ifdef USE_TANGENT');
    lines.push('attribute vec4 tangent;');
    lines.push('#endif');
  }
  lines.push('');
  lines.push('// ---- frame uniforms (re-uploaded for every draw call) ----');
  lines.push('uniform mat4 modelMatrix;');
  lines.push('uniform mat4 modelViewMatrix;');
  lines.push('uniform mat4 projectionMatrix;');
  lines.push('uniform mat4 viewMatrix;');
  lines.push('uniform mat3 normalMatrix;');
  lines.push('uniform vec3 cameraPosition;');
  lines.push('uniform mat3 uvTransform;');
  lines.push('');
  lines.push('// ---- material scalars ----');
  lines.push('uniform vec3 diffuse;');
  lines.push('uniform float opacity;');
  lines.push('uniform vec3 emissive;');
  lines.push('uniform vec3 specular;');
  lines.push('uniform float shininess;');
  lines.push('uniform float roughness;');
  lines.push('uniform float metalness;');
  // `normalScale` is deliberately NOT declared here: `normalmap_pars_fragment`
  // owns it, guarded by `USE_NORMALMAP`, and declaring it in both places is a
  // redefinition error.
  lines.push('uniform float alphaTest;');
  lines.push('uniform float size;');
  lines.push('uniform float sizeAttenuation;');
  // Half the drawing-buffer height, so size attenuation is resolution
  // independent (`gl_PointSize` is in physical pixels).
  lines.push('uniform float pointScale;');
  lines.push('uniform float depthNear;');
  lines.push('uniform float depthFar;');
  lines.push('uniform float displacementScale;');
  lines.push('uniform float displacementBias;');
  // `begin_vertex` samples this, so it must be declared whenever the define is
  // set — including in the vertex stage, where the prologue is shared.
  if (!isFragment) {
    lines.push('#ifdef USE_DISPLACEMENTMAP');
    lines.push('uniform sampler2D displacementMap;');
    lines.push('#endif');
  }
  lines.push('');
  lines.push('// ---- lights, packed into vec4 lanes (see core/LightState.ts) ----');
  lines.push(`#define MAX_DIRECTIONAL_LIGHTS ${MAX_DIRECTIONAL_LIGHTS}`);
  lines.push(`#define MAX_POINT_LIGHTS ${MAX_POINT_LIGHTS}`);
  lines.push(`#define MAX_SPOT_LIGHTS ${MAX_SPOT_LIGHTS}`);
  lines.push(`#define DIRECTIONAL_LIGHT_FLOATS ${DIRECTIONAL_LIGHT_FLOATS}`);
  lines.push(`#define POINT_LIGHT_FLOATS ${POINT_LIGHT_FLOATS}`);
  lines.push(`#define SPOT_LIGHT_FLOATS ${SPOT_LIGHT_FLOATS}`);
  // Packed light arrays. GLSL ES 1.00 only allows array indexing with a
  // constant-index-expression, so these are *not* wrapped in helper functions
  // (indexing from inside a function body fails to compile on real drivers).
  // The `MINI3D_ACCUM_LIGHT` macro indexes them directly with the caller's loop
  // counter, which keeps the index constant at the point of expansion.
  //
  // Lane layout (mirrors core/LightState.ts):
  //   directionalLightsData[i * 2 + 0] = [direction.xyz, 0]
  //   directionalLightsData[i * 2 + 1] = [color.rgb, 0]
  //   pointLightsData[i * 2 + 0]       = [position.xyz, 1]
  //   pointLightsData[i * 2 + 1]       = [color.rgb, distance]
  //   spotLightsData[i * 4 + 0]        = [position.xyz, 1]
  //   spotLightsData[i * 4 + 1]        = [direction.xyz, 0]
  //   spotLightsData[i * 4 + 2]        = [color.rgb, distance]
  //   spotLightsData[i * 4 + 3]        = [cosOuter, cosInner, 0, 0]
  lines.push(
    `uniform vec4 directionalLightsData[${MAX_DIRECTIONAL_LIGHTS * (DIRECTIONAL_LIGHT_FLOATS / 4)}];`,
  );
  lines.push(`uniform vec4 pointLightsData[${MAX_POINT_LIGHTS * (POINT_LIGHT_FLOATS / 4)}];`);
  lines.push(`uniform vec4 spotLightsData[${MAX_SPOT_LIGHTS * (SPOT_LIGHT_FLOATS / 4)}];`);
  return lines.join('\n') + '\n';
}

/** Downgrades modern GLSL keywords for GLSL ES 1.00 contexts. */
export function compatVertex(source: string): string {
  return source
    .replace(
      /^([ \t]*)in[ \t]+(vec[234]|float|int|mat[34]|ivec[234]|uvec[234])[ \t]+(\w+)[ \t]*;/gm,
      '$1attribute $2 $3;',
    )
    .replace(
      /^([ \t]*)out[ \t]+(vec[234]|float|int|mat[34]|ivec[234]|uvec[234])[ \t]+(\w+)[ \t]*;/gm,
      '$1varying $2 $3;',
    );
}

export function compatFragment(source: string): string {
  return source
    .replace(
      /^([ \t]*)in[ \t]+(vec[234]|float|int|mat[34]|ivec[234])[ \t]+(\w+)[ \t]*;/gm,
      '$1varying $2 $3;',
    )
    .replace(/^([ \t]*)out[ \t]+vec4[ \t]+(\w+)[ \t]*;/gm, '$1#define $2 gl_FragColor');
}

/** Adds the `out` declaration for GLSL ES 3.00 fragment shaders. */
function modernFragment(source: string): string {
  if (/^[ \t]*out[ \t]+vec4[ \t]+\w+[ \t]*;/m.test(source)) return source;
  return source.replace(
    /(precision[ \t]+mediump[ \t]+sampler2D[ \t]*;)/,
    '$1\nout vec4 pc_fragColor;\n#define gl_FragColor pc_fragColor',
  );
}

function compileShader(gl: GL, type: number, source: string, cacheKey: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('mini3d: gl.createShader() returned null');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? '(no log)';
    gl.deleteShader(shader);
    const numbered = source
      .split('\n')
      .map((line, i) => `${String(i + 1).padStart(4, ' ')}| ${line}`)
      .join('\n');
    const kind = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
    throw new Error(
      `mini3d: ${kind} shader compile failed for ${cacheKey}\n${log}\n${numbered}`,
    );
  }
  return shader;
}

/** Stable cache key for a material/program pair. */
export function programCacheKey(
  shaderName: ShaderLibName | null,
  defines: Record<string, string | number | boolean>,
  raw: boolean,
  glslVersion: string,
): string {
  const definePart = Object.keys(defines)
    .filter((key) => defines[key] !== false && defines[key] !== undefined && defines[key] !== null)
    .sort()
    .map((key) => `${key}=${String(defines[key])}`)
    .join(',');
  return `${shaderName ?? 'custom'}|${raw ? 'raw' : 'std'}|${glslVersion}|${definePart}`;
}

/**
 * Folds a material's own switches plus its texture slots into the `USE_*`
 * macros the shader library expects, then layers the user's `defines` on top.
 */
export function buildMaterialDefines(
  material: Material,
  derivativesAvailable = true,
): Record<string, string | number | boolean> {
  const m = material as Material & {
    map?: unknown;
    alphaMap?: unknown;
    normalMap?: unknown;
    emissiveMap?: unknown;
    specularMap?: unknown;
    roughnessMap?: unknown;
    metalnessMap?: unknown;
    aoMap?: unknown;
    lightMap?: unknown;
    displacementMap?: unknown;
  };

  const defines: Record<string, string | number | boolean> = {};
  const doubles = material.side === 'double';

  if (material.vertexColors) defines.USE_COLOR = true;
  if (material.flatShading) defines.FLAT_SHADED = true;
  if (doubles) defines.DOUBLE_SIDED = true;
  if (material.alphaTest > 0) defines.USE_ALPHATEST = true;

  if (m.map) defines.USE_MAP = true;
  if (m.alphaMap) defines.USE_ALPHAMAP = true;
  // Normal mapping is only compiled in when the context can compute
  // screen-space derivatives; otherwise the interpolated normal is used.
  if (m.normalMap && derivativesAvailable) defines.USE_NORMALMAP = true;
  if (m.emissiveMap) defines.USE_EMISSIVEMAP = true;
  if (m.specularMap) defines.USE_SPECULARMAP = true;
  if (m.roughnessMap) defines.USE_ROUGHNESSMAP = true;
  if (m.metalnessMap) defines.USE_METALNESSMAP = true;
  if (m.aoMap) defines.USE_AOMAP = true;
  if (m.lightMap) defines.USE_LIGHTMAP = true;
  if (m.displacementMap) defines.USE_DISPLACEMENTMAP = true;

  // Any texture consumer needs the interpolated uv varying.
  if (
    m.map ||
    m.alphaMap ||
    m.normalMap ||
    m.emissiveMap ||
    m.specularMap ||
    m.roughnessMap ||
    m.metalnessMap ||
    m.aoMap ||
    m.lightMap ||
    m.displacementMap
  ) {
    defines.USE_UV = true;
  }

  if ((material as { depthPacking?: string }).depthPacking === 'rgba') {
    defines.DEPTH_PACKING_RGBA = true;
  }

  // Toning mapping / output colour space are toggles the renderer owns.
  const rendererState = (material as unknown as { __rendererDefines?: Record<string, unknown> })
    .__rendererDefines;
  if (rendererState) Object.assign(defines, rendererState);

  Object.assign(defines, material.defines);

  // Last line of defence: `normal_fragment` calls the derivative-based
  // `perturbNormal2Arb`, which `GLProgram` only splices in when the context can
  // compile derivatives. A material that sets `USE_NORMALMAP` in its own
  // `defines` (or `getDefines`) would otherwise produce a program that cannot
  // compile, so the define is dropped here regardless of where it came from.
  if (!derivativesAvailable) delete defines.USE_NORMALMAP;

  return defines;
}

/** True when `kind` maps to a built-in shader. */
export function isBuiltInKind(kind: string): kind is ShaderLibName {
  return Object.prototype.hasOwnProperty.call(ShaderLib, kind);
}

/** Resolves a material to the shader pair + defines a program should use. */
export function resolveMaterialShader(
  material: Material,
  derivativesAvailable = true,
): {
  parameters: ProgramParameters;
  source: ShaderSource;
} {
  const custom = material as Material &
    Partial<ShaderSource> & { glslVersion?: string; rawShaderMaterial?: boolean };

  if (typeof custom.vertexShader === 'string' && typeof custom.fragmentShader === 'string') {
    const source: ShaderSource = {
      vertexShader: custom.vertexShader,
      fragmentShader: custom.fragmentShader,
      defines: { ...material.getDefines() },
      uniforms: custom.uniforms ? { ...custom.uniforms } : {},
    };
    material.onBeforeCompile?.(source);
    return {
      parameters: {
        shaderName: null,
        defines: source.defines,
        vertexShader: source.vertexShader,
        fragmentShader: source.fragmentShader,
        raw: custom.rawShaderMaterial === true,
        glslVersion: custom.glslVersion === '300 es' ? '300 es' : '100 es',
      },
      source,
    };
  }

  const shaderName = isBuiltInKind(material.kind) ? material.kind : 'basic';
  const entry = ShaderLib[shaderName];
  const source: ShaderSource = {
    vertexShader: entry.vertexShader,
    fragmentShader: entry.fragmentShader,
    defines: buildMaterialDefines(material, derivativesAvailable),
    uniforms: { ...material.uniforms },
  };
  material.onBeforeCompile?.(source);
  return {
    parameters: {
      shaderName,
      defines: source.defines,
      vertexShader: source.vertexShader,
      fragmentShader: source.fragmentShader,
      raw: false,
      glslVersion: '100 es',
      standardDerivatives: derivativesAvailable,
    },
    source,
  };
}
