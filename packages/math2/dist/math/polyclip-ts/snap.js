import { BigNumber } from "../../utils/bignumber.js";
import { SplayTreeSet } from "../../data/splaytree/index.js";
import compare from "./compare.js";
import identity from "./identity.js";
const snap = (eps) => {
  if (eps) {
    const xTree = new SplayTreeSet(compare(eps));
    const yTree = new SplayTreeSet(compare(eps));
    const snapCoord = (coord, tree) => {
      return tree.addAndReturn(coord);
    };
    const snap2 = (v) => {
      return {
        x: snapCoord(v.x, xTree),
        y: snapCoord(v.y, yTree)
      };
    };
    snap2({ x: new BigNumber(0), y: new BigNumber(0) });
    return snap2;
  }
  return identity;
};
export {
  snap as default
};
