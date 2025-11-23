```css
font = 
  [ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ]  |
  <system-family-name>                                

<font-style> = 
  normal                           |
  italic                           |
  left                             |
  right                            |
  oblique <angle [-90deg,90deg]>?  

<font-variant-css2> = 
  normal      |
  small-caps  

<font-weight> = 
  <font-weight-absolute>  |
  bolder                  |
  lighter                 

<font-width-css3> = 
  normal           |
  ultra-condensed  |
  extra-condensed  |
  condensed        |
  semi-condensed   |
  semi-expanded    |
  expanded         |
  extra-expanded   |
  ultra-expanded   

<font-size> = 
  <absolute-size>            |
  <relative-size>            |
  <length-percentage [0,∞]>  |
  math                       

<line-height> = 
  normal                     |
  <number [0,∞]>             |
  <length-percentage [0,∞]>  

<font-family> = 
  [ <family-name> | <generic-family> ]#  

<system-family-name> = 
  caption        |
  icon           |
  menu           |
  message-box    |
  small-caption  |
  status-bar     

<font-weight-absolute> = 
  normal             |
  bold               |
  <number [1,1000]>  

<length-percentage> = 
  <length>      |
  <percentage>  

<family-name> = 
  <string>         |
  <custom-ident>+  

<generic-family> = 
  <generic-script-specific>  |
  <generic-complete>         |
  <generic-incomplete>       

<generic-script-specific> = 
  generic( fangsong )   |
  generic( kai )        |
  generic( khmer-mul )  |
  generic( nastaliq )   

<generic-complete> = 
  serif       |
  sans-serif  |
  system-ui   |
  cursive     |
  fantasy     |
  math        |
  monospace   

<generic-incomplete> = 
  ui-serif       |
  ui-sans-serif  |
  ui-monospace   |
  ui-rounded     

```


