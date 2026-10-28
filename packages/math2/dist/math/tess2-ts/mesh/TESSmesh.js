import { Geom } from "../utils/Geom.js";
import { assert } from "../utils/assert.js";
import { TESSface } from "./TESSface.js";
import { TESShalfEdge } from "./TESShalfEdge.js";
import { TESSvertex } from "./TESSvertex.js";
class TESSmesh {
  vHead;
  /* dummy header for vertex list */
  fHead;
  /* dummy header for face list */
  eHead;
  /* dummy header for edge list */
  eHeadSym;
  /* and its symmetric counterpart */
  constructor() {
    const v = new TESSvertex();
    const f = new TESSface();
    const e = new TESShalfEdge(0);
    const eSym = new TESShalfEdge(1);
    v.next = v.prev = v;
    v.anEdge = null;
    f.next = f.prev = f;
    e.next = e;
    e.Sym = eSym;
    eSym.next = eSym;
    eSym.Sym = e;
    this.vHead = v;
    this.fHead = f;
    this.eHead = e;
    this.eHeadSym = eSym;
  }
  /* MakeEdge creates a new pair of half-edges which form their own loop.
   * No vertex or face structures are allocated, but these must be assigned
   * before the current edge operation is completed.
   */
  //static TESShalfEdge *MakeEdge( TESSmesh* mesh, TESShalfEdge *eNext )
  makeEdge_(eNext) {
    var e = new TESShalfEdge(0);
    var eSym = new TESShalfEdge(1);
    if (eNext.Sym.side < eNext.side) {
      eNext = eNext.Sym;
    }
    var ePrev = eNext.Sym.next;
    eSym.next = ePrev;
    ePrev.Sym.next = e;
    e.next = eNext;
    eNext.Sym.next = eSym;
    e.Sym = eSym;
    e.Onext = e;
    e.Lnext = eSym;
    e.Org = null;
    e.Lface = null;
    e.winding = 0;
    e.activeRegion = null;
    eSym.Sym = e;
    eSym.Onext = eSym;
    eSym.Lnext = e;
    eSym.Org = null;
    eSym.Lface = null;
    eSym.winding = 0;
    eSym.activeRegion = null;
    return e;
  }
  /* Splice( a, b ) is best described by the Guibas/Stolfi paper or the
   * CS348a notes (see mesh.h).  Basically it modifies the mesh so that
   * a->Onext and b->Onext are exchanged.  This can have various effects
   * depending on whether a and b belong to different face or vertex rings.
   * For more explanation see tessMeshSplice() below.
   */
  // static void Splice( TESShalfEdge *a, TESShalfEdge *b )
  splice_(a, b) {
    var aOnext = a.Onext;
    var bOnext = b.Onext;
    aOnext.Sym.Lnext = b;
    bOnext.Sym.Lnext = a;
    a.Onext = bOnext;
    b.Onext = aOnext;
  }
  /* MakeVertex( newVertex, eOrig, vNext ) attaches a new vertex and makes it the
   * origin of all edges in the vertex loop to which eOrig belongs. "vNext" gives
   * a place to insert the new vertex in the global vertex list.  We insert
   * the new vertex *before* vNext so that algorithms which walk the vertex
   * list will not see the newly created vertices.
   */
  //static void MakeVertex( TESSvertex *newVertex, TESShalfEdge *eOrig, TESSvertex *vNext )
  makeVertex_(newVertex, eOrig, vNext) {
    var vNew = newVertex;
    assert(vNew, "Vertex can't be null!");
    var vPrev = vNext.prev;
    vNew.prev = vPrev;
    vPrev.next = vNew;
    vNew.next = vNext;
    vNext.prev = vNew;
    vNew.anEdge = eOrig;
    var e = eOrig;
    do {
      e.Org = vNew;
      e = e.Onext;
    } while (e !== eOrig);
  }
  /* MakeFace( newFace, eOrig, fNext ) attaches a new face and makes it the left
   * face of all edges in the face loop to which eOrig belongs.  "fNext" gives
   * a place to insert the new face in the global face list.  We insert
   * the new face *before* fNext so that algorithms which walk the face
   * list will not see the newly created faces.
   */
  // static void MakeFace( TESSface *newFace, TESShalfEdge *eOrig, TESSface *fNext )
  makeFace_(newFace, eOrig, fNext) {
    var fNew = newFace;
    assert(fNew, "Face can't be null");
    var fPrev = fNext.prev;
    fNew.prev = fPrev;
    fPrev.next = fNew;
    fNew.next = fNext;
    fNext.prev = fNew;
    fNew.anEdge = eOrig;
    fNew.trail = null;
    fNew.marked = false;
    fNew.inside = fNext.inside;
    var e = eOrig;
    do {
      e.Lface = fNew;
      e = e.Lnext;
    } while (e !== eOrig);
  }
  /* KillEdge( eDel ) destroys an edge (the half-edges eDel and eDel->Sym),
   * and removes from the global edge list.
   */
  //static void KillEdge( TESSmesh *mesh, TESShalfEdge *eDel )
  killEdge_(eDel) {
    if (eDel.Sym.side < eDel.side) {
      eDel = eDel.Sym;
    }
    var eNext = eDel.next;
    var ePrev = eDel.Sym.next;
    eNext.Sym.next = ePrev;
    ePrev.Sym.next = eNext;
  }
  /* KillVertex( vDel ) destroys a vertex and removes it from the global
   * vertex list.  It updates the vertex loop to point to a given new vertex.
   */
  //static void KillVertex( TESSmesh *mesh, TESSvertex *vDel, TESSvertex *newOrg )
  killVertex_(vDel, newOrg) {
    var eStart = vDel.anEdge;
    var e = eStart;
    do {
      e.Org = newOrg;
      e = e.Onext;
    } while (e !== eStart);
    var vPrev = vDel.prev;
    var vNext = vDel.next;
    vNext.prev = vPrev;
    vPrev.next = vNext;
  }
  /* KillFace( fDel ) destroys a face and removes it from the global face
   * list.  It updates the face loop to point to a given new face.
   */
  //static void KillFace( TESSmesh *mesh, TESSface *fDel, TESSface *newLface )
  killFace_(fDel, newLface) {
    var eStart = fDel.anEdge;
    var e = eStart;
    do {
      e.Lface = newLface;
      e = e.Lnext;
    } while (e !== eStart);
    var fPrev = fDel.prev;
    var fNext = fDel.next;
    fNext.prev = fPrev;
    fPrev.next = fNext;
  }
  /****************** Basic Edge Operations **********************/
  /* tessMeshMakeEdge creates one edge, two vertices, and a loop (face).
   * The loop consists of the two new half-edges.
   */
  //TESShalfEdge *tessMeshMakeEdge( TESSmesh *mesh )
  makeEdge() {
    var newVertex1 = new TESSvertex();
    var newVertex2 = new TESSvertex();
    var newFace = new TESSface();
    var e = this.makeEdge_(this.eHead);
    this.makeVertex_(newVertex1, e, this.vHead);
    this.makeVertex_(newVertex2, e.Sym, this.vHead);
    this.makeFace_(newFace, e, this.fHead);
    return e;
  }
  /* tessMeshSplice( eOrg, eDst ) is the basic operation for changing the
   * mesh connectivity and topology.  It changes the mesh so that
   *	eOrg->Onext <- OLD( eDst->Onext )
   *	eDst->Onext <- OLD( eOrg->Onext )
   * where OLD(...) means the value before the meshSplice operation.
   *
   * This can have two effects on the vertex structure:
   *  - if eOrg->Org != eDst->Org, the two vertices are merged together
   *  - if eOrg->Org == eDst->Org, the origin is split into two vertices
   * In both cases, eDst->Org is changed and eOrg->Org is untouched.
   *
   * Similarly (and independently) for the face structure,
   *  - if eOrg->Lface == eDst->Lface, one loop is split into two
   *  - if eOrg->Lface != eDst->Lface, two distinct loops are joined into one
   * In both cases, eDst->Lface is changed and eOrg->Lface is unaffected.
   *
   * Some special cases:
   * If eDst == eOrg, the operation has no effect.
   * If eDst == eOrg->Lnext, the new face will have a single edge.
   * If eDst == eOrg->Lprev, the old face will have a single edge.
   * If eDst == eOrg->Onext, the new vertex will have a single edge.
   * If eDst == eOrg->Oprev, the old vertex will have a single edge.
   */
  //int tessMeshSplice( TESSmesh* mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst )
  splice(eOrg, eDst) {
    var joiningLoops = false;
    var joiningVertices = false;
    if (eOrg === eDst) return;
    if (eDst.Org !== eOrg.Org) {
      joiningVertices = true;
      this.killVertex_(eDst.Org, eOrg.Org);
    }
    if (eDst.Lface !== eOrg.Lface) {
      joiningLoops = true;
      this.killFace_(eDst.Lface, eOrg.Lface);
    }
    this.splice_(eDst, eOrg);
    if (!joiningVertices) {
      var newVertex = new TESSvertex();
      this.makeVertex_(newVertex, eDst, eOrg.Org);
      eOrg.Org.anEdge = eOrg;
    }
    if (!joiningLoops) {
      var newFace = new TESSface();
      this.makeFace_(newFace, eDst, eOrg.Lface);
      eOrg.Lface.anEdge = eOrg;
    }
  }
  /* tessMeshDelete( eDel ) removes the edge eDel.  There are several cases:
   * if (eDel->Lface != eDel->Rface), we join two loops into one; the loop
   * eDel->Lface is deleted.  Otherwise, we are splitting one loop into two;
   * the newly created loop will contain eDel->Dst.  If the deletion of eDel
   * would create isolated vertices, those are deleted as well.
   *
   * This function could be implemented as two calls to tessMeshSplice
   * plus a few calls to memFree, but this would allocate and delete
   * unnecessary vertices and faces.
   */
  //int tessMeshDelete( TESSmesh *mesh, TESShalfEdge *eDel )
  delete(eDel) {
    var eDelSym = eDel.Sym;
    var joiningLoops = false;
    if (eDel.Lface !== eDel.Rface) {
      joiningLoops = true;
      this.killFace_(eDel.Lface, eDel.Rface);
    }
    if (eDel.Onext === eDel) {
      this.killVertex_(eDel.Org, null);
    } else {
      eDel.Rface.anEdge = eDel.Oprev;
      eDel.Org.anEdge = eDel.Onext;
      this.splice_(eDel, eDel.Oprev);
      if (!joiningLoops) {
        var newFace = new TESSface();
        this.makeFace_(newFace, eDel, eDel.Lface);
      }
    }
    if (eDelSym.Onext === eDelSym) {
      this.killVertex_(eDelSym.Org, null);
      this.killFace_(eDelSym.Lface, null);
    } else {
      eDel.Lface.anEdge = eDelSym.Oprev;
      eDelSym.Org.anEdge = eDelSym.Onext;
      this.splice_(eDelSym, eDelSym.Oprev);
    }
    this.killEdge_(eDel);
  }
  /******************** Other Edge Operations **********************/
  /* All these routines can be implemented with the basic edge
   * operations above.  They are provided for convenience and efficiency.
   */
  /* tessMeshAddEdgeVertex( eOrg ) creates a new edge eNew such that
   * eNew == eOrg->Lnext, and eNew->Dst is a newly created vertex.
   * eOrg and eNew will have the same left face.
   */
  // TESShalfEdge *tessMeshAddEdgeVertex( TESSmesh *mesh, TESShalfEdge *eOrg );
  addEdgeVertex(eOrg) {
    var eNew = this.makeEdge_(eOrg);
    var eNewSym = eNew.Sym;
    this.splice_(eNew, eOrg.Lnext);
    eNew.Org = eOrg.Dst;
    var newVertex = new TESSvertex();
    this.makeVertex_(newVertex, eNewSym, eNew.Org);
    eNew.Lface = eNewSym.Lface = eOrg.Lface;
    return eNew;
  }
  /* tessMeshSplitEdge( eOrg ) splits eOrg into two edges eOrg and eNew,
   * such that eNew == eOrg->Lnext.  The new vertex is eOrg->Dst == eNew->Org.
   * eOrg and eNew will have the same left face.
   */
  // TESShalfEdge *tessMeshSplitEdge( TESSmesh *mesh, TESShalfEdge *eOrg );
  splitEdge(eOrg) {
    var tempHalfEdge = this.addEdgeVertex(eOrg);
    var eNew = tempHalfEdge.Sym;
    this.splice_(eOrg.Sym, eOrg.Sym.Oprev);
    this.splice_(eOrg.Sym, eNew);
    eOrg.Dst = eNew.Org;
    eNew.Dst.anEdge = eNew.Sym;
    eNew.Rface = eOrg.Rface;
    eNew.winding = eOrg.winding;
    eNew.Sym.winding = eOrg.Sym.winding;
    return eNew;
  }
  /* tessMeshConnect( eOrg, eDst ) creates a new edge from eOrg->Dst
   * to eDst->Org, and returns the corresponding half-edge eNew.
   * If eOrg->Lface == eDst->Lface, this splits one loop into two,
   * and the newly created loop is eNew->Lface.  Otherwise, two disjoint
   * loops are merged into one, and the loop eDst->Lface is destroyed.
   *
   * If (eOrg == eDst), the new face will have only two edges.
   * If (eOrg->Lnext == eDst), the old face is reduced to a single edge.
   * If (eOrg->Lnext->Lnext == eDst), the old face is reduced to two edges.
   */
  // TESShalfEdge *tessMeshConnect( TESSmesh *mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst );
  connect(eOrg, eDst) {
    var joiningLoops = false;
    var eNew = this.makeEdge_(eOrg);
    var eNewSym = eNew.Sym;
    if (eDst.Lface !== eOrg.Lface) {
      joiningLoops = true;
      this.killFace_(eDst.Lface, eOrg.Lface);
    }
    this.splice_(eNew, eOrg.Lnext);
    this.splice_(eNewSym, eDst);
    eNew.Org = eOrg.Dst;
    eNewSym.Org = eDst.Org;
    eNew.Lface = eNewSym.Lface = eOrg.Lface;
    eOrg.Lface.anEdge = eNewSym;
    if (!joiningLoops) {
      var newFace = new TESSface();
      this.makeFace_(newFace, eNew, eOrg.Lface);
    }
    return eNew;
  }
  /* tessMeshZapFace( fZap ) destroys a face and removes it from the
   * global face list.  All edges of fZap will have a NULL pointer as their
   * left face.  Any edges which also have a NULL pointer as their right face
   * are deleted entirely (along with any isolated vertices this produces).
   * An entire mesh can be deleted by zapping its faces, one at a time,
   * in any order.  Zapped faces cannot be used in further mesh operations!
   */
  zapFace(fZap) {
    var eStart = fZap.anEdge;
    var e, eNext, eSym;
    var fPrev, fNext;
    eNext = eStart.Lnext;
    do {
      e = eNext;
      eNext = e.Lnext;
      e.Lface = null;
      if (e.Rface === null) {
        if (e.Onext === e) {
          this.killVertex_(e.Org, null);
        } else {
          e.Org.anEdge = e.Onext;
          this.splice_(e, e.Oprev);
        }
        eSym = e.Sym;
        if (eSym.Onext === eSym) {
          this.killVertex_(eSym.Org, null);
        } else {
          eSym.Org.anEdge = eSym.Onext;
          this.splice_(eSym, eSym.Oprev);
        }
        this.killEdge_(e);
      }
    } while (e != eStart);
    fPrev = fZap.prev;
    fNext = fZap.next;
    fNext.prev = fPrev;
    fPrev.next = fNext;
  }
  countFaceVerts_(f) {
    var eCur = f.anEdge;
    var n = 0;
    do {
      n++;
      eCur = eCur.Lnext;
    } while (eCur !== f.anEdge);
    return n;
  }
  //int tessMeshMergeConvexFaces( TESSmesh *mesh, int maxVertsPerFace )
  mergeConvexFaces(maxVertsPerFace) {
    var f;
    var eCur, eNext, eSym;
    var vStart;
    var curNv, symNv;
    for (f = this.fHead.next; f !== this.fHead; f = f.next) {
      if (!f.inside) continue;
      eCur = f.anEdge;
      vStart = eCur.Org;
      while (true) {
        eNext = eCur.Lnext;
        eSym = eCur.Sym;
        if (eSym && eSym.Lface && eSym.Lface.inside) {
          curNv = this.countFaceVerts_(f);
          symNv = this.countFaceVerts_(eSym.Lface);
          if (curNv + symNv - 2 <= maxVertsPerFace) {
            if (Geom.vertCCW(
              eCur.Lprev.Org,
              eCur.Org,
              eSym.Lnext.Lnext.Org
            ) && Geom.vertCCW(
              eSym.Lprev.Org,
              eSym.Org,
              eCur.Lnext.Lnext.Org
            )) {
              eNext = eSym.Lnext;
              this.delete(eSym);
              eCur = null;
              eSym = null;
            }
          }
        }
        if (eCur && eCur.Lnext.Org === vStart) break;
        eCur = eNext;
      }
    }
    return true;
  }
  /* tessMeshCheckMesh( mesh ) checks a mesh for self-consistency.
   */
  check() {
    var fHead = this.fHead;
    var vHead = this.vHead;
    var eHead = this.eHead;
    var f, fPrev, v, vPrev, e, ePrev;
    fPrev = fHead;
    for (fPrev = fHead; (f = fPrev.next) !== fHead; fPrev = f) {
      assert(f.prev === fPrev);
      e = f.anEdge;
      do {
        assert(e.Sym !== e);
        assert(e.Sym.Sym === e);
        assert(e.Lnext.Onext.Sym === e);
        assert(e.Onext.Sym.Lnext === e);
        assert(e.Lface === f);
        e = e.Lnext;
      } while (e !== f.anEdge);
    }
    assert(f.prev === fPrev && f.anEdge === null);
    vPrev = vHead;
    for (vPrev = vHead; (v = vPrev.next) !== vHead; vPrev = v) {
      assert(v.prev === vPrev);
      e = v.anEdge;
      do {
        assert(e.Sym !== e);
        assert(e.Sym.Sym === e);
        assert(e.Lnext.Onext.Sym === e);
        assert(e.Onext.Sym.Lnext === e);
        assert(e.Org === v);
        e = e.Onext;
      } while (e !== v.anEdge);
    }
    assert(v.prev === vPrev && v.anEdge === null);
    ePrev = eHead;
    for (ePrev = eHead; (e = ePrev.next) !== eHead; ePrev = e) {
      assert(e.Sym.next === ePrev.Sym);
      assert(e.Sym !== e);
      assert(e.Sym.Sym === e);
      assert(e.Org !== null);
      assert(e.Dst !== null);
      assert(e.Lnext.Onext.Sym === e);
      assert(e.Onext.Sym.Lnext === e);
    }
    assert(
      e.Sym.next === ePrev.Sym && e.Sym === this.eHeadSym && e.Sym.Sym === e && e.Org === null && e.Dst === null && e.Lface === null && e.Rface === null
    );
  }
}
export {
  TESSmesh
};
