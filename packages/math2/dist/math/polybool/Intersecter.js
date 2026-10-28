import { SegmentLine, SegmentCurve, segmentsIntersect } from "./Segment.js";
class SegmentBoolBase {
  id;
  data;
  myFill;
  otherFill = null;
  closed;
  constructor(data, fill = null, closed = false, log = null) {
    this.id = log?.segmentId() ?? -1;
    this.data = data;
    this.myFill = {
      above: fill?.above ?? null,
      below: fill?.below ?? null
    };
    this.closed = closed;
  }
}
class SegmentBoolLine extends SegmentBoolBase {
}
class SegmentBoolCurve extends SegmentBoolBase {
}
function copySegmentBool(seg, log) {
  if (seg instanceof SegmentBoolLine) {
    return new SegmentBoolLine(seg.data, seg.myFill, seg.closed, log);
  } else if (seg instanceof SegmentBoolCurve) {
    return new SegmentBoolCurve(seg.data, seg.myFill, seg.closed, log);
  }
  throw new Error("PolyBool: Unknown SegmentBool in copySegmentBool");
}
class EventBool {
  isStart;
  p;
  seg;
  primary;
  other;
  status = null;
  constructor(isStart, p, seg, primary) {
    this.isStart = isStart;
    this.p = p;
    this.seg = seg;
    this.primary = primary;
  }
}
class ListBool {
  nodes = [];
  remove(node) {
    const i = this.nodes.indexOf(node);
    if (i >= 0) {
      this.nodes.splice(i, 1);
    }
  }
  getIndex(node) {
    return this.nodes.indexOf(node);
  }
  isEmpty() {
    return this.nodes.length <= 0;
  }
  getHead() {
    return this.nodes[0];
  }
  removeHead() {
    this.nodes.shift();
  }
  insertBefore(node, check) {
    this.findTransition(node, check).insert(node);
  }
  findTransition(node, check) {
    const compare = (a, b) => check(b) - check(a);
    let i = 0;
    let high = this.nodes.length;
    while (i < high) {
      const mid = i + high >> 1;
      if (compare(this.nodes[mid], node) > 0) {
        high = mid;
      } else {
        i = mid + 1;
      }
    }
    return {
      before: i <= 0 ? null : this.nodes[i - 1] ?? null,
      after: this.nodes[i] ?? null,
      insert: (node2) => {
        this.nodes.splice(i, 0, node2);
        return node2;
      }
    };
  }
}
class Intersecter {
  selfIntersection;
  geo;
  events = new ListBool();
  status = new ListBool();
  log;
  currentPath = [];
  constructor(selfIntersection, geo, log = null) {
    this.selfIntersection = selfIntersection;
    this.geo = geo;
    this.log = log;
  }
  compareEvents(aStart, a1, a2, aSeg, bStart, b1, b2, bSeg) {
    const comp = this.geo.compareVec2(a1, b1);
    if (comp !== 0) {
      return comp;
    }
    if (aSeg instanceof SegmentLine && bSeg instanceof SegmentLine && this.geo.isEqualVec2(a2, b2)) {
      return 0;
    }
    if (aStart !== bStart) {
      return aStart ? 1 : -1;
    }
    return this.compareSegments(bSeg, aSeg);
  }
  addEvent(ev) {
    this.events.insertBefore(ev, (here) => {
      if (here === ev) {
        return 0;
      }
      return this.compareEvents(
        ev.isStart,
        ev.p,
        ev.other.p,
        ev.seg.data,
        here.isStart,
        here.p,
        here.other.p,
        here.seg.data
      );
    });
  }
  divideEvent(ev, t, p) {
    this.log?.segmentDivide(ev.seg, p);
    const [left, right] = ev.seg.data.split([t]);
    left.setEnd(p);
    right.setStart(p);
    const ns = right instanceof SegmentLine ? new SegmentBoolLine(right, ev.seg.myFill, ev.seg.closed, this.log) : right instanceof SegmentCurve ? new SegmentBoolCurve(right, ev.seg.myFill, ev.seg.closed, this.log) : null;
    if (!ns) {
      throw new Error("PolyBool: Unknown segment data in divideEvent");
    }
    this.events.remove(ev.other);
    ev.seg.data = left;
    this.log?.segmentChop(ev.seg);
    ev.other.p = p;
    this.addEvent(ev.other);
    return this.addSegment(ns, ev.primary);
  }
  beginPath() {
    this.currentPath = [];
  }
  closePath() {
    for (const seg of this.currentPath) {
      seg.closed = true;
    }
  }
  addSegment(seg, primary) {
    const evStart = new EventBool(true, seg.data.start(), seg, primary);
    const evEnd = new EventBool(false, seg.data.end(), seg, primary);
    evStart.other = evEnd;
    evEnd.other = evStart;
    this.addEvent(evStart);
    this.addEvent(evEnd);
    return evStart;
  }
  addLine(from, to, primary = true) {
    const f = this.geo.compareVec2(from, to);
    if (f === 0) {
      return;
    }
    const seg = new SegmentBoolLine(
      new SegmentLine(f < 0 ? from : to, f < 0 ? to : from, this.geo),
      null,
      false,
      this.log
    );
    this.currentPath.push(seg);
    this.addSegment(seg, primary);
  }
  addCurve(from, c1, c2, to, primary = true) {
    const original = new SegmentCurve(from, c1, c2, to, this.geo);
    const curves = original.split(original.inflectionTValues());
    for (const curve of curves) {
      const f = this.geo.compareVec2(curve.start(), curve.end());
      if (f === 0) {
        continue;
      }
      const line = curve.toLine();
      if (line) {
        this.addLine(line.p0, line.p1, primary);
      } else {
        const seg = new SegmentBoolCurve(
          f < 0 ? curve : curve.reverse(),
          null,
          false,
          this.log
        );
        this.currentPath.push(seg);
        this.addSegment(seg, primary);
      }
    }
  }
  compareSegments(seg1, seg2) {
    let A = seg1.start();
    let B = seg2.start2();
    const C = seg2.start();
    if (seg2.pointOn(A)) {
      A = seg1.start2();
      if (seg2.pointOn(A)) {
        if (seg1 instanceof SegmentLine) {
          if (seg2 instanceof SegmentLine) {
            return 0;
          }
          if (seg2 instanceof SegmentCurve) {
            A = seg1.point(0.5);
          }
        }
        if (seg1 instanceof SegmentCurve) {
          A = seg1.end();
        }
      }
      if (seg2 instanceof SegmentCurve) {
        if (this.geo.snap0(A[0] - C[0]) === 0 && this.geo.snap0(B[0] - C[0]) === 0) {
          return Math.sign(C[1] - A[1]);
        }
      }
    } else {
      if (seg2 instanceof SegmentCurve) {
        const y = seg2.mapXtoY(A[0], true);
        if (y !== false) {
          return Math.sign(y - A[1]);
        }
      }
      if (seg1 instanceof SegmentCurve) {
        const i = segmentsIntersect(seg1, seg2, true);
        if (i && i.kind === "tValuePairs") {
          for (const pair of i.tValuePairs) {
            const t = this.geo.snap01(pair[0]);
            if (t > 0 && t < 1) {
              B = seg1.point(t);
              break;
            }
          }
        }
      }
    }
    const [Ax, Ay] = A;
    const [Bx, By] = B;
    const [Cx, Cy] = C;
    return Math.sign((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax));
  }
  statusFindSurrounding(ev) {
    return this.status.findTransition(ev, (here) => {
      if (ev === here) {
        return 0;
      }
      const c = this.compareSegments(ev.seg.data, here.seg.data);
      return c === 0 ? -1 : c;
    });
  }
  checkIntersection(ev1, ev2) {
    const seg1 = ev1.seg;
    const seg2 = ev2.seg;
    this.log?.checkIntersection(seg1, seg2);
    const i = segmentsIntersect(seg1.data, seg2.data, false);
    if (i === null) {
      return null;
    } else if (i.kind === "tRangePairs") {
      const {
        tStart: [tA1, tB1],
        tEnd: [tA2, tB2]
      } = i;
      if (tA1 === 1 && tA2 === 1 && tB1 === 0 && tB2 === 0 || tA1 === 0 && tA2 === 0 && tB1 === 1 && tB2 === 1) {
        return null;
      }
      if (tA1 === 0 && tA2 === 1 && tB1 === 0 && tB2 === 1) {
        return ev2;
      }
      const a1 = seg1.data.start();
      const a2 = seg1.data.end();
      const b2 = seg2.data.end();
      if (tA1 === 0 && tB1 === 0) {
        if (tA2 === 1) {
          this.divideEvent(ev2, tB2, a2);
        } else {
          this.divideEvent(ev1, tA2, b2);
        }
        return ev2;
      } else if (tB1 > 0 && tB1 < 1) {
        if (tA2 === 1 && tB2 === 1) {
          this.divideEvent(ev2, tB1, a1);
        } else {
          if (tA2 === 1) {
            this.divideEvent(ev2, tB2, a2);
          } else {
            this.divideEvent(ev1, tA2, b2);
          }
          this.divideEvent(ev2, tB1, a1);
        }
      }
      return null;
    } else if (i.kind === "tValuePairs") {
      if (i.tValuePairs.length <= 0) {
        return null;
      }
      let minPair = i.tValuePairs[0];
      for (let j = 1; j < i.tValuePairs.length && (minPair[0] === 0 && minPair[1] === 0 || minPair[0] === 0 && minPair[1] === 1 || minPair[0] === 1 && minPair[1] === 0 || minPair[0] === 1 && minPair[1] === 1); j++) {
        minPair = i.tValuePairs[j];
      }
      const [tA, tB] = minPair;
      const p = tB === 0 ? seg2.data.start() : tB === 1 ? seg2.data.end() : tA === 0 ? seg1.data.start() : tA === 1 ? seg1.data.end() : seg1.data.point(tA);
      if (tA > 0 && tA < 1) {
        this.divideEvent(ev1, tA, p);
      }
      if (tB > 0 && tB < 1) {
        this.divideEvent(ev2, tB, p);
      }
      return null;
    }
    throw new Error("PolyBool: Unknown intersection type");
  }
  calculate() {
    const segments = [];
    while (!this.events.isEmpty()) {
      const ev = this.events.getHead();
      this.log?.vert(ev.p[0]);
      if (ev.isStart) {
        this.log?.segmentNew(ev.seg, ev.primary);
        const surrounding = this.statusFindSurrounding(ev);
        const above = surrounding.before;
        const below = surrounding.after;
        this.log?.tempStatus(
          ev.seg,
          above ? above.seg : false,
          below ? below.seg : false
        );
        const checkBothIntersections = () => {
          if (above) {
            const eve2 = this.checkIntersection(ev, above);
            if (eve2) {
              return eve2;
            }
          }
          if (below) {
            return this.checkIntersection(ev, below);
          }
          return null;
        };
        const eve = checkBothIntersections();
        if (eve) {
          if (this.selfIntersection) {
            let toggle;
            if (ev.seg.myFill.below === null) {
              toggle = ev.seg.closed;
            } else {
              toggle = ev.seg.myFill.above !== ev.seg.myFill.below;
            }
            if (toggle) {
              eve.seg.myFill.above = !eve.seg.myFill.above;
            }
          } else {
            eve.seg.otherFill = ev.seg.myFill;
          }
          this.log?.segmentUpdate(eve.seg);
          this.events.remove(ev.other);
          this.events.remove(ev);
        }
        if (this.events.getHead() !== ev) {
          this.log?.rewind(ev.seg);
          continue;
        }
        if (this.selfIntersection) {
          let toggle;
          if (ev.seg.myFill.below === null) {
            toggle = ev.seg.closed;
          } else {
            toggle = ev.seg.myFill.above !== ev.seg.myFill.below;
          }
          if (!below) {
            ev.seg.myFill.below = false;
          } else {
            ev.seg.myFill.below = below.seg.myFill.above;
          }
          ev.seg.myFill.above = toggle ? !ev.seg.myFill.below : ev.seg.myFill.below;
        } else {
          if (ev.seg.otherFill === null) {
            let inside;
            if (!below) {
              inside = false;
            } else {
              if (ev.primary === below.primary) {
                if (below.seg.otherFill === null) {
                  throw new Error(
                    "PolyBool: Unexpected state of otherFill (null)"
                  );
                }
                inside = below.seg.otherFill.above;
              } else {
                inside = below.seg.myFill.above;
              }
            }
            ev.seg.otherFill = {
              above: inside,
              below: inside
            };
          }
        }
        this.log?.status(
          ev.seg,
          above ? above.seg : false,
          below ? below.seg : false
        );
        ev.other.status = surrounding.insert(ev);
      } else {
        const st = ev.status;
        if (st === null) {
          throw new Error(
            "PolyBool: Zero-length segment detected; your epsilon is probably too small or too large"
          );
        }
        const i = this.status.getIndex(st);
        if (i > 0 && i < this.status.nodes.length - 1) {
          const before = this.status.nodes[i - 1];
          const after = this.status.nodes[i + 1];
          this.checkIntersection(before, after);
        }
        this.log?.statusRemove(st.seg);
        this.status.remove(st);
        if (!ev.primary) {
          if (!ev.seg.otherFill) {
            throw new Error("PolyBool: Unexpected state of otherFill (null)");
          }
          const s = ev.seg.myFill;
          ev.seg.myFill = ev.seg.otherFill;
          ev.seg.otherFill = s;
        }
        segments.push(ev.seg);
      }
      this.events.removeHead();
    }
    this.log?.done();
    return segments;
  }
}
export {
  EventBool,
  Intersecter,
  ListBool,
  SegmentBoolBase,
  SegmentBoolCurve,
  SegmentBoolLine,
  copySegmentBool
};
