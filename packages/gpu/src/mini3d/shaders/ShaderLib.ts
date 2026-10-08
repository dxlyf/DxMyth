/**
 * Built-in GLSL shader sources for the WebGL1 / WebGL2 backends.
 *
 * Every shader is written in GLSL ES 1.00 and relies on the prologue built by
 * `WebGLProgram`. Uniform and attribute naming follows the contract documented
 * in `ShaderChunk.ts`; `WgslLib.ts` mirrors the same lighting maths in WGSL so
 * all three backends produce matching images.
 */
import { resolveIncludes } from './ShaderChunk';

export type ShaderLibName =
  | 'basic'
  | 'lambert'
  | 'phong'
  | 'standard'
  | 'normal'
  | 'depth'
  | 'line'
  | 'points';

export interface GLShaderEntry {
  name: ShaderLibName;
  vertexShader: string;
  fragmentShader: string;
  /** Uniforms this shader expects, for diagnostics and material validation. */
  uniformNames: string[];
}

/**
 * Varyings every built-in shader declares. `vWorldPosition` is needed because
 * light data is packed in world space; `vViewPosition` keeps the view-space
 * depth used by fog and normal-map perturbation.
 */
const SHARED_VARYINGS = /* glsl */ `
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
`;

const VERTEX_HEAD = /* glsl */ `
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <normal_pars_vertex>
#include <fog_pars_vertex>
${SHARED_VARYINGS}
`;

/** Vertex body for triangle shaders. */
const VERTEX_BODY = /* glsl */ `
void main() {
  #include <uv_vertex>
  #include <color_vertex>
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>
  #include <project_vertex>
  vViewPosition = -mvPosition.xyz;
  #include <worldpos_vertex>
  vWorldPosition = worldPosition.xyz;
  #include <fog_vertex>
}
`;

const FRAGMENT_HEAD = /* glsl */ `
#include <common>
#include <uv_pars_fragment>
#include <color_pars_fragment>
#include <normal_pars_fragment>
#include <colorspace_pars_fragment>
#include <tonemapping_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <normalmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <specularmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <aomap_pars_fragment>
#include <bsdfs>
#include <lights_lambert_fragment>
#include <lights_phong_fragment>
#include <lights_physical_fragment>
${SHARED_VARYINGS}
`;

/** Colours/factors every lit material exposes. */
const LIT_UNIFORMS = [
  'diffuse',
  'opacity',
  'emissive',
  'specular',
  'shininess',
  'roughness',
  'metalness',
  'normalScale',
  'uvTransform',
  'alphaTest',
  'ambientLightColor',
  'hemisphereLightSkyColor',
  'hemisphereLightGroundColor',
  'hemisphereLightUp',
  'numDirectionalLights',
  'numPointLights',
  'numSpotLights',
  'directionalLightsData',
  'pointLightsData',
  'spotLightsData',
  'fogColor',
  'fogNear',
  'fogFar',
  'fogDensity',
  'diffuseMap',
  'alphaMap',
  'emissiveMap',
  'specularMap',
  'roughnessMap',
  'metalnessMap',
  'normalMap',
  'aoMap',
  'normalMatrix',
  'cameraPosition',
];

/** Shared fully-lit fragment tail. */
const LIT_EPILOGUE = /* glsl */ `
  #include <aomap_fragment>
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.directSpecular
    + reflectedLight.indirectDiffuse + reflectedLight.indirectSpecular
    + totalEmissiveRadiance;

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`;

