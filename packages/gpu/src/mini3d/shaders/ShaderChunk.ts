/**
 * GLSL chunk registry for the WebGL1 / WebGL2 backends.
 *
 * Chunks are written in GLSL ES 1.00 dialect. The program builder rewrites
 * `attribute`/`varying`/`gl_FragColor` when the material requests GLSL ES 3.00
 * (see `WebGLProgram.buildPrefix` / `compat*`), so each chunk has exactly one
 * authoring dialect.
 *
 * Naming contract used by every chunk (also honoured by `WgslLib`):
 *   attributes : position, normal, uv, color
 *   varyings   : vUv, vColor, vNormal (view space), vViewPosition, vFogDepth
 *   uniforms   : modelMatrix, modelViewMatrix, projectionMatrix, viewMatrix,
 *                normalMatrix, cameraPosition, uvTransform,
 *                diffuse, opacity, emissive, specular, shininess, roughness,
 *                metalness, normalScale, diffuseMap, alphaMap, emissiveMap,
 *                specularMap, roughnessMap, metalnessMap, normalMap, aoMap,
 *                ambientLightColor, hemisphereLight*, numDirectionalLights,
 *                numPointLights, numSpotLights, *LightsData[]
 */
export const ShaderChunk: Record<string, string> = {
  // ------------------------------------------------------------------ common --
  common: /* glsl */ `
#ifndef MINI3D_COMMON
#define MINI3D_COMMON
const float PI = 3.141592653589793;
const float RECIPROCAL_PI = 0.3183098861837907;
const float MINI3D_EPSILON = 1e-6;
float pow2(const in float x) { return x * x; }
vec3 pow2(const in vec3 x) { return x * x; }
float saturate(const in float x) { return clamp(x, 0.0, 1.0); }
vec3 saturate(const in vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }
float mini3dLuminance(const in vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
mat3 transposeMat3(const in mat3 m) {
  return mat3(m[0].x, m[1].x, m[2].x, m[0].y, m[1].y, m[2].y, m[0].z, m[1].z, m[2].z);
}
/**
 * Insertion point for the tangent-space normal-map helper.
 *
 * Some drivers (notably ANGLE on Intel under WebGL1) type-check dFdx/dFdy even
 * when the enclosing #ifdef is undefined, so derivative code must never be
 * present in the source at all. The program builder therefore splices the
 * helper in here only when the context can compile derivatives.
 */
void mini3dShaderPassthrough() {}
#endif
`,

  // ------------------------------------------------------- vertex plumbing ----
  uv_pars_vertex: /* glsl */ `
#ifdef USE_UV
varying vec2 vUv;
#endif
`,
  uv_pars_fragment: /* glsl */ `
#ifdef USE_UV
varying vec2 vUv;
#endif
`,
  uv_vertex: /* glsl */ `
#ifdef USE_UV
vUv = (uvTransform * vec3(uv, 1.0)).xy;
#endif
`,
  color_pars_vertex: /* glsl */ `
#ifdef USE_COLOR
varying vec3 vColor;
#endif
`,
  color_vertex: /* glsl */ `
#ifdef USE_COLOR
vColor = color;
#endif
`,
  normal_pars_vertex: /* glsl */ `
#ifndef FLAT_SHADED
varying vec3 vNormal;
#else
// Flat shading drops the interpolated normal. Screen-space derivatives would
// give a true per-face normal, but WebGL1 cannot portably compile dFdx/dFdy,
// so the per-vertex geometric normal is carried instead.
varying vec3 vFlatNormal;
#endif
`,
  normal_pars_fragment: /* glsl */ `
#ifndef FLAT_SHADED
varying vec3 vNormal;
#else
varying vec3 vFlatNormal;
#endif
`,
  /**
   * Retained for API parity with the chunk naming used by three.js. The
   * `vFlatNormal` declaration lives in `normal_pars_vertex`, which every
   * program actually includes.
   */
  normal_viewspace_vertex: /* glsl */ ``,
  beginnormal_vertex: /* glsl */ `
vec3 objectNormal = vec3(normal);
#ifdef USE_TANGENT
vec3 objectTangent = vec3(tangent);
#endif
`,
  defaultnormal_vertex: /* glsl */ `
vec3 transformedNormal = normalMatrix * objectNormal;
`,
  normal_vertex: /* glsl */ `
#ifdef FLAT_SHADED
vFlatNormal = normalize(transformedNormal);
#else
vNormal = normalize(transformedNormal);
#endif
`,
  begin_vertex: /* glsl */ `
vec3 transformed = vec3(position);
#ifdef USE_DISPLACEMENTMAP
transformed += normalize(objectNormal) * texture2D(displacementMap, uv).x * displacementScale;
#endif
`,
  project_vertex: /* glsl */ `
vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
gl_Position = projectionMatrix * mvPosition;
`,
  logdepthbuf_pars_vertex: /* glsl */ ``,
  logdepthbuf_vertex: /* glsl */ ``,
  clipping_planes_pars_vertex: /* glsl */ ``,
  clipping_planes_vertex: /* glsl */ ``,
  worldpos_vertex: /* glsl */ `
vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
`,
  fog_pars_vertex: /* glsl */ `
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,
  fog_vertex: /* glsl */ `
#ifdef USE_FOG
vFogDepth = -mvPosition.z;
#endif
`,
  morphtarget_pars_vertex: /* glsl */ ``,
  morphtarget_vertex: /* glsl */ ``,
  skinning_pars_vertex: /* glsl */ ``,
  skinning_vertex: /* glsl */ ``,

  // ----------------------------------------------------- fragment plumbing --
  common_fragment: /* glsl */ ``,
  precision_fragment: /* glsl */ ``,
  color_pars_fragment: /* glsl */ `
#ifdef USE_COLOR
varying vec3 vColor;
#endif
`,
  color_fragment: /* glsl */ `
#ifdef USE_COLOR
diffuseColor.rgb *= vColor;
#endif
`,
  alphamap_pars_fragment: /* glsl */ `
#ifdef USE_ALPHAMAP
uniform sampler2D alphaMap;
#endif
`,
  alphamap_fragment: /* glsl */ `
#ifdef USE_ALPHAMAP
diffuseColor.a *= texture2D(alphaMap, vUv).g;
#endif
`,
  alphatest_fragment: /* glsl */ `
#ifdef USE_ALPHATEST
if (diffuseColor.a < alphaTest) discard;
#endif
`,
  map_pars_fragment: /* glsl */ `
#ifdef USE_MAP
uniform sampler2D diffuseMap;
#endif
`,
  map_fragment: /* glsl */ `
#ifdef USE_MAP
vec4 sampledDiffuseColor = texture2D(diffuseMap, vUv);
diffuseColor *= sampledDiffuseColor;
#endif
`,
  normalmap_pars_fragment: /* glsl */ `
#ifdef USE_NORMALMAP
uniform sampler2D normalMap;
uniform vec2 normalScale;
#endif
`,
  /**
   * Tangent-space normal-map perturbation. Spliced in by `GLProgram` only when
   * the context can compile `dFdx`/`dFdy`, because some drivers type-check
   * derivative built-ins inside an inactive `#ifdef` block.
   */
  normalmap_perturb_fragment: /* glsl */ `
vec3 perturbNormal2Arb(const in vec3 eyePos, const in vec3 surfNorm) {
  vec3 q0 = dFdx(eyePos.xyz);
  vec3 q1 = dFdy(eyePos.xyz);
  vec2 st0 = dFdx(vUv.st);
  vec2 st1 = dFdy(vUv.st);
  vec3 S = normalize(q0 * st1.t - q1 * st0.t);
  vec3 T = normalize(-q0 * st1.s + q1 * st0.s);
  vec3 N = normalize(surfNorm);
  mat3 tsn = mat3(S, T, N);
  vec3 mapN = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
  mapN.xy *= normalScale;
  return normalize(tsn * mapN);
}
`,
/**
 * The view-space shading normal, shared by every lit program.
 *
 * `vWorldPosition` is the varying the vertex stage always writes, so the
 * normal-map perturbation can rely on it.
 */
normal_fragment: /* glsl */ `
#ifdef FLAT_SHADED
vec3 normal = normalize(vFlatNormal);
#else
vec3 normal = normalize(vNormal);
#endif
#ifdef DOUBLE_SIDED
normal *= gl_FrontFacing ? 1.0 : -1.0;
#endif
#ifdef USE_NORMALMAP
normal = perturbNormal2Arb(vWorldPosition, normal);
#endif
`,
  emissivemap_pars_fragment: /* glsl */ `
#ifdef USE_EMISSIVEMAP
uniform sampler2D emissiveMap;
#endif
`,
  emissivemap_fragment: /* glsl */ `
#ifdef USE_EMISSIVEMAP
totalEmissiveRadiance *= texture2D(emissiveMap, vUv).rgb;
#endif
`,
  specularmap_pars_fragment: /* glsl */ `
#ifdef USE_SPECULARMAP
uniform sampler2D specularMap;
#endif
`,
  specularmap_fragment: /* glsl */ `
float specularStrength = 1.0;
#ifdef USE_SPECULARMAP
specularStrength = texture2D(specularMap, vUv).r;
#endif
`,
  roughnessmap_pars_fragment: /* glsl */ `
#ifdef USE_ROUGHNESSMAP
uniform sampler2D roughnessMap;
#endif
`,
  roughnessmap_fragment: /* glsl */ `
#ifdef USE_ROUGHNESSMAP
roughnessFactor *= texture2D(roughnessMap, vUv).g;
#endif
`,
  metalnessmap_pars_fragment: /* glsl */ `
#ifdef USE_METALNESSMAP
uniform sampler2D metalnessMap;
#endif
`,
  metalnessmap_fragment: /* glsl */ `
#ifdef USE_METALNESSMAP
metalnessFactor *= texture2D(metalnessMap, vUv).b;
#endif
`,
  aomap_pars_fragment: /* glsl */ `
#ifdef USE_AOMAP
uniform sampler2D aoMap;
#endif
`,
  aomap_fragment: /* glsl */ `
#ifdef USE_AOMAP
float ambientOcclusion = texture2D(aoMap, vUv).r;
reflectedLight.indirectDiffuse *= ambientOcclusion;
#endif
`,
  envmap_pars_fragment: /* glsl */ ``,
  envmap_fragment: /* glsl */ ``,

  // --------------------------------------------------------------- lighting --
  lights_pars_begin: /* glsl */ `
uniform vec3 ambientLightColor;
uniform vec3 hemisphereLightSkyColor;
uniform vec3 hemisphereLightGroundColor;
uniform vec3 hemisphereLightUp;
uniform int numDirectionalLights;
uniform int numPointLights;
uniform int numSpotLights;
`,
  lights_pars_fragment: /* glsl */ `
struct IncidentLight {
  vec3 color;
  vec3 direction;
  vec3 position;
  float attenuation;
  float spotAttenuation;
};
struct ReflectedLight {
  vec3 directDiffuse;
  vec3 directSpecular;
  vec3 indirectDiffuse;
  vec3 indirectSpecular;
};
struct GeometricContext {
  vec3 position;
  vec3 normal;
  vec3 viewDir;
};
`,
  lights_lambert_fragment: /* glsl */ `
/**
 * GLSL ES 1.00 only permits array indexing with a "constant-index-expression",
 * which excludes function parameters. Light lookups therefore happen inside
 * macros: the array index is then the enclosing for-loop's constant counter at
 * the point of expansion. (Indexing a light array from inside a helper function
 * fails to compile on a real driver.)
 *
 * MINI3D_ACCUM_LIGHT expects the surrounding scope to define an IncidentLight
 * named directLight; the world position comes from the vWorldPosition varying,
 * which every built-in fragment shader declares.
 */
#ifndef MINI3D_ACCUM_LIGHT
#define MINI3D_ACCUM_LIGHT(TYPE, INDEX) \
  if (TYPE == 0) { \
    directLight.direction = normalize(-directionalLightsData[(INDEX) * 2].xyz); \
    directLight.color = directionalLightsData[(INDEX) * 2 + 1].rgb; \
    directLight.attenuation = 1.0; \
  } else if (TYPE == 1) { \
    vec3 mini3dToLight = pointLightsData[(INDEX) * 2].xyz - vWorldPosition; \
    float mini3dDist = length(mini3dToLight); \
    vec4 mini3dColorDistance = pointLightsData[(INDEX) * 2 + 1]; \
    directLight.direction = mini3dToLight / max(mini3dDist, 1e-4); \
    directLight.color = mini3dColorDistance.rgb; \
    directLight.attenuation = 1.0 / max(mini3dDist * mini3dDist, 1e-4); \
    if (mini3dColorDistance.a > 0.0) { \
      directLight.attenuation *= pow(saturate(1.0 - mini3dDist / mini3dColorDistance.a), 2.0); \
    } \
  } else { \
    vec3 mini3dToLight = spotLightsData[(INDEX) * 4].xyz - vWorldPosition; \
    float mini3dDist = length(mini3dToLight); \
    vec4 mini3dColorDistance = spotLightsData[(INDEX) * 4 + 2]; \
    directLight.direction = mini3dToLight / max(mini3dDist, 1e-4); \
    directLight.color = mini3dColorDistance.rgb; \
    directLight.attenuation = 1.0 / max(mini3dDist * mini3dDist, 1e-4); \
    vec2 mini3dCosines = spotLightsData[(INDEX) * 4 + 3].xy; \
    float mini3dCosAngle = dot(-directLight.direction, \
      normalize(spotLightsData[(INDEX) * 4 + 1].xyz)); \
    directLight.attenuation *= smoothstep(mini3dCosines.x, mini3dCosines.y, mini3dCosAngle); \
  }
#endif

/** Ambient + hemisphere term; no light-array indexing, so a function is fine. */
vec3 irradianceAmbient(const in vec3 normal) {
  return ambientLightColor
    + mix(hemisphereLightGroundColor, hemisphereLightSkyColor, normal.y * 0.5 + 0.5);
}

void RE_Direct_Lambert(
  const in IncidentLight directLight,
  const in GeometricContext geometry,
  const in vec3 diffuseColor,
  inout ReflectedLight reflectedLight
) {
  float dotNL = saturate(dot(geometry.normal, directLight.direction));
  reflectedLight.directDiffuse += directLight.color * diffuseColor * dotNL * directLight.attenuation;
}

vec3 BRDF_Lambert(const in vec3 diffuseColor) {
  return RECIPROCAL_PI * diffuseColor;
}
`,
  lights_phong_fragment: /* glsl */ `
void RE_Direct_Phong(
  const in IncidentLight directLight,
  const in GeometricContext geometry,
  const in vec3 diffuseColor,
  const in vec3 specularColor,
  const in float shininess,
  inout ReflectedLight reflectedLight
) {
  float dotNL = saturate(dot(geometry.normal, directLight.direction));
  vec3 halfDir = normalize(directLight.direction + geometry.viewDir);
  float dotNH = saturate(dot(geometry.normal, halfDir));
  float specularStrength = pow(dotNH, max(shininess, 1.0));
  reflectedLight.directDiffuse += directLight.color * diffuseColor * dotNL * directLight.attenuation;
  reflectedLight.directSpecular += directLight.color * specularColor * specularStrength * directLight.attenuation;
}

vec3 BRDF_Phong(const in vec3 diffuseColor, const in vec3 specularColor, const in float shininess) {
  return RECIPROCAL_PI * (diffuseColor + specularColor * shininess);
}
`,
  lights_physical_fragment: /* glsl */ `
float D_GGX(const in float roughness, const in float dotNH) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = dotNH * dotNH * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-7);
}

float V_SmithGGXCorrelated(const in float roughness, const in float dotNV, const in float dotNL) {
  float a2 = roughness * roughness * roughness * roughness;
  float lambdaV = dotNL * sqrt(dotNV * dotNV * (1.0 - a2) + a2);
  float lambdaL = dotNV * sqrt(dotNL * dotNL * (1.0 - a2) + a2);
  return 0.5 / max(lambdaV + lambdaL, 1e-7);
}

vec3 F_Schlick(const in vec3 f0, const in float dotVH) {
  float fresnel = exp2((-5.55473 * dotVH - 6.98316) * dotVH);
  return f0 * (1.0 - fresnel) + fresnel;
}

void RE_Direct_Physical(
  const in IncidentLight directLight,
  const in GeometricContext geometry,
  const in vec3 diffuseColor,
  const in vec3 f0,
  const in float roughness,
  inout ReflectedLight reflectedLight
) {
  float dotNL = saturate(dot(geometry.normal, directLight.direction));
  if (dotNL <= 0.0) return;
  vec3 halfDir = normalize(directLight.direction + geometry.viewDir);
  float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
  float dotNH = saturate(dot(geometry.normal, halfDir));
  float dotVH = saturate(dot(geometry.viewDir, halfDir));

  vec3 F = F_Schlick(f0, dotVH);
  float D = D_GGX(max(roughness, 0.045), dotNH);
  float V = V_SmithGGXCorrelated(max(roughness, 0.045), dotNV, dotNL);

  vec3 specular = F * D * V;
  vec3 kd = vec3(1.0) - F;

  reflectedLight.directDiffuse += directLight.color * kd * diffuseColor * RECIPROCAL_PI * dotNL * directLight.attenuation;
  reflectedLight.directSpecular += directLight.color * specular * dotNL * directLight.attenuation;
}
`,
  lights_fragment_end: /* glsl */ ``,

  // ------------------------------------------------------------------- fog --
  fog_pars_fragment: /* glsl */ `
#ifdef USE_FOG
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float fogDensity;
varying float vFogDepth;
#endif
`,
  fog_fragment: /* glsl */ `
#ifdef USE_FOG
#ifdef FOG_EXP2
float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
#else
float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
#endif
gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
#endif
`,

  // ------------------------------------------------------------- tonemapping --
  tonemapping_pars_fragment: /* glsl */ `
vec3 mini3dToneMapping(vec3 color) {
#ifdef USE_TONEMAPPING_ACES
  color *= 1.0 / 0.6;
  const mat3 ACESInput = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 ACESOutput = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color = ACESInput * color;
  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  color = ACESOutput * (a / b);
#elif defined(USE_TONEMAPPING_REINHARD)
  color = color / (color + vec3(1.0));
#elif defined(USE_TONEMAPPING_CINEON)
  color = max(vec3(0.0), color - 0.004);
  color = (color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06);
#else
  color = saturate(color);
#endif
  return saturate(color);
}
`,
  tonemapping_fragment: /* glsl */ `
#ifdef USE_TONEMAPPING
gl_FragColor.rgb = mini3dToneMapping(gl_FragColor.rgb);
#endif
`,
  dithering_fragment: /* glsl */ `
#ifdef DITHERING
float mini3dDither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
gl_FragColor.rgb += (mini3dDither - 0.5) / 255.0;
#endif
`,

  // ------------------------------------------------------- colour pipeline ---
  colorspace_pars_fragment: /* glsl */ `
vec3 mini3dLinearToSRGB(vec3 c) {
  return mix(
    pow(c, vec3(0.41666)) * 1.055 - vec3(0.055),
    c * 12.92,
    vec3(lessThanEqual(c, vec3(0.0031308)))
  );
}
vec3 mini3dSRGBToLinear(vec3 c) {
  return mix(
    pow((c + vec3(0.055)) * vec3(0.9478672986), vec3(2.4)),
    c * vec3(0.0773993808),
    vec3(lessThanEqual(c, vec3(0.04045)))
  );
}
`,
  colorspace_fragment: /* glsl */ `
#ifdef SRGB_OUTPUT
gl_FragColor.rgb = mini3dLinearToSRGB(gl_FragColor.rgb);
#endif
`,
  encodings_fragment: /* glsl */ `
#ifdef SRGB_OUTPUT
gl_FragColor.rgb = mini3dLinearToSRGB(gl_FragColor.rgb);
#endif
`,
  premultiplied_alpha_fragment: /* glsl */ `
#ifdef PREMULTIPLIED_ALPHA
gl_FragColor.rgb *= gl_FragColor.a;
#endif
`,
  output_fragment: /* glsl */ ``,
  opaque_fragment: /* glsl */ ``,

  // ------------------------------------------------------------------ misc --
  bsdfs: /* glsl */ `
float mini3dFresnelSchlick(const in float cosTheta, const in float f0) {
  return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
}
vec3 mini3dFresnelSchlick3(const in float cosTheta, const in vec3 f0) {
  return f0 + (vec3(1.0) - f0) * pow(1.0 - cosTheta, 5.0);
}
`,
  cube_uv_reflection_fragment: /* glsl */ ``,
  packing_pars_fragment: /* glsl */ `
const vec4 PackFactors = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
const vec2 ShiftRight8 = vec2(256.0 * 256.0 * 256.0, 256.0 * 256.0);
float packDepthToRGBA(const in float depth) {
  vec4 packedDepth = fract(depth * PackFactors);
  packedDepth -= packedDepth.yzww * vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
  return dot(packedDepth, vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0));
}
`,
  packing_fragment: /* glsl */ `
gl_FragColor = vec4(packDepthToRGBA(gl_FragCoord.z), 1.0);
`,
};

