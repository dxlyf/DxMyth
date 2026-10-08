/**
 * WGSL sources for the WebGPU backend.
 *
 * WGSL has no preprocessor, so every feature toggle is resolved by string
 * concatenation in TypeScript: `WgslLib` holds the *plain* (all-features-off)
 * variant of each program and `buildWgslShader()` / `buildWgslVertexShader()` /
 * `buildWgslFragmentShader()` produce the variants a material needs.
 *
 * ### Binding layout (fixed; the backend builds both bind groups to match)
 *
 * ```
 * @group(0) @binding(0) var<uniform> frame: FrameUniforms;
 *
 * @group(1) @binding(0) var<uniform> object: ObjectUniforms;
 * @group(1) @binding(1) var t_diffuse:  texture_2d<f32>;
 * @group(1) @binding(2) var s_diffuse:  sampler;
 * @group(1) @binding(3) var t_normal:   texture_2d<f32>;
 * @group(1) @binding(4) var s_normal:   sampler;
 * @group(1) @binding(5) var t_emissive: texture_2d<f32>;
 * @group(1) @binding(6) var s_emissive: sampler;
 * @group(1) @binding(7) var t_ao:       texture_2d<f32>;
 * @group(1) @binding(8) var s_ao:       sampler;
 * ```
 *
 * `FrameUniforms` scalar fields come first (16 bytes each, no padding
 * surprises) followed by `array<vec4<f32>, N>` fields whose element stride is
 * exactly 16 bytes, so the whole struct is filled from one `Float32Array` in
 * declaration order:
 *
 * | field | meaning |
 * | --- | --- |
 * | `viewMatrix`, `projectionMatrix`, `viewProjectionMatrix` | mat4x4, column major |
 * | `cameraPosition` | `xyz` = eye position (world space) |
 * | `ambientColor` | `rgb` = ambient irradiance |
 * | `hemisphereSky` / `hemisphereGround` | `rgb` = hemisphere irradiance |
 * | `directionalCounts` | `x` = dir count, `y` = point count, `z` = spot count |
 * | `directionalData` | 8 lights x 2 vec4: `[i*2].xyz` = direction, `[i*2+1].rgb` = colour |
 * | `pointData` | 8 lights x 2 vec4: `[i*2].xyz` = position, `[i*2+1]` = (`rgb` colour, `a` distance) |
 * | `spotData` | 4 lights x 4 vec4: `[i*4].xyz` position, `[i*4+1].xyz` direction, `[i*4+2]` (`rgb` colour, `a` distance), `[i*4+3].xy` (`x` cosOuter, `y` cosInner) |
 * | `fogColor` | `rgb` = fog colour |
 * | `fogParams` | `x` near, `y` far, `z` fog enabled (>0.5), `w` density (exp2 fog) |
 *
 * `ObjectUniforms`:
 *
 * | field | meaning |
 * | --- | --- |
 * | `modelMatrix`, `normalMatrix` | mat4x4, column major (`normalMatrix` is a mat4 holding the mat3 in its first three columns) |
 * | `diffuse` | `rgb` = base colour; `a` unused |
 * | `emissive` | `rgb` = emissive colour |
 * | `specularShininess` | `rgb` = specular colour, `a` = Blinn-Phong shininess |
 * | `roughnessMetalness` | `x` roughness, `y` metalness, `z` **opacity**, `w` unused |
 * | `uvTransform` | mat4x4 whose first three columns are the `Matrix3` in column-major order (column 3 unused) |
 * | `flags` | `x` = alpha-test threshold, `y` = point size, `z` = size attenuation (>0.5 on), `w` unused. These are the lanes `WgpuUniforms.packObjectUniforms` writes. |
 *
 * Vertex inputs are `@location(0) position`, `@location(1) normal`,
 * `@location(2) uv`, `@location(3) color`. The vertex stage writes `VSOut`
 * (`@builtin(position)` + the four varyings); the fragment stage reads `FSIn`,
 * which is `VSOut` plus `@builtin(front_facing)`, so back-face flipping works
 * without a second pipeline variant.
 */

/** Program names; identical to `ShaderLib` / `MaterialKind` for built-ins. */
export type WgslShaderLibName =
  | 'basic'
  | 'lambert'
  | 'phong'
  | 'standard'
  | 'normal'
  | 'depth'
  | 'line'
  | 'points';