export const ShaderLib: Record<ShaderLibName, GLShaderEntry> = {
  // --------------------------------------------------------------- basic ---
  basic: {
    name: 'basic',
    uniformNames: ['diffuse', 'opacity', 'uvTransform', 'alphaTest', 'diffuseMap', 'alphaMap'],
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  gl_FragColor = diffuseColor;
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`),
  },

  // ------------------------------------------------------------- lambert ---
  lambert: {
    name: 'lambert',
    uniformNames: LIT_UNIFORMS,
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  vec3 totalEmissiveRadiance = emissive;
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>

  #include <normal_fragment>

  #include <emissivemap_fragment>
  #include <alphatest_fragment>

  ReflectedLight reflectedLight;
  reflectedLight.directDiffuse = vec3(0.0);
  reflectedLight.directSpecular = vec3(0.0);
  reflectedLight.indirectDiffuse = vec3(0.0);
  reflectedLight.indirectSpecular = vec3(0.0);

  GeometricContext geometry;
  geometry.position = vWorldPosition;
  geometry.normal = normal;
  geometry.viewDir = normalize(cameraPosition - vWorldPosition);

  IncidentLight directLight;
  for (int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
    if (i >= numDirectionalLights) break;
    MINI3D_ACCUM_LIGHT(0, i)
    RE_Direct_Lambert(directLight, geometry, diffuseColor.rgb, reflectedLight);
  }
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= numPointLights) break;
    MINI3D_ACCUM_LIGHT(1, i)
    RE_Direct_Lambert(directLight, geometry, diffuseColor.rgb, reflectedLight);
  }
  for (int i = 0; i < MAX_SPOT_LIGHTS; i++) {
    if (i >= numSpotLights) break;
    MINI3D_ACCUM_LIGHT(2, i)
    RE_Direct_Lambert(directLight, geometry, diffuseColor.rgb, reflectedLight);
  }

  reflectedLight.indirectDiffuse +=
    irradianceAmbient(normal) * diffuseColor.rgb * RECIPROCAL_PI;
${LIT_EPILOGUE}`),
  },

  // --------------------------------------------------------------- phong ---
  phong: {
    name: 'phong',
    uniformNames: LIT_UNIFORMS,
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  vec3 totalEmissiveRadiance = emissive;
  #include <map_fragment>
  #include <color_fragment>
  #include <specularmap_fragment>
  #include <alphamap_fragment>

  #include <normal_fragment>

  #include <emissivemap_fragment>
  #include <alphatest_fragment>

  ReflectedLight reflectedLight;
  reflectedLight.directDiffuse = vec3(0.0);
  reflectedLight.directSpecular = vec3(0.0);
  reflectedLight.indirectDiffuse = vec3(0.0);
  reflectedLight.indirectSpecular = vec3(0.0);

  GeometricContext geometry;
  geometry.position = vWorldPosition;
  geometry.normal = normal;
  geometry.viewDir = normalize(cameraPosition - vWorldPosition);

  vec3 specularColor = specular * specularStrength;

  IncidentLight directLight;
  for (int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
    if (i >= numDirectionalLights) break;
    MINI3D_ACCUM_LIGHT(0, i)
    RE_Direct_Phong(directLight, geometry, diffuseColor.rgb, specularColor, shininess, reflectedLight);
  }
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= numPointLights) break;
    MINI3D_ACCUM_LIGHT(1, i)
    RE_Direct_Phong(directLight, geometry, diffuseColor.rgb, specularColor, shininess, reflectedLight);
  }
  for (int i = 0; i < MAX_SPOT_LIGHTS; i++) {
    if (i >= numSpotLights) break;
    MINI3D_ACCUM_LIGHT(2, i)
    RE_Direct_Phong(directLight, geometry, diffuseColor.rgb, specularColor, shininess, reflectedLight);
  }

  reflectedLight.indirectDiffuse +=
    irradianceAmbient(normal) * diffuseColor.rgb * RECIPROCAL_PI;
