import { precision } from "./precision.js";
import operation from "./operation.js";
const union = (geom, ...moreGeoms) => operation.run("union", geom, moreGeoms);
const intersection = (geom, ...moreGeoms) => operation.run("intersection", geom, moreGeoms);
const xor = (geom, ...moreGeoms) => operation.run("xor", geom, moreGeoms);
const difference = (geom, ...moreGeoms) => operation.run("difference", geom, moreGeoms);
const setPrecision = precision.set;
export {
  difference,
  intersection,
  setPrecision,
  union,
  xor
};
