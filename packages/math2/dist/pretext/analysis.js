const collapsibleWhitespaceRunRe = /[ \t\n\r\f]+/g;
const needsWhitespaceNormalizationRe = /[\t\n\r\f]| {2,}|^ | $/;
function getWhiteSpaceProfile(whiteSpace) {
  const mode = whiteSpace ?? "normal";
  return mode === "pre-wrap" ? { mode, preserveOrdinarySpaces: true, preserveHardBreaks: true } : { mode, preserveOrdinarySpaces: false, preserveHardBreaks: false };
}
function normalizeWhitespaceNormal(text) {
  if (!needsWhitespaceNormalizationRe.test(text)) return text;
  let normalized = text.replace(collapsibleWhitespaceRunRe, " ");
  if (normalized.charCodeAt(0) === 32) {
    normalized = normalized.slice(1);
  }
  if (normalized.length > 0 && normalized.charCodeAt(normalized.length - 1) === 32) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
function normalizeWhitespacePreWrap(text) {
  if (!/[\r\f]/.test(text)) return text;
  return text.replace(/\r\n/g, "\n").replace(/[\r\f]/g, "\n");
}
let sharedWordSegmenter = null;
let segmenterLocale;
function getSharedWordSegmenter() {
  if (sharedWordSegmenter === null) {
    sharedWordSegmenter = new Intl.Segmenter(segmenterLocale, { granularity: "word" });
  }
  return sharedWordSegmenter;
}
function clearAnalysisCaches() {
  sharedWordSegmenter = null;
}
function setAnalysisLocale(locale) {
  const nextLocale = locale && locale.length > 0 ? locale : void 0;
  if (segmenterLocale === nextLocale) return;
  segmenterLocale = nextLocale;
  sharedWordSegmenter = null;
}
const arabicScriptRe = new RegExp("\\p{Script=Arabic}", "u");
const combiningMarkRe = new RegExp("\\p{M}", "u");
const decimalDigitRe = new RegExp("\\p{Nd}", "u");
function containsArabicScript(text) {
  return arabicScriptRe.test(text);
}
function isCJKCodePoint(codePoint) {
  return codePoint >= 19968 && codePoint <= 40959 || codePoint >= 13312 && codePoint <= 19903 || codePoint >= 131072 && codePoint <= 173791 || codePoint >= 173824 && codePoint <= 177983 || codePoint >= 177984 && codePoint <= 178207 || codePoint >= 178208 && codePoint <= 183983 || codePoint >= 183984 && codePoint <= 191471 || codePoint >= 191472 && codePoint <= 192093 || codePoint >= 194560 && codePoint <= 195103 || codePoint >= 196608 && codePoint <= 201551 || codePoint >= 201552 && codePoint <= 205743 || codePoint >= 205744 && codePoint <= 210041 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 12288 && codePoint <= 12351 || codePoint >= 12352 && codePoint <= 12447 || codePoint >= 12448 && codePoint <= 12543 || codePoint >= 12592 && codePoint <= 12687 || codePoint >= 44032 && codePoint <= 55215 || codePoint >= 65280 && codePoint <= 65519;
}
function isCJK(s) {
  for (let i = 0; i < s.length; i++) {
    const first = s.charCodeAt(i);
    if (first < 12288) continue;
    if (first >= 55296 && first <= 56319 && i + 1 < s.length) {
      const second = s.charCodeAt(i + 1);
      if (second >= 56320 && second <= 57343) {
        const codePoint = (first - 55296 << 10) + (second - 56320) + 65536;
        if (isCJKCodePoint(codePoint)) return true;
        i++;
        continue;
      }
    }
    if (isCJKCodePoint(first)) return true;
  }
  return false;
}
function endsWithLineStartProhibitedText(text) {
  const last = getLastCodePoint(text);
  return last !== null && (kinsokuStart.has(last) || leftStickyPunctuation.has(last));
}
const keepAllGlueChars = /* @__PURE__ */ new Set([
  " ",
  " ",
  "⁠",
  "\uFEFF"
]);
const keepAllDashBreakChars = /* @__PURE__ */ new Set([
  "-",
  "‐",
  "–",
  "—"
]);
function endsWithKeepAllGlueText(text) {
  const last = getLastCodePoint(text);
  return last !== null && keepAllGlueChars.has(last);
}
function endsWithKeepAllDashBreakText(text) {
  const last = getLastCodePoint(text);
  return last !== null && keepAllDashBreakChars.has(last);
}
function canContinueKeepAllTextRun(previousText, breakAfterPunctuation) {
  if (endsWithKeepAllGlueText(previousText)) return false;
  if (!breakAfterPunctuation) return true;
  if (endsWithLineStartProhibitedText(previousText)) return false;
  if (endsWithKeepAllDashBreakText(previousText)) return false;
  return true;
}
const kinsokuStart = /* @__PURE__ */ new Set([
  "，",
  "．",
  "！",
  "：",
  "；",
  "？",
  "、",
  "。",
  "・",
  "）",
  "〕",
  "〉",
  "》",
  "」",
  "』",
  "】",
  "〗",
  "〙",
  "〛",
  "ー",
  "々",
  "〻",
  "ゝ",
  "ゞ",
  "ヽ",
  "ヾ"
]);
const kinsokuEnd = /* @__PURE__ */ new Set([
  '"',
  "(",
  "[",
  "{",
  "¡",
  "¿",
  "“",
  "‘",
  "‚",
  "„",
  "«",
  "‹",
  "⸘",
  "（",
  "〔",
  "〈",
  "《",
  "「",
  "『",
  "【",
  "〖",
  "〘",
  "〚"
]);
const forwardStickyGlue = /* @__PURE__ */ new Set([
  "'",
  "’"
]);
const leftStickyPunctuation = /* @__PURE__ */ new Set([
  ".",
  ",",
  "!",
  "?",
  ":",
  ";",
  "،",
  "؛",
  "؟",
  "।",
  "॥",
  "၊",
  "။",
  "၌",
  "၍",
  "၏",
  ")",
  "]",
  "}",
  "%",
  '"',
  "”",
  "’",
  "»",
  "›",
  "…"
]);
const arabicNoSpaceTrailingPunctuation = /* @__PURE__ */ new Set([
  ":",
  ".",
  "،",
  "؛"
]);
const myanmarMedialGlue = /* @__PURE__ */ new Set([
  "၏"
]);
const closingQuoteChars = /* @__PURE__ */ new Set([
  "”",
  "’",
  "»",
  "›",
  "」",
  "』",
  "】",
  "》",
  "〉",
  "〕",
  "）"
]);
function isLeftStickyPunctuationSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment)) return true;
  let sawPunctuation = false;
  for (const ch of segment) {
    if (leftStickyPunctuation.has(ch) || isLineBreakNumericAffix(ch)) {
      sawPunctuation = true;
      continue;
    }
    if (sawPunctuation && combiningMarkRe.test(ch)) continue;
    return false;
  }
  return sawPunctuation;
}
function isCJKLineStartProhibitedSegment(segment) {
  for (const ch of segment) {
    if (!kinsokuStart.has(ch) && !leftStickyPunctuation.has(ch)) return false;
  }
  return segment.length > 0;
}
function isForwardStickyClusterSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment)) return true;
  for (const ch of segment) {
    if (!kinsokuEnd.has(ch) && !forwardStickyGlue.has(ch) && !combiningMarkRe.test(ch) && !isLineBreakNumericAffix(ch)) {
      return false;
    }
  }
  return segment.length > 0;
}
function isEscapedQuoteClusterSegment(segment) {
  let sawQuote = false;
  for (const ch of segment) {
    if (ch === "\\" || combiningMarkRe.test(ch)) continue;
    if (kinsokuEnd.has(ch) || leftStickyPunctuation.has(ch) || forwardStickyGlue.has(ch)) {
      sawQuote = true;
      continue;
    }
    return false;
  }
  return sawQuote;
}
function previousCodePointStart(text, end) {
  const last = end - 1;
  if (last <= 0) return Math.max(last, 0);
  const lastCodeUnit = text.charCodeAt(last);
  if (lastCodeUnit < 56320 || lastCodeUnit > 57343) return last;
  const maybeHigh = last - 1;
  if (maybeHigh < 0) return last;
  const highCodeUnit = text.charCodeAt(maybeHigh);
  return highCodeUnit >= 55296 && highCodeUnit <= 56319 ? maybeHigh : last;
}
function getLastCodePoint(text) {
  if (text.length === 0) return null;
  const start = previousCodePointStart(text, text.length);
  return text.slice(start);
}
function getFirstSignificantCodePoint(text) {
  for (const ch of text) {
    if (!combiningMarkRe.test(ch)) return ch;
  }
  return null;
}
function getLastSignificantCodePoint(text) {
  for (let end = text.length; end > 0; ) {
    const start = previousCodePointStart(text, end);
    const ch = text.slice(start, end);
    if (!combiningMarkRe.test(ch)) return ch;
    end = start;
  }
  return null;
}
const lineBreakNumericAffixRanges = [
  36,
  37,
  43,
  43,
  92,
  92,
  162,
  165,
  176,
  177,
  1423,
  1423,
  1545,
  1547,
  1642,
  1642,
  2046,
  2047,
  2546,
  2547,
  2553,
  2555,
  2801,
  2801,
  3065,
  3065,
  3449,
  3449,
  3647,
  3647,
  6107,
  6107,
  8240,
  8247,
  8279,
  8279,
  8352,
  8399,
  8451,
  8451,
  8457,
  8457,
  8470,
  8470,
  8722,
  8723,
  43064,
  43064,
  65020,
  65020,
  65129,
  65130,
  65284,
  65285,
  65504,
  65505,
  65509,
  65510,
  73693,
  73696,
  123647,
  123647,
  126124,
  126124,
  126128,
  126128
];
function isCodePointInRanges(codePoint, ranges) {
  for (let i = 0; i < ranges.length; i += 2) {
    if (codePoint >= ranges[i] && codePoint <= ranges[i + 1]) return true;
  }
  return false;
}
function isLineBreakNumericAffix(ch) {
  const codePoint = ch.codePointAt(0);
  return codePoint !== void 0 && isCodePointInRanges(codePoint, lineBreakNumericAffixRanges);
}
function endsWithLineBreakNumericAffix(text) {
  const last = getLastSignificantCodePoint(text);
  return last !== null && isLineBreakNumericAffix(last);
}
function startsWithDecimalDigit(text) {
  const first = getFirstSignificantCodePoint(text);
  return first !== null && decimalDigitRe.test(first);
}
function splitTrailingForwardStickyCluster(text) {
  const chars = Array.from(text);
  let splitIndex = chars.length;
  while (splitIndex > 0) {
    const ch = chars[splitIndex - 1];
    if (combiningMarkRe.test(ch)) {
      splitIndex--;
      continue;
    }
    if (kinsokuEnd.has(ch) || forwardStickyGlue.has(ch)) {
      splitIndex--;
      continue;
    }
    break;
  }
  if (splitIndex <= 0 || splitIndex === chars.length) return null;
  return {
    head: chars.slice(0, splitIndex).join(""),
    tail: chars.slice(splitIndex).join("")
  };
}
function getRepeatableSingleCharRunChar(text, isWordLike, kind) {
  return kind === "text" && !isWordLike && text.length === 1 && text !== "-" && text !== "—" ? text : null;
}
function hasArabicNoSpacePunctuation(containsArabic, lastCodePoint) {
  return containsArabic && lastCodePoint !== null && arabicNoSpaceTrailingPunctuation.has(lastCodePoint);
}
function endsWithMyanmarMedialGlue(segment) {
  const lastCodePoint = getLastCodePoint(segment);
  return lastCodePoint !== null && myanmarMedialGlue.has(lastCodePoint);
}
function splitLeadingSpaceAndMarks(segment) {
  if (segment.length < 2 || segment[0] !== " ") return null;
  const marks = segment.slice(1);
  if (new RegExp("^\\p{M}+$", "u").test(marks)) {
    return { space: " ", marks };
  }
  return null;
}
function endsWithClosingQuote(text) {
  let end = text.length;
  while (end > 0) {
    const start = previousCodePointStart(text, end);
    const ch = text.slice(start, end);
    if (closingQuoteChars.has(ch)) return true;
    if (!leftStickyPunctuation.has(ch)) return false;
    end = start;
  }
  return false;
}
function classifySegmentBreakChar(ch, whiteSpaceProfile) {
  if (whiteSpaceProfile.preserveOrdinarySpaces || whiteSpaceProfile.preserveHardBreaks) {
    if (ch === " ") return "preserved-space";
    if (ch === "	") return "tab";
    if (whiteSpaceProfile.preserveHardBreaks && ch === "\n") return "hard-break";
  }
  if (ch === " ") return "space";
  if (ch === " " || ch === " " || ch === "⁠" || ch === "\uFEFF") {
    return "glue";
  }
  if (ch === "​") return "zero-width-break";
  if (ch === "­") return "soft-hyphen";
  return "text";
}
const breakCharRe = /[\x20\t\n\xA0\xAD\u200B\u202F\u2060\uFEFF]/;
function joinTextParts(parts) {
  return parts.length === 1 ? parts[0] : parts.join("");
}
function joinReversedPrefixParts(prefixParts, tail) {
  const parts = [];
  for (let i = prefixParts.length - 1; i >= 0; i--) {
    parts.push(prefixParts[i]);
  }
  parts.push(tail);
  return joinTextParts(parts);
}
function splitSegmentByBreakKind(segment, isWordLike, start, whiteSpaceProfile) {
  if (!breakCharRe.test(segment)) {
    return [{ text: segment, isWordLike, kind: "text", start }];
  }
  const pieces = [];
  let currentKind = null;
  let currentTextParts = [];
  let currentStart = start;
  let currentWordLike = false;
  let offset = 0;
  for (const ch of segment) {
    const kind = classifySegmentBreakChar(ch, whiteSpaceProfile);
    const wordLike = kind === "text" && isWordLike;
    if (currentKind !== null && kind === currentKind && wordLike === currentWordLike) {
      currentTextParts.push(ch);
      offset += ch.length;
      continue;
    }
    if (currentKind !== null) {
      pieces.push({
        text: joinTextParts(currentTextParts),
        isWordLike: currentWordLike,
        kind: currentKind,
        start: currentStart
      });
    }
    currentKind = kind;
    currentTextParts = [ch];
    currentStart = start + offset;
    currentWordLike = wordLike;
    offset += ch.length;
  }
  if (currentKind !== null) {
    pieces.push({
      text: joinTextParts(currentTextParts),
      isWordLike: currentWordLike,
      kind: currentKind,
      start: currentStart
    });
  }
  return pieces;
}
function isTextRunBoundary(kind) {
  return kind === "space" || kind === "preserved-space" || kind === "zero-width-break" || kind === "hard-break";
}
const urlSchemeSegmentRe = /^[A-Za-z][A-Za-z0-9+.-]*:$/;
function isUrlLikeRunStart(segmentation, index) {
  const text = segmentation.texts[index];
  if (text.startsWith("www.")) return true;
  return urlSchemeSegmentRe.test(text) && index + 1 < segmentation.len && segmentation.kinds[index + 1] === "text" && segmentation.texts[index + 1] === "//";
}
function isUrlQueryBoundarySegment(text) {
  return text.includes("?") && (text.includes("://") || text.startsWith("www."));
}
function mergeUrlRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0; i < segmentation.len; i++) {
    const start = segmentation.starts[i];
    let text = segmentation.texts[i];
    let wordLike = segmentation.isWordLike[i];
    const kind = segmentation.kinds[i];
    let queryStartOverride = -1;
    if (kind === "text" && isUrlLikeRunStart(segmentation, i)) {
      const urlParts = [text];
      let j2 = i + 1;
      while (j2 < segmentation.len && !isTextRunBoundary(segmentation.kinds[j2])) {
        if (queryStartOverride < 0 && isUrlLikeRunStart(segmentation, j2)) {
          queryStartOverride = segmentation.starts[j2];
        }
        const nextText = segmentation.texts[j2];
        urlParts.push(nextText);
        wordLike = true;
        j2++;
        if (nextText.includes("?")) break;
      }
      text = joinTextParts(urlParts);
      i = j2 - 1;
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
    if (!isUrlQueryBoundarySegment(text)) continue;
    const nextIndex = i + 1;
    if (nextIndex >= segmentation.len || isTextRunBoundary(segmentation.kinds[nextIndex])) {
      continue;
    }
    const queryParts = [];
    const queryStart = queryStartOverride < 0 ? segmentation.starts[nextIndex] : queryStartOverride;
    let j = nextIndex;
    while (j < segmentation.len && !isTextRunBoundary(segmentation.kinds[j])) {
      queryParts.push(segmentation.texts[j]);
      j++;
    }
    if (queryParts.length > 0) {
      texts.push(joinTextParts(queryParts));
      isWordLike.push(true);
      kinds.push("text");
      starts.push(queryStart);
      i = j - 1;
    }
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
const numericJoinerChars = /* @__PURE__ */ new Set([
  ":",
  "-",
  "/",
  "×",
  ",",
  ".",
  "+",
  "–",
  "—"
]);
const wordInternalSymbolRe = /[\p{P}\p{S}\p{Co}]/u;
const emojiPresentationRe = new RegExp("\\p{Emoji_Presentation}", "u");
const noSpaceWordBreakAfterChars = /* @__PURE__ */ new Set([
  "?",
  "֊",
  "-",
  "‐",
  "‒",
  "–",
  "—",
  "…",
  "‼",
  "‽",
  "⁉"
]);
function isAsciiWordInternalSymbolCode(code) {
  return code >= 33 && code <= 47 && code !== 45 || code >= 58 && code <= 64 && code !== 63 || code >= 91 && code <= 96 || code >= 123 && code <= 126;
}
function isNoSpaceWordInternalSymbol(ch) {
  const code = ch.charCodeAt(0);
  if (code < 128) return isAsciiWordInternalSymbolCode(code);
  return !noSpaceWordBreakAfterChars.has(ch) && !emojiPresentationRe.test(ch) && wordInternalSymbolRe.test(ch);
}
function isNoSpaceWordInternalSymbolSegment(text) {
  let sawSymbol = false;
  for (const ch of text) {
    if (combiningMarkRe.test(ch)) continue;
    if (!isNoSpaceWordInternalSymbol(ch)) return false;
    sawSymbol = true;
  }
  return sawSymbol;
}
function endsWithNoSpaceWordJoiner(text) {
  for (let end = text.length; end > 0; ) {
    const start = previousCodePointStart(text, end);
    const ch = text.slice(start, end);
    if (combiningMarkRe.test(ch)) {
      end = start;
      continue;
    }
    return isNoSpaceWordInternalSymbol(ch) || isLineBreakNumericAffix(ch);
  }
  return false;
}
function canJoinNoSpaceWordBoundary(leftText, leftWordLike, rightText, rightWordLike) {
  const leftSymbol = !leftWordLike && isNoSpaceWordInternalSymbolSegment(leftText);
  const rightSymbol = !rightWordLike && isNoSpaceWordInternalSymbolSegment(rightText);
  const leftAffix = endsWithLineBreakNumericAffix(leftText);
  const leftEndsJoiner = (leftWordLike || leftAffix) && endsWithNoSpaceWordJoiner(leftText);
  if (!leftSymbol && !rightSymbol && !leftEndsJoiner) return false;
  if (isCJK(leftText) || isCJK(rightText)) return false;
  return (leftWordLike || leftSymbol || leftAffix) && (rightWordLike || rightSymbol);
}
function segmentContainsDecimalDigit(text) {
  for (const ch of text) {
    if (decimalDigitRe.test(ch)) return true;
  }
  return false;
}
function isNumericRunSegment(text) {
  if (text.length === 0) return false;
  for (const ch of text) {
    if (decimalDigitRe.test(ch) || numericJoinerChars.has(ch)) continue;
    return false;
  }
  return true;
}
function mergeNumericRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  function pushNumericRun(text, start) {
    if (text.includes("-")) {
      const parts = text.split("-");
      let shouldSplit = parts.length > 1;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!shouldSplit) break;
        if (part.length === 0 || !segmentContainsDecimalDigit(part) || !isNumericRunSegment(part)) {
          shouldSplit = false;
        }
      }
      if (shouldSplit) {
        let offset = 0;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const splitText = i < parts.length - 1 ? `${part}-` : part;
          texts.push(splitText);
          isWordLike.push(true);
          kinds.push("text");
          starts.push(start + offset);
          offset += splitText.length;
        }
        return;
      }
    }
    texts.push(text);
    isWordLike.push(true);
    kinds.push("text");
    starts.push(start);
  }
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    if (kind === "text" && isNumericRunSegment(text) && segmentContainsDecimalDigit(text)) {
      const mergedParts = [text];
      let j = i + 1;
      while (j < segmentation.len && segmentation.kinds[j] === "text" && isNumericRunSegment(segmentation.texts[j])) {
        mergedParts.push(segmentation.texts[j]);
        j++;
      }
      pushNumericRun(joinTextParts(mergedParts), segmentation.starts[i]);
      i = j - 1;
      continue;
    }
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeNoSpaceWordChains(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  let i = 0;
  while (i < segmentation.len) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    const wordLike = segmentation.isWordLike[i];
    if (kind === "text") {
      const mergedParts = [text];
      let j = i + 1;
      let mergedWordLike = wordLike;
      while (j < segmentation.len && segmentation.kinds[j] === "text" && canJoinNoSpaceWordBoundary(
        segmentation.texts[j - 1],
        segmentation.isWordLike[j - 1],
        segmentation.texts[j],
        segmentation.isWordLike[j]
      )) {
        const nextText = segmentation.texts[j];
        mergedParts.push(nextText);
        mergedWordLike = mergedWordLike || segmentation.isWordLike[j];
        j++;
      }
      if (j > i + 1) {
        texts.push(joinTextParts(mergedParts));
        isWordLike.push(mergedWordLike);
        kinds.push("text");
        starts.push(segmentation.starts[i]);
        i = j;
        continue;
      }
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
    i++;
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeGlueConnectedTextRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  let read = 0;
  while (read < segmentation.len) {
    const textParts = [segmentation.texts[read]];
    let wordLike = segmentation.isWordLike[read];
    let kind = segmentation.kinds[read];
    let start = segmentation.starts[read];
    if (kind === "glue") {
      const glueParts = [textParts[0]];
      const glueStart = start;
      read++;
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        glueParts.push(segmentation.texts[read]);
        read++;
      }
      const glueText = joinTextParts(glueParts);
      if (read < segmentation.len && segmentation.kinds[read] === "text") {
        textParts[0] = glueText;
        textParts.push(segmentation.texts[read]);
        wordLike = segmentation.isWordLike[read];
        kind = "text";
        start = glueStart;
        read++;
      } else {
        texts.push(glueText);
        isWordLike.push(false);
        kinds.push("glue");
        starts.push(glueStart);
        continue;
      }
    } else {
      read++;
    }
    if (kind === "text") {
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        const glueParts = [];
        while (read < segmentation.len && segmentation.kinds[read] === "glue") {
          glueParts.push(segmentation.texts[read]);
          read++;
        }
        const glueText = joinTextParts(glueParts);
        if (read < segmentation.len && segmentation.kinds[read] === "text") {
          textParts.push(glueText, segmentation.texts[read]);
          wordLike = wordLike || segmentation.isWordLike[read];
          read++;
          continue;
        }
        textParts.push(glueText);
      }
    }
    texts.push(joinTextParts(textParts));
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function carryTrailingForwardStickyAcrossCJKBoundary(segmentation) {
  const { texts, kinds, starts } = segmentation;
  for (let i = 0; i < texts.length - 1; i++) {
    if (kinds[i] !== "text" || kinds[i + 1] !== "text") continue;
    if (!isCJK(texts[i]) || !isCJK(texts[i + 1])) continue;
    const split = splitTrailingForwardStickyCluster(texts[i]);
    if (split === null) continue;
    texts[i] = split.head;
    texts[i + 1] = split.tail + texts[i + 1];
    starts[i + 1] = starts[i] + split.head.length;
  }
}
function buildMergedSegmentation(normalized, profile, whiteSpaceProfile) {
  const wordSegmenter = getSharedWordSegmenter();
  let mergedLen = 0;
  const mergedTexts = [];
  const mergedWordLike = [];
  const mergedKinds = [];
  const mergedStarts = [];
  let hasTail = false;
  let tailStart = 0;
  let tailEnd = 0;
  let tailWordLike = false;
  let tailKind = "text";
  let tailSingleCharRunChar = null;
  let tailContainsCJK = false;
  let tailContainsArabicScript = false;
  let tailEndsWithClosingQuote = false;
  let tailEndsWithMyanmarMedialGlue = false;
  let tailHasArabicNoSpacePunctuation = false;
  for (const s of wordSegmenter.segment(normalized)) {
    for (const piece of splitSegmentByBreakKind(s.segment, s.isWordLike ?? false, s.index, whiteSpaceProfile)) {
      const isText = piece.kind === "text";
      const repeatableSingleCharRunChar = getRepeatableSingleCharRunChar(piece.text, piece.isWordLike, piece.kind);
      const pieceContainsCJK = isCJK(piece.text);
      const pieceContainsArabicScript = containsArabicScript(piece.text);
      const pieceLastCodePoint = getLastCodePoint(piece.text);
      const pieceEndsWithClosingQuote = endsWithClosingQuote(piece.text);
      const pieceEndsWithMyanmarMedialGlue = endsWithMyanmarMedialGlue(piece.text);
      const pieceEnd = piece.start + piece.text.length;
      let appendToTail = false;
      if (profile.carryCJKAfterClosingQuote && isText && hasTail && tailKind === "text" && pieceContainsCJK && tailContainsCJK && tailEndsWithClosingQuote) {
        appendToTail = true;
      } else if (isText && hasTail && tailKind === "text" && isCJKLineStartProhibitedSegment(piece.text) && tailContainsCJK) {
        appendToTail = true;
      } else if (isText && hasTail && tailKind === "text" && tailEndsWithMyanmarMedialGlue) {
        appendToTail = true;
      } else if (isText && hasTail && tailKind === "text" && piece.isWordLike && pieceContainsArabicScript && tailHasArabicNoSpacePunctuation) {
        appendToTail = true;
      } else if (repeatableSingleCharRunChar !== null && hasTail && tailKind === "text" && tailSingleCharRunChar === repeatableSingleCharRunChar) {
        tailEnd = pieceEnd;
        continue;
      } else if (isText && !piece.isWordLike && hasTail && tailKind === "text" && !tailContainsCJK && (isLeftStickyPunctuationSegment(piece.text) || piece.text === "-" && tailWordLike)) {
        appendToTail = true;
      }
      if (appendToTail) {
        tailEnd = pieceEnd;
        tailWordLike = tailWordLike || piece.isWordLike;
        tailSingleCharRunChar = null;
        tailContainsCJK = tailContainsCJK || pieceContainsCJK;
        tailContainsArabicScript = tailContainsArabicScript || pieceContainsArabicScript;
        tailEndsWithClosingQuote = pieceEndsWithClosingQuote;
        tailEndsWithMyanmarMedialGlue = pieceEndsWithMyanmarMedialGlue;
        tailHasArabicNoSpacePunctuation = hasArabicNoSpacePunctuation(
          tailContainsArabicScript,
          pieceLastCodePoint
        );
      } else {
        if (hasTail) {
          mergedTexts[mergedLen] = normalized.slice(tailStart, tailEnd);
          mergedWordLike[mergedLen] = tailWordLike;
          mergedKinds[mergedLen] = tailKind;
          mergedStarts[mergedLen] = tailStart;
          mergedLen++;
        }
        hasTail = true;
        tailStart = piece.start;
        tailEnd = pieceEnd;
        tailWordLike = piece.isWordLike;
        tailKind = piece.kind;
        tailSingleCharRunChar = repeatableSingleCharRunChar;
        tailContainsCJK = pieceContainsCJK;
        tailContainsArabicScript = pieceContainsArabicScript;
        tailEndsWithClosingQuote = pieceEndsWithClosingQuote;
        tailEndsWithMyanmarMedialGlue = pieceEndsWithMyanmarMedialGlue;
        tailHasArabicNoSpacePunctuation = hasArabicNoSpacePunctuation(
          pieceContainsArabicScript,
          pieceLastCodePoint
        );
      }
    }
  }
  if (hasTail) {
    mergedTexts[mergedLen] = normalized.slice(tailStart, tailEnd);
    mergedWordLike[mergedLen] = tailWordLike;
    mergedKinds[mergedLen] = tailKind;
    mergedStarts[mergedLen] = tailStart;
    mergedLen++;
  }
  for (let i = 1; i < mergedLen; i++) {
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && isEscapedQuoteClusterSegment(mergedTexts[i]) && mergedKinds[i - 1] === "text" && !isCJK(mergedTexts[i - 1])) {
      mergedTexts[i - 1] += mergedTexts[i];
      mergedWordLike[i - 1] = mergedWordLike[i - 1] || mergedWordLike[i];
      mergedTexts[i] = "";
    }
  }
  let nextLiveIndex = -1;
  let forwardStickyPrefixParts = null;
  for (let i = mergedLen - 1; i >= 0; i--) {
    const text = mergedTexts[i];
    if (text.length === 0) continue;
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && nextLiveIndex >= 0 && mergedKinds[nextLiveIndex] === "text" && (isForwardStickyClusterSegment(text) || text === "-" && startsWithDecimalDigit(mergedTexts[nextLiveIndex]))) {
      if (forwardStickyPrefixParts === null) forwardStickyPrefixParts = [];
      forwardStickyPrefixParts.push(text);
      mergedStarts[nextLiveIndex] = mergedStarts[i];
      mergedTexts[i] = "";
      continue;
    }
    if (forwardStickyPrefixParts !== null) {
      mergedTexts[nextLiveIndex] = joinReversedPrefixParts(
        forwardStickyPrefixParts,
        mergedTexts[nextLiveIndex]
      );
      forwardStickyPrefixParts = null;
    }
    nextLiveIndex = i;
  }
  if (forwardStickyPrefixParts !== null) {
    mergedTexts[nextLiveIndex] = joinReversedPrefixParts(
      forwardStickyPrefixParts,
      mergedTexts[nextLiveIndex]
    );
  }
  let compactLen = 0;
  for (let read = 0; read < mergedLen; read++) {
    const text = mergedTexts[read];
    if (text.length === 0) continue;
    if (compactLen !== read) {
      mergedTexts[compactLen] = text;
      mergedWordLike[compactLen] = mergedWordLike[read];
      mergedKinds[compactLen] = mergedKinds[read];
      mergedStarts[compactLen] = mergedStarts[read];
    }
    compactLen++;
  }
  mergedTexts.length = compactLen;
  mergedWordLike.length = compactLen;
  mergedKinds.length = compactLen;
  mergedStarts.length = compactLen;
  const compacted = mergeGlueConnectedTextRuns({
    len: compactLen,
    texts: mergedTexts,
    isWordLike: mergedWordLike,
    kinds: mergedKinds,
    starts: mergedStarts
  });
  const mergedRuns = mergeNoSpaceWordChains(mergeNumericRuns(mergeUrlRuns(compacted)));
  carryTrailingForwardStickyAcrossCJKBoundary(mergedRuns);
  for (let i = 0; i < mergedRuns.len - 1; i++) {
    const split = splitLeadingSpaceAndMarks(mergedRuns.texts[i]);
    if (split === null) continue;
    if (mergedRuns.kinds[i] !== "space" && mergedRuns.kinds[i] !== "preserved-space" || mergedRuns.kinds[i + 1] !== "text" || !containsArabicScript(mergedRuns.texts[i + 1])) {
      continue;
    }
    mergedRuns.texts[i] = split.space;
    mergedRuns.isWordLike[i] = false;
    mergedRuns.kinds[i] = mergedRuns.kinds[i] === "preserved-space" ? "preserved-space" : "space";
    mergedRuns.texts[i + 1] = split.marks + mergedRuns.texts[i + 1];
    mergedRuns.starts[i + 1] = mergedRuns.starts[i] + split.space.length;
  }
  return mergedRuns;
}
function mergeKeepAllTextSegments(normalized, segmentation, breakAfterPunctuation) {
  if (segmentation.len <= 1) return segmentation;
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  let groupStart = -1;
  let groupContainsCJK = false;
  function pushOriginalText(index) {
    texts.push(segmentation.texts[index]);
    isWordLike.push(segmentation.isWordLike[index]);
    kinds.push("text");
    starts.push(segmentation.starts[index]);
  }
  function pushMergedText(start, end) {
    let wordLike = false;
    for (let i = start; i < end; i++) {
      wordLike = wordLike || segmentation.isWordLike[i];
    }
    const sourceStart = segmentation.starts[start];
    const sourceEnd = end < segmentation.len ? segmentation.starts[end] : normalized.length;
    texts.push(normalized.slice(sourceStart, sourceEnd));
    isWordLike.push(wordLike);
    kinds.push("text");
    starts.push(sourceStart);
  }
  function flushGroup(end) {
    if (groupStart < 0) return;
    if (groupContainsCJK) {
      if (groupStart + 1 === end) {
        pushOriginalText(groupStart);
      } else {
        pushMergedText(groupStart, end);
      }
    } else {
      for (let i = groupStart; i < end; i++) pushOriginalText(i);
    }
    groupStart = -1;
    groupContainsCJK = false;
  }
  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    if (kind === "text") {
      if (groupStart >= 0 && !canContinueKeepAllTextRun(segmentation.texts[i - 1], breakAfterPunctuation)) {
        flushGroup(i);
      }
      if (groupStart < 0) groupStart = i;
      groupContainsCJK = groupContainsCJK || isCJK(text);
      continue;
    }
    flushGroup(i);
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  flushGroup(segmentation.len);
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function analyzeText(text, profile, whiteSpace = "normal", wordBreak = "normal") {
  const whiteSpaceProfile = getWhiteSpaceProfile(whiteSpace);
  const normalized = whiteSpaceProfile.mode === "pre-wrap" ? normalizeWhitespacePreWrap(text) : normalizeWhitespaceNormal(text);
  if (normalized.length === 0) {
    return {
      normalized,
      len: 0,
      texts: [],
      isWordLike: [],
      kinds: [],
      starts: []
    };
  }
  const mergedSegmentation = buildMergedSegmentation(normalized, profile, whiteSpaceProfile);
  const segmentation = wordBreak === "keep-all" ? mergeKeepAllTextSegments(normalized, mergedSegmentation, profile.breakKeepAllAfterPunctuation) : mergedSegmentation;
  return {
    normalized,
    ...segmentation
  };
}
export {
  analyzeText,
  canContinueKeepAllTextRun,
  clearAnalysisCaches,
  endsWithClosingQuote,
  isCJK,
  isNumericRunSegment,
  kinsokuEnd,
  kinsokuStart,
  leftStickyPunctuation,
  normalizeWhitespaceNormal,
  setAnalysisLocale
};
