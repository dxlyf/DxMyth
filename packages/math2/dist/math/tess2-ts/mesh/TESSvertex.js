class TESSvertex {
  next = null;
  /* next vertex (never NULL) */
  prev = null;
  /* previous vertex (never NULL) */
  anEdge = null;
  /* a half-edge with this origin */
  /* Internal data (keep hidden) */
  coords = [0, 0, 0];
  /* vertex location in 3D */
  s = 0;
  t = 0;
  /* projection onto the sweep plane */
  pqHandle = 0;
  /* to allow deletion from priority queue */
  n = 0;
  /* to allow identify unique vertices */
  idx = 0;
  /* to allow map result to original verts */
}
export {
  TESSvertex
};