export interface WgslShaderEntry {
  vertexShader: string;
  fragmentShader: string;
}

export type WgslToneMapping = 'none' | 'linear' | 'reinhard' | 'cineon' | 'aces';

/**
 * Everything that changes the generated WGSL source. All flags default to
 * `false`, matching the "no `USE_*` macros defined" GLSL variant: the default
 * `WgslLib` programs therefore never sample a texture and use
 * `vec3<f32>(1.0)` for the vertex colour.
 *
 * Only `useMap` / `useNormalMap` / `useEmissiveMap` / `vertexColors` change the
 * code *structure* of an otherwise complete program; flat shading, tone
 * mapping, output colour space, the fog curve and depth packing are also
 * compile-time choices (WGSL has no preprocessor and `ObjectUniforms.flags` is
 * fully occupied by the alpha test and point-size lanes). Fog is the exception:
 * it is always emitted and gated at runtime by `FrameUniforms.fogParams.z`, so
 * a scene without fog pays only one branch.
 */
export interface WgslMaterialOptions {
  /** Multiplies the base colour/alpha by `t_diffuse`. */
  useMap?: boolean;
  /** Perturbs the shading normal with `t_normal` (screen-space TBN). */
  useNormalMap?: boolean;
  /** Multiplies `emissive` by `t_emissive`. */
  useEmissiveMap?: boolean;
  /** Multiplies the base colour by `t_ao.r`. */
  useAoMap?: boolean;
  /**
   * Accepted for API/cache-key parity with the WebGPU backend, but inert:
   * the frozen bind group exposes only four 2D texture slots
   * (diffuse/normal/emissive/ao), so an alpha/specular/roughness/metalness map
   * has nowhere to be bound. Supporting them needs extra bindings.
   */
  useAlphaMap?: boolean;
  /** See {@link WgslMaterialOptions.useAlphaMap} — inert. */
  useSpecularMap?: boolean;
  /** See {@link WgslMaterialOptions.useAlphaMap} — inert. */
  useRoughnessMap?: boolean;
  /** See {@link WgslMaterialOptions.useAlphaMap} — inert. */
  useMetalnessMap?: boolean;
  /** `true` reads `@location(3) color`; `false` uses `vec3<f32>(1.0)`. */
  vertexColors?: boolean;
  /** Derives the shading normal from screen-space derivatives. */
  flatShading?: boolean;
  /** Flips the shading normal on back faces (`gl_FrontFacing` equivalent). */
  doubleSided?: boolean;
  /** Baked into the source; `'none'` leaves tone mapping to the caller. */
  toneMapping?: WgslToneMapping;
  /** Bakes the linear->sRGB transfer into the source. */
  srgbOutput?: boolean;
  /** Uses `1 - exp(-density^2 * depth^2)` instead of the near/far ramp. */
  fogExp2?: boolean;
  /** `MeshDepthMaterial.depthPacking`; only used by the `depth` program. */
  depthPacking?: 'basic' | 'rgba';
}

/** Alias used by the WebGPU backend for the program name union. */
export type WgslShaderName = WgslShaderLibName;

/** Alias used by the WebGPU backend for the material variant set. */
export type WgslVariants = WgslMaterialOptions;

// ---------------------------------------------------------------- prologue --

/** Structs, bind groups and vertex I/O shared by every program. */
const WGSL_PRELUDE = /* wgsl */ `
struct FrameUniforms {
  viewMatrix: mat4x4<f32>,
  projectionMatrix: mat4x4<f32>,
  viewProjectionMatrix: mat4x4<f32>,
  cameraPosition: vec4<f32>,
  ambientColor: vec4<f32>,
  hemisphereSky: vec4<f32>,
  hemisphereGround: vec4<f32>,
  directionalCounts: vec4<f32>,
  directionalData: array<vec4<f32>, 16>,
  pointData: array<vec4<f32>, 16>,
  spotData: array<vec4<f32>, 16>,
  fogColor: vec4<f32>,
  fogParams: vec4<f32>,
};

struct ObjectUniforms {
  modelMatrix: mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
  diffuse: vec4<f32>,
  emissive: vec4<f32>,
  specularShininess: vec4<f32>,
  roughnessMetalness: vec4<f32>,
  uvTransform: mat4x4<f32>,
  flags: vec4<f32>,
};

@group(0) @binding(0) var<uniform> frame: FrameUniforms;

@group(1) @binding(0) var<uniform> object: ObjectUniforms;
@group(1) @binding(1) var t_diffuse: texture_2d<f32>;
@group(1) @binding(2) var s_diffuse: sampler;
@group(1) @binding(3) var t_normal: texture_2d<f32>;
@group(1) @binding(4) var s_normal: sampler;
@group(1) @binding(5) var t_emissive: texture_2d<f32>;
@group(1) @binding(6) var s_emissive: sampler;
@group(1) @binding(7) var t_ao: texture_2d<f32>;
@group(1) @binding(8) var s_ao: sampler;

struct VSIn {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
};

struct VSOut {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPosition: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
};

struct FSIn {
  @builtin(position) position: vec4<f32>,
  @builtin(front_facing) frontFacing: bool,
  @location(0) worldPosition: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) color: vec3<f32>,
};
`;

