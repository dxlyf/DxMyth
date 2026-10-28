let sharedGraphemeSegmenter = null;
let sharedLineTextCaches = /* @__PURE__ */ new WeakMap();
function getSharedGraphemeSegmenter() {
  if (sharedGraphemeSegmenter === null) {
    sharedGraphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter;
}
function getSegmentGraphemes(segmentIndex, segments, cache) {
  let graphemes = cache.get(segmentIndex);
  if (graphemes !== void 0) return graphemes;
  graphemes = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const gs of graphemeSegmenter.segment(segments[segmentIndex])) {
    graphemes.push(gs.segment);
  }
  cache.set(segmentIndex, graphemes);
  return graphemes;
}
function lineHasDiscretionaryHyphen(kinds, startSegmentIndex, endSegmentIndex) {
  return endSegmentIndex > startSegmentIndex && kinds[endSegmentIndex - 1] === "soft-hyphen";
}
function appendSegmentGraphemeRange(text, graphemes, startGraphemeIndex, endGraphemeIndex) {
  for (let i = startGraphemeIndex; i < endGraphemeIndex; i++) {
    text += graphemes[i];
  }
  return text;
}
function getLineTextCache(prepared) {
  let cache = sharedLineTextCaches.get(prepared);
  if (cache !== void 0) return cache;
  cache = /* @__PURE__ */ new Map();
  sharedLineTextCaches.set(prepared, cache);
  return cache;
}
function buildLineTextFromRange(prepared, cache, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  let text = "";
  const endsWithDiscretionaryHyphen = lineHasDiscretionaryHyphen(
    prepared.kinds,
    startSegmentIndex,
    endSegmentIndex
  );
  for (let i = startSegmentIndex; i < endSegmentIndex; i++) {
    if (prepared.kinds[i] === "soft-hyphen" || prepared.kinds[i] === "hard-break") continue;
    if (i === startSegmentIndex && startGraphemeIndex > 0) {
      const graphemes = getSegmentGraphemes(i, prepared.segments, cache);
      text = appendSegmentGraphemeRange(text, graphemes, startGraphemeIndex, graphemes.length);
    } else {
      text += prepared.segments[i];
    }
  }
  if (endGraphemeIndex > 0) {
    if (endsWithDiscretionaryHyphen) text += "-";
    const graphemes = getSegmentGraphemes(endSegmentIndex, prepared.segments, cache);
    text = appendSegmentGraphemeRange(
      text,
      graphemes,
      startSegmentIndex === endSegmentIndex ? startGraphemeIndex : 0,
      endGraphemeIndex
    );
  } else if (endsWithDiscretionaryHyphen) {
    text += "-";
  }
  return text;
}
function clearLineTextCaches() {
  sharedGraphemeSegmenter = null;
  sharedLineTextCaches = /* @__PURE__ */ new WeakMap();
}
export {
  buildLineTextFromRange,
  clearLineTextCaches,
  getLineTextCache
};
