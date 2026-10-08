import { Object3D } from './Object3D';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';

/**
 * Base class for all light types. Backends collect lights by `type` while
 * traversing the scene, so every light must set `isLight` and `type`.
 */
export class Light extends Object3D {
  readonly isLight = true;
  override type = 'Light';
  color: Color;
  intensity: number;

  constructor(color: number | string | Color = 0xffffff, intensity = 1) {
    super();
    this.color = color instanceof Color ? color.clone() : new Color(color);
    this.intensity = intensity;
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as Light;
    this.color.copy(light.color);
    this.intensity = light.intensity;
    return this;
  }

  override dispose(): void {
    super.dispose();
  }
}

/**
 * Ambient light: a constant term added to every lit fragment. `color` is
 * multiplied by `intensity` by the renderer.
 */
export class AmbientLight extends Light {
  readonly isAmbientLight = true;
  override type = 'AmbientLight';

  constructor(color: number | string | Color = 0xffffff, intensity = 1) {
    super(color, intensity);
  }
}

/**
 * Hemispheric light: blends `skyColor` (facing up) and `groundColor` (facing
 * down) by the surface normal's Y component.
 */
export class HemisphereLight extends Light {
  readonly isHemisphereLight = true;
  override type = 'HemisphereLight';
  groundColor: Color;

  constructor(
    skyColor: number | string | Color = 0xffffff,
    groundColor: number | string | Color = 0xffffff,
    intensity = 1,
  ) {
    super(skyColor, intensity);
    this.groundColor = groundColor instanceof Color ? groundColor.clone() : new Color(groundColor);
    this.position.set(0, 1, 0);
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as HemisphereLight;
    this.groundColor.copy(light.groundColor);
    return this;
  }
}

/** Shared configuration for lights that cast shadows. */
export interface LightShadowOptions {
  mapSize?: { width: number; height: number };
  camera?: { near: number; far: number; left?: number; right?: number; top?: number; bottom?: number; fov?: number };
  bias?: number;
  normalBias?: number;
  radius?: number;
  enabled?: boolean;
}

/**
 * Follower for `radius`-style soft shadows. `ShadowMap` in each backend reads
 * `mapSize`, `camera.near/far` and `bias`.
 */
export class LightShadow {
  enabled = false;
  bias = 0;
  normalBias = 0;
  radius = 1;
  mapSize: { width: number; height: number };
  camera: {
    near: number;
    far: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    fov: number;
  };

  constructor(options: LightShadowOptions = {}) {
    this.mapSize = options.mapSize
      ? { ...options.mapSize }
      : { width: 512, height: 512 };
    this.camera = {
      near: options.camera?.near ?? 0.5,
      far: options.camera?.far ?? 500,
      left: options.camera?.left ?? -5,
      right: options.camera?.right ?? 5,
      top: options.camera?.top ?? 5,
      bottom: options.camera?.bottom ?? -5,
      fov: options.camera?.fov ?? 50,
    };
    this.bias = options.bias ?? 0;
    this.normalBias = options.normalBias ?? 0;
    this.radius = options.radius ?? 1;
    this.enabled = options.enabled ?? false;
  }
}

/**
 * Directional light. The light direction is `position -> target`, so a light
 * at `(5, 10, 7.5)` with a default target at the origin shines towards -X/-Y/-Z
 * exactly like three.js.
 */
export class DirectionalLight extends Light {
  readonly isDirectionalLight = true;
  override type = 'DirectionalLight';
  target: Object3D;
  shadow: LightShadow;

  constructor(color: number | string | Color = 0xffffff, intensity = 1) {
    super(color, intensity);
    this.position.set(0, 1, 0);
    // The target is a plain node; it must be added to the scene for its world
    // matrix to refresh, which matches three.js behaviour.
    this.target = new Object3D();
    this.shadow = new LightShadow();
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as DirectionalLight;
    this.target = light.target.clone(false);
    this.shadow = new LightShadow({
      mapSize: light.shadow.mapSize,
      camera: light.shadow.camera,
      bias: light.shadow.bias,
      normalBias: light.shadow.normalBias,
      radius: light.shadow.radius,
      enabled: light.shadow.enabled,
    });
    return this;
  }

