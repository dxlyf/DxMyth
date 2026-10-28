import constant from "./constant.js";
const compare = (eps) => {
  const almostEqual = eps ? (a, b) => b.minus(a).abs().isLessThanOrEqualTo(eps) : constant(false);
  return (a, b) => {
    if (almostEqual(a, b)) return 0;
    return a.comparedTo(b);
  };
};
export {
  compare as default
};