```ts
/**
 * FontMgrFull.ts
 * Complete Font Manager + @font-face CSS auto-loader
 * Compatible with CanvasKit (canvaskit-wasm full) 0.40.0
 *
 * Features implemented in this single module:
 *  - Parse page CSS and <link rel="stylesheet"> to find @font-face rules (best-effort, respects CORS)
 *  - Auto-download and register fonts (woff2 / woff / ttf / otf)
 *  - Build FontFamily table with multiple weights/styles and unicode-range metadata
 *  - Matching algorithm for family/style/weight/variant and unicode-range-aware fallback chain
 *  - Integrates with CanvasKit.Typeface.MakeFreeTypeFaceFromData and CanvasKit.Font
 *  - measureText using font.getGlyphIDs + font.getWidths with TextBlob.getBounds fallback
 *  - glyph availability check
 *  - LRU cache for CanvasKit.Font instances
 *  - Public API for your 2D engine: loadPageFonts(), loadFontFromURL(), getFont(), measureText(), pickTypefaceForRequest()
 *
 * Notes/limitations:
 *  - Browsers may block reading cssRules of cross-origin stylesheets. For those we attempt to re-fetch via fetch() and parse the CSS text.
 *  - Parsing CSS is best-effort using a lightweight parser (regex + simple state). It won't be a full CSS parser but handles common @font-face patterns.
 *  - unicode-range parsing supports formats like U+26, U+20-7F, U+4E00-9FFF and comma-separated lists.
 *  - CanvasKit 0.40.0 is required (Typeface.MakeFreeTypeFaceFromData, TextBlob.MakeFromText, Font API present).
 */

export type FontStyle = "normal" | "italic";

export interface RegisteredFontDesc {
  family: string;
  weight: number; // 100..900
  style: FontStyle;
  source: string; // original URL
  buffer?: ArrayBuffer; // loaded binary (optional)
  unicodeRanges?: Array<[number, number]>; // inclusive ranges
  format?: string; // 'woff2'|'woff'|'ttf'|'otf' etc
  descriptors?: Record<string, string | number>;
}

interface LoadedTypeface {
  desc: RegisteredFontDesc;
  typeface: any; // CanvasKit.Typeface
}

interface FontCacheEntry {
  key: string;
  font: any; // CanvasKit.Font
}

export class PageFontLoader {
  // Lightweight CSS @font-face parser and loader
  // Usage: const loader = new PageFontLoader(); await loader.loadPageFonts();

  async loadPageFonts(): Promise<string[]> {
    // returns array of parsed @font-face CSS text blocks (for debugging)
    const cssTexts: string[] = [];

    // Iterate document.styleSheets and attempt to get cssRules; if cross-origin, fetch text
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        // Some sheets allow cssRules access
        // @ts-ignore
        const rules = sheet.cssRules;
        if (!rules) continue;
        const css = Array.from(rules).map((r: any) => r.cssText || '').join('\n');
        if (css) cssTexts.push(css);
      } catch (e) {
        // Cross-origin css; try to fetch via href if available
        // @ts-ignore
        const href = sheet.href;
        if (href) {
          try {
            const txt = await fetch(href, { mode: 'cors' }).then(r => r.text());
            cssTexts.push(txt);
          } catch (err) {
            // ignore if can't fetch
          }
        }
      }
    }

    return cssTexts;
  }

  /**
   * Extracts @font-face blocks from plain CSS text.
   */
  extractFontFaceBlocks(cssText: string): string[] {
    const blocks: string[] = [];
    const re = /@font-face\s*\{([\s\S]*?)\}/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(cssText)) !== null) {
      blocks.push(m[1].trim());
    }
    return blocks;
  }

  /**
   * Parse a single @font-face block body into descriptors
   */
  parseFontFaceBlock(blockBody: string): Record<string, string> {
    const desc: Record<string, string> = {};
    // naive split by semicolon but keep urls intact
    const parts = blockBody.split(/;(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);
    for (let p of parts) {
      p = p.trim();
      if (!p) continue;
      const idx = p.indexOf(':');
      if (idx === -1) continue;
      const key = p.slice(0, idx).trim().toLowerCase();
      let val = p.slice(idx + 1).trim();
      // strip trailing semicolon
      if (val.endsWith(';')) val = val.slice(0, -1).trim();
      // strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      desc[key] = val;
    }
    return desc;
  }

  /**
   * parse src descriptor into array of {url, format}
   */
  parseSrcDescriptor(src: string): Array<{ url: string; format?: string }> {
    // src: url("/fonts/foo.woff2") format('woff2'), url('/fonts/foo.ttf')
    const results: Array<{ url: string; format?: string }> = [];
    // match url(...) and optional format('...') following it
    const re = /url\(([^)]+)\)\s*(?:format\(([^)]+)\))?/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      let u = m[1].trim();
      if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) u = u.slice(1, -1);
      let f = m[2];
      if (f) {
        f = f.trim();
        if ((f.startsWith('"') && f.endsWith('"')) || (f.startsWith("'") && f.endsWith("'"))) f = f.slice(1, -1);
      }
      results.push({ url: u, format: f ? f.toLowerCase() : undefined });
    }
    return results;
  }

  /**
   * Parse unicode-range descriptor like: U+26, U+20-7F, U+4E00-9FFF
   */
  parseUnicodeRange(rangeText: string): Array<[number, number]> {
    const out: Array<[number, number]> = [];
    const parts = rangeText.split(',');
    for (let p of parts) {
      p = p.trim().toUpperCase();
      if (!p.startsWith('U+')) continue;
      const body = p.slice(2);
      if (body.includes('-')) {
        const [a, b] = body.split('-');
        const start = parseInt(a, 16);
        const end = parseInt(b, 16);
        if (!Number.isNaN(start) && !Number.isNaN(end)) out.push([start, end]);
      } else {
        const v = parseInt(body, 16);
        if (!Number.isNaN(v)) out.push([v, v]);
      }
    }
    return out;
  }
}


export class CanvasKitFontMgr {
  // High-level FontMgr that builds on top of CanvasKit 0.40.0
  private CanvasKit: any;
  private loader: PageFontLoader;

  // registered fonts and family map
  private registeredFonts: RegisteredFontDesc[] = [];
  private familyMap = new Map<string, RegisteredFontDesc[]>();

  // cached typefaces by buffer id
  private typefaceCache = new Map<string, any>();

  // loaded typefaces
  private loadedTypefaces: LoadedTypeface[] = [];

  // LRU Font instance cache map
  private fontCache = new Map<string, FontCacheEntry>();
  private maxFontCache = 128;

  // explicit fallback order
  private fallbackFamilies: string[] = [];

  constructor(CanvasKit: any, opts?: { maxFontCache?: number }) {
    this.CanvasKit = CanvasKit;
    this.loader = new PageFontLoader();
    if (opts?.maxFontCache) this.maxFontCache = opts.maxFontCache;
  }

  /* ------------------- registration & loading ------------------- */
  registerFontDesc(desc: RegisteredFontDesc) {
    this.registeredFonts.push(desc);
    if (!this.familyMap.has(desc.family)) this.familyMap.set(desc.family, []);
    this.familyMap.get(desc.family)!.push(desc);
  }

  async loadFontFromURL(url: string, family: string, opts?: { weight?: number; style?: FontStyle; formatHint?: string }) {
    const weight = this.normalizeWeight(opts?.weight);
    const style = opts?.style || 'normal' as FontStyle;
    const fmt = opts?.formatHint;

    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`Failed to fetch font ${url}: ${resp.status}`);
    const buf = await resp.arrayBuffer();
    const desc: RegisteredFontDesc = { family, weight, style, source: url, buffer: buf, format: fmt };
    this.registerFontDesc(desc);
    await this._loadTypefaceFromDesc(desc);
    return desc;
  }

  async loadFontsFromCssText(cssText: string, baseURL?: string) {
    const blocks = this.loader.extractFontFaceBlocks(cssText);
    for (const body of blocks) {
      const d = this.loader.parseFontFaceBlock(body);
      const familyRaw = d['font-family'] || d['font-family']?.trim() || '';
      const family = familyRaw.replace(/['"]/g, '').trim();
      if (!family) continue;
      const weight = this.parseFontWeight(d['font-weight'] || '400');
      const style = (d['font-style'] || 'normal').trim() === 'italic' ? 'italic' as FontStyle : 'normal' as FontStyle;
      const src = d['src'];
      const unicodeRanges = d['unicode-range'] ? this.loader.parseUnicodeRange(d['unicode-range']) : undefined;
      if (!src) continue;
      const srcs = this.loader.parseSrcDescriptor(src);
      // prefer woff2 > woff > ttf/otf by implicit order or format hint
      for (const s of srcs) {
        let url = s.url;
        if (baseURL && !/^https?:\/\//i.test(url) && !url.startsWith('data:')) {
          // resolve relative
          try { url = new URL(url, baseURL).toString(); } catch (e) {}
        }
        try {
          const resp = await fetch(url, { mode: 'cors' });
          if (!resp.ok) continue;
          const buf = await resp.arrayBuffer();
          const desc: RegisteredFontDesc = {
            family,
            weight,
            style,
            source: url,
            buffer: buf,
            unicodeRanges: unicodeRanges,
            format: s.format
          };
          this.registerFontDesc(desc);
          await this._loadTypefaceFromDesc(desc);
          break; // stop at first successful source
        } catch (e) {
          // try next src
        }
      }
    }
  }

  async loadFontsFromDocument() {
    // Parse in-page and external CSS
    const cssTexts = await this.loader.loadPageFonts();
    // For <link rel=stylesheet href='...'> we already attempted to fetch; cssTexts contains fetched ones
    // Try to also inspect <style> elements directly
    for (const s of Array.from(document.querySelectorAll('style'))) {
      cssTexts.push(s.textContent || '');
    }
    // For <link rel='stylesheet' href='...'> that were cross-origin and couldn't be read, loader.loadPageFonts already attempted fetch
    for (const txt of cssTexts) {
      await this.loadFontsFromCssText(txt, location.href);
    }
  }

  private computeBufferId(buf: ArrayBuffer) {
    const view = new Uint8Array(buf);
    const len = view.length;
    const head = Array.from(view.slice(0, Math.min(8, len))).map(n => n.toString(16).padStart(2, '0')).join('');
    const tail = Array.from(view.slice(Math.max(0, len - 8), len)).map(n => n.toString(16).padStart(2, '0')).join('');
    return `${len}:${head}:${tail}`;
  }

  private async _loadTypefaceFromDesc(desc: RegisteredFontDesc) {
    if (!desc.buffer) return null;
    const id = this.computeBufferId(desc.buffer);
    if (this.typefaceCache.has(id)) {
      const tf = this.typefaceCache.get(id);
      this.loadedTypefaces.push({ desc, typeface: tf });
      return tf;
    }

    if (!this.CanvasKit || !this.CanvasKit.Typeface || typeof this.CanvasKit.Typeface.MakeFreeTypeFaceFromData !== 'function') {
      throw new Error('CanvasKit Typeface.MakeFreeTypeFaceFromData not available');
    }

    const tf = this.CanvasKit.Typeface.MakeFreeTypeFaceFromData(desc.buffer);
    if (!tf) throw new Error('MakeFreeTypeFaceFromData returned null for ' + desc.source);

    this.typefaceCache.set(id, tf);
    this.loadedTypefaces.push({ desc, typeface: tf });
    return tf;
  }

  /* ------------------- matching algorithm ------------------- */
  private normalizeWeight(w?: number) { if (!w) return 400; return Math.max(100, Math.min(900, Math.round(w))); }

  /**
   * Pick best typeface for a requested family/weight/style for a given string (unicode-aware)
   */
  pickTypefaceForRequest(familyList: string[], weight: number, style: FontStyle, sampleText?: string) {
    // familyList: e.g. ['Roboto','Helvetica','sans-serif'] in priority order
    // 1. try each family in order, within a family pick best weight/style and check unicode-range if sampleText provided
    for (const fam of familyList) {
      const candidates = this.familyMap.get(fam);
      if (!candidates || candidates.length === 0) continue;
      // find best score
      let best: RegisteredFontDesc | null = null; let bestScore = Infinity;
      for (const c of candidates) {
        let score = Math.abs((c.weight || 400) - weight);
        if (c.style !== style) score += 10000;
        // prefer fonts whose unicode-range includes the sample text
        if (sampleText && c.unicodeRanges && c.unicodeRanges.length > 0) {
          let allCovered = true;
          for (const ch of Array.from(sampleText)) {
            const cp = ch.codePointAt(0) || 0;
            let covered = false;
            for (const r of c.unicodeRanges) { if (cp >= r[0] && cp <= r[1]) { covered = true; break; } }
            if (!covered) { allCovered = false; break; }
          }
          if (allCovered) score -= 2000; // boost
        }
        if (score < bestScore) { bestScore = score; best = c; }
      }
      if (best) return this.getTypefaceForDesc(best);
    }

    // 2. fallbackFamilies
    for (const fam of this.fallbackFamilies) {
      const candidates = this.familyMap.get(fam);
      if (!candidates) continue;
      // choose best similarly
      let best: RegisteredFontDesc | null = null; let bestScore = Infinity;
      for (const c of candidates) {
        let score = Math.abs((c.weight || 400) - weight);
        if (c.style !== style) score += 10000;
        if (score < bestScore) { bestScore = score; best = c; }
      }
      if (best) return this.getTypefaceForDesc(best);
    }

    // 3. try loadedTypefaces arbitrary order
    if (this.loadedTypefaces.length > 0) return this.loadedTypefaces[0].typeface;

    // 4. CanvasKit default (likely null)
    try { if (this.CanvasKit.Typeface && typeof this.CanvasKit.Typeface.MakeDefault === 'function') return this.CanvasKit.Typeface.MakeDefault(); } catch (e) {}
    return null;
  }

  getTypefaceForDesc(desc: RegisteredFontDesc) {
    // find loaded typeface matching this desc
    const found = this.loadedTypefaces.find(l => l.desc.source === desc.source || (l.desc.buffer && desc.buffer && this.computeBufferId(l.desc.buffer) === this.computeBufferId(desc.buffer!)));
    if (found) return found.typeface;
    // try loading sync (shouldn't happen) but attempt
    return this._loadTypefaceFromDesc(desc).then(tf => tf).catch(() => null);
  }

  /* ------------------- Font instance caching ------------------- */
  private makeFontKey(familyList: string[], size: number, weight: number, style: FontStyle, extraFlags?: Record<string, any>) {
    const famKey = familyList.join(',');
    const ef = extraFlags && Object.keys(extraFlags).length ? JSON.stringify(Object.keys(extraFlags).sort().reduce((o:any,k)=>{o[k]=extraFlags[k];return o;},{})) : '{}';
    return `${famKey}|s${Math.round(size)}|w${weight}|style:${style}|flags:${ef}`;
  }

  getFont(familyList: string[], size: number, opts?: { weight?: number; style?: FontStyle; extraFlags?: Record<string, any> }) {
    const weight = this.normalizeWeight(opts?.weight);
    const style = opts?.style || 'normal';
    const key = this.makeFontKey(familyList, size, weight, style, opts?.extraFlags);
    if (this.fontCache.has(key)) {
      // touch LRU
      const e = this.fontCache.get(key)!;
      this.fontCache.delete(key);
      this.fontCache.set(key, e);
      return e.font;
    }

    const tf = this.pickTypefaceForRequest(familyList, weight, style);
    const font = new this.CanvasKit.Font(tf, size);

    this.fontCache.set(key, { key, font });
    this.ensureFontCacheLimit();
    return font;
  }

  private ensureFontCacheLimit() {
    while (this.fontCache.size > this.maxFontCache) {
      const oldest = this.fontCache.keys().next().value;
      const entry = this.fontCache.get(oldest);
      if (entry) {
        try { if (entry.font && typeof entry.font.delete === 'function') entry.font.delete(); } catch (e) {}
      }
      this.fontCache.delete(oldest);
    }
  }

  /* ------------------- measurement & glyph detection ------------------- */
  measureText(text: string, font: any): { width: number; glyphs?: number[] } {
    try {
      if (font && typeof font.getGlyphIDs === 'function' && typeof font.getWidths === 'function') {
        const glyphs = font.getGlyphIDs(text) || [];
        if (glyphs && glyphs.length) {
          const widths = font.getWidths(glyphs) || [];
          const w = widths.reduce((s: number, a: number) => s + a, 0);
          return { width: w, glyphs };
        }
      }

      // fallback via TextBlob
      if (this.CanvasKit.TextBlob && typeof this.CanvasKit.TextBlob.MakeFromText === 'function') {
        const blob = this.CanvasKit.TextBlob.MakeFromText(text, font);
        if (blob && typeof blob.getBounds === 'function') {
          const b = blob.getBounds();
          return { width: b.width };
        }
      }
    } catch (e) {
      // ignore
    }
    return { width: 0 };
  }

  fontHasGlyph(fontOrTypeface: any, ch: string): boolean {
    try {
      if (!fontOrTypeface) return false;
      // try font.getGlyphIDs
      if (typeof fontOrTypeface.getGlyphIDs === 'function') {
        const ids = fontOrTypeface.getGlyphIDs(ch);
        return Array.isArray(ids) && ids.length > 0 && ids[0] !== 0;
      }
      // try typeface.getGlyphIDs maybe accepts codepoints
      if (typeof fontOrTypeface.getGlyphIDs === 'function') {
        const ids = fontOrTypeface.getGlyphIDs(ch);
        return Array.isArray(ids) && ids.length > 0 && ids[0] !== 0;
      }
    } catch (e) {}
    return false;
  }

  /* ------------------- helpers ------------------- */
  parseFontWeight(w: string) {
    w = (w || '400').trim();
    if (/^(normal)$/i.test(w)) return 400;
    if (/^(bold)$/i.test(w)) return 700;
    const n = parseInt(w, 10);
    if (!Number.isNaN(n)) return Math.max(100, Math.min(900, n));
    return 400;
  }

  addFallbackFamily(family: string) { if (!this.fallbackFamilies.includes(family)) this.fallbackFamilies.push(family); }

  /* ------------------- expose state for engine integration ------------------- */
  // enumerate loaded families
  listFamilies() { return Array.from(this.familyMap.keys()); }

  // get RegisteredFontDesc for a family
  getFamilyFonts(family: string) { return this.familyMap.get(family) || []; }

  // attempt to preload fonts found in document (auto) - convenience
  async preloadPageFonts() {
    await this.loadFontsFromDocument();
  }

  destroy() {
    for (const [k, e] of this.fontCache.entries()) { try { if (e.font && typeof e.font.delete === 'function') e.font.delete(); } catch (er) {} }
    this.fontCache.clear();
    for (const [k, tf] of this.typefaceCache.entries()) { try { if (tf && typeof tf.delete === 'function') tf.delete(); } catch (er) {} }
    this.typefaceCache.clear();
    this.registeredFonts = [];
    this.familyMap.clear();
    this.loadedTypefaces = [];
    this.fallbackFamilies = [];
  }
}

/* ---------------------- Usage Example ----------------------

// initialization
const CanvasKit = await CanvasKitInit({ locateFile: f => '/canvaskit/'+f });
const fontMgr = new CanvasKitFontMgr(CanvasKit, { maxFontCache: 256 });

// auto parse & preload fonts declared in page CSS
await fontMgr.preloadPageFonts();

// or load manually
await fontMgr.loadFontFromURL('/fonts/Roboto-Regular.ttf', 'Roboto', { weight: 400, style: 'normal' });
await fontMgr.loadFontFromURL('/fonts/NotoSansCJK-Regular.otf', 'Noto Sans CJK', { weight: 400 });

fontMgr.addFallbackFamily('Noto Sans CJK');

// get a CanvasKit.Font for drawing
const font = fontMgr.getFont(['Roboto','Noto Sans CJK','sans-serif'], 20, { weight: 400, style: 'normal' });

// measure text
const m = fontMgr.measureText('Hello 世界', font);
console.log(m.width);

// choose a typeface that can render a particular string
const tf = fontMgr.pickTypefaceForRequest(['Roboto','Noto Sans CJK'], 400, 'normal', '世界');

// cleanup
fontMgr.destroy();

------------------------------------------------------------*/

```