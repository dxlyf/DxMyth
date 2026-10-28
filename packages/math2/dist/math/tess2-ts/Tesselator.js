import { WINDING, ELEMENT } from "./utils/constants.js";
import { TESSmesh } from "./mesh/TESSmesh.js";
import { Geom } from "./utils/Geom.js";
import { Sweep } from "./utils/Sweep.js";
class Tesselator {
  /*** state needed for collecting the input data ***/
  /* stores the input contours, and eventually the tessellation itself */
  mesh = new TESSmesh();
  /*** state needed for projecting onto the sweep plane ***/
  normal = [0, 0, 0];
  /* user-specified normal (if provided) */
  sUnit = [0, 0, 0];
  /* unit vector in s-direction (debugging) */
  tUnit = [0, 0, 0];
  /* unit vector in t-direction (debugging) */
  bmin = [0, 0];
  bmax = [0, 0];
  /*** state needed for the line sweep ***/
  /* rule for determining polygon interior */
  windingRule = WINDING.ODD;
  dict = null;
  /* edge dictionary for sweep line */
  pq = null;
  /* priority queue of vertex events */
  event = null;
  /* current sweep event being processed */
  vertexIndexCounter = 0;
  vertices = [];
  vertexIndices = [];
  vertexCount = 0;
  elements = [];
  elementCount = 0;
  dot_(u, v) {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  }
  normalize_(v) {
    let len = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    if (!len) {
      throw "Zero-size vector!";
    }
    len = Math.sqrt(len);
    v[0] /= len;
    v[1] /= len;
    v[2] /= len;
  }
  longAxis_(v) {
    let i = 0;
    if (Math.abs(v[1]) > Math.abs(v[0])) {
      i = 1;
    }
    if (Math.abs(v[2]) > Math.abs(v[i])) {
      i = 2;
    }
    return i;
  }
  computeNormal_(norm) {
    let v, v1, v2;
    let c, tLen2, maxLen2;
    let maxVal = [0, 0, 0], minVal = [0, 0, 0], d1 = [0, 0, 0], d2 = [0, 0, 0], tNorm = [0, 0, 0];
    const maxVert = [null, null, null], minVert = [null, null, null];
    const vHead = this.mesh.vHead;
    v = vHead.next;
    for (let i2 = 0; i2 < 3; ++i2) {
      c = v.coords[i2];
      minVal[i2] = c;
      minVert[i2] = v;
      maxVal[i2] = c;
      maxVert[i2] = v;
    }
    for (v = vHead.next; v !== vHead; v = v.next) {
      for (let i2 = 0; i2 < 3; ++i2) {
        c = v.coords[i2];
        if (c < minVal[i2]) {
          minVal[i2] = c;
          minVert[i2] = v;
        }
        if (c > maxVal[i2]) {
          maxVal[i2] = c;
          maxVert[i2] = v;
        }
      }
    }
    let i = 0;
    if (maxVal[1] - minVal[1] > maxVal[0] - minVal[0]) {
      i = 1;
    }
    if (maxVal[2] - minVal[2] > maxVal[i] - minVal[i]) {
      i = 2;
    }
    if (minVal[i] >= maxVal[i]) {
      norm[0] = 0;
      norm[1] = 0;
      norm[2] = 1;
      return;
    }
    maxLen2 = 0;
    v1 = minVert[i];
    v2 = maxVert[i];
    d1[0] = v1.coords[0] - v2.coords[0];
    d1[1] = v1.coords[1] - v2.coords[1];
    d1[2] = v1.coords[2] - v2.coords[2];
    for (v = vHead.next; v !== vHead; v = v.next) {
      d2[0] = v.coords[0] - v2.coords[0];
      d2[1] = v.coords[1] - v2.coords[1];
      d2[2] = v.coords[2] - v2.coords[2];
      tNorm[0] = d1[1] * d2[2] - d1[2] * d2[1];
      tNorm[1] = d1[2] * d2[0] - d1[0] * d2[2];
      tNorm[2] = d1[0] * d2[1] - d1[1] * d2[0];
      tLen2 = tNorm[0] * tNorm[0] + tNorm[1] * tNorm[1] + tNorm[2] * tNorm[2];
      if (tLen2 > maxLen2) {
        maxLen2 = tLen2;
        norm[0] = tNorm[0];
        norm[1] = tNorm[1];
        norm[2] = tNorm[2];
      }
    }
    if (maxLen2 <= 0) {
      norm[0] = norm[1] = norm[2] = 0;
      norm[this.longAxis_(d1)] = 1;
    }
  }
  checkOrientation_() {
    var fHead = this.mesh.fHead;
    var v, vHead = this.mesh.vHead;
    var e;
    let area = 0;
    for (let f2 = fHead.next; f2 !== fHead; f2 = f2.next) {
      e = f2.anEdge;
      if (e.winding <= 0) continue;
      do {
        area += (e.Org.s - e.Dst.s) * (e.Org.t + e.Dst.t);
        e = e.Lnext;
      } while (e !== f2.anEdge);
    }
    if (area < 0) {
      for (v = vHead.next; v !== vHead; v = v.next) {
        v.t = -v.t;
      }
      this.tUnit[0] = -this.tUnit[0];
      this.tUnit[1] = -this.tUnit[1];
      this.tUnit[2] = -this.tUnit[2];
    }
  }
  /*	#ifdef FOR_TRITE_TEST_PROGRAM
  	#include <stdlib.h>
  	extern int RandomSweep;
  	#define S_UNIT_X	(RandomSweep ? (2*drand48()-1) : 1.0)
  	#define S_UNIT_Y	(RandomSweep ? (2*drand48()-1) : 0.0)
  	#else
  	#if defined(SLANTED_SWEEP) */
  /* The "feature merging" is not intended to be complete.  There are
   * special cases where edges are nearly parallel to the sweep line
   * which are not implemented.  The algorithm should still behave
   * robustly (ie. produce a reasonable tesselation) in the presence
   * of such edges, however it may miss features which could have been
   * merged.  We could minimize this effect by choosing the sweep line
   * direction to be something unusual (ie. not parallel to one of the
   * coordinate axes).
   */
  /*	#define S_UNIT_X	(TESSreal)0.50941539564955385	// Pre-normalized
  	#define S_UNIT_Y	(TESSreal)0.86052074622010633
  	#else
  	#define S_UNIT_X	(TESSreal)1.0
  	#define S_UNIT_Y	(TESSreal)0.0
  	#endif
  	#endif*/
  /* Determine the polygon normal and project vertices onto the plane
   * of the polygon.
   */
  projectPolygon_() {
    let vHead = this.mesh.vHead;
    let norm = [0, 0, 0];
    let sUnit, tUnit;
    let computedNormal = false;
    norm[0] = this.normal[0];
    norm[1] = this.normal[1];
    norm[2] = this.normal[2];
    if (!norm[0] && !norm[1] && !norm[2]) {
      this.computeNormal_(norm);
      computedNormal = true;
    }
    sUnit = this.sUnit;
    tUnit = this.tUnit;
    let axis = this.longAxis_(norm);
    sUnit[axis] = 0;
    sUnit[(axis + 1) % 3] = 1;
    sUnit[(axis + 2) % 3] = 0;
    tUnit[axis] = 0;
    tUnit[(axis + 1) % 3] = 0;
    tUnit[(axis + 2) % 3] = norm[axis] > 0 ? 1 : -1;
    for (let v2 = vHead.next; v2 !== vHead; v2 = v2.next) {
      v2.s = this.dot_(v2.coords, sUnit);
      v2.t = this.dot_(v2.coords, tUnit);
    }
    if (computedNormal) {
      this.checkOrientation_();
    }
    let first = true;
    for (let v2 = vHead.next; v2 !== vHead; v2 = v2.next) {
      if (first) {
        this.bmin[0] = this.bmax[0] = v2.s;
        this.bmin[1] = this.bmax[1] = v2.t;
        first = false;
      } else {
        if (v2.s < this.bmin[0]) this.bmin[0] = v2.s;
        if (v2.s > this.bmax[0]) this.bmax[0] = v2.s;
        if (v2.t < this.bmin[1]) this.bmin[1] = v2.t;
        if (v2.t > this.bmax[1]) this.bmax[1] = v2.t;
      }
    }
  }
  addWinding_(eDst, eSrc) {
    eDst.winding += eSrc.winding;
    eDst.Sym.winding += eSrc.Sym.winding;
  }
  /* tessMeshTessellateMonoRegion( face ) tessellates a monotone region
   * (what else would it do??)  The region must consist of a single
   * loop of half-edges (see mesh.h) oriented CCW.  "Monotone" in this
   * case means that any vertical line intersects the interior of the
   * region in a single interval.
   *
   * Tessellation consists of adding interior edges (actually pairs of
   * half-edges), to split the region into non-overlapping triangles.
   *
   * The basic idea is explained in Preparata and Shamos (which I don''t
   * have handy right now), although their implementation is more
   * complicated than this one.  The are two edge chains, an upper chain
   * and a lower chain.  We process all vertices from both chains in order,
   * from right to left.
   *
   * The algorithm ensures that the following invariant holds after each
   * vertex is processed: the untessellated region consists of two
   * chains, where one chain (say the upper) is a single edge, and
   * the other chain is concave.  The left vertex of the single edge
   * is always to the left of all vertices in the concave chain.
   *
   * Each step consists of adding the rightmost unprocessed vertex to one
   * of the two chains, and forming a fan of triangles from the rightmost
   * of two chain endpoints.  Determining whether we can add each triangle
   * to the fan is a simple orientation test.  By making the fan as large
   * as possible, we restore the invariant (check it yourself).
   */
  //	int tessMeshTessellateMonoRegion( TESSmesh *mesh, TESSface *face )
  tessellateMonoRegion_(mesh, face) {
    let up, lo;
    up = face.anEdge;
    if (!(up.Lnext !== up && up.Lnext.Lnext !== up)) {
      throw "Mono region invalid";
    }
    for (; Geom.vertLeq(up.Dst, up.Org); up = up.Lprev) ;
    for (; Geom.vertLeq(up.Org, up.Dst); up = up.Lnext) ;
    lo = up.Lprev;
    let tempHalfEdge = void 0;
    while (up.Lnext !== lo) {
      if (Geom.vertLeq(up.Dst, lo.Org)) {
        while (lo.Lnext !== up && (Geom.edgeGoesLeft(lo.Lnext) || Geom.edgeSign(lo.Org, lo.Dst, lo.Lnext.Dst) <= 0)) {
          tempHalfEdge = mesh.connect(lo.Lnext, lo);
          lo = tempHalfEdge.Sym;
        }
        lo = lo.Lprev;
      } else {
        while (lo.Lnext !== up && (Geom.edgeGoesRight(up.Lprev) || Geom.edgeSign(up.Dst, up.Org, up.Lprev.Org) >= 0)) {
          tempHalfEdge = mesh.connect(up, up.Lprev);
          up = tempHalfEdge.Sym;
        }
        up = up.Lnext;
      }
    }
    if (lo.Lnext === up) {
      throw "Mono region invalid";
    }
    while (lo.Lnext.Lnext !== up) {
      tempHalfEdge = mesh.connect(lo.Lnext, lo);
      lo = tempHalfEdge.Sym;
    }
    return true;
  }
  /* tessMeshTessellateInterior( mesh ) tessellates each region of
   * the mesh which is marked "inside" the polygon.  Each such region
   * must be monotone.
   */
  //int tessMeshTessellateInterior( TESSmesh *mesh )
  tessellateInterior_(mesh) {
    let next;
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = next) {
      next = f.next;
      if (f.inside) {
        if (!this.tessellateMonoRegion_(mesh, f)) {
          return false;
        }
      }
    }
    return true;
  }
  /* tessMeshDiscardExterior( mesh ) zaps (ie. sets to NULL) all faces
   * which are not marked "inside" the polygon.  Since further mesh operations
   * on NULL faces are not allowed, the main purpose is to clean up the
   * mesh so that exterior loops are not represented in the data structure.
   */
  //void tessMeshDiscardExterior( TESSmesh *mesh )
  discardExterior_(mesh) {
    let next;
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = next) {
      next = f.next;
      if (!f.inside) {
        mesh.zapFace(f);
      }
    }
  }
  /* tessMeshSetWindingNumber( mesh, value, keepOnlyBoundary ) resets the
   * winding numbers on all edges so that regions marked "inside" the
   * polygon have a winding number of "value", and regions outside
   * have a winding number of 0.
   *
   * If keepOnlyBoundary is TRUE, it also deletes all edges which do not
   * separate an interior region from an exterior one.
   */
  //	int tessMeshSetWindingNumber( TESSmesh *mesh, int value, int keepOnlyBoundary )
  setWindingNumber_(mesh, value, keepOnlyBoundary) {
    let eNext;
    for (let e = mesh.eHead.next; e !== mesh.eHead; e = eNext) {
      eNext = e.next;
      if (e.Rface.inside !== e.Lface.inside) {
        e.winding = e.Lface.inside ? value : -value;
      } else {
        if (!keepOnlyBoundary) {
          e.winding = 0;
        } else {
          mesh.delete(e);
        }
      }
    }
  }
  getNeighbourFace_(edge) {
    if (!edge.Rface) return -1;
    if (!edge.Rface.inside) return -1;
    return edge.Rface.n;
  }
  outputPolymesh_(mesh, elementType, polySize, vertexSize) {
    let edge;
    let maxFaceCount = 0;
    let maxVertexCount = 0;
    let faceVerts;
    if (polySize > 3) {
      mesh.mergeConvexFaces(polySize);
    }
    for (let v = mesh.vHead.next; v !== mesh.vHead; v = v.next) {
      v.n = -1;
    }
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = f.next) {
      f.n = -1;
      if (!f.inside) {
        continue;
      }
      edge = f.anEdge;
      faceVerts = 0;
      do {
        let v = edge.Org;
        if (v.n === -1) {
          v.n = maxVertexCount;
          maxVertexCount++;
        }
        faceVerts++;
        edge = edge.Lnext;
      } while (edge !== f.anEdge);
      if (faceVerts > polySize) {
        throw `Face vertex greater that support polygon`;
      }
      f.n = maxFaceCount;
      ++maxFaceCount;
    }
    this.elementCount = maxFaceCount;
    if (elementType === ELEMENT.CONNECTED_POLYGONS) {
      maxFaceCount *= 2;
    }
    this.elements = [];
    this.elements.length = maxFaceCount * polySize;
    this.vertexCount = maxVertexCount;
    this.vertices = [];
    this.vertices.length = maxVertexCount * vertexSize;
    this.vertexIndices = [];
    this.vertexIndices.length = maxVertexCount;
    for (let v = mesh.vHead.next; v !== mesh.vHead; v = v.next) {
      if (v.n !== -1) {
        var idx = v.n * vertexSize;
        this.vertices[idx + 0] = v.coords[0];
        this.vertices[idx + 1] = v.coords[1];
        if (vertexSize > 2) {
          this.vertices[idx + 2] = v.coords[2];
        }
        this.vertexIndices[v.n] = v.idx;
      }
    }
    let nel = 0;
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = f.next) {
      if (!f.inside) continue;
      edge = f.anEdge;
      faceVerts = 0;
      do {
        let v = edge.Org;
        this.elements[nel++] = v.n;
        faceVerts++;
        edge = edge.Lnext;
      } while (edge !== f.anEdge);
      for (let i2 = faceVerts; i2 < polySize; ++i2) {
        this.elements[nel++] = -1;
      }
      if (elementType === ELEMENT.CONNECTED_POLYGONS) {
        edge = f.anEdge;
        do {
          this.elements[nel++] = this.getNeighbourFace_(edge);
          edge = edge.Lnext;
        } while (edge !== f.anEdge);
        for (let i2 = faceVerts; i2 < polySize; ++i2) {
          this.elements[nel++] = -1;
        }
      }
    }
  }
  //	void OutputContours( TESStesselator *tess, TESSmesh *mesh, int vertexSize )
  outputContours_(mesh, vertexSize) {
    let edge;
    let start;
    let startVert = 0;
    let vertCount = 0;
    this.vertexCount = 0;
    this.elementCount = 0;
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = f.next) {
      if (!f.inside) {
        continue;
      }
      start = edge = f.anEdge;
      do {
        this.vertexCount++;
        edge = edge.Lnext;
      } while (edge !== start);
      this.elementCount++;
    }
    this.elements = [];
    this.elements.length = this.elementCount * 2;
    this.vertices = [];
    this.vertices.length = this.vertexCount * vertexSize;
    this.vertexIndices = [];
    this.vertexIndices.length = this.vertexCount;
    let nv = 0;
    let nvi = 0;
    let nel = 0;
    startVert = 0;
    for (let f = mesh.fHead.next; f !== mesh.fHead; f = f.next) {
      if (!f.inside) {
        continue;
      }
      vertCount = 0;
      start = edge = f.anEdge;
      do {
        this.vertices[nv++] = edge.Org.coords[0];
        this.vertices[nv++] = edge.Org.coords[1];
        if (vertexSize > 2) {
          this.vertices[nv++] = edge.Org.coords[2];
        }
        this.vertexIndices[nvi++] = edge.Org.idx;
        vertCount++;
        edge = edge.Lnext;
      } while (edge !== start);
      this.elements[nel++] = startVert;
      this.elements[nel++] = vertCount;
      startVert += vertCount;
    }
  }
  addContour(size, vertices) {
    if (this.mesh === null) {
      this.mesh = new TESSmesh();
    }
    if (size < 2) {
      size = 2;
    }
    if (size > 3) {
      size = 3;
    }
    let e = null;
    for (let i = 0; i < vertices.length; i += size) {
      if (e === null) {
        e = this.mesh.makeEdge();
        this.mesh.splice(e, e.Sym);
      } else {
        this.mesh.splitEdge(e);
        e = e.Lnext;
      }
      e.Org.coords[0] = vertices[i + 0];
      e.Org.coords[1] = vertices[i + 1];
      if (size > 2) {
        e.Org.coords[2] = vertices[i + 2];
      } else {
        e.Org.coords[2] = 0;
      }
      e.Org.idx = this.vertexIndexCounter++;
      e.winding = 1;
      e.Sym.winding = -1;
    }
  }
  //	int tessTesselate( TESStesselator *tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal )
  /**
   * Run tesselation
   * @param windingRule 
   * @param elementType 
   * @param polySize 
   * @param vertexSize 
   * @param normal 
   * @param validate UNSAFE! Skip mesh validation pass, may throw any error.
   */
  tesselate(windingRule = WINDING.ODD, elementType = ELEMENT.POLYGONS, polySize, vertexSize, normal, validate = true) {
    this.vertices = [];
    this.elements = [];
    this.vertexIndices = [];
    this.vertexIndexCounter = 0;
    if (normal) {
      this.normal[0] = normal[0];
      this.normal[1] = normal[1];
      this.normal[2] = normal[2];
    }
    this.windingRule = windingRule;
    if (vertexSize < 2) {
      vertexSize = 2;
    }
    if (vertexSize > 3) {
      vertexSize = 3;
    }
    if (!this.mesh) {
      return false;
    }
    this.projectPolygon_();
    Sweep.computeInterior(this, validate);
    var mesh = this.mesh;
    if (elementType === ELEMENT.BOUNDARY_CONTOURS) {
      this.setWindingNumber_(mesh, 1, true);
    } else {
      this.tessellateInterior_(mesh);
    }
    if (validate) {
      mesh.check();
    }
    if (elementType === ELEMENT.BOUNDARY_CONTOURS) {
      this.outputContours_(mesh, vertexSize);
    } else {
      this.outputPolymesh_(
        mesh,
        elementType,
        polySize,
        vertexSize
      );
    }
    return true;
  }
}
export {
  Tesselator
};