/** Every chunk name that ships with the library. */
export type ShaderChunkName = keyof typeof ShaderChunk | string;

/**
 * Recursively expands `#include <name>` / `#include "name"` directives.
 * Throws with a clear message when a chunk is unknown, which makes shader
 * authoring mistakes loud instead of silently producing broken GLSL.
 */
export function resolveIncludes(
  source: string,
  chunks: Record<string, string> = ShaderChunk,
  depth = 0,
): string {
  if (depth > 16) {
    throw new Error('mini3d.resolveIncludes: include depth exceeded (circular chunk include?)');
  }
  if (source.indexOf('#include') === -1) return source;

  let changed = false;
  const output = source.replace(
    /^([ \t]*)#include[ \t]+[<"]([\w.-]+)[>"][ \t]*$/gm,
    (_match, indent: string, name: string) => {
      const chunk = chunks[name];
      if (chunk === undefined) {
        throw new Error(`mini3d.resolveIncludes: unknown shader chunk "${name}"`);
      }
      changed = true;
      const indented = chunk
        .split('\n')
        .map((line) => (line.length ? indent + line : line))
        .join('\n');
      return indented;
    },
  );

  return changed ? resolveIncludes(output, chunks, depth + 1) : output;
}

/** Registers or overrides a chunk (used by user-land material extensions). */
export function registerShaderChunk(name: string, source: string): void {
  ShaderChunk[name] = source;
}
