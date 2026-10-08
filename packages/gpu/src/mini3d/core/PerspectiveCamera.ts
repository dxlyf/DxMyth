import { Camera } from './Camera';

/**
 * Perspective camera with a vertical field of view (degrees), matching
 * three.js argument order: `fov, aspect, near, far`.
 */
export class PerspectiveCamera extends Camera {
  readonly isPerspectiveCamera = true;
  override type = 'PerspectiveCamera';

  fov: number;
  aspect: number;
  /** Sensor height in millimetres; only used by `setFocalLength`. */
  filmGauge = 35;
  filmOffset = 0;

  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  override updateProjectionMatrix(): void {
    const near = this.near;
    let top = (near * Math.tan((Math.PI * this.fov) / 360)) / this.zoom;
    let height = 2 * top;
    let width = this.aspect * height;
    let left = -0.5 * width;
    const view = this.view;

    if (view.enabled) {
      const fullWidth = view.fullWidth;
      const fullHeight = view.fullHeight;
      left += (view.offsetX * width) / fullWidth;
      top -= (view.offsetY * height) / fullHeight;
      width *= view.width / fullWidth;
      height *= view.height / fullHeight;
    }

    const skew = this.filmOffset;
    if (skew !== 0) left += (near * skew) / this.getFilmWidth();

    this.projectionMatrix.makePerspective(
      left,
      left + width,
      top,
      top - height,
      near,
      this.far,
      this.coordinateSystem,
    );
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }

  getFilmWidth(): number {
    return this.filmGauge * Math.min(this.aspect, 1);
  }

  getFilmHeight(): number {
    return this.filmGauge / Math.max(this.aspect, 1);
  }

  /** Sets `fov` from a focal length in millimetres. */
  setFocalLength(focalLength: number): this {
    const vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;
    this.fov = (360 / Math.PI) * Math.atan(vExtentSlope);
    this.updateProjectionMatrix();
    return this;
  }

  getFocalLength(): number {
    const vExtentSlope = Math.tan((Math.PI * 0.5 * this.fov) / 180);
    return (0.5 * this.getFilmHeight()) / vExtentSlope;
  }

  /** Keeps the vertical framing while changing the viewport aspect. */
  setAspect(aspect: number): this {
    this.aspect = aspect;
    this.updateProjectionMatrix();
    return this;
  }

  /** Horizontal field of view in degrees (derived from `fov` + aspect). */
  getEffectiveFOV(): number {
    return (360 / Math.PI) * Math.atan(Math.tan((Math.PI * this.fov) / 360) / this.aspect);
  }

  /** Full vertical field of view including the zoom factor. */
  getEffectiveFOVWithZoom(): number {
    return (360 / Math.PI) * Math.atan(Math.tan((Math.PI * this.fov) / 360) / this.zoom);
  }
}
