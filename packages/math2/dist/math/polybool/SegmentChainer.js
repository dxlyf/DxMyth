import { SegmentLine, SegmentCurve } from "./Segment.js";
function joinLines(seg1, seg2, geo) {
  if (geo.isCollinear(seg1.p0, seg1.p1, seg2.p1)) {
    return new SegmentLine(seg1.p0, seg2.p1, geo);
  }
  return false;
}
function joinCurves(seg1, seg2, geo) {
  if (geo.isCollinear(seg1.p2, seg1.p3, seg2.p1)) {
    const dx = seg2.p1[0] - seg1.p2[0];
    const dy = seg2.p1[1] - seg1.p2[1];
    const t = Math.abs(dx) > Math.abs(dy) ? (seg1.p3[0] - seg1.p2[0]) / dx : (seg1.p3[1] - seg1.p2[1]) / dy;
    const ts = geo.snap01(t);
    if (ts !== 0 && ts !== 1) {
      const ns = new SegmentCurve(
        seg1.p0,
        [
          seg1.p0[0] + (seg1.p1[0] - seg1.p0[0]) / t,
          seg1.p0[1] + (seg1.p1[1] - seg1.p0[1]) / t
        ],
        [
          seg2.p2[0] - t * (seg2.p3[0] - seg2.p2[0]) / (1 - t),
          seg2.p2[1] - t * (seg2.p3[1] - seg2.p2[1]) / (1 - t)
        ],
        seg2.p3,
        geo
      );
      const [left, right] = ns.split([t]);
      if (left.isEqual(seg1) && right.isEqual(seg2)) {
        return ns;
      }
    }
  }
  return false;
}
function joinSegments(seg1, seg2, geo) {
  if (seg1 === seg2) {
    return false;
  }
  if (seg1 instanceof SegmentLine && seg2 instanceof SegmentLine) {
    return joinLines(seg1, seg2, geo);
  }
  if (seg1 instanceof SegmentCurve && seg2 instanceof SegmentCurve) {
    return joinCurves(seg1, seg2, geo);
  }
  return false;
}
function SegmentChainer(segments, geo, log) {
  const closedChains = [];
  const openChains = [];
  const regions = [];
  for (const segb of segments) {
    let setMatch = function(index, matchesHead, matchesPt1) {
      if (nextMatch) {
        nextMatch.index = index;
        nextMatch.matchesHead = matchesHead;
        nextMatch.matchesPt1 = matchesPt1;
      }
      if (nextMatch === firstMatch) {
        nextMatch = secondMatch;
        return false;
      }
      nextMatch = null;
      return true;
    };
    let seg = segb.data;
    const closed = segb.closed;
    const chains = closed ? closedChains : openChains;
    const pt1 = seg.start();
    const pt2 = seg.end();
    const reverseChain = (index) => {
      log?.chainReverse(index, closed);
      const newChain = [];
      for (const seg2 of chains[index].segs) {
        newChain.unshift(seg2.reverse());
      }
      chains[index] = {
        segs: newChain,
        fill: !chains[index].fill
      };
      return newChain;
    };
    if (seg instanceof SegmentLine && geo.isEqualVec2(pt1, pt2)) {
      console.warn(
        "PolyBool: Warning: Zero-length segment detected; your epsilon is probably too small or too large"
      );
      continue;
    }
    log?.chainStart({ seg, fill: !!segb.myFill.above }, closed);
    const firstMatch = {
      index: 0,
      matchesHead: false,
      matchesPt1: false
    };
    const secondMatch = {
      index: 0,
      matchesHead: false,
      matchesPt1: false
    };
    let nextMatch = firstMatch;
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i].segs;
      const head = chain[0].start();
      const tail = chain[chain.length - 1].end();
      if (geo.isEqualVec2(head, pt1)) {
        if (setMatch(i, true, true)) {
          break;
        }
      } else if (geo.isEqualVec2(head, pt2)) {
        if (setMatch(i, true, false)) {
          break;
        }
      } else if (geo.isEqualVec2(tail, pt1)) {
        if (setMatch(i, false, true)) {
          break;
        }
      } else if (geo.isEqualVec2(tail, pt2)) {
        if (setMatch(i, false, false)) {
          break;
        }
      }
    }
    if (nextMatch === firstMatch) {
      const fill = !!segb.myFill.above;
      chains.push({ segs: [seg], fill });
      log?.chainNew({ seg, fill }, closed);
    } else if (nextMatch === secondMatch) {
      const index = firstMatch.index;
      log?.chainMatch(index, closed);
      const { segs: chain, fill } = chains[index];
      if (firstMatch.matchesHead) {
        if (firstMatch.matchesPt1) {
          seg = seg.reverse();
          log?.chainAddHead(index, { seg, fill }, closed);
          chain.unshift(seg);
        } else {
          log?.chainAddHead(index, { seg, fill }, closed);
          chain.unshift(seg);
        }
      } else {
        if (firstMatch.matchesPt1) {
          log?.chainAddTail(index, { seg, fill }, closed);
          chain.push(seg);
        } else {
          seg = seg.reverse();
          log?.chainAddTail(index, { seg, fill }, closed);
          chain.push(seg);
        }
      }
      if (firstMatch.matchesHead) {
        const next = chain[1];
        const newSeg = joinSegments(seg, next, geo);
        if (newSeg) {
          chain.shift();
          chain[0] = newSeg;
          log?.chainSimplifyHead(index, { seg: newSeg, fill }, closed);
        }
      } else {
        const next = chain[chain.length - 2];
        const newSeg = joinSegments(next, seg, geo);
        if (newSeg) {
          chain.pop();
          chain[chain.length - 1] = newSeg;
          log?.chainSimplifyTail(index, { seg: newSeg, fill }, closed);
        }
      }
      if (closed) {
        let finalChain = chain;
        let segS = finalChain[0];
        let segE = finalChain[finalChain.length - 1];
        if (finalChain.length > 0 && geo.isEqualVec2(segS.start(), segE.end())) {
          let winding = 0;
          let last = finalChain[0].start();
          for (const seg2 of finalChain) {
            const here = seg2.end();
            winding += here[1] * last[0] - here[0] * last[1];
            last = here;
          }
          const isClockwise = winding < 0;
          if (isClockwise === fill) {
            finalChain = reverseChain(index);
            segS = finalChain[0];
            segE = finalChain[finalChain.length - 1];
          }
          const newStart = joinSegments(segE, segS, geo);
          if (newStart) {
            finalChain.pop();
            finalChain[0] = newStart;
            log?.chainSimplifyClose(index, { seg: newStart, fill }, closed);
          }
          log?.chainClose(index, closed);
          chains.splice(index, 1);
          regions.push(finalChain);
        }
      }
    } else {
      const appendChain = (index1, index2) => {
        const { segs: chain1, fill } = chains[index1];
        const { segs: chain2 } = chains[index2];
        log?.chainAddTail(index1, { seg, fill }, closed);
        chain1.push(seg);
        const next = chain1[chain1.length - 2];
        const newEnd = joinSegments(next, seg, geo);
        if (newEnd) {
          chain1.pop();
          chain1[chain1.length - 1] = newEnd;
          log?.chainSimplifyTail(index1, { seg: newEnd, fill }, closed);
        }
        const tail = chain1[chain1.length - 1];
        const head = chain2[0];
        const newJoin = joinSegments(tail, head, geo);
        if (newJoin) {
          chain2.shift();
          chain1[chain1.length - 1] = newJoin;
          log?.chainSimplifyJoin(
            index1,
            index2,
            { seg: newJoin, fill },
            closed
          );
        }
        log?.chainJoin(index1, index2, closed);
        chains[index1].segs = chain1.concat(chain2);
        chains.splice(index2, 1);
      };
      const F = firstMatch.index;
      const S = secondMatch.index;
      log?.chainConnect(F, S, closed);
      const reverseF = chains[F].segs.length < chains[S].segs.length;
      if (firstMatch.matchesHead) {
        if (secondMatch.matchesHead) {
          if (reverseF) {
            if (!firstMatch.matchesPt1) {
              seg = seg.reverse();
            }
            reverseChain(F);
            appendChain(F, S);
          } else {
            if (firstMatch.matchesPt1) {
              seg = seg.reverse();
            }
            reverseChain(S);
            appendChain(S, F);
          }
        } else {
          if (firstMatch.matchesPt1) {
            seg = seg.reverse();
          }
          appendChain(S, F);
        }
      } else {
        if (secondMatch.matchesHead) {
          if (!firstMatch.matchesPt1) {
            seg = seg.reverse();
          }
          appendChain(F, S);
        } else {
          if (reverseF) {
            if (firstMatch.matchesPt1) {
              seg = seg.reverse();
            }
            reverseChain(F);
            appendChain(S, F);
          } else {
            if (!firstMatch.matchesPt1) {
              seg = seg.reverse();
            }
            reverseChain(S);
            appendChain(F, S);
          }
        }
      }
    }
  }
  for (const { segs } of openChains) {
    regions.push(segs);
  }
  return regions;
}
function segmentsToReceiver(segments, geo, receiver, matrix) {
  const [a, b, c, d, e, f] = matrix;
  receiver.beginPath();
  for (const region of segments) {
    if (region.length <= 0) {
      continue;
    }
    for (let i = 0; i < region.length; i++) {
      const seg = region[i];
      if (i === 0) {
        const [p0x, p0y] = seg.start();
        receiver.moveTo(a * p0x + c * p0y + e, b * p0x + d * p0y + f);
      }
      if (seg instanceof SegmentLine) {
        const [p1x, p1y] = seg.p1;
        receiver.lineTo(a * p1x + c * p1y + e, b * p1x + d * p1y + f);
      } else if (seg instanceof SegmentCurve) {
        const [p1x, p1y] = seg.p1;
        const [p2x, p2y] = seg.p2;
        const [p3x, p3y] = seg.p3;
        receiver.bezierCurveTo(
          a * p1x + c * p1y + e,
          b * p1x + d * p1y + f,
          a * p2x + c * p2y + e,
          b * p2x + d * p2y + f,
          a * p3x + c * p3y + e,
          b * p3x + d * p3y + f
        );
      } else {
        throw new Error("PolyBool: Unknown segment instance");
      }
    }
    const first = region[0];
    const last = region[region.length - 1];
    if (geo.isEqualVec2(first.start(), last.end())) {
      receiver.closePath();
    }
  }
  return receiver;
}
export {
  SegmentChainer,
  joinCurves,
  joinLines,
  joinSegments,
  segmentsToReceiver
};
