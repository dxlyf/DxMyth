import { Object3D } from './Object3D';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Sphere } from '../math/Sphere';
import { Line3 } from '../math/Line3';
import { triangleHit, buildFace, interpolateUv, makeHit } from './RaycastUtils';
import type { BufferGeometry } from './BufferGeometry';
import type { Material } from '../materials/Material';
import type { Box3 } from '../math/Box3';
import type { Intersection, Raycaster } from './Raycaster';

/**
 * A drawable geometry + material pair. `Mesh` renders triangles, `Line`
 * renders segments and `Points` renders a point cloud; all three share the
 * same geometry/material plumbing and differ only in `drawMode`.
 */
export class Mesh<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material | Material[] = Material | Material[],
> extends Object3D {
  readonly isMesh = true;
  override type = 'Mesh';
  geometry: TGeometry;
  material: TMaterial;

  constructor(geometry: TGeometry, material: TMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }

  /** Uses the geometry's own bounds transform (identity by default). */
  getBoundingBox(): Box3 {
    return this.geometry.getBoundingBox();
  }

  getBoundingSphere(): Sphere {
    return this.geometry.getBoundingSphere();
  }

  /**
   * Triangle-exact raycast. Prunes with the geometry's bounding sphere, then
   * respects the material's `side` for back-face culling.
   */
  override raycast(raycaster: Raycaster, intersects: Intersection[]): void {
    const material = this.material;
    if (Array.isArray(material) ? material.length === 0 : !material) return;
    const geometry = this.geometry;
    const position = geometry.attributes.position;
    if (!position) return;

    // Bounding-sphere rejection first: the cheapest possible early out.
    _sphere.copy(geometry.getBoundingSphere()).applyMatrix4(this.matrixWorld);
    if (!raycaster.ray.intersectsSphere(_sphere)) return;

    const first = Array.isArray(material) ? material[0] : (material as Material);
    const side = first ? first.side : 'front';
    const doubleSided = side === 'double';
    const materialIndexHint = (index: number): number => {
      if (!geometry.groups.length) return 0;
      for (const group of geometry.groups) {
        if (index >= group.start && index < group.start + group.count) {
          return group.materialIndex;
        }
      }
      return 0;
    };

    const index = geometry.index;
    const elementCount = index ? index.count : position.count;
    const drawStart = Math.max(geometry.drawRange.start, 0);
    const drawEnd = Math.min(
      elementCount,
      drawStart + (Number.isFinite(geometry.drawRange.count) ? geometry.drawRange.count : elementCount),
    );

    for (let i = drawStart; i < drawEnd; i += 3) {
      const ia = index ? index.array[i] : i;
      const ib = index ? index.array[i + 1] : i + 1;
      const ic = index ? index.array[i + 2] : i + 2;

      // `triangleHit` tests in world space, so `_localPoint` holds the world-space
      // hit point and the face normal it produces is world-space too.
      if (!triangleHit(raycaster, geometry, ia, ib, ic, this.matrixWorld, _localPoint, _bary)) {
        continue;
      }

      const face = buildFace(geometry, ia, ib, ic, _bary);
      if (face) face.materialIndex = materialIndexHint(i);

      if (!doubleSided) {
        const facing = raycaster.ray.direction.dot(face?.normal ?? _faceNormal.set(0, 0, 1));
        // Front-facing means the normal points back towards the ray.
        if (side === 'front' ? facing > 0 : facing < 0) continue;
      }

      const intersection = makeHit(raycaster, _localPoint, this, i);
      intersection.face = face;
      intersection.barycoord = _bary.clone();
      const uvAttribute = geometry.attributes.uv as
        | { array: ArrayLike<number>; itemSize: number }
        | undefined;
      const uv = interpolateUv(uvAttribute as never, ia, ib, ic, _bary);
      if (uv) intersection.uv = uv;

      intersects.push(intersection);
    }
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const mesh = source as Mesh<TGeometry, TMaterial>;
    this.geometry = mesh.geometry;
    this.material = mesh.material;
    return this;
  }

  override dispose(): void {
    this.geometry?.dispose();
    const material = this.material;
    if (Array.isArray(material)) {
      for (const entry of material as Material[]) entry?.dispose();
    } else if (material) {
      (material as Material).dispose();
    }
    super.dispose();
  }
}

