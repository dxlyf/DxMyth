import { Camera } from './Camera';

/**
 * Orthographic camera. Both the six-argument form
 * `(left, right, top, bottom, near, far)` and the legacy
 * `(width, height, near, far)` frustum-size form are accepted, matching
 * three.js.
 */
export class OrthographicCamera extends Camera {
  readonly isOrthographicCamera = true;
  override type = 'OrthographicCamera';

  left: number;
  right: number;
  top: number;
  bottom: number;
  /** When set, the constructor was called with `(width, height, near, far)`. */
  viewWidth: number | null = null;
  viewHeight: number | null = null;

  constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2000) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  /** Convenience constructor for a symmetric frustum in world units. */
  static fromSize(width: number, height: number, near = 0.1, far = 2000): OrthographicCamera {
    const camera = new OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far,
    );
    camera.viewWidth = width;
    camera.viewHeight = height;
    return camera;
  }

  override updateProjectionMatrix(): void {
    const dx = (this.right - this.left) / (2 * this.zoom);
    const dy = (this.top - this.bottom) / (2 * this.zoom);
    const cx = (this.right + this.left) / 2;
    const cy = (this.top + this.bottom) / 2;
    let left = cx - dx;
    let right = cx + dx;
    let top = cy + dy;
    let bottom = cy - dy;
    const view = this.view;

    if (view.enabled) {
      const zoomW = this.zoom / (view.width / view.fullWidth);
      const zoomH = this.zoom / (view.height / view.fullHeight);
      left += (view.offsetX * (dx * 2)) / view.fullWidth / (zoomW / this.zoom);
      right += (view.offsetX * (dx * 2)) / view.fullWidth / (zoomW / this.zoom);
      top -= (view.offsetY * (dy * 2)) / view.fullHeight / (zoomH / this.zoom);
      bottom -= (view.offsetY * (dy * 2)) / view.fullHeight / (zoomH / this.zoom);
    }

    this.projectionMatrix.makeOrthographic(
      left,
      right,
      top,
      bottom,
      this.near,
      this.far,
      this.coordinateSystem,
    );
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }

  /** Resizes a symmetric frustum (only meaningful for `fromSize` cameras). */
  setSize(width: number, height: number): this {
    this.viewWidth = width;
    this.viewHeight = height;
    this.left = -width / 2;
    this.right = width / 2;
    this.top = height / 2;
    this.bottom = -height / 2;
    this.updateProjectionMatrix();
    return this;
  }
}
