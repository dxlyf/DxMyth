import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import type { Object3D } from '../core/Object3D';
import type {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  SpotLight,
} from '../core/Lights';
import type { Camera } from '../core/Camera';

/** Hard caps shared by the GLSL and WGSL shader libraries. */
export const MAX_DIRECTIONAL_LIGHTS = 8;
export const MAX_POINT_LIGHTS = 8;
export const MAX_SPOT_LIGHTS = 4;

/** Floats per light record in the packed uniform blocks. */
export const DIRECTIONAL_LIGHT_FLOATS = 8; // direction(3) + pad + color(3) + pad
export const POINT_LIGHT_FLOATS = 8; // position(3) + pad + color(3) + distance
export const SPOT_LIGHT_FLOATS = 16; // position(3)+pad, direction(3)+pad, color(3)+distance, cos/penumbra

/**
 * Collected, pre-multiplied light state for one frame. Both backends use this
 * so the visual result is identical across WebGL, WebGL2 and WebGPU.
 *
 * Packed layouts (uploaded as `vec4` arrays):
 * - `directionalData`: `[direction.xyz, 0]`, `[color.xyz, 0]` per light
 * - `pointData`:       `[position.xyz, 1]`,  `[color.xyz, distance]` per light
 * - `spotData`:        `[position.xyz, 1]`,  `[direction.xyz, 0]`,
 *                      `[color.xyz, distance]`, `[cosOuter, cosInner, 0, 0]`
 */
export class LightState {
  readonly ambient = new Color(0, 0, 0);
  readonly hemisphereSky = new Color(0, 0, 0);
  readonly hemisphereGround = new Color(0, 0, 0);
  hemisphereIntensity = 0;
  hemisphereUp: [number, number, number] = [0, 1, 0];

  directionalCount = 0;
  pointCount = 0;
  spotCount = 0;

  readonly directionalData = new Float32Array(MAX_DIRECTIONAL_LIGHTS * DIRECTIONAL_LIGHT_FLOATS);
  readonly pointData = new Float32Array(MAX_POINT_LIGHTS * POINT_LIGHT_FLOATS);
  readonly spotData = new Float32Array(MAX_SPOT_LIGHTS * SPOT_LIGHT_FLOATS);

  /** Bumped whenever the counts change so backends can skip re-uploads. */
  version = 0;

  reset(): void {
    this.ambient.setRGB(0, 0, 0);
    this.hemisphereSky.setRGB(0, 0, 0);
    this.hemisphereGround.setRGB(0, 0, 0);
    this.hemisphereIntensity = 0;
    this.directionalCount = 0;
    this.pointCount = 0;
    this.spotCount = 0;
    this.directionalData.fill(0);
    this.pointData.fill(0);
    this.spotData.fill(0);
  }

  /** True when nothing would light a lit material. */
  get isEmpty(): boolean {
    return (
      this.directionalCount === 0 &&
      this.pointCount === 0 &&
      this.spotCount === 0 &&
      this.ambient.getLuminance() === 0 &&
      this.hemisphereIntensity === 0
    );
  }
}

/**
 * Walks the scene once and packs every supported light into `state`.
 *
 * `_tmpDirection` etc. are module-level scratch objects so a full traversal
 * allocates nothing.
 */