  override dispose(): void {
    super.dispose();
  }
}

/** Point light with optional distance falloff (inverse-square or smooth). */
export class PointLight extends Light {
  readonly isPointLight = true;
  override type = 'PointLight';
  distance: number;
  decay: number;
  shadow: LightShadow;

  constructor(
    color: number | string | Color = 0xffffff,
    intensity = 1,
    distance = 0,
    decay = 2,
  ) {
    super(color, intensity);
    this.distance = distance;
    this.decay = decay;
    this.shadow = new LightShadow({
      camera: { near: 0.5, far: distance > 0 ? distance : 500 },
    });
  }

  /** Physical falloff: intensity is in candela, so scale by 4π like three.js. */
  getPower(): number {
    return this.intensity * 4 * Math.PI;
  }

  setPower(power: number): this {
    this.intensity = power / (4 * Math.PI);
    return this;
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as PointLight;
    this.distance = light.distance;
    this.decay = light.decay;
    this.shadow = new LightShadow({
      mapSize: light.shadow.mapSize,
      camera: light.shadow.camera,
      bias: light.shadow.bias,
      normalBias: light.shadow.normalBias,
      radius: light.shadow.radius,
      enabled: light.shadow.enabled,
    });
    return this;
  }
}

/** Spot light: a point light restricted to a cone around -Z. */
export class SpotLight extends PointLight {
  readonly isSpotLight = true;
  override type = 'SpotLight';
  angle: number;
  penumbra: number;
  target: Object3D;

  constructor(
    color: number | string | Color = 0xffffff,
    intensity = 1,
    distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
    decay = 2,
  ) {
    super(color, intensity, distance, decay);
    this.angle = angle;
    this.penumbra = penumbra;
    this.target = new Object3D();
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as SpotLight;
    this.angle = light.angle;
    this.penumbra = light.penumbra;
    this.target = light.target.clone(false);
    return this;
  }
}

/**
 * Rect-area light. mini3d treats it as a directional light sampled from
 * `position` towards `target` and averages `width`/`height` into the
 * intensity, which is enough for preview shading.
 */
export class RectAreaLight extends Light {
  readonly isRectAreaLight = true;
  override type = 'RectAreaLight';
  width: number;
  height: number;
  /** Point the panel faces; `updateOrientation()` turns it into a quaternion. */
  target: Vector3;

  constructor(
    color: number | string | Color = 0xffffff,
    intensity = 1,
    width = 10,
    height = 10,
  ) {
    super(color, intensity);
    this.width = width;
    this.height = height;
    this.target = new Vector3(0, 0, 0);
  }

  /** Reorients the panel so its normal points at `target`. */
  updateOrientation(): this {
    this.lookAt(this.target);
    return this;
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const light = source as RectAreaLight;
    this.width = light.width;
    this.height = light.height;
    this.target.copy(light.target);
    return this;
  }
}

/** Emissive-ish light stored for exporters; contributes ambient-like light. */
export class RectAreaLightUniformsLib {
  static init(): void {
    /* Uniform-based area lights are not implemented; kept for API parity. */
  }
}

/** Convenience type guard used by the renderers' light collection pass. */
export function isRectAreaLight(light: Object3D): light is RectAreaLight {
  return (light as unknown as RectAreaLight).isRectAreaLight === true;
}

/** Texture-based light probe (unused by the forward renderer). */
export class LightProbe extends Light {
  readonly isLightProbe = true;
  override type = 'LightProbe';
  sh: Float32Array;

  constructor(sh: Float32Array = new Float32Array(27)) {
    super(0xffffff, 1);
    this.sh = sh;
  }
}
