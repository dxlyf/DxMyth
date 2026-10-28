class ActiveRegion {
  eUp = null;
  /* upper edge, directed right to left */
  nodeUp = null;
  /* dictionary node corresponding to eUp */
  windingNumber = 0;
  /* used to determine which regions are
   * inside the polygon */
  inside = false;
  /* is this region inside the polygon? */
  sentinel = false;
  /* marks fake edges at t = +/-infinity */
  dirty = false;
  /* marks regions where the upper or lower
   * edge has changed, but we haven't checked
   * whether they intersect yet */
  fixUpperEdge = false;
  /* marks temporary edges introduced when
   * we process a "right vertex" (one without
   * any edges leaving to the right) */
}
export {
  ActiveRegion
};