// -------------------------------------------------------------------- math --

/** Constants and helpers; mirrors the GLSL chunks one-for-one. */
const WGSL_MATH = /* wgsl */ `
const PI: f32 = 3.141592653589793;
const RECIPROCAL_PI: f32 = 0.3183098861837907;
const EPSILON: f32 = 1e-6;

fn saturate(x: f32) -> f32 {
  return clamp(x, 0.0, 1.0);
}

fn saturate3(x: vec3<f32>) -> vec3<f32> {
  return clamp(x, vec3<f32>(0.0), vec3<f32>(1.0));
}

fn mini3dLuminance(c: vec3<f32>) -> f32 {
  return dot(c, vec3<f32>(0.2126, 0.7152, 0.0722));
}

fn linearToSrgb(c: vec3<f32>) -> vec3<f32> {
  let low = c * 12.92;
  let high = pow(max(c, vec3<f32>(0.0)), vec3<f32>(0.41666)) * 1.055 - vec3<f32>(0.055);
  return select(high, low, c <= vec3<f32>(0.0031308));
}

fn srgbToLinear(c: vec3<f32>) -> vec3<f32> {
  let low = c * 0.0773993808;
  let high = pow((c + vec3<f32>(0.055)) * 0.9478672986, vec3<f32>(2.4));
  return select(high, low, c <= vec3<f32>(0.04045));
}

fn acesFilmicToneMapping(colorIn: vec3<f32>) -> vec3<f32> {
  let acesInput = mat3x3<f32>(
    vec3<f32>(0.59719, 0.07600, 0.02840),
    vec3<f32>(0.35458, 0.90834, 0.13383),
    vec3<f32>(0.04823, 0.01566, 0.83777),
  );
  let acesOutput = mat3x3<f32>(
    vec3<f32>(1.60475, -0.10208, -0.00327),
    vec3<f32>(-0.53108, 1.10813, -0.07276),
    vec3<f32>(-0.07367, -0.00605, 1.07602),
  );
  var color = colorIn * (1.0 / 0.6);
  color = acesInput * color;
  let a = color * (color + vec3<f32>(0.0245786)) - vec3<f32>(0.000090537);
  let b = color * (0.983729 * color + vec3<f32>(0.4329510)) + vec3<f32>(0.238081);
  color = acesOutput * (a / b);
  return saturate3(color);
}

fn reinhardToneMapping(color: vec3<f32>) -> vec3<f32> {
  return saturate3(color / (color + vec3<f32>(1.0)));
}

fn cineonToneMapping(colorIn: vec3<f32>) -> vec3<f32> {
  let color = max(vec3<f32>(0.0), colorIn - vec3<f32>(0.004));
  return saturate3(
    (color * (6.2 * color + vec3<f32>(0.5))) / (color * (6.2 * color + vec3<f32>(1.7)) + vec3<f32>(0.06))
  );
}

fn directionalLightDirection(i: i32) -> vec3<f32> {
  return frame.directionalData[i * 2].xyz;
}

fn directionalLightColor(i: i32) -> vec3<f32> {
  return frame.directionalData[i * 2 + 1].rgb;
}

fn pointLightPosition(i: i32) -> vec3<f32> {
  return frame.pointData[i * 2].xyz;
}

fn pointLightColorDistance(i: i32) -> vec4<f32> {
  return frame.pointData[i * 2 + 1];
}

fn spotLightPosition(i: i32) -> vec3<f32> {
  return frame.spotData[i * 4].xyz;
}

fn spotLightDirection(i: i32) -> vec3<f32> {
  return frame.spotData[i * 4 + 1].xyz;
}

fn spotLightColorDistance(i: i32) -> vec4<f32> {
  return frame.spotData[i * 4 + 2];
}

fn spotLightCosines(i: i32) -> vec2<f32> {
  return frame.spotData[i * 4 + 3].xy;
}

fn distanceAttenuation(lightDistance: f32, cutoffDistance: f32) -> f32 {
  var attenuation = 1.0 / max(lightDistance * lightDistance, 1e-4);
  if (cutoffDistance > 0.0) {
    let falloff = saturate(1.0 - lightDistance / cutoffDistance);
    attenuation = attenuation * falloff * falloff;
  }
  return attenuation;
}

fn irradianceFromLights(worldPosition: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
  var irradiance = frame.ambientColor.rgb;
  irradiance = irradiance + mix(frame.hemisphereGround.rgb, frame.hemisphereSky.rgb, normal.y * 0.5 + 0.5);

  let directionalCount = i32(frame.directionalCounts.x);
  for (var i = 0; i < directionalCount; i = i + 1) {
    let lightDirection = normalize(-directionalLightDirection(i));
    irradiance = irradiance + directionalLightColor(i) * max(dot(normal, lightDirection), 0.0);
  }

  let pointCount = i32(frame.directionalCounts.y);
  for (var i = 0; i < pointCount; i = i + 1) {
    let toLight = pointLightPosition(i) - worldPosition;
    let lightDistance = length(toLight);
    let lightDirection = toLight / max(lightDistance, 1e-4);
    let colorDistance = pointLightColorDistance(i);
    let attenuation = distanceAttenuation(lightDistance, colorDistance.a);
    irradiance = irradiance + colorDistance.rgb * max(dot(normal, lightDirection), 0.0) * attenuation;
  }

  let spotCount = i32(frame.directionalCounts.z);
  for (var i = 0; i < spotCount; i = i + 1) {
    let toLight = spotLightPosition(i) - worldPosition;
    let lightDistance = length(toLight);
    let lightDirection = toLight / max(lightDistance, 1e-4);
    let cosAngle = dot(-lightDirection, normalize(spotLightDirection(i)));
    let cosines = spotLightCosines(i);
    let spotFactor = smoothstep(cosines.x, cosines.y, cosAngle);
    let colorDistance = spotLightColorDistance(i);
    let attenuation = spotFactor / max(lightDistance * lightDistance, 1e-4);
    irradiance = irradiance + colorDistance.rgb * max(dot(normal, lightDirection), 0.0) * attenuation;
  }

  return max(irradiance, vec3<f32>(0.0));
}

fn dGGX(roughness: f32, dotNH: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let d = dotNH * dotNH * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-7);
}

fn vSmithGGXCorrelated(roughness: f32, dotNV: f32, dotNL: f32) -> f32 {
  let a2 = roughness * roughness * roughness * roughness;
  let lambdaV = dotNL * sqrt(dotNV * dotNV * (1.0 - a2) + a2);
  let lambdaL = dotNV * sqrt(dotNL * dotNL * (1.0 - a2) + a2);
  return 0.5 / max(lambdaV + lambdaL, 1e-7);
}

fn fSchlick(f0: vec3<f32>, dotVH: f32) -> vec3<f32> {
  let fresnel = exp2((-5.55473 * dotVH - 6.98316) * dotVH);
  return f0 * (1.0 - fresnel) + vec3<f32>(fresnel);
}
`;

