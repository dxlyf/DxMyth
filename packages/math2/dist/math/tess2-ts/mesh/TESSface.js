class TESSface {
  next = null;
  /* next face (never NULL) */
  prev = null;
  /* previous face (never NULL) */
  anEdge = null;
  /* a half edge with this left face */
  /* Internal data (keep hidden) */
  trail = null;
  /* "stack" for conversion to strips */
  n = 0;
  /* to allow identiy unique faces */
  marked = false;
  /* flag for conversion to strips */
  inside = false;
  /* this face is in the polygon interior */
}
export {
  TESSface
};
