class TESShalfEdge {
  /* change in winding number when crossing from the right face to the left face */
  constructor(side) {
    this.side = side;
  }
  next = null;
  /* doubly-linked list (prev==Sym->next) */
  Org = null;
  /* origin vertex (Overtex too long) */
  Sym = null;
  /* same edge, opposite direction */
  Onext = null;
  /* next edge CCW around origin */
  Lnext = null;
  /* next edge CCW around left face */
  Lface = null;
  /* left face */
  /* Internal data (keep hidden) */
  activeRegion = null;
  /* a region with this upper edge (sweep.c) */
  winding = 0;
  get Rface() {
    return this.Sym.Lface;
  }
  set Rface(v) {
    this.Sym.Lface = v;
  }
  get Dst() {
    return this.Sym.Org;
  }
  set Dst(v) {
    this.Sym.Org = v;
  }
  get Oprev() {
    return this.Sym.Lnext;
  }
  set Oprev(v) {
    this.Sym.Lnext = v;
  }
  get Lprev() {
    return this.Onext.Sym;
  }
  set Lprev(v) {
    this.Onext.Sym = v;
  }
  get Dprev() {
    return this.Lnext.Sym;
  }
  set Dprev(v) {
    this.Lnext.Sym = v;
  }
  get Rprev() {
    return this.Sym.Onext;
  }
  set Rprev(v) {
    this.Sym.Onext = v;
  }
  get Dnext() {
    return this.Sym.Onext.Sym;
  }
  set Dnext(v) {
    this.Sym.Onext.Sym = v;
  }
  get Rnext() {
    return this.Sym.Lnext.Sym;
  }
  set Rnext(v) {
    this.Sym.Lnext.Sym = v;
  }
}
export {
  TESShalfEdge
};