/** Depth packing, only emitted into the `depth` fragment shader on request. */
const WGSL_PACKING = /* wgsl */ `
fn packDepthToRGBA(depth: f32) -> vec4<f32> {
  let packFactors = vec3<f32>(256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
  let shiftRight8 = 1.0 / 256.0;
  var packed = vec4<f32>(fract(depth * packFactors), depth);
  packed = vec4<f32>(
    packed.x,
    packed.y - packed.x * shiftRight8,
    packed.z - packed.y * shiftRight8,
    packed.w - packed.z * shiftRight8
  );
  return packed * (256.0 / 255.0);
}
`;

// ------------------------------------------------------------ code pieces --

type LitModel = 'lambert' | 'phong' | 'physical';

/** Statements that accumulate one light, given `lightColor`/`lightDirection`. */
function directLightBody(model: LitModel, attenuation: string): string {
  if (model === 'lambert') {
    return `    directDiffuse = directDiffuse + lightColor * albedo * dotNL * (${attenuation});`;
  }
  if (model === 'phong') {
    return `    directDiffuse = directDiffuse + lightColor * albedo * dotNL * (${attenuation});
    let halfDir = normalize(lightDirection + viewDir);
    let dotNH = saturate(dot(normal, halfDir));
    directSpecular = directSpecular + lightColor * specularColor * pow(dotNH, max(shininess, 1.0)) * (${attenuation});`;
  }
  return `    let halfDir = normalize(lightDirection + viewDir);
    let dotNV = saturate(dot(normal, viewDir));
    let dotNH = saturate(dot(normal, halfDir));
    let dotVH = saturate(dot(viewDir, halfDir));
    let fresnel = fSchlick(f0, dotVH);
    let distribution = dGGX(max(roughness, 0.045), dotNH);
    let visibility = vSmithGGXCorrelated(max(roughness, 0.045), dotNV, dotNL);
    let specularTerm = fresnel * distribution * visibility;
    let kd = vec3<f32>(1.0) - fresnel;
    directDiffuse = directDiffuse + lightColor * kd * diffuseTerm * RECIPROCAL_PI * dotNL * (${attenuation});
    directSpecular = directSpecular + lightColor * specularTerm * dotNL * (${attenuation});`;
}

