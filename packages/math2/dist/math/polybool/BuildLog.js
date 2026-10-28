class BuildLog {
  list = [];
  nextSegmentId = 0;
  curVert = NaN;
  push(type, data) {
    this.list.push({
      type,
      data: JSON.parse(JSON.stringify(data))
    });
  }
  info(msg, data) {
    this.push("info", { msg, data });
  }
  segmentId() {
    return this.nextSegmentId++;
  }
  checkIntersection(seg1, seg2) {
    this.push("check", { seg1, seg2 });
  }
  segmentDivide(seg, p) {
    this.push("div_seg", { seg, p });
  }
  segmentChop(seg) {
    this.push("chop", { seg });
  }
  statusRemove(seg) {
    this.push("pop_seg", { seg });
  }
  segmentUpdate(seg) {
    this.push("seg_update", { seg });
  }
  segmentNew(seg, primary) {
    this.push("new_seg", { seg, primary });
  }
  tempStatus(seg, above, below) {
    this.push("temp_status", { seg, above, below });
  }
  rewind(seg) {
    this.push("rewind", { seg });
  }
  status(seg, above, below) {
    this.push("status", { seg, above, below });
  }
  vert(x) {
    if (x !== this.curVert) {
      this.push("vert", { x });
      this.curVert = x;
    }
  }
  selected(segs) {
    this.push("selected", { segs });
  }
  chainStart(sf, closed) {
    this.push("chain_start", { sf, closed });
  }
  chainNew(sf, closed) {
    this.push("chain_new", { sf, closed });
  }
  chainMatch(index, closed) {
    this.push("chain_match", { index, closed });
  }
  chainClose(index, closed) {
    this.push("chain_close", { index, closed });
  }
  chainAddHead(index, sf, closed) {
    this.push("chain_add_head", { index, sf, closed });
  }
  chainAddTail(index, sf, closed) {
    this.push("chain_add_tail", { index, sf, closed });
  }
  chainSimplifyHead(index, sf, closed) {
    this.push("chain_simp_head", { index, sf, closed });
  }
  chainSimplifyTail(index, sf, closed) {
    this.push("chain_simp_tail", { index, sf, closed });
  }
  chainSimplifyClose(index, sf, closed) {
    this.push("chain_simp_close", { index, sf, closed });
  }
  chainSimplifyJoin(index1, index2, sf, closed) {
    this.push("chain_simp_join", { index1, index2, sf, closed });
  }
  chainConnect(index1, index2, closed) {
    this.push("chain_con", { index1, index2, closed });
  }
  chainReverse(index, closed) {
    this.push("chain_rev", { index, closed });
  }
  chainJoin(index1, index2, closed) {
    this.push("chain_join", { index1, index2, closed });
  }
  done() {
    this.push("done", null);
  }
}
export {
  BuildLog as default
};
