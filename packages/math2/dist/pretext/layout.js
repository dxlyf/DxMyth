import { computeSegmentLevels } from "./bidi.js";
import { setAnalysisLocale, analyzeText, isCJK, kinsokuStart, leftStickyPunctuation, isNumericRunSegment, endsWithClosingQuote, kinsokuEnd, canContinueKeepAllTextRun, clearAnalysisCaches } from "./analysis.js";
import { clearMeasurementCaches, getEngineProfile, getFontMeasurementState, textMayContainEmoji, getCorrectedSegmentWidth, getSegmentMetrics, getSegmentBreakableFitAdvances } from "./measurement.js";
import { countPreparedLines, walkPreparedLinesRaw, measurePreparedLineGeometry, normalizePreparedLineStart, stepPreparedLineGeometryFromChunk } from "./line-break.js";
import { getLineTextCache, buildLineTextFromRange, clearLineTextCaches } from "./line-text.js";
let sharedGraphemeSegmenter = null;
function getSharedGraphemeSegmenter() {
  if (sharedGraphemeSegmenter === null) {
    sharedGraphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter;
}
function createEmptyPrepared(includeSegments) {
  if (includeSegments) {
    return {
      widths: [],
      lineEndFitAdvances: [],
      lineEndPaintAdvances: [],
      kinds: [],
      simpleLineWalkFastPath: true,
      segLevels: null,
      breakableFitAdvances: [],
      breakablePreferredBreaks: [],
      letterSpacing: 0,
      spacingGraphemeCounts: [],
      discretionaryHyphenWidth: 0,
      tabStopAdvance: 0,
      chunks: [],
      segments: []
    };
  }
  return {
    widths: [],
    lineEndFitAdvances: [],
    lineEndPaintAdvances: [],
    kinds: [],
    simpleLineWalkFastPath: true,
    segLevels: null,
    breakableFitAdvances: [],
    breakablePreferredBreaks: [],
    letterSpacing: 0,
    spacingGraphemeCounts: [],
    discretionaryHyphenWidth: 0,
    tabStopAdvance: 0,
    chunks: []
  };
}
function buildBaseCjkUnits(segText, engineProfile) {
  const units = [];
  let unitParts = [];
  let unitStart = 0;
  let unitContainsCJK = false;
  let unitEndsWithClosingQuote = false;
  let unitIsSingleKinsokuEnd = false;
  function pushUnit() {
    if (unitParts.length === 0) return;
    units.push({
      text: unitParts.length === 1 ? unitParts[0] : unitParts.join(""),
      start: unitStart
    });
    unitParts = [];
    unitContainsCJK = false;
    unitEndsWithClosingQuote = false;
    unitIsSingleKinsokuEnd = false;
  }
  function startUnit(grapheme, start, graphemeContainsCJK) {
    unitParts = [grapheme];
    unitStart = start;
    unitContainsCJK = graphemeContainsCJK;
    unitEndsWithClosingQuote = endsWithClosingQuote(grapheme);
    unitIsSingleKinsokuEnd = kinsokuEnd.has(grapheme);
  }
  function appendToUnit(grapheme, graphemeContainsCJK) {
    unitParts.push(grapheme);
    unitContainsCJK = unitContainsCJK || graphemeContainsCJK;
    const graphemeEndsWithClosingQuote = endsWithClosingQuote(grapheme);
    if (grapheme.length === 1 && leftStickyPunctuation.has(grapheme)) {
      unitEndsWithClosingQuote = unitEndsWithClosingQuote || graphemeEndsWithClosingQuote;
    } else {
      unitEndsWithClosingQuote = graphemeEndsWithClosingQuote;
    }
    unitIsSingleKinsokuEnd = false;
  }
  for (const gs of getSharedGraphemeSegmenter().segment(segText)) {
    const grapheme = gs.segment;
    const graphemeContainsCJK = isCJK(grapheme);
    if (unitParts.length === 0) {
      startUnit(grapheme, gs.index, graphemeContainsCJK);
      continue;
    }
    if (unitIsSingleKinsokuEnd || kinsokuStart.has(grapheme) || leftStickyPunctuation.has(grapheme) || engineProfile.carryCJKAfterClosingQuote && graphemeContainsCJK && unitEndsWithClosingQuote) {
      appendToUnit(grapheme, graphemeContainsCJK);
      continue;
    }
    if (!unitContainsCJK && !graphemeContainsCJK) {
      appendToUnit(grapheme, graphemeContainsCJK);
      continue;
    }
    pushUnit();
    startUnit(grapheme, gs.index, graphemeContainsCJK);
  }
  pushUnit();
  return units;
}
function mergeKeepAllTextUnits(segText, units, breakAfterPunctuation) {
  if (units.length <= 1) return units;
  const merged = [];
  let groupStart = -1;
  let groupContainsCJK = false;
  function pushMergedUnit(start, end) {
    const sourceStart = units[start].start;
    const sourceEnd = end < units.length ? units[end].start : segText.length;
    merged.push({
      text: segText.slice(sourceStart, sourceEnd),
      start: sourceStart
    });
  }
  function flushGroup(end) {
    if (groupStart < 0) return;
    if (groupContainsCJK) {
      if (groupStart + 1 === end) {
        merged.push(units[groupStart]);
      } else {
        pushMergedUnit(groupStart, end);
      }
    } else {
      for (let i = groupStart; i < end; i++) merged.push(units[i]);
    }
    groupStart = -1;
    groupContainsCJK = false;
  }
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (groupStart >= 0 && !canContinueKeepAllTextRun(units[i - 1].text, breakAfterPunctuation)) {
      flushGroup(i);
    }
    if (groupStart < 0) groupStart = i;
    groupContainsCJK = groupContainsCJK || isCJK(unit.text);
  }
  flushGroup(units.length);
  return merged;
}
function countRenderedSpacingGraphemes(text, kind) {
  if (kind === "zero-width-break" || kind === "soft-hyphen" || kind === "hard-break") {
    return 0;
  }
  if (kind === "tab") return 1;
  let count = 0;
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const _ of graphemeSegmenter.segment(text)) count++;
  return count;
}
function isPreferredBreakGrapheme(grapheme) {
  return grapheme === "-" || grapheme === "֊" || grapheme === "‐" || grapheme === "‒" || grapheme === "–" || grapheme === "—";
}
function getBreakablePreferredBreaks(text) {
  if (!/[-\u058A\u2010\u2012\u2013\u2014]/u.test(text)) return null;
  const breaks = [];
  let graphemeIndex = 0;
  for (const gs of getSharedGraphemeSegmenter().segment(text)) {
    graphemeIndex++;
    if (isPreferredBreakGrapheme(gs.segment)) breaks.push(graphemeIndex);
  }
  return breaks.length === 0 ? null : breaks;
}
function addInternalLetterSpacing(width, graphemeCount, letterSpacing) {
  return graphemeCount > 1 ? width + (graphemeCount - 1) * letterSpacing : width;
}
function measureAnalysis(analysis, font, includeSegments, wordBreak, letterSpacing) {
  const engineProfile = getEngineProfile();
  const { cache, emojiCorrection } = getFontMeasurementState(
    font,
    textMayContainEmoji(analysis.normalized)
  );
  const discretionaryHyphenWidth = getCorrectedSegmentWidth("-", getSegmentMetrics("-", cache), emojiCorrection) + (letterSpacing === 0 ? 0 : letterSpacing * 2);
  const spaceWidth = getCorrectedSegmentWidth(" ", getSegmentMetrics(" ", cache), emojiCorrection);
  const tabStopAdvance = spaceWidth * 8;
  const hasLetterSpacing = letterSpacing !== 0;
  if (analysis.len === 0) return createEmptyPrepared(includeSegments);
  const widths = [];
  const lineEndFitAdvances = [];
  const lineEndPaintAdvances = [];
  const kinds = [];
  let simpleLineWalkFastPath = !hasLetterSpacing;
  const segStarts = includeSegments ? [] : null;
  const breakableFitAdvances = [];
  const breakablePreferredBreaks = [];
  const spacingGraphemeCounts = [];
  const segments = includeSegments ? [] : null;
  const chunks = [];
  let chunkStartSegmentIndex = 0;
  function pushMeasuredSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, breakableFitAdvance, breakablePreferredBreak, spacingGraphemeCount) {
    if (kind !== "text" && kind !== "space" && kind !== "zero-width-break") {
      simpleLineWalkFastPath = false;
    }
    widths.push(width);
    lineEndFitAdvances.push(lineEndFitAdvance);
    lineEndPaintAdvances.push(lineEndPaintAdvance);
    kinds.push(kind);
    segStarts?.push(start);
    breakableFitAdvances.push(breakableFitAdvance);
    breakablePreferredBreaks.push(breakablePreferredBreak);
    if (hasLetterSpacing) spacingGraphemeCounts.push(spacingGraphemeCount);
    if (segments !== null) segments.push(text);
  }
  function pushMeasuredTextSegment(text, textMetrics, kind, start, wordLike, allowOverflowBreaks) {
    const spacingGraphemeCount = hasLetterSpacing ? countRenderedSpacingGraphemes(text, kind) : 0;
    const width = addInternalLetterSpacing(
      getCorrectedSegmentWidth(text, textMetrics, emojiCorrection),
      spacingGraphemeCount,
      letterSpacing
    );
    const baseLineEndFitAdvance = kind === "space" || kind === "preserved-space" || kind === "zero-width-break" ? 0 : width;
    const lineEndFitAdvance = baseLineEndFitAdvance === 0 ? 0 : baseLineEndFitAdvance + (spacingGraphemeCount > 0 ? letterSpacing : 0);
    const lineEndPaintAdvance = kind === "space" || kind === "zero-width-break" ? 0 : width;
    if (allowOverflowBreaks && wordLike && text.length > 1) {
      let fitMode = "sum-graphemes";
      if (letterSpacing !== 0) {
        fitMode = "segment-prefixes";
      } else if (isNumericRunSegment(text)) {
        fitMode = "pair-context";
      } else if (engineProfile.preferPrefixWidthsForBreakableRuns) {
        fitMode = "segment-prefixes";
      }
      const fitAdvances = getSegmentBreakableFitAdvances(
        text,
        textMetrics,
        cache,
        emojiCorrection,
        fitMode
      );
      const preferredBreaks = fitAdvances === null || wordBreak === "keep-all" ? null : getBreakablePreferredBreaks(text);
      pushMeasuredSegment(
        text,
        width,
        lineEndFitAdvance,
        lineEndPaintAdvance,
        kind,
        start,
        fitAdvances,
        preferredBreaks,
        spacingGraphemeCount
      );
      return;
    }
    pushMeasuredSegment(
      text,
      width,
      lineEndFitAdvance,
      lineEndPaintAdvance,
      kind,
      start,
      null,
      null,
      spacingGraphemeCount
    );
  }
  for (let mi = 0; mi < analysis.len; mi++) {
    const segText = analysis.texts[mi];
    const segWordLike = analysis.isWordLike[mi];
    const segKind = analysis.kinds[mi];
    const segStart = analysis.starts[mi];
    if (segKind === "soft-hyphen") {
      pushMeasuredSegment(
        segText,
        0,
        discretionaryHyphenWidth,
        discretionaryHyphenWidth,
        segKind,
        segStart,
        null,
        null,
        0
      );
      continue;
    }
    if (segKind === "hard-break") {
      const endSegmentIndex = widths.length;
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null, null, 0);
      chunks.push({
        startSegmentIndex: chunkStartSegmentIndex,
        endSegmentIndex,
        consumedEndSegmentIndex: widths.length
      });
      chunkStartSegmentIndex = widths.length;
      continue;
    }
    if (segKind === "tab") {
      pushMeasuredSegment(
        segText,
        0,
        0,
        0,
        segKind,
        segStart,
        null,
        null,
        hasLetterSpacing ? countRenderedSpacingGraphemes(segText, segKind) : 0
      );
      continue;
    }
    const segMetrics = getSegmentMetrics(segText, cache);
    if (segKind === "text" && segMetrics.containsCJK) {
      const baseUnits = buildBaseCjkUnits(segText, engineProfile);
      const measuredUnits = wordBreak === "keep-all" ? mergeKeepAllTextUnits(segText, baseUnits, engineProfile.breakKeepAllAfterPunctuation) : baseUnits;
      for (let i = 0; i < measuredUnits.length; i++) {
        const unit = measuredUnits[i];
        const unitMetrics = getSegmentMetrics(unit.text, cache);
        pushMeasuredTextSegment(
          unit.text,
          unitMetrics,
          "text",
          segStart + unit.start,
          segWordLike,
          wordBreak === "keep-all" || !unitMetrics.containsCJK
        );
      }
      continue;
    }
    pushMeasuredTextSegment(segText, segMetrics, segKind, segStart, segWordLike, true);
  }
  if (chunkStartSegmentIndex < widths.length) {
    chunks.push({
      startSegmentIndex: chunkStartSegmentIndex,
      endSegmentIndex: widths.length,
      consumedEndSegmentIndex: widths.length
    });
  }
  const segLevels = segStarts === null ? null : computeSegmentLevels(analysis.normalized, segStarts);
  if (segments !== null) {
    return {
      widths,
      lineEndFitAdvances,
      lineEndPaintAdvances,
      kinds,
      simpleLineWalkFastPath,
      segLevels,
      breakableFitAdvances,
      breakablePreferredBreaks,
      letterSpacing,
      spacingGraphemeCounts,
      discretionaryHyphenWidth,
      tabStopAdvance,
      chunks,
      segments
    };
  }
  return {
    widths,
    lineEndFitAdvances,
    lineEndPaintAdvances,
    kinds,
    simpleLineWalkFastPath,
    segLevels,
    breakableFitAdvances,
    breakablePreferredBreaks,
    letterSpacing,
    spacingGraphemeCounts,
    discretionaryHyphenWidth,
    tabStopAdvance,
    chunks
  };
}
function prepareInternal(text, font, includeSegments, options) {
  const wordBreak = options?.wordBreak ?? "normal";
  const letterSpacing = options?.letterSpacing ?? 0;
  const analysis = analyzeText(text, getEngineProfile(), options?.whiteSpace, wordBreak);
  return measureAnalysis(analysis, font, includeSegments, wordBreak, letterSpacing);
}
function prepare(text, font, options) {
  return prepareInternal(text, font, false, options);
}
function prepareWithSegments(text, font, options) {
  return prepareInternal(text, font, true, options);
}
function getInternalPrepared(prepared) {
  return prepared;
}
function layout(prepared, maxWidth, lineHeight) {
  const lineCount = countPreparedLines(getInternalPrepared(prepared), maxWidth);
  return { lineCount, height: lineCount * lineHeight };
}
function createLayoutLine(prepared, cache, width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  return {
    text: buildLineTextFromRange(
      prepared,
      cache,
      startSegmentIndex,
      startGraphemeIndex,
      endSegmentIndex,
      endGraphemeIndex
    ),
    width,
    start: {
      segmentIndex: startSegmentIndex,
      graphemeIndex: startGraphemeIndex
    },
    end: {
      segmentIndex: endSegmentIndex,
      graphemeIndex: endGraphemeIndex
    }
  };
}
function createLayoutLineRange(width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  return {
    width,
    start: {
      segmentIndex: startSegmentIndex,
      graphemeIndex: startGraphemeIndex
    },
    end: {
      segmentIndex: endSegmentIndex,
      graphemeIndex: endGraphemeIndex
    }
  };
}
function materializeLineRange(prepared, line) {
  return createLayoutLine(
    prepared,
    getLineTextCache(prepared),
    line.width,
    line.start.segmentIndex,
    line.start.graphemeIndex,
    line.end.segmentIndex,
    line.end.graphemeIndex
  );
}
function walkLineRanges(prepared, maxWidth, onLine) {
  if (prepared.widths.length === 0) return 0;
  return walkPreparedLinesRaw(
    getInternalPrepared(prepared),
    maxWidth,
    (width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) => {
      onLine(createLayoutLineRange(
        width,
        startSegmentIndex,
        startGraphemeIndex,
        endSegmentIndex,
        endGraphemeIndex
      ));
    }
  );
}
function measureLineStats(prepared, maxWidth) {
  return measurePreparedLineGeometry(getInternalPrepared(prepared), maxWidth);
}
function measureNaturalWidth(prepared) {
  let maxWidth = 0;
  walkPreparedLinesRaw(getInternalPrepared(prepared), Number.POSITIVE_INFINITY, (width) => {
    if (width > maxWidth) maxWidth = width;
  });
  return maxWidth;
}
function layoutNextLine(prepared, start, maxWidth) {
  const internal = getInternalPrepared(prepared);
  const end = {
    segmentIndex: start.segmentIndex,
    graphemeIndex: start.graphemeIndex
  };
  const chunkIndex = normalizePreparedLineStart(internal, end);
  if (chunkIndex < 0) return null;
  const lineStartSegmentIndex = end.segmentIndex;
  const lineStartGraphemeIndex = end.graphemeIndex;
  const width = stepPreparedLineGeometryFromChunk(internal, end, chunkIndex, maxWidth);
  if (width === null) return null;
  return createLayoutLine(
    prepared,
    getLineTextCache(prepared),
    width,
    lineStartSegmentIndex,
    lineStartGraphemeIndex,
    end.segmentIndex,
    end.graphemeIndex
  );
}
function layoutNextLineRange(prepared, start, maxWidth) {
  const internal = getInternalPrepared(prepared);
  const end = {
    segmentIndex: start.segmentIndex,
    graphemeIndex: start.graphemeIndex
  };
  const chunkIndex = normalizePreparedLineStart(internal, end);
  if (chunkIndex < 0) return null;
  const lineStartSegmentIndex = end.segmentIndex;
  const lineStartGraphemeIndex = end.graphemeIndex;
  const width = stepPreparedLineGeometryFromChunk(internal, end, chunkIndex, maxWidth);
  if (width === null) return null;
  return createLayoutLineRange(
    width,
    lineStartSegmentIndex,
    lineStartGraphemeIndex,
    end.segmentIndex,
    end.graphemeIndex
  );
}
function layoutWithLines(prepared, maxWidth, lineHeight) {
  const lines = [];
  if (prepared.widths.length === 0) return { lineCount: 0, height: 0, lines };
  const graphemeCache = getLineTextCache(prepared);
  const lineCount = walkPreparedLinesRaw(
    getInternalPrepared(prepared),
    maxWidth,
    (width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) => {
      lines.push(createLayoutLine(
        prepared,
        graphemeCache,
        width,
        startSegmentIndex,
        startGraphemeIndex,
        endSegmentIndex,
        endGraphemeIndex
      ));
    }
  );
  return { lineCount, height: lineCount * lineHeight, lines };
}
function clearCache() {
  clearAnalysisCaches();
  sharedGraphemeSegmenter = null;
  clearLineTextCaches();
  clearMeasurementCaches();
}
function setLocale(locale) {
  setAnalysisLocale(locale);
  clearCache();
}
export {
  clearCache,
  layout,
  layoutNextLine,
  layoutNextLineRange,
  layoutWithLines,
  materializeLineRange,
  measureLineStats,
  measureNaturalWidth,
  prepare,
  prepareWithSegments,
  setLocale,
  walkLineRanges
};