export function collectLights(root: Object3D, state: LightState, camera?: Camera): LightState {
  state.reset();

  root.updateMatrixWorld();

  root.traverseVisible((object) => {
    const light = object as Object3D & { isLight?: boolean; isAmbientLight?: boolean };
    if (!light.isLight) return undefined;

    if (light.isAmbientLight) {
      const ambient = object as AmbientLight;
      state.ambient.add(_color.copy(ambient.color).multiplyScalar(ambient.intensity));
      return undefined;
    }

    if ((object as Object3D & { isHemisphereLight?: boolean }).isHemisphereLight) {
      const hemi = object as HemisphereLight;
      state.hemisphereSky.add(_color.copy(hemi.color).multiplyScalar(hemi.intensity));
      state.hemisphereGround.add(
        _color.copy(hemi.groundColor).multiplyScalar(hemi.intensity),
      );
      state.hemisphereIntensity += hemi.intensity;
      object.getWorldPosition(_v1);
      const length = _v1.length() || 1;
      state.hemisphereUp = [_v1.x / length, _v1.y / length, _v1.z / length];
      return undefined;
    }

    if ((object as Object3D & { isDirectionalLight?: boolean }).isDirectionalLight) {
      const dirLight = object as DirectionalLight;
      if (state.directionalCount >= MAX_DIRECTIONAL_LIGHTS) return undefined;
      // Direction of travel: from the light towards its target.
      dirLight.target.updateMatrixWorld();
      object.getWorldPosition(_v1);
      _v2.setFromMatrixPosition(dirLight.target.matrixWorld);
      _v3.subVectors(_v2, _v1).normalize();

      const base = state.directionalCount * DIRECTIONAL_LIGHT_FLOATS;
      state.directionalData[base] = _v3.x;
      state.directionalData[base + 1] = _v3.y;
      state.directionalData[base + 2] = _v3.z;
      state.directionalData[base + 3] = 0;
      _color.copy(dirLight.color).multiplyScalar(dirLight.intensity);
      state.directionalData[base + 4] = _color.r;
      state.directionalData[base + 5] = _color.g;
      state.directionalData[base + 6] = _color.b;
      state.directionalData[base + 7] = 0;
      state.directionalCount++;
      return undefined;
    }

    if ((object as Object3D & { isSpotLight?: boolean }).isSpotLight) {
      const spot = object as SpotLight;
      if (state.spotCount >= MAX_SPOT_LIGHTS) return undefined;
      spot.target.updateMatrixWorld();
      object.getWorldPosition(_v1);
      _v2.setFromMatrixPosition(spot.target.matrixWorld);
      _v3.subVectors(_v2, _v1).normalize();

      const base = state.spotCount * SPOT_LIGHT_FLOATS;
      state.spotData[base] = _v1.x;
      state.spotData[base + 1] = _v1.y;
      state.spotData[base + 2] = _v1.z;
      state.spotData[base + 3] = 1;
      state.spotData[base + 4] = _v3.x;
      state.spotData[base + 5] = _v3.y;
      state.spotData[base + 6] = _v3.z;
      state.spotData[base + 7] = 0;
      _color.copy(spot.color).multiplyScalar(spot.intensity);
      state.spotData[base + 8] = _color.r;
      state.spotData[base + 9] = _color.g;
      state.spotData[base + 10] = _color.b;
      state.spotData[base + 11] = spot.distance;
      state.spotData[base + 12] = Math.cos(spot.angle);
      state.spotData[base + 13] = Math.cos(
        spot.angle * Math.max(0, 1 - Math.min(1, spot.penumbra)),
      );
      state.spotCount++;
      return undefined;
    }

    if ((object as Object3D & { isPointLight?: boolean }).isPointLight) {
      const point = object as PointLight;
      if (state.pointCount >= MAX_POINT_LIGHTS) return undefined;
      object.getWorldPosition(_v1);
      const base = state.pointCount * POINT_LIGHT_FLOATS;
      state.pointData[base] = _v1.x;
      state.pointData[base + 1] = _v1.y;
      state.pointData[base + 2] = _v1.z;
      state.pointData[base + 3] = 1;
      _color.copy(point.color).multiplyScalar(point.intensity);
      state.pointData[base + 4] = _color.r;
      state.pointData[base + 5] = _color.g;
      state.pointData[base + 6] = _color.b;
      state.pointData[base + 7] = point.distance;
      state.pointCount++;
    }
    return undefined;
  });

  // A camera-attached hemisphere light falls back to the camera's up vector.
  if (camera && state.hemisphereIntensity > 0) {
    _v1.set(0, 1, 0).transformDirection(camera.matrixWorld);
    state.hemisphereUp = [_v1.x, _v1.y, _v1.z];
  }

  state.version++;
  return state;
}

/** Uniform name/value pairs a backend can upload directly. */
export function lightUniforms(state: LightState, lightState: 'webgl' | 'webgpu'): Record<string, unknown> {
  return {
    numDirectionalLights: state.directionalCount,
    numPointLights: state.pointCount,
    numSpotLights: state.spotCount,
    ambientLightColor: [state.ambient.r, state.ambient.g, state.ambient.b],
    hemisphereLightUp: state.hemisphereUp,
    directionalLightsData: state.directionalData,
    pointLightsData: state.pointData,
    spotLightsData: state.spotData,
    backend: lightState,
  };
}

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _color = new Color();
