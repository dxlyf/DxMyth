import constant from "./constant.js";
function orient(eps) {
  const almostCollinear = eps ? (area2, ax, ay, cx, cy) => area2.exponentiatedBy(2).isLessThanOrEqualTo(
    cx.minus(ax).exponentiatedBy(2).plus(cy.minus(ay).exponentiatedBy(2)).times(eps)
  ) : constant(false);
  return (a, b, c) => {
    const ax = a.x, ay = a.y, cx = c.x, cy = c.y;
    const area2 = ay.minus(cy).times(b.x.minus(cx)).minus(ax.minus(cx).times(b.y.minus(cy)));
    if (almostCollinear(area2, ax, ay, cx, cy)) return 0;
    return area2.comparedTo(0);
  };
}
export {
  orient as default
};
