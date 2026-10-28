import { Matrix } from "./matrix/Matrix.js";
import { ObservablePoint } from "./point/ObservablePoint.js";
class Transform {
  /**
   * A default (identity) transform.
   * @static
   * @type {PIXI.Transform}
   */
  static IDENTITY = new Transform();
  /** The world transformation matrix. */
  worldTransform;
  /** The local transformation matrix. */
  localTransform;
  /** The coordinate of the object relative to the local coordinates of the parent. */
  position;
  /** The scale factor of the object. */
  scale;
  /** The pivot point of the displayObject that it rotates around. */
  pivot;
  /** The skew amount, on the x and y axis. */
  skew;
  /** The locally unique ID of the parent's world transform used to calculate the current world transformation matrix. */
  _parentID;
  /** The locally unique ID of the world transform. */
  _worldID;
  /** The rotation amount. */
  _rotation;
  /**
   * The X-coordinate value of the normalized local X axis,
   * the first column of the local transformation matrix without a scale.
   */
  _cx;
  /**
   * The Y-coordinate value of the normalized local X axis,
   * the first column of the local transformation matrix without a scale.
   */
  _sx;
  /**
   * The X-coordinate value of the normalized local Y axis,
   * the second column of the local transformation matrix without a scale.
   */
  _cy;
  /**
   * The Y-coordinate value of the normalized local Y axis,
   * the second column of the local transformation matrix without a scale.
   */
  _sy;
  /** The locally unique ID of the local transform. */
  _localID;
  /** The locally unique ID of the local transform used to calculate the current local transformation matrix. */
  _currentLocalID;
  constructor() {
    this.worldTransform = new Matrix();
    this.localTransform = new Matrix();
    this.position = new ObservablePoint(this, 0, 0);
    this.scale = new ObservablePoint(this, 1, 1);
    this.pivot = new ObservablePoint(this, 0, 0);
    this.skew = new ObservablePoint(this, 0, 0);
    this._rotation = 0;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._localID = 0;
    this._currentLocalID = 0;
    this._worldID = 0;
    this._parentID = 0;
  }
  /** Called when a value changes. */
  _onUpdate(target) {
    if (target === this.skew) {
      this.updateSkew();
    } else {
      this._localID++;
    }
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y);
    this._sx = Math.sin(this._rotation + this.skew.y);
    this._cy = -Math.sin(this._rotation - this.skew.x);
    this._sy = Math.cos(this._rotation - this.skew.x);
    this._localID++;
  }
  /** Updates the local transformation matrix. */
  updateLocalTransform() {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
  }
  /**
   * Updates the local and the world transformation matrices.
   * @param parentTransform - The parent transform
   */
  updateTransform(parentTransform) {
    const lt = this.localTransform;
    if (this._localID !== this._currentLocalID) {
      lt.a = this._cx * this.scale.x;
      lt.b = this._sx * this.scale.x;
      lt.c = this._cy * this.scale.y;
      lt.d = this._sy * this.scale.y;
      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
      this._currentLocalID = this._localID;
      this._parentID = -1;
    }
    if (this._parentID !== parentTransform._worldID) {
      const pt = parentTransform.worldTransform;
      const wt = this.worldTransform;
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
      this._parentID = parentTransform._worldID;
      this._worldID++;
    }
  }
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @param matrix - The matrix to decompose
   */
  setFromMatrix(matrix) {
    matrix.decompose(this);
    this._localID++;
  }
  /** The rotation of the object in radians. */
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this.updateSkew();
    }
  }
}
export {
  Transform
};