/**
 * Direct lighting loops over the packed light arrays.
 *
 * Requires `albedo`, `normal`, `viewDir`, `var directDiffuse`,
 * `var directSpecular` and — for `phong` — `specularColor`/`shininess`, for
 * `physical` — `diffuseTerm`/`f0`/`roughness`.
 */
function directLighting(model: LitModel): string {
  const guardOpen = model === 'physical' ? '\n    if (dotNL > 0.0) {' : '';
  const guardClose = model === 'physical' ? '\n    }' : '';
  const directional = `  let directionalCount = i32(frame.directionalCounts.x);
  for (var i = 0; i < directionalCount; i = i + 1) {
    let lightColor = directionalLightColor(i);
    let lightDirection = normalize(-directionalLightDirection(i));
    let dotNL = saturate(dot(normal, lightDirection));${guardOpen}
${directLightBody(model, '1.0')}${guardClose}
  }`;
  const point = `  let pointCount = i32(frame.directionalCounts.y);
  for (var i = 0; i < pointCount; i = i + 1) {
    let toLight = pointLightPosition(i) - input.worldPosition;
    let lightDistance = length(toLight);
    let lightDirection = toLight / max(lightDistance, 1e-4);
    let dotNL = saturate(dot(normal, lightDirection));
    let colorDistance = pointLightColorDistance(i);
    let lightColor = colorDistance.rgb;
    let attenuation = distanceAttenuation(lightDistance, colorDistance.a);${guardOpen}
${directLightBody(model, 'attenuation')}${guardClose}
  }`;
  const spot = `  let spotCount = i32(frame.directionalCounts.z);
  for (var i = 0; i < spotCount; i = i + 1) {
    let toLight = spotLightPosition(i) - input.worldPosition;
    let lightDistance = length(toLight);
    let lightDirection = toLight / max(lightDistance, 1e-4);
    let dotNL = saturate(dot(normal, lightDirection));
    let cosAngle = dot(-lightDirection, normalize(spotLightDirection(i)));
    let cosines = spotLightCosines(i);
    let spotFactor = smoothstep(cosines.x, cosines.y, cosAngle);
    let colorDistance = spotLightColorDistance(i);
    let lightColor = colorDistance.rgb;
    let attenuation = spotFactor / max(lightDistance * lightDistance, 1e-4);${guardOpen}
${directLightBody(model, 'attenuation')}${guardClose}
  }`;
  return `${directional}\n${point}\n${spot}`;
}

/** Base colour / opacity, optional diffuse map + AO map, alpha test. */
function surfaceSetup(options: WgslMaterialOptions): string {
  const lines = [
    '  var albedo = object.diffuse.rgb * input.color;',
    '  var alpha = object.roughnessMetalness.z;',
  ];
  if (options.useMap) {
    lines.push('  let sampledDiffuse = textureSample(t_diffuse, s_diffuse, input.uv);');
    lines.push('  albedo = albedo * sampledDiffuse.rgb;');
    lines.push('  alpha = alpha * sampledDiffuse.a;');
  }
  if (options.useAoMap) {
    lines.push('  albedo = albedo * textureSample(t_ao, s_ao, input.uv).r;');
  }
  lines.push('  if (alpha < object.flags.x) {');
  lines.push('    discard;');
  lines.push('  }');
  return lines.join('\n');
}

