import { SegmentBoolLine, SegmentBoolCurve } from "./Intersecter.js";
function select(segments, selection, log) {
  const result = [];
  for (const seg of segments) {
    const index = (seg.myFill.above ? 8 : 0) + (seg.myFill.below ? 4 : 0) + (seg.otherFill && seg.otherFill.above ? 2 : 0) + (seg.otherFill && seg.otherFill.below ? 1 : 0);
    const flags = selection[index];
    const above = (flags & 1) !== 0;
    const below = (flags & 2) !== 0;
    if (!seg.closed && flags !== 0 || seg.closed && above !== below) {
      const fill = { above, below };
      if (seg instanceof SegmentBoolLine) {
        result.push(new SegmentBoolLine(seg.data, fill, seg.closed, log));
      } else if (seg instanceof SegmentBoolCurve) {
        result.push(new SegmentBoolCurve(seg.data, fill, seg.closed, log));
      } else {
        throw new Error(
          "PolyBool: Unknown SegmentBool type in SegmentSelector"
        );
      }
    }
  }
  log?.selected(result);
  return result;
}
class SegmentSelector {
  // prettier-ignore
  static union(segments, log) {
    return select(
      segments,
      [
        4,
        2,
        1,
        0,
        2,
        2,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0
      ],
      log
    );
  }
  // prettier-ignore
  static intersect(segments, log) {
    return select(
      segments,
      [
        0,
        0,
        0,
        4,
        0,
        2,
        0,
        2,
        0,
        0,
        1,
        1,
        4,
        2,
        1,
        0
      ],
      log
    );
  }
  // prettier-ignore
  static difference(segments, log) {
    return select(
      segments,
      [
        4,
        0,
        0,
        0,
        2,
        0,
        2,
        0,
        1,
        1,
        0,
        0,
        0,
        1,
        2,
        0
      ],
      log
    );
  }
  // prettier-ignore
  static differenceRev(segments, log) {
    return select(
      segments,
      [
        4,
        2,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        2,
        0,
        2,
        0,
        0,
        0,
        0
      ],
      log
    );
  }
  // prettier-ignore
  static xor(segments, log) {
    return select(
      segments,
      [
        4,
        2,
        1,
        0,
        2,
        0,
        0,
        1,
        1,
        0,
        0,
        2,
        0,
        1,
        2,
        0
      ],
      log
    );
  }
}
export {
  SegmentSelector
};
