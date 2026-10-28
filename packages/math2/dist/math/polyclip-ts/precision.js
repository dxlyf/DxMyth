import compare from "./compare.js";
import orient from "./orient.js";
import snap from "./snap.js";
const set = (eps) => {
  return {
    set: (eps2) => {
      precision = set(eps2);
    },
    reset: () => set(eps),
    compare: compare(eps),
    snap: snap(eps),
    orient: orient(eps)
  };
};
let precision = set();
export {
  precision
};
