import { Object3D } from './Object3D';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { Frustum } from '../math/Frustum';

/**
 * Base camera. Owns the projection matrix and the frustum used for culling;
 * `PerspectiveCamera` / `OrthographicCamera` fill in `updateProjectionMatrix`.
 */
export class Camera extends Object3D {
  readonly isCamera = true;
  override type = 'Camera';

  /** Projection/ view matrices consumed by every backend. */
  readonly projectionMatrix = new Matrix4();
  readonly projectionMatrixInverse = new Matrix4();
  readonly matrixWorldInverse = new Matrix4();
  readonly frustum = new Frustum();

  near = 0.1;
  far = 2000;
  /** Zoom factor applied before the projection is built. */
  zoom = 1;
  /** Set by backends so the projection can flip clip-space depth for WebGPU. */
  coordinateSystem: 'webgl' | 'webgpu' = 'webgl';

  /** Oblique near-plane clipping (unused unless `setViewOffset`-style tools). */
  readonly view = {
    enabled: false,
    fullWidth: 1,
    fullHeight: 1,
    offsetX: 0,
    offsetY: 0,
    width: 1,
    height: 1,
  };

  constructor() {
    super();
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix(): void {
    // Overridden by subclasses.
  }

  /** Recomputes `matrixWorldInverse` and the six frustum planes. */
  override updateMatrixWorld(force = false): void {
    super.updateMatrixWorld(force);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    this.frustum.setFromProjectionMatrix(
      _projScreen.multiplyMatrices(this.projectionMatrix, this.matrixWorldInverse),
    );
  }

  /** Efficient refresh: rotation sync + world matrix + view/frustum. */
  updateMatrices(): void {
    this.syncRotation();
    this.updateProjectionMatrix();
    this.updateMatrixWorld(true);
  }

  /** World-space direction the camera looks along. */
  override getWorldDirection(target: Vector3 = new Vector3()): Vector3 {
    this.updateWorldMatrix(true, false);
    const e = this.matrixWorld.elements;
    // Cameras look down -Z.
    return target.set(-e[8], -e[9], -e[10]).normalize();
  }

  /** Enlarges/shrinks the frustum to fit a vertical or horizontal span. */
  setViewOffset(
    fullWidth: number,
    fullHeight: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ): this {
    this.view.enabled = true;
    this.view.fullWidth = fullWidth;
    this.view.fullHeight = fullHeight;
    this.view.offsetX = x;
    this.view.offsetY = y;
    this.view.width = width;
    this.view.height = height;
    this.updateProjectionMatrix();
    return this;
  }

  clearViewOffset(): this {
    this.view.enabled = false;
    this.updateProjectionMatrix();
    return this;
  }

  /**
   * Builds a picking ray from normalised device coordinates.
   * `ndc.x`/`ndc.y` are in `[-1, 1]` with +Y up (WebGL convention).
   */
  unproject(ndc: Vector3, target: Vector3 = new Vector3()): Vector3 {
    this.updateMatrixWorld(true);
    return target
      .set(ndc.x, ndc.y, ndc.z)
      .applyMatrix4(this.projectionMatrixInverse)
      .applyMatrix4(this.matrixWorld);
  }
}

const _projScreen = new Matrix4();