${LIT_EPILOGUE}`),
  },

  // ------------------------------------------------------------ standard ---
  standard: {
    name: 'standard',
    uniformNames: LIT_UNIFORMS,
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  vec3 totalEmissiveRadiance = emissive;
  float roughnessFactor = roughness;
  float metalnessFactor = metalness;
  #include <map_fragment>
  #include <color_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <alphamap_fragment>

  #include <normal_fragment>

  #include <emissivemap_fragment>
  #include <alphatest_fragment>

  ReflectedLight reflectedLight;
  reflectedLight.directDiffuse = vec3(0.0);
  reflectedLight.directSpecular = vec3(0.0);
  reflectedLight.indirectDiffuse = vec3(0.0);
  reflectedLight.indirectSpecular = vec3(0.0);

  GeometricContext geometry;
  geometry.position = vWorldPosition;
  geometry.normal = normal;
  geometry.viewDir = normalize(cameraPosition - vWorldPosition);

  vec3 f0 = mix(vec3(0.04), diffuseColor.rgb, metalnessFactor);
  vec3 diffuseTerm = diffuseColor.rgb * (1.0 - metalnessFactor);

  IncidentLight directLight;
  for (int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
    if (i >= numDirectionalLights) break;
    MINI3D_ACCUM_LIGHT(0, i)
    RE_Direct_Physical(directLight, geometry, diffuseTerm, f0, roughnessFactor, reflectedLight);
  }
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= numPointLights) break;
    MINI3D_ACCUM_LIGHT(1, i)
    RE_Direct_Physical(directLight, geometry, diffuseTerm, f0, roughnessFactor, reflectedLight);
  }
  for (int i = 0; i < MAX_SPOT_LIGHTS; i++) {
    if (i >= numSpotLights) break;
    MINI3D_ACCUM_LIGHT(2, i)
    RE_Direct_Physical(directLight, geometry, diffuseTerm, f0, roughnessFactor, reflectedLight);
  }

  // No environment map yet: ambient and hemisphere stand in for indirect light.
  reflectedLight.indirectDiffuse +=
    irradianceAmbient(normal) * diffuseTerm * RECIPROCAL_PI;
${LIT_EPILOGUE}`),
  },

  // -------------------------------------------------------------- normal ---
  normal: {
    name: 'normal',
    uniformNames: ['opacity', 'uvTransform'],
    vertexShader: resolveIncludes(`
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
// The normal visualisation always reads the varying normal, so the define must
// be dropped before normal_pars_vertex declares the varyings. Deriving a
// true face normal would need screen-space derivatives, which WebGL1 cannot
// portably compile.
#undef FLAT_SHADED
#include <normal_pars_vertex>
#include <fog_pars_vertex>
${SHARED_VARYINGS}
${VERTEX_BODY}
`),
    fragmentShader: resolveIncludes(`
// normal_pars_fragment (inside FRAGMENT_HEAD) declares the normal varying, so
// the define has to be dropped before the head is included.
#undef FLAT_SHADED
${FRAGMENT_HEAD}
void main() {
  // FLAT_SHADED is deliberately ignored here: deriving a face normal needs
  // screen-space derivatives, which are not portable to WebGL1. Per-face
  // normals belong in the geometry (see BufferGeometry.computeVertexNormals).
  vec3 normal = normalize(vNormal);
#ifdef DOUBLE_SIDED
  normal *= gl_FrontFacing ? 1.0 : -1.0;
#endif
  gl_FragColor = vec4(normal * 0.5 + 0.5, opacity);
  #include <premultiplied_alpha_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`),
  },

  // --------------------------------------------------------------- depth ---
  depth: {
    name: 'depth',
    uniformNames: ['opacity', 'depthNear', 'depthFar'],
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
#include <packing_pars_fragment>
void main() {
  // NDC depth straight from the rasteriser: 0 at the near plane, 1 at the far
  // plane, exactly like the hardware depth buffer. Using gl_FragCoord.z avoids
  // needing camera near/far uniforms here at all.
  float depth = gl_FragCoord.z;
#ifdef DEPTH_PACKING_RGBA
  gl_FragColor = vec4(packDepthToRGBA(depth), opacity);
#else
  gl_FragColor = vec4(vec3(depth), opacity);
#endif
  #include <fog_fragment>
}
`),
  },

  // ---------------------------------------------------------------- line ---
  line: {
    name: 'line',
    uniformNames: ['diffuse', 'opacity', 'uvTransform', 'alphaTest', 'diffuseMap', 'alphaMap'],
    vertexShader: resolveIncludes(`${VERTEX_HEAD}${VERTEX_BODY}`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  gl_FragColor = diffuseColor;
  #include <premultiplied_alpha_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`),
  },

  // -------------------------------------------------------------- points ---
  points: {
    name: 'points',
    uniformNames: ['diffuse', 'opacity', 'uvTransform', 'alphaTest', 'diffuseMap', 'size', 'sizeAttenuation'],
    vertexShader: resolveIncludes(`
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
${SHARED_VARYINGS}
void main() {
  vec3 transformed = vec3(position);
  #include <uv_vertex>
  #include <color_vertex>
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  vViewPosition = -mvPosition.xyz;
  if (sizeAttenuation > 0.5) {
    // Perspective-correct world-space point size: pointScale is half the
    // drawing-buffer height, so a size-unit point keeps its apparent size
    // regardless of canvas resolution.
    gl_PointSize = size * (pointScale / max(-mvPosition.z, 1e-3));
  } else {
    gl_PointSize = size;
  }
  gl_Position = projectionMatrix * mvPosition;
  #include <worldpos_vertex>
  vWorldPosition = worldPosition.xyz;
  #include <fog_vertex>
}
`),
    fragmentShader: resolveIncludes(`
${FRAGMENT_HEAD}
void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  // The round-sprite shape is generated from gl_PointCoord rather than
  // relying on a map, so a point cloud is always visible.
  vec2 pointCoord = gl_PointCoord - vec2(0.5);
  float pointRadius = dot(pointCoord, pointCoord);
  if (pointRadius > 0.25) discard;
#ifdef USE_MAP
  diffuseColor *= texture2D(diffuseMap, gl_PointCoord);
#else
  diffuseColor.rgb *= smoothstep(0.25, 0.05, pointRadius);
#endif
  #include <color_fragment>
  #include <alphatest_fragment>
  gl_FragColor = diffuseColor;
  #include <premultiplied_alpha_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`),
  },
};

export type { GLShaderEntry as ShaderLibEntry };

/** Exposed so tests can assert every program compiles after include expansion. */
export function rawShaderSources(): Record<ShaderLibName, { vertex: string; fragment: string }> {
  const out = {} as Record<ShaderLibName, { vertex: string; fragment: string }>;
  for (const key of Object.keys(ShaderLib) as ShaderLibName[]) {
    out[key] = {
      vertex: ShaderLib[key].vertexShader,
      fragment: ShaderLib[key].fragmentShader,
    };
  }
  return out;
}