/** Shading normal (+ optional flip / tangent-space normal map / flat shading). */
function normalSetup(options: WgslMaterialOptions): string {
  const lines: string[] = [];
  if (options.flatShading) {
    lines.push(
      '  var normal = normalize(cross(dpdx(input.worldPosition), dpdy(input.worldPosition)));',
    );
  } else {
    lines.push('  var normal = normalize(input.normal);');
  }
  if (options.doubleSided) {
    lines.push('  if (!input.frontFacing) {');
    lines.push('    normal = -normal;');
    lines.push('  }');
  }
  if (options.useNormalMap) {
    lines.push('  let q0 = dpdx(input.worldPosition);');
    lines.push('  let q1 = dpdy(input.worldPosition);');
    lines.push('  let st0 = dpdx(input.uv);');
    lines.push('  let st1 = dpdy(input.uv);');
    lines.push('  let tangentS = normalize(q0 * st1.y - q1 * st0.y);');
    lines.push('  let tangentT = normalize(-q0 * st1.x + q1 * st0.x);');
    lines.push(
      '  let mapN = textureSample(t_normal, s_normal, input.uv).xyz * 2.0 - vec3<f32>(1.0);',
    );
    lines.push('  let tsn = mat3x3<f32>(tangentS, tangentT, normal);');
    lines.push('  normal = normalize(tsn * mapN);');
  }
  return lines.join('\n');
}

/** Tonemapping + output transfer + fog, applied to the local `outgoing`. */
function outputTail(options: WgslMaterialOptions): string {
  const lines: string[] = [];
  const mode = options.toneMapping ?? 'none';
  if (mode !== 'none') {
    const fn =
      mode === 'linear'
        ? 'saturate3'
        : mode === 'reinhard'
          ? 'reinhardToneMapping'
          : mode === 'cineon'
            ? 'cineonToneMapping'
            : 'acesFilmicToneMapping';
    lines.push(`  outgoing = ${fn}(outgoing);`);
  }
  if (options.srgbOutput) {
    lines.push('  outgoing = linearToSrgb(outgoing);');
  }
  const fogFactor = options.fogExp2
    ? '1.0 - exp(-frame.fogParams.w * frame.fogParams.w * viewDepth * viewDepth)'
    : 'smoothstep(frame.fogParams.x, frame.fogParams.y, viewDepth)';
  lines.push('  if (frame.fogParams.z > 0.5) {');
  lines.push(`    let fogFactor = clamp(${fogFactor}, 0.0, 1.0);`);
  lines.push('    outgoing = mix(outgoing, frame.fogColor.rgb, fogFactor);');
  lines.push('  }');
  return lines.join('\n');
}

/** `viewPosition` / `viewDir` / `viewDepth` come from the world position. */
const VIEW_SETUP = /* wgsl */ `  let viewPosition = (frame.viewMatrix * vec4<f32>(input.worldPosition, 1.0)).xyz;
  let viewDepth = -viewPosition.z;
  let viewDir = normalize(frame.cameraPosition.xyz - input.worldPosition);`;

// ---------------------------------------------------------------- vertex ----

/** Vertex stage; identical for every program (points are 1px in WebGPU). */
function vertexSource(options: WgslMaterialOptions): string {
  const colorExpression = options.vertexColors ? 'input.color' : 'vec3<f32>(1.0)';
  return `${WGSL_PRELUDE}${WGSL_MATH}
@vertex
fn vs_main(input: VSIn) -> VSOut {
  var output: VSOut;
  let uvTransform = mat3x3<f32>(
    object.uvTransform[0].xyz,
    object.uvTransform[1].xyz,
    object.uvTransform[2].xyz,
  );
  let worldPosition = object.modelMatrix * vec4<f32>(input.position, 1.0);
  let viewPosition = frame.viewMatrix * worldPosition;
  output.position = frame.projectionMatrix * viewPosition;
  output.worldPosition = worldPosition.xyz;
  output.normal = normalize((object.normalMatrix * vec4<f32>(input.normal, 0.0)).xyz);
  output.uv = (uvTransform * vec3<f32>(input.uv, 1.0)).xy;
  output.color = ${colorExpression};
  return output;
}
`;
}

