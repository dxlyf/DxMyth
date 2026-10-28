import { Geom } from "./Geom.js";
import { assert } from "./assert.js";
import { PriorityQ } from "./PriorityQ.js";
import { WINDING } from "./constants.js";
import { ActiveRegion } from "../mesh/ActiveRegion.js";
import { TESSvertex } from "../mesh/TESSvertex.js";
import { Dict } from "./Dict.js";
class Sweep {
  static regionBelow(r) {
    return r.nodeUp.prev.key;
  }
  static regionAbove(r) {
    return r.nodeUp.next.key;
  }
  static debugEvent(tess) {
  }
  /*
   * Invariants for the Edge Dictionary.
   * - each pair of adjacent edges e2=Succ(e1) satisfies EdgeLeq(e1,e2)
   *   at any valid location of the sweep event
   * - if EdgeLeq(e2,e1) as well (at any valid sweep event), then e1 and e2
   *   share a common endpoint
   * - for each e, e->Dst has been processed, but not e->Org
   * - each edge e satisfies VertLeq(e->Dst,event) && VertLeq(event,e->Org)
   *   where "event" is the current sweep line event.
   * - no edge e has zero length
   *
   * Invariants for the Mesh (the processed portion).
   * - the portion of the mesh left of the sweep line is a planar graph,
   *   ie. there is *some* way to embed it in the plane
   * - no processed edge has zero length
   * - no two processed vertices have identical coordinates
   * - each "inside" region is monotone, ie. can be broken into two chains
   *   of monotonically increasing vertices according to VertLeq(v1,v2)
   *   - a non-invariant: these chains may intersect (very slightly)
   *
   * Invariants for the Sweep.
   * - if none of the edges incident to the event vertex have an activeRegion
   *   (ie. none of these edges are in the edge dictionary), then the vertex
   *   has only right-going edges.
   * - if an edge is marked "fixUpperEdge" (it is a temporary edge introduced
   *   by ConnectRightVertex), then it is the only right-going edge from
   *   its associated vertex.  (This says that these edges exist only
   *   when it is necessary.)
   */
  /* When we merge two edges into one, we need to compute the combined
   * winding of the new edge.
   */
  static addWinding(eDst, eSrc) {
    eDst.winding += eSrc.winding;
    eDst.Sym.winding += eSrc.Sym.winding;
  }
  //static int EdgeLeq( TESStesselator *tess, ActiveRegion *reg1, ActiveRegion *reg2 )
  static edgeLeq(tess, reg1, reg2) {
    var ev = tess.event;
    var e1 = reg1.eUp;
    var e2 = reg2.eUp;
    if (e1.Dst === ev) {
      if (e2.Dst === ev) {
        if (Geom.vertLeq(e1.Org, e2.Org)) {
          return Geom.edgeSign(e2.Dst, e1.Org, e2.Org) <= 0;
        }
        return Geom.edgeSign(e1.Dst, e2.Org, e1.Org) >= 0;
      }
      return Geom.edgeSign(e2.Dst, ev, e2.Org) <= 0;
    }
    if (e2.Dst === ev) {
      return Geom.edgeSign(e1.Dst, ev, e1.Org) >= 0;
    }
    const t1 = Geom.edgeEval(e1.Dst, ev, e1.Org);
    const t2 = Geom.edgeEval(e2.Dst, ev, e2.Org);
    return t1 >= t2;
  }
  //static void DeleteRegion( TESStesselator *tess, ActiveRegion *reg )
  static deleteRegion(tess, reg) {
    if (reg.fixUpperEdge) {
      assert(reg.eUp.winding === 0);
    }
    reg.eUp.activeRegion = null;
    tess.dict.delete(reg.nodeUp);
  }
  //static int FixUpperEdge( TESStesselator *tess, ActiveRegion *reg, TESShalfEdge *newEdge )
  static fixUpperEdge(tess, reg, newEdge) {
    assert(reg.fixUpperEdge);
    tess.mesh.delete(reg.eUp);
    reg.fixUpperEdge = false;
    reg.eUp = newEdge;
    newEdge.activeRegion = reg;
  }
  //static ActiveRegion *TopLeftRegion( TESStesselator *tess, ActiveRegion *reg )
  static topLeftRegion(tess, reg) {
    var org = reg.eUp.Org;
    var e;
    do {
      reg = Sweep.regionAbove(reg);
    } while (reg.eUp.Org === org);
    if (reg.fixUpperEdge) {
      e = tess.mesh.connect(
        Sweep.regionBelow(reg).eUp.Sym,
        reg.eUp.Lnext
      );
      if (e === null) return null;
      Sweep.fixUpperEdge(tess, reg, e);
      reg = Sweep.regionAbove(reg);
    }
    return reg;
  }
  //static ActiveRegion *TopRightRegion( ActiveRegion *reg )
  static topRightRegion(reg) {
    var dst = reg.eUp.Dst;
    do {
      reg = Sweep.regionAbove(reg);
    } while (reg.eUp.Dst === dst);
    return reg;
  }
  //static ActiveRegion *AddRegionBelow( TESStesselator *tess, ActiveRegion *regAbove, TESShalfEdge *eNewUp )
  static addRegionBelow(tess, regAbove, eNewUp) {
    var regNew = new ActiveRegion();
    regNew.eUp = eNewUp;
    regNew.nodeUp = tess.dict.insertBefore(regAbove.nodeUp, regNew);
    regNew.fixUpperEdge = false;
    regNew.sentinel = false;
    regNew.dirty = false;
    eNewUp.activeRegion = regNew;
    return regNew;
  }
  //static int IsWindingInside( TESStesselator *tess, int n )
  static isWindingInside(tess, n) {
    switch (tess.windingRule) {
      case WINDING.ODD:
        return (n & 1) !== 0;
      case WINDING.NONZERO:
        return n !== 0;
      case WINDING.POSITIVE:
        return n > 0;
      case WINDING.NEGATIVE:
        return n < 0;
      case WINDING.ABS_GEQ_TWO:
        return n >= 2 || n <= -2;
    }
    throw new Error("Invalid winding rulle");
  }
  //static void ComputeWinding( TESStesselator *tess, ActiveRegion *reg )
  static computeWinding(tess, reg) {
    reg.windingNumber = Sweep.regionAbove(reg).windingNumber + reg.eUp.winding;
    reg.inside = Sweep.isWindingInside(tess, reg.windingNumber);
  }
  //static void FinishRegion( TESStesselator *tess, ActiveRegion *reg )
  static finishRegion(tess, reg) {
    var e = reg.eUp;
    var f = e.Lface;
    f.inside = reg.inside;
    f.anEdge = e;
    Sweep.deleteRegion(tess, reg);
  }
  //static TESShalfEdge *FinishLeftRegions( TESStesselator *tess, ActiveRegion *regFirst, ActiveRegion *regLast )
  static finishLeftRegions(tess, regFirst, regLast) {
    var e;
    var reg = null;
    var regPrev = regFirst;
    var ePrev = regFirst.eUp;
    while (regPrev !== regLast) {
      regPrev.fixUpperEdge = false;
      reg = Sweep.regionBelow(regPrev);
      e = reg.eUp;
      if (e.Org != ePrev.Org) {
        if (!reg.fixUpperEdge) {
          Sweep.finishRegion(tess, regPrev);
          break;
        }
        e = tess.mesh.connect(ePrev.Lprev, e.Sym);
        Sweep.fixUpperEdge(tess, reg, e);
      }
      if (ePrev.Onext !== e) {
        tess.mesh.splice(e.Oprev, e);
        tess.mesh.splice(ePrev, e);
      }
      Sweep.finishRegion(tess, regPrev);
      ePrev = reg.eUp;
      regPrev = reg;
    }
    return ePrev;
  }
  //static void AddRightEdges( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eFirst, TESShalfEdge *eLast, TESShalfEdge *eTopLeft, int cleanUp )
  static addRightEdges(tess, regUp, eFirst, eLast, eTopLeft, cleanUp) {
    var reg, regPrev;
    var e, ePrev;
    var firstTime = true;
    e = eFirst;
    do {
      assert(Geom.vertLeq(e.Org, e.Dst));
      Sweep.addRegionBelow(tess, regUp, e.Sym);
      e = e.Onext;
    } while (e !== eLast);
    if (eTopLeft === null) {
      eTopLeft = Sweep.regionBelow(regUp).eUp.Rprev;
    }
    regPrev = regUp;
    ePrev = eTopLeft;
    for (; ; ) {
      reg = Sweep.regionBelow(regPrev);
      e = reg.eUp.Sym;
      if (e.Org !== ePrev.Org) break;
      if (e.Onext !== ePrev) {
        tess.mesh.splice(e.Oprev, e);
        tess.mesh.splice(ePrev.Oprev, e);
      }
      reg.windingNumber = regPrev.windingNumber - e.winding;
      reg.inside = Sweep.isWindingInside(tess, reg.windingNumber);
      regPrev.dirty = true;
      if (!firstTime && Sweep.checkForRightSplice(tess, regPrev)) {
        Sweep.addWinding(e, ePrev);
        Sweep.deleteRegion(tess, regPrev);
        tess.mesh.delete(ePrev);
      }
      firstTime = false;
      regPrev = reg;
      ePrev = e;
    }
    regPrev.dirty = true;
    assert(regPrev.windingNumber - e.winding === reg.windingNumber);
    if (cleanUp) {
      Sweep.walkDirtyRegions(tess, regPrev);
    }
  }
  //static void SpliceMergeVertices( TESStesselator *tess, TESShalfEdge *e1, TESShalfEdge *e2 )
  static spliceMergeVertices(tess, e1, e2) {
    tess.mesh.splice(e1, e2);
  }
  //static void VertexWeights( TESSvertex *isect, TESSvertex *org, TESSvertex *dst, TESSreal *weights )
  static vertexWeights(isect, org, dst) {
    var t1 = Geom.vertL1dist(org, isect);
    var t2 = Geom.vertL1dist(dst, isect);
    var w0 = 0.5 * t2 / (t1 + t2);
    var w1 = 0.5 * t1 / (t1 + t2);
    isect.coords[0] += w0 * org.coords[0] + w1 * dst.coords[0];
    isect.coords[1] += w0 * org.coords[1] + w1 * dst.coords[1];
    isect.coords[2] += w0 * org.coords[2] + w1 * dst.coords[2];
  }
  //static void GetIntersectData( TESStesselator *tess, TESSvertex *isect, TESSvertex *orgUp, TESSvertex *dstUp, TESSvertex *orgLo, TESSvertex *dstLo )
  static getIntersectData(tess, isect, orgUp, dstUp, orgLo, dstLo) {
    isect.coords[0] = isect.coords[1] = isect.coords[2] = 0;
    isect.idx = -1;
    Sweep.vertexWeights(isect, orgUp, dstUp);
    Sweep.vertexWeights(isect, orgLo, dstLo);
  }
  //static int CheckForRightSplice( TESStesselator *tess, ActiveRegion *regUp )
  static checkForRightSplice(tess, regUp) {
    var regLo = Sweep.regionBelow(regUp);
    var eUp = regUp.eUp;
    var eLo = regLo.eUp;
    if (Geom.vertLeq(eUp.Org, eLo.Org)) {
      if (Geom.edgeSign(eLo.Dst, eUp.Org, eLo.Org) > 0) return false;
      if (!Geom.vertEq(eUp.Org, eLo.Org)) {
        tess.mesh.splitEdge(eLo.Sym);
        tess.mesh.splice(eUp, eLo.Oprev);
        regUp.dirty = regLo.dirty = true;
      } else if (eUp.Org !== eLo.Org) {
        tess.pq.delete(eUp.Org.pqHandle);
        Sweep.spliceMergeVertices(tess, eLo.Oprev, eUp);
      }
    } else {
      if (Geom.edgeSign(eUp.Dst, eLo.Org, eUp.Org) < 0) return false;
      Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
      tess.mesh.splitEdge(eUp.Sym);
      tess.mesh.splice(eLo.Oprev, eUp);
    }
    return true;
  }
  //static int CheckForLeftSplice( TESStesselator *tess, ActiveRegion *regUp )
  static checkForLeftSplice(tess, regUp) {
    var regLo = Sweep.regionBelow(regUp);
    var eUp = regUp.eUp;
    var eLo = regLo.eUp;
    var e;
    assert(!Geom.vertEq(eUp.Dst, eLo.Dst));
    if (Geom.vertLeq(eUp.Dst, eLo.Dst)) {
      if (Geom.edgeSign(eUp.Dst, eLo.Dst, eUp.Org) < 0) return false;
      Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
      e = tess.mesh.splitEdge(eUp);
      tess.mesh.splice(eLo.Sym, e);
      e.Lface.inside = regUp.inside;
    } else {
      if (Geom.edgeSign(eLo.Dst, eUp.Dst, eLo.Org) > 0) return false;
      regUp.dirty = regLo.dirty = true;
      e = tess.mesh.splitEdge(eLo);
      tess.mesh.splice(eUp.Lnext, eLo.Sym);
      e.Rface.inside = regUp.inside;
    }
    return true;
  }
  //static int CheckForIntersect( TESStesselator *tess, ActiveRegion *regUp )
  static checkForIntersect(tess, regUp) {
    var regLo = Sweep.regionBelow(regUp);
    var eUp = regUp.eUp;
    var eLo = regLo.eUp;
    var orgUp = eUp.Org;
    var orgLo = eLo.Org;
    var dstUp = eUp.Dst;
    var dstLo = eLo.Dst;
    var tMinUp, tMaxLo;
    var isect = new TESSvertex(), orgMin;
    var e;
    assert(!Geom.vertEq(dstLo, dstUp));
    assert(Geom.edgeSign(dstUp, tess.event, orgUp) <= 0);
    assert(Geom.edgeSign(dstLo, tess.event, orgLo) >= 0);
    assert(orgUp !== tess.event && orgLo !== tess.event);
    assert(!regUp.fixUpperEdge && !regLo.fixUpperEdge);
    if (orgUp === orgLo) return false;
    tMinUp = Math.min(orgUp.t, dstUp.t);
    tMaxLo = Math.max(orgLo.t, dstLo.t);
    if (tMinUp > tMaxLo) return false;
    if (Geom.vertLeq(orgUp, orgLo)) {
      if (Geom.edgeSign(dstLo, orgUp, orgLo) > 0) return false;
    } else {
      if (Geom.edgeSign(dstUp, orgLo, orgUp) < 0) return false;
    }
    Geom.intersect(dstUp, orgUp, dstLo, orgLo, isect);
    assert(Math.min(orgUp.t, dstUp.t) <= isect.t);
    assert(isect.t <= Math.max(orgLo.t, dstLo.t));
    assert(Math.min(dstLo.s, dstUp.s) <= isect.s);
    assert(isect.s <= Math.max(orgLo.s, orgUp.s));
    if (Geom.vertLeq(isect, tess.event)) {
      isect.s = tess.event.s;
      isect.t = tess.event.t;
    }
    orgMin = Geom.vertLeq(orgUp, orgLo) ? orgUp : orgLo;
    if (Geom.vertLeq(orgMin, isect)) {
      isect.s = orgMin.s;
      isect.t = orgMin.t;
    }
    if (Geom.vertEq(isect, orgUp) || Geom.vertEq(isect, orgLo)) {
      Sweep.checkForRightSplice(tess, regUp);
      return false;
    }
    if (!Geom.vertEq(dstUp, tess.event) && Geom.edgeSign(dstUp, tess.event, isect) >= 0 || !Geom.vertEq(dstLo, tess.event) && Geom.edgeSign(dstLo, tess.event, isect) <= 0) {
      if (dstLo === tess.event) {
        tess.mesh.splitEdge(eUp.Sym);
        tess.mesh.splice(eLo.Sym, eUp);
        regUp = Sweep.topLeftRegion(tess, regUp);
        eUp = Sweep.regionBelow(regUp).eUp;
        Sweep.finishLeftRegions(tess, Sweep.regionBelow(regUp), regLo);
        Sweep.addRightEdges(tess, regUp, eUp.Oprev, eUp, eUp, true);
        return true;
      }
      if (dstUp === tess.event) {
        tess.mesh.splitEdge(eLo.Sym);
        tess.mesh.splice(eUp.Lnext, eLo.Oprev);
        regLo = regUp;
        regUp = Sweep.topRightRegion(regUp);
        e = Sweep.regionBelow(regUp).eUp.Rprev;
        regLo.eUp = eLo.Oprev;
        eLo = Sweep.finishLeftRegions(tess, regLo, null);
        Sweep.addRightEdges(tess, regUp, eLo.Onext, eUp.Rprev, e, true);
        return true;
      }
      if (Geom.edgeSign(dstUp, tess.event, isect) >= 0) {
        Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
        tess.mesh.splitEdge(eUp.Sym);
        eUp.Org.s = tess.event.s;
        eUp.Org.t = tess.event.t;
      }
      if (Geom.edgeSign(dstLo, tess.event, isect) <= 0) {
        regUp.dirty = regLo.dirty = true;
        tess.mesh.splitEdge(eLo.Sym);
        eLo.Org.s = tess.event.s;
        eLo.Org.t = tess.event.t;
      }
      return false;
    }
    tess.mesh.splitEdge(eUp.Sym);
    tess.mesh.splitEdge(eLo.Sym);
    tess.mesh.splice(eLo.Oprev, eUp);
    eUp.Org.s = isect.s;
    eUp.Org.t = isect.t;
    eUp.Org.pqHandle = tess.pq.insert(eUp.Org);
    Sweep.getIntersectData(tess, eUp.Org, orgUp, dstUp, orgLo, dstLo);
    Sweep.regionAbove(regUp).dirty = regUp.dirty = regLo.dirty = true;
    return false;
  }
  //static void WalkDirtyRegions( TESStesselator *tess, ActiveRegion *regUp )
  static walkDirtyRegions(tess, regUp) {
    var regLo = Sweep.regionBelow(regUp);
    var eUp, eLo;
    for (; ; ) {
      while (regLo.dirty) {
        regUp = regLo;
        regLo = Sweep.regionBelow(regLo);
      }
      if (!regUp.dirty) {
        regLo = regUp;
        regUp = Sweep.regionAbove(regUp);
        if (regUp === null || !regUp.dirty) {
          return;
        }
      }
      regUp.dirty = false;
      eUp = regUp.eUp;
      eLo = regLo.eUp;
      if (eUp.Dst !== eLo.Dst) {
        if (Sweep.checkForLeftSplice(tess, regUp)) {
          if (regLo.fixUpperEdge) {
            Sweep.deleteRegion(tess, regLo);
            tess.mesh.delete(eLo);
            regLo = Sweep.regionBelow(regUp);
            eLo = regLo.eUp;
          } else if (regUp.fixUpperEdge) {
            Sweep.deleteRegion(tess, regUp);
            tess.mesh.delete(eUp);
            regUp = Sweep.regionAbove(regLo);
            eUp = regUp.eUp;
          }
        }
      }
      if (eUp.Org !== eLo.Org) {
        if (eUp.Dst !== eLo.Dst && !regUp.fixUpperEdge && !regLo.fixUpperEdge && (eUp.Dst === tess.event || eLo.Dst === tess.event)) {
          if (Sweep.checkForIntersect(tess, regUp)) {
            return;
          }
        } else {
          Sweep.checkForRightSplice(tess, regUp);
        }
      }
      if (eUp.Org === eLo.Org && eUp.Dst === eLo.Dst) {
        Sweep.addWinding(eLo, eUp);
        Sweep.deleteRegion(tess, regUp);
        tess.mesh.delete(eUp);
        regUp = Sweep.regionAbove(regLo);
      }
    }
  }
  //static void ConnectRightVertex( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eBottomLeft )
  static connectRightVertex(tess, regUp, eBottomLeft) {
    var eNew;
    var eTopLeft = eBottomLeft.Onext;
    var regLo = Sweep.regionBelow(regUp);
    var eUp = regUp.eUp;
    var eLo = regLo.eUp;
    var degenerate = false;
    if (eUp.Dst !== eLo.Dst) {
      Sweep.checkForIntersect(tess, regUp);
    }
    if (Geom.vertEq(eUp.Org, tess.event)) {
      tess.mesh.splice(eTopLeft.Oprev, eUp);
      regUp = Sweep.topLeftRegion(tess, regUp);
      eTopLeft = Sweep.regionBelow(regUp).eUp;
      Sweep.finishLeftRegions(tess, Sweep.regionBelow(regUp), regLo);
      degenerate = true;
    }
    if (Geom.vertEq(eLo.Org, tess.event)) {
      tess.mesh.splice(eBottomLeft, eLo.Oprev);
      eBottomLeft = Sweep.finishLeftRegions(tess, regLo, null);
      degenerate = true;
    }
    if (degenerate) {
      Sweep.addRightEdges(
        tess,
        regUp,
        eBottomLeft.Onext,
        eTopLeft,
        eTopLeft,
        true
      );
      return;
    }
    if (Geom.vertLeq(eLo.Org, eUp.Org)) {
      eNew = eLo.Oprev;
    } else {
      eNew = eUp;
    }
    eNew = tess.mesh.connect(eBottomLeft.Lprev, eNew);
    Sweep.addRightEdges(tess, regUp, eNew, eNew.Onext, eNew.Onext, false);
    eNew.Sym.activeRegion.fixUpperEdge = true;
    Sweep.walkDirtyRegions(tess, regUp);
  }
  /* Because vertices at exactly the same location are merged together
   * before we process the sweep event, some degenerate cases can't occur.
   * However if someone eventually makes the modifications required to
   * merge features which are close together, the cases below marked
   * TOLERANCE_NONZERO will be useful.  They were debugged before the
   * code to merge identical vertices in the main loop was added.
   */
  //#define TOLERANCE_NONZERO	FALSE
  //static void ConnectLeftDegenerate( TESStesselator *tess, ActiveRegion *regUp, TESSvertex *vEvent )
  static connectLeftDegenerate(tess, regUp, vEvent) {
    var e, eTopLeft, eTopRight, eLast;
    var reg;
    e = regUp.eUp;
    if (Geom.vertEq(e.Org, vEvent)) {
      assert(
        false
        /*TOLERANCE_NONZERO*/
      );
      Sweep.spliceMergeVertices(tess, e, vEvent.anEdge);
      return;
    }
    if (!Geom.vertEq(e.Dst, vEvent)) {
      tess.mesh.splitEdge(e.Sym);
      if (regUp.fixUpperEdge) {
        tess.mesh.delete(e.Onext);
        regUp.fixUpperEdge = false;
      }
      tess.mesh.splice(vEvent.anEdge, e);
      Sweep.sweepEvent(tess, vEvent);
      return;
    }
    assert(
      false
      /*TOLERANCE_NONZERO*/
    );
    regUp = Sweep.topRightRegion(regUp);
    reg = Sweep.regionBelow(regUp);
    eTopRight = reg.eUp.Sym;
    eTopLeft = eLast = eTopRight.Onext;
    if (reg.fixUpperEdge) {
      assert(eTopLeft !== eTopRight);
      Sweep.deleteRegion(tess, reg);
      tess.mesh.delete(eTopRight);
      eTopRight = eTopLeft.Oprev;
    }
    tess.mesh.splice(vEvent.anEdge, eTopRight);
    if (!Geom.edgeGoesLeft(eTopLeft)) {
      eTopLeft = null;
    }
    Sweep.addRightEdges(
      tess,
      regUp,
      eTopRight.Onext,
      eLast,
      eTopLeft,
      true
    );
  }
  //static void ConnectLeftVertex( TESStesselator *tess, TESSvertex *vEvent )
  static connectLeftVertex(tess, vEvent) {
    var regUp, regLo, reg;
    var eUp, eLo, eNew;
    var tmp = new ActiveRegion();
    tmp.eUp = vEvent.anEdge.Sym;
    regUp = tess.dict.search(tmp).key;
    regLo = Sweep.regionBelow(regUp);
    if (!regLo) {
      return;
    }
    eUp = regUp.eUp;
    eLo = regLo.eUp;
    if (Geom.edgeSign(eUp.Dst, vEvent, eUp.Org) === 0) {
      Sweep.connectLeftDegenerate(tess, regUp, vEvent);
      return;
    }
    reg = Geom.vertLeq(eLo.Dst, eUp.Dst) ? regUp : regLo;
    if (regUp.inside || reg.fixUpperEdge) {
      if (reg === regUp) {
        eNew = tess.mesh.connect(vEvent.anEdge.Sym, eUp.Lnext);
      } else {
        var tempHalfEdge = tess.mesh.connect(eLo.Dnext, vEvent.anEdge);
        eNew = tempHalfEdge.Sym;
      }
      if (reg.fixUpperEdge) {
        Sweep.fixUpperEdge(tess, reg, eNew);
      } else {
        Sweep.computeWinding(
          tess,
          Sweep.addRegionBelow(tess, regUp, eNew)
        );
      }
      Sweep.sweepEvent(tess, vEvent);
    } else {
      Sweep.addRightEdges(
        tess,
        regUp,
        vEvent.anEdge,
        vEvent.anEdge,
        null,
        true
      );
    }
  }
  //static void SweepEvent( TESStesselator *tess, TESSvertex *vEvent )
  static sweepEvent(tess, vEvent) {
    tess.event = vEvent;
    var e = vEvent.anEdge;
    while (e.activeRegion === null) {
      e = e.Onext;
      if (e === vEvent.anEdge) {
        Sweep.connectLeftVertex(tess, vEvent);
        return;
      }
    }
    var regUp = Sweep.topLeftRegion(tess, e.activeRegion);
    assert(regUp !== null);
    var reg = Sweep.regionBelow(regUp);
    var eTopLeft = reg.eUp;
    var eBottomLeft = Sweep.finishLeftRegions(tess, reg, null);
    if (eBottomLeft.Onext === eTopLeft) {
      Sweep.connectRightVertex(tess, regUp, eBottomLeft);
    } else {
      Sweep.addRightEdges(
        tess,
        regUp,
        eBottomLeft.Onext,
        eTopLeft,
        eTopLeft,
        true
      );
    }
  }
  /* Make the sentinel coordinates big enough that they will never be
   * merged with real input features.
   */
  //static void AddSentinel( TESStesselator *tess, TESSreal smin, TESSreal smax, TESSreal t )
  static addSentinel(tess, smin, smax, t) {
    var reg = new ActiveRegion();
    var e = tess.mesh.makeEdge();
    e.Org.s = smax;
    e.Org.t = t;
    e.Dst.s = smin;
    e.Dst.t = t;
    tess.event = e.Dst;
    reg.eUp = e;
    reg.windingNumber = 0;
    reg.inside = false;
    reg.fixUpperEdge = false;
    reg.sentinel = true;
    reg.dirty = false;
    reg.nodeUp = tess.dict.insert(reg);
  }
  //static void InitEdgeDict( TESStesselator *tess )
  static initEdgeDict(tess) {
    tess.dict = new Dict(tess, Sweep.edgeLeq);
    var w = tess.bmax[0] - tess.bmin[0];
    var h = tess.bmax[1] - tess.bmin[1];
    var smin = tess.bmin[0] - w;
    var smax = tess.bmax[0] + w;
    var tmin = tess.bmin[1] - h;
    var tmax = tess.bmax[1] + h;
    Sweep.addSentinel(tess, smin, smax, tmin);
    Sweep.addSentinel(tess, smin, smax, tmax);
  }
  static doneEdgeDict(tess) {
    var reg;
    var fixedEdges = 0;
    while ((reg = tess.dict.min().key) !== null) {
      if (!reg.sentinel) {
        assert(reg.fixUpperEdge);
        assert(++fixedEdges === 1);
      }
      assert(reg.windingNumber === 0);
      Sweep.deleteRegion(tess, reg);
    }
  }
  static removeDegenerateEdges(tess) {
    var e, eNext, eLnext;
    var eHead = tess.mesh.eHead;
    for (e = eHead.next; e !== eHead; e = eNext) {
      eNext = e.next;
      eLnext = e.Lnext;
      if (Geom.vertEq(e.Org, e.Dst) && e.Lnext.Lnext !== e) {
        Sweep.spliceMergeVertices(tess, eLnext, e);
        tess.mesh.delete(e);
        e = eLnext;
        eLnext = e.Lnext;
      }
      if (eLnext.Lnext === e) {
        if (eLnext !== e) {
          if (eLnext === eNext || eLnext === eNext.Sym) {
            eNext = eNext.next;
          }
          tess.mesh.delete(eLnext);
        }
        if (e === eNext || e === eNext.Sym) {
          eNext = eNext.next;
        }
        tess.mesh.delete(e);
      }
    }
  }
  static initPriorityQ(tess) {
    var pq;
    var v, vHead;
    var vertexCount = 0;
    vHead = tess.mesh.vHead;
    for (v = vHead.next; v !== vHead; v = v.next) {
      vertexCount++;
    }
    vertexCount += 8;
    pq = tess.pq = new PriorityQ(vertexCount, Geom.vertLeq);
    vHead = tess.mesh.vHead;
    for (v = vHead.next; v !== vHead; v = v.next) {
      v.pqHandle = pq.insert(v);
    }
    if (v !== vHead) {
      return false;
    }
    pq.init();
    return true;
  }
  static donePriorityQ(tess) {
    tess.pq = null;
  }
  static removeDegenerateFaces(tess, mesh) {
    var f, fNext;
    var e;
    for (f = mesh.fHead.next; f !== mesh.fHead; f = fNext) {
      fNext = f.next;
      e = f.anEdge;
      assert(e.Lnext !== e);
      if (e.Lnext.Lnext === e) {
        Sweep.addWinding(e.Onext, e);
        tess.mesh.delete(e);
      }
    }
    return true;
  }
  static computeInterior(tess, validate = true) {
    var v, vNext;
    Sweep.removeDegenerateEdges(tess);
    if (!Sweep.initPriorityQ(tess)) {
      return false;
    }
    Sweep.initEdgeDict(tess);
    while ((v = tess.pq.extractMin()) !== null) {
      for (; ; ) {
        vNext = tess.pq.min();
        if (vNext === null || !Geom.vertEq(vNext, v)) break;
        vNext = tess.pq.extractMin();
        Sweep.spliceMergeVertices(tess, v.anEdge, vNext.anEdge);
      }
      Sweep.sweepEvent(tess, v);
    }
    tess.event = tess.dict.min().key.eUp.Org;
    Sweep.doneEdgeDict(tess);
    Sweep.donePriorityQ(tess);
    if (!Sweep.removeDegenerateFaces(tess, tess.mesh)) ;
    if (validate) {
      tess.mesh.check();
    }
    return true;
  }
}
export {
  Sweep
};
