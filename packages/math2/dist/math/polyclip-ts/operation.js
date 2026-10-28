import { SplayTreeSet } from "../../data/splaytree/index.js";
import { getBboxOverlap } from "./bbox.js";
import { MultiPolyIn } from "./geom-in.js";
import { RingOut, MultiPolyOut } from "./geom-out.js";
import { precision } from "./precision.js";
import SweepEvent from "./sweep-event.js";
import SweepLine from "./sweep-line.js";
class Operation {
  type;
  numMultiPolys;
  run(type, geom, moreGeoms) {
    operation.type = type;
    const multipolys = [new MultiPolyIn(geom, true)];
    for (let i = 0, iMax = moreGeoms.length; i < iMax; i++) {
      multipolys.push(new MultiPolyIn(moreGeoms[i], false));
    }
    operation.numMultiPolys = multipolys.length;
    if (operation.type === "difference") {
      const subject = multipolys[0];
      let i = 1;
      while (i < multipolys.length) {
        if (getBboxOverlap(multipolys[i].bbox, subject.bbox) !== null) i++;
        else multipolys.splice(i, 1);
      }
    }
    if (operation.type === "intersection") {
      for (let i = 0, iMax = multipolys.length; i < iMax; i++) {
        const mpA = multipolys[i];
        for (let j = i + 1, jMax = multipolys.length; j < jMax; j++) {
          if (getBboxOverlap(mpA.bbox, multipolys[j].bbox) === null) return [];
        }
      }
    }
    const queue = new SplayTreeSet(SweepEvent.compare);
    for (let i = 0, iMax = multipolys.length; i < iMax; i++) {
      const sweepEvents = multipolys[i].getSweepEvents();
      for (let j = 0, jMax = sweepEvents.length; j < jMax; j++) {
        queue.add(sweepEvents[j]);
      }
    }
    const sweepLine = new SweepLine(queue);
    let evt = null;
    if (queue.size != 0) {
      evt = queue.first();
      queue.delete(evt);
    }
    while (evt) {
      const newEvents = sweepLine.process(evt);
      for (let i = 0, iMax = newEvents.length; i < iMax; i++) {
        const evt2 = newEvents[i];
        if (evt2.consumedBy === void 0) queue.add(evt2);
      }
      if (queue.size != 0) {
        evt = queue.first();
        queue.delete(evt);
      } else {
        evt = null;
      }
    }
    precision.reset();
    const ringsOut = RingOut.factory(sweepLine.segments);
    const result = new MultiPolyOut(ringsOut);
    return result.getGeom();
  }
}
const operation = new Operation();
export {
  Operation,
  operation as default
};