// -------------------------------------------------------------- fragment ----

function emissiveExpression(options: WgslMaterialOptions): string {
  return options.useEmissiveMap
    ? 'object.emissive.rgb * textureSample(t_emissive, s_emissive, input.uv).rgb'
    : 'object.emissive.rgb';
}

function unlitFragment(options: WgslMaterialOptions): string {
  return `@fragment
fn fs_main(input: FSIn) -> @location(0) vec4<f32> {
${surfaceSetup(options)}
  var outgoing = albedo;
${VIEW_SETUP}
${outputTail(options)}
  return vec4<f32>(outgoing, alpha);
}
`;
}

function litFragment(kind: LitModel, options: WgslMaterialOptions): string {
  const modelUniforms: string[] = [
    '  var directDiffuse = vec3<f32>(0.0);',
    '  var directSpecular = vec3<f32>(0.0);',
  ];
  if (kind === 'phong') {
    modelUniforms.push('  let specularColor = object.specularShininess.rgb;');
    modelUniforms.push('  let shininess = object.specularShininess.a;');
  }
  if (kind === 'physical') {
    modelUniforms.push('  let metalness = clamp(object.roughnessMetalness.y, 0.0, 1.0);');
    modelUniforms.push('  let roughness = object.roughnessMetalness.x;');
    modelUniforms.push('  let diffuseTerm = albedo * (1.0 - metalness);');
    modelUniforms.push('  let f0 = mix(vec3<f32>(0.04), albedo, metalness);');
  }
  const indirectAlbedo = kind === 'physical' ? 'diffuseTerm' : 'albedo';
  return `@fragment
fn fs_main(input: FSIn) -> @location(0) vec4<f32> {
${surfaceSetup(options)}
${normalSetup(options)}
  var totalEmissiveRadiance = ${emissiveExpression(options)};
${VIEW_SETUP}
${modelUniforms.join('\n')}
${directLighting(kind)}
  let irradiance = irradianceFromLights(input.worldPosition, normal);
  let indirectDiffuse = irradiance * ${indirectAlbedo} * RECIPROCAL_PI;
  var outgoing = directDiffuse + directSpecular + indirectDiffuse + totalEmissiveRadiance;
${outputTail(options)}
  return vec4<f32>(outgoing, alpha);
}
`;
}

function normalFragment(options: WgslMaterialOptions): string {
  return `@fragment
fn fs_main(input: FSIn) -> @location(0) vec4<f32> {
${normalSetup(options)}
  let alpha = object.roughnessMetalness.z;
  var outgoing = normal * 0.5 + vec3<f32>(0.5);
${VIEW_SETUP}
${outputTail(options)}
  return vec4<f32>(outgoing, alpha);
}
`;
}

function depthFragment(options: WgslMaterialOptions): string {
  const packing = options.depthPacking === 'rgba';
  return `${packing ? WGSL_PACKING : ''}@fragment
fn fs_main(input: FSIn) -> @location(0) vec4<f32> {
  let alpha = object.roughnessMetalness.z;
  let depth = 1.0 - input.position.z;
${packing ? '  return vec4<f32>(packDepthToRGBA(depth).rgb, alpha);' : '  return vec4<f32>(vec3<f32>(depth), alpha);'}
}
`;
}

function fragmentSource(kind: WgslShaderLibName, options: WgslMaterialOptions): string {
  const head = WGSL_PRELUDE + WGSL_MATH;
  switch (kind) {
    case 'basic':
    case 'line':
    case 'points':
      return head + unlitFragment(options);
    case 'lambert':
      return head + litFragment('lambert', options);
    case 'phong':
      return head + litFragment('phong', options);
    case 'standard':
      return head + litFragment('physical', options);
    case 'normal':
      return head + normalFragment(options);
    case 'depth':
      return head + depthFragment(options);
  }
}

// ------------------------------------------------------------------ public --

/** Builds the vertex source for `kind` with the given feature set. */
export function buildWgslVertexShader(
  _kind: WgslShaderLibName,
  options: WgslMaterialOptions = {},
): string {
  return vertexSource(options);
}