/** Indexed or non-indexed line segments (`drawMode: 'lines'`). */
export class Line<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material = Material,
> extends Object3D {
  readonly isLine = true;
  override type = 'Line';
  geometry: TGeometry;
  material: TMaterial;

  constructor(geometry: TGeometry, material: TMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
    // The draw mode lives on the geometry because it describes how the vertex
    // data is interpreted; a line/point node must declare it or a backend will
    // default to triangles.
    geometry.setDrawMode('lines');
  }

  /** Segment-based raycast with a distance threshold in world units. */
  override raycast(raycaster: Raycaster, intersects: Intersection[]): void {
    const geometry = this.geometry;
    const position = geometry.attributes.position;
    if (!position) return;

    _sphere.copy(geometry.getBoundingSphere()).applyMatrix4(this.matrixWorld);
    if (!raycaster.ray.intersectsSphere(_sphere)) return;

    const threshold = raycaster.params.Line.threshold;
    const thresholdSq = threshold * threshold;
    const index = geometry.index;
    const start = geometry.drawRange.start;
    const count = index ? index.count : position.count;
    const end = Math.min(count, Number.isFinite(geometry.drawRange.count) ? start + geometry.drawRange.count : count);
    const step = this.type === 'LineSegments' ? 2 : 1;

    for (let i = start; i < end - 1; i += step) {
      const ia = index ? index.array[i] : i;
      const ib = index ? index.array[i + 1] : i + 1;
      _v0.fromArray(position.array, ia * position.itemSize).applyMatrix4(this.matrixWorld);
      _v1.fromArray(position.array, ib * position.itemSize).applyMatrix4(this.matrixWorld);
      _line.set(_v0, _v1);

      const pointOnLine = _line.closestPointToPoint(raycaster.ray.origin, true, _localPoint);
      const distance = raycaster.ray.distanceSqToPoint(pointOnLine);
      if (distance > thresholdSq) continue;

      const point = pointOnLine.clone();
      const hitDistance = raycaster.ray.origin.distanceTo(point);
      if (hitDistance < raycaster.near || hitDistance > raycaster.far) continue;

      intersects.push({
        distance: hitDistance,
        point,
        object: this,
        index: i,
        face: null,
      });
    }
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const line = source as Line<TGeometry, TMaterial>;
    this.geometry = line.geometry;
    this.material = line.material;
    return this;
  }
}

/** Connected line strip (`drawMode: 'line-strip'`). */
export class LineSegments<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material = Material,
> extends Line<TGeometry, TMaterial> {
  readonly isLineSegments = true;

  constructor(geometry: TGeometry, material: TMaterial) {
    super(geometry, material);
    this.type = 'LineSegments';
  }
}

/** A single closed loop, rendered as a line strip plus a closing segment. */
export class LineLoop<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material = Material,
> extends Line<TGeometry, TMaterial> {
  readonly isLineLoop = true;

  constructor(geometry: TGeometry, material: TMaterial) {
    super(geometry, material);
    this.type = 'LineLoop';
  }
}

/** Point cloud (`drawMode: 'points'`). */
export class Points<
  TGeometry extends BufferGeometry = BufferGeometry,
  TMaterial extends Material = Material,
> extends Object3D {
  readonly isPoints = true;
  override type = 'Points';
  geometry: TGeometry;
  material: TMaterial;

  constructor(geometry: TGeometry, material: TMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
    geometry.setDrawMode('points');
  }

  /** Per-vertex raycast with a distance threshold in world units. */
  override raycast(raycaster: Raycaster, intersects: Intersection[]): void {
    const geometry = this.geometry;
    const position = geometry.attributes.position;
    if (!position) return;

    _sphere.copy(geometry.getBoundingSphere()).applyMatrix4(this.matrixWorld);
    if (!raycaster.ray.intersectsSphere(_sphere)) return;

    const threshold = raycaster.params.Points.threshold;
    const thresholdSq = threshold * threshold;
    const drawStart = geometry.drawRange.start;
    const drawEnd = Math.min(
      position.count,
      Number.isFinite(geometry.drawRange.count) ? drawStart + geometry.drawRange.count : position.count,
    );

    for (let i = drawStart; i < drawEnd; i++) {
      _localPoint.fromArray(position.array, i * position.itemSize).applyMatrix4(this.matrixWorld);
      const distanceSq = raycaster.ray.distanceSqToPoint(_localPoint);
      if (distanceSq > thresholdSq) continue;

      const point = _localPoint.clone();
      const distance = raycaster.ray.origin.distanceTo(point);
      if (distance < raycaster.near || distance > raycaster.far) continue;

      intersects.push({ distance, point, object: this, index: i, face: null });
    }
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const points = source as Points<TGeometry, TMaterial>;
    this.geometry = points.geometry;
    this.material = points.material;
    return this;
  }
}

/** Billboarded quad; renders through the sprite shader path. */
export class Sprite extends Object3D {
  readonly isSprite = true;
  override type = 'Sprite';
  material: Material;
  /** Pivot in `[-1, 1]` quad space; `(-0.5, -0.5)` is the default centre. */
  center = { x: 0.5, y: 0.5 };

  constructor(material: Material) {
    super();
    this.material = material;
  }

  override copy(source: Object3D, recursive = true): this {
    super.copy(source, recursive);
    const sprite = source as Sprite;
    this.material = sprite.material;
    this.center = { ...sprite.center };
    return this;
  }
}

/** Empty transform node, handy for grouping. */
export class Group extends Object3D {
  readonly isGroup = true;
  override type = 'Group';
}

// Scratch objects: raycasting avoids per-triangle allocation.
const _sphere = new Sphere();
const _localPoint = new Vector3();
const _bary = new Vector3();
const _v0 = new Vector3();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _edge1 = new Vector3();
const _edge2 = new Vector3();
const _faceNormal = new Vector3();
const _line = new Line3();
