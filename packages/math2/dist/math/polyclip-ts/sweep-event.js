import Segment from "./segment.js";
import { cosineOfAngle, sineOfAngle } from "./vector.js";
class SweepEvent {
  point;
  isLeft;
  segment;
  otherSE;
  consumedBy;
  // for ordering sweep events in the sweep event queue
  static compare(a, b) {
    const ptCmp = SweepEvent.comparePoints(a.point, b.point);
    if (ptCmp !== 0) return ptCmp;
    if (a.point !== b.point) a.link(b);
    if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1;
    return Segment.compare(a.segment, b.segment);
  }
  // for ordering points in sweep line order
  static comparePoints(aPt, bPt) {
    if (aPt.x.isLessThan(bPt.x)) return -1;
    if (aPt.x.isGreaterThan(bPt.x)) return 1;
    if (aPt.y.isLessThan(bPt.y)) return -1;
    if (aPt.y.isGreaterThan(bPt.y)) return 1;
    return 0;
  }
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(point, isLeft) {
    if (point.events === void 0) point.events = [this];
    else point.events.push(this);
    this.point = point;
    this.isLeft = isLeft;
  }
  link(other) {
    if (other.point === this.point) {
      throw new Error("Tried to link already linked events");
    }
    const otherEvents = other.point.events;
    for (let i = 0, iMax = otherEvents.length; i < iMax; i++) {
      const evt = otherEvents[i];
      this.point.events.push(evt);
      evt.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const numEvents = this.point.events.length;
    for (let i = 0; i < numEvents; i++) {
      const evt1 = this.point.events[i];
      if (evt1.segment.consumedBy !== void 0) continue;
      for (let j = i + 1; j < numEvents; j++) {
        const evt2 = this.point.events[j];
        if (evt2.consumedBy !== void 0) continue;
        if (evt1.otherSE.point.events !== evt2.otherSE.point.events) continue;
        evt1.segment.consume(evt2.segment);
      }
    }
  }
  getAvailableLinkedEvents() {
    const events = [];
    for (let i = 0, iMax = this.point.events.length; i < iMax; i++) {
      const evt = this.point.events[i];
      if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {
        events.push(evt);
      }
    }
    return events;
  }
  /**
   * Returns a comparator function for sorting linked events that will
   * favor the event that will give us the smallest left-side angle.
   * All ring construction starts as low as possible heading to the right,
   * so by always turning left as sharp as possible we'll get polygons
   * without uncessary loops & holes.
   *
   * The comparator function has a compute cache such that it avoids
   * re-computing already-computed values.
   */
  getLeftmostComparator(baseEvent) {
    const cache = /* @__PURE__ */ new Map();
    const fillCache = (linkedEvent) => {
      const nextEvent = linkedEvent.otherSE;
      cache.set(linkedEvent, {
        sine: sineOfAngle(this.point, baseEvent.point, nextEvent.point),
        cosine: cosineOfAngle(this.point, baseEvent.point, nextEvent.point)
      });
    };
    return (a, b) => {
      if (!cache.has(a)) fillCache(a);
      if (!cache.has(b)) fillCache(b);
      const { sine: asine, cosine: acosine } = cache.get(a);
      const { sine: bsine, cosine: bcosine } = cache.get(b);
      if (asine.isGreaterThanOrEqualTo(0) && bsine.isGreaterThanOrEqualTo(0)) {
        if (acosine.isLessThan(bcosine)) return 1;
        if (acosine.isGreaterThan(bcosine)) return -1;
        return 0;
      }
      if (asine.isLessThan(0) && bsine.isLessThan(0)) {
        if (acosine.isLessThan(bcosine)) return -1;
        if (acosine.isGreaterThan(bcosine)) return 1;
        return 0;
      }
      if (bsine.isLessThan(asine)) return -1;
      if (bsine.isGreaterThan(asine)) return 1;
      return 0;
    };
  }
}
export {
  SweepEvent as default
};