/** Builds the fragment source for `kind` with the given feature set. */
export function buildWgslFragmentShader(
  kind: WgslShaderLibName,
  options: WgslMaterialOptions = {},
): string {
  return fragmentSource(kind, options);
}

/** Builds both stages for `kind` with the given feature set. */
export function buildWgslShader(
  kind: WgslShaderLibName,
  options: WgslMaterialOptions = {},
): WgslShaderEntry {
  return {
    vertexShader: vertexSource(options),
    fragmentShader: fragmentSource(kind, options),
  };
}

/**
 * The default (all-features-off) program for every built-in material kind.
 *
 * Materials that use a diffuse/normal/emissive map, vertex colours, flat
 * shading, tone mapping, sRGB output or RGBA depth packing must go through
 * `buildWgslShader()` instead.
 */
export const WgslLib: Record<WgslShaderLibName, WgslShaderEntry> = {
  basic: buildWgslShader('basic'),
  lambert: buildWgslShader('lambert'),
  phong: buildWgslShader('phong'),
  standard: buildWgslShader('standard'),
  normal: buildWgslShader('normal'),
  depth: buildWgslShader('depth'),
  line: buildWgslShader('line'),
  points: buildWgslShader('points'),
};

/** Alias kept for symmetry with `ShaderLib`. */
export const WgslShaderLib = WgslLib;

/**
 * Cheap structural self-check used by the test suite and by the backend while
 * wiring pipelines: it does not parse WGSL, but it catches the mistakes that
 * string concatenation makes possible (missing entry points, GLSL tokens
 * leaking in, undeclared struct references).
 */
export function validateWgslSources(): string[] {
  const problems: string[] = [];

  for (const [kind, entry] of Object.entries(WgslLib)) {
    if (!entry.vertexShader.includes('@vertex') || !entry.vertexShader.includes('fn vs_main(')) {
      problems.push(`${kind}: vertex source is missing \`@vertex fn vs_main\``);
    }
    if (
      !entry.fragmentShader.includes('@fragment') ||
      !entry.fragmentShader.includes('fn fs_main(')
    ) {
      problems.push(`${kind}: fragment source is missing \`@fragment fn fs_main\``);
    }
    for (const [stage, source] of [
      ['vertex', entry.vertexShader],
      ['fragment', entry.fragmentShader],
    ] as const) {
      for (const [label, pattern] of GLSL_LEAK_PATTERNS) {
        if (pattern.test(source)) problems.push(`${kind}.${stage}: leaked GLSL token "${label}"`);
      }
      for (const structName of referencedStructs(source)) {
        if (!source.includes(`struct ${structName} `)) {
          problems.push(`${kind}.${stage}: struct "${structName}" used but not declared`);
        }
      }
    }
  }

  return problems;
}

/** GLSL-only spellings that must never survive into a WGSL source string. */
const GLSL_LEAK_PATTERNS: Array<[string, RegExp]> = [
  ['gl_FragColor', /gl_FragColor/],
  ['texture2D', /texture2D/],
  ['textureCube', /textureCube/],
  ['gl_Position', /gl_Position/],
  ['gl_PointSize', /gl_PointSize/],
  ['gl_PointCoord', /gl_PointCoord/],
  ['varying', /\bvarying\b/],
  ['uniform declaration', /(?:^|[^\w<>])uniform\b/],
  ['vecN (must be vecN<f32>)', /\bvec[234]\b(?!\s*<)/],
  ['matN (must be matNxM<f32>)', /\bmat[234]\b(?!\s*x\d\s*<)/],
  ['sampler2D', /sampler2D/],
];

/** Struct names a source refers to through a declaration or a constructor. */
function referencedStructs(source: string): string[] {
  const found = new Set<string>();
  const pattern = /\b(FrameUniforms|ObjectUniforms|VSIn|VSOut|FSIn)\b/g;
  let match = pattern.exec(source);
  while (match !== null) {
    found.add(match[1]);
    match = pattern.exec(source);
  }
  return Array.from(found);
}

/** Convenience map from `MaterialKind` values to WGSL program names. */
export const WGSL_KIND_BY_MATERIAL_KIND: Record<string, WgslShaderLibName | null> = {
  basic: 'basic',
  lambert: 'lambert',
  phong: 'phong',
  standard: 'standard',
  normal: 'normal',
  depth: 'depth',
  line: 'line',
  points: 'points',
  shader: null,
  'raw-shader': null,
};
