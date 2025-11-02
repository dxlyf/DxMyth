export type TextStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  color?: string;
};
export type TextRun = { text: string; style: TextStyle };
export type Paragraph = {
  blocks: TextRun[];
  align?: "left" | "center" | "right";
};

export class CanvasRichTextEditor {
  private canvas: HTMLCanvasElement;
  private ime: HTMLTextAreaElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private doc: Paragraph[];
  private caret: { block: number; offset: number };
  private sel: {
    start: { block: number; offset: number };
    end: { block: number; offset: number };
  } | null;
  private tool: TextStyle;
  private undoStack: any[] = [];
  private redoStack: any[] = [];
  private caretVisible = true;
  private blinkTimer = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ime: HTMLTextAreaElement,
    opts?: { onReady?: () => void }
  ) {
    this.canvas = canvas;
    this.ime = ime;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context required");
    this.ctx = ctx;
    this.dpr = Math.max(1, window.devicePixelRatio || 1);
    this.doc = [
      {
        blocks: [
          {
            text: "这是一个 TypeScript Canvas 富文本编辑器示例。支持中文输入，换行，以及多种样式。",
            style: { fontSize: 16, color: "#000" },
          },
        ],
      },
    ];
    this.caret = { block: 0, offset: 0 };
    this.sel = null;
    this.tool = { fontSize: 16, color: "#000" };

    this.setup();
    this.resize();
    this.render();
    opts?.onReady?.();
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth * this.dpr;
    this.canvas.height = this.canvas.clientHeight * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.render();
  }

  private setup() {
    this.ime.addEventListener("input", () => {
      if ((this as any).composing) return;
      const v = this.ime.value;
      if (v) {
        this.insertText(v);
        this.ime.value = "";
        this.render();
      }
    });
    this.ime.addEventListener("compositionstart", () => {
      (this as any).composing = true;
    });
    this.ime.addEventListener("compositionend", (e: CompositionEvent) => {
      (this as any).composing = false;
      const v = e.data || this.ime.value;
      if (v) {
        this.insertText(v);
        this.ime.value = "";
        this.render();
      }
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const r = this.canvas.getBoundingClientRect();
      const x = e.clientX - r.left,
        y = e.clientY - r.top;
      const hit = this.hitTest(x, y);
      this.sel = null;
      this.caret = hit;
      this.focusIMEAt(x, y);
      this.render();
      const onmove = (ev: MouseEvent) => {
        const rx = ev.clientX - r.left,
          ry = ev.clientY - r.top;
        const h2 = this.hitTest(rx, ry);
        this.sel = { start: this.caret, end: h2 };
        this.render();
      };
      const onup = () => {
        window.removeEventListener("mousemove", onmove);
        window.removeEventListener("mouseup", onup);
      };
      window.addEventListener("mousemove", onmove);
      window.addEventListener("mouseup", onup);
    });

    document.addEventListener("keydown", (e) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        this.toggleStyle("bold");
        return;
      }
      if (meta && e.key.toLowerCase() === "i") {
        e.preventDefault();
        this.toggleStyle("italic");
        return;
      }
      if (meta && e.key.toLowerCase() === "u") {
        e.preventDefault();
        this.toggleStyle("underline");
        return;
      }
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        this.insertNewline();
        this.render();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        this.backspace();
        this.render();
        return;
      }
      if (e.key === "Delete") {
        e.preventDefault();
        this.deleteForward();
        this.render();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.moveCaretLeft(e.shiftKey);
        this.render();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.moveCaretRight(e.shiftKey);
        this.render();
        return;
      }
      if (e.key.length === 1 && !meta) {
        this.ime.focus();
      }
    });

    setInterval(() => {
      this.caretVisible = !this.caretVisible;
      this.render();
    }, 500);
  }

  private focusIMEAt(x: number, y: number) {
    this.ime.style.left = x + 4 + "px";
    this.ime.style.top = y + 4 + "px";
    this.ime.focus();
  }

  private pushUndo() {
    this.undoStack.push(
      JSON.stringify({ doc: this.doc, caret: this.caret, sel: this.sel })
    );
    if (this.undoStack.length > 200) this.undoStack.shift();
    this.redoStack.length = 0;
  }
  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(
      JSON.stringify({ doc: this.doc, caret: this.caret, sel: this.sel })
    );
    const s = JSON.parse(this.undoStack.pop()!);
    this.doc = s.doc;
    this.caret = s.caret;
    this.sel = s.sel;
    this.render();
  }
  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(
      JSON.stringify({ doc: this.doc, caret: this.caret, sel: this.sel })
    );
    const s = JSON.parse(this.redoStack.pop()!);
    this.doc = s.doc;
    this.caret = s.caret;
    this.sel = s.sel;
    this.render();
  }

  toggleStyle(name: "bold" | "italic" | "underline") {
    const v = !(this.tool as any)[name];
    if (this.sel) {
      this.applyStyleToSelection({ [name]: v });
    } else {
      (this.tool as any)[name] = v;
    }
    this.render();
  }
  setFontSize(sz: number) {
    if (this.sel) {
      this.applyStyleToSelection({ fontSize: sz });
    } else {
      this.tool.fontSize = sz;
    }
    this.render();
  }
  setColor(color: string) {
    if (this.sel) {
      this.applyStyleToSelection({ color });
    } else {
      this.tool.color = color;
    }
    this.render();
  }

  private applyStyleToSelection(style: TextStyle) {
    if (!this.sel) return;
    this.pushUndo();
    const n = this.normalizeSel();
    const { start, end } = n;
    if (start.block === end.block) {
      const p = this.doc[start.block];
      const before = this.substringParagraph(p, 0, start.offset);
      const mid = this.substringParagraph(p, start.offset, end.offset);
      const after = this.substringParagraph(
        p,
        end.offset,
        this.paragraphLength(p)
      );
      const base = p.blocks[0].style;
      const runs: TextRun[] = [];
      if (before.length)
        runs.push({ text: before, style: Object.assign({}, base) });
      if (mid.length)
        runs.push({ text: mid, style: Object.assign({}, base, style) });
      if (after.length)
        runs.push({ text: after, style: Object.assign({}, base) });
      p.blocks = runs.length
        ? runs
        : [{ text: "", style: Object.assign({}, base) }];
      this.sel = null;
      this.caret = { block: start.block, offset: start.offset + mid.length };
    } else {
      for (let b = start.block; b <= end.block; b++) {
        const p = this.doc[b];
        if (b === start.block) {
          const before = this.substringParagraph(p, 0, start.offset);
          const after = this.substringParagraph(
            p,
            start.offset,
            this.paragraphLength(p)
          );
          const base = p.blocks[0].style;
          const left = before.length
            ? { text: before, style: Object.assign({}, base) }
            : null;
          const mid = after.length
            ? { text: after, style: Object.assign({}, base, style) }
            : null;
          p.blocks = [];
          if (left) p.blocks.push(left);
          if (mid) p.blocks.push(mid);
          if (p.blocks.length === 0) p.blocks.push({ text: "", style: base });
        } else if (b === end.block) {
          const before = this.substringParagraph(p, 0, end.offset);
          const after = this.substringParagraph(
            p,
            end.offset,
            this.paragraphLength(p)
          );
          const base = p.blocks[0].style;
          const left = before.length
            ? { text: before, style: Object.assign({}, base, style) }
            : null;
          const right = after.length
            ? { text: after, style: Object.assign({}, base) }
            : null;
          p.blocks = [];
          if (left) p.blocks.push(left);
          if (right) p.blocks.push(right);
          if (p.blocks.length === 0) p.blocks.push({ text: "", style: base });
        } else {
          p.blocks = [
            {
              text: this.paragraphText(p),
              style: Object.assign({}, p.blocks[0].style, style),
            },
          ];
        }
      }
      this.sel = null;
      this.caret = { block: start.block, offset: start.offset };
    }
  }

  private insertText(str: string) {
    this.pushUndo();
    if (this.sel) {
      this.deleteSelectionInternal();
    }
    const p = this.doc[this.caret.block];
    const ri = this.findRunIndexAtOffset(p, this.caret.offset);
    const run = p.blocks[ri.runIndex];
    const before = run.text.slice(0, ri.runOffset);
    const after = run.text.slice(ri.runOffset);
    run.text = before + str + after;
    this.caret.offset += str.length;
  }

  private deleteSelectionInternal() {
    const n = this.normalizeSel();
    if (!n) return;
    const { start, end } = n;
    if (start.block === end.block) {
      const p = this.doc[start.block];
      const merged = this.removeRangeFromParagraph(p, start.offset, end.offset);
      p.blocks = [
        { text: merged, style: Object.assign({}, p.blocks[0].style) },
      ];
      this.caret = { block: start.block, offset: start.offset };
      this.sel = null;
    } else {
      const pStart = this.doc[start.block];
      const pEnd = this.doc[end.block];
      const merged =
        this.substringParagraph(pStart, 0, start.offset) +
        this.substringParagraph(pEnd, end.offset, this.paragraphLength(pEnd));
      pStart.blocks = [
        { text: merged, style: Object.assign({}, pStart.blocks[0].style) },
      ];
      this.doc.splice(start.block + 1, end.block - start.block);
      this.caret = { block: start.block, offset: start.offset };
      this.sel = null;
    }
  }

  private insertNewline() {
    this.pushUndo();
    const p = this.doc[this.caret.block];
    const before = this.substringParagraph(p, 0, this.caret.offset);
    const after = this.substringParagraph(
      p,
      this.caret.offset,
      this.paragraphLength(p)
    );
    p.blocks = [{ text: before, style: Object.assign({}, p.blocks[0].style) }];
    const newP = {
      blocks: [{ text: after, style: Object.assign({}, p.blocks[0].style) }],
    };
    this.doc.splice(this.caret.block + 1, 0, newP);
    this.caret.block++;
    this.caret.offset = 0;
    this.sel = null;
  }

  private backspace() {
    if (this.sel) {
      this.pushUndo();
      this.deleteSelectionInternal();
      return;
    }
    const p = this.doc[this.caret.block];
    if (this.caret.offset > 0) {
      this.pushUndo();
      const merged = this.removeRangeFromParagraph(
        p,
        this.caret.offset - 1,
        this.caret.offset
      );
      p.blocks = [
        { text: merged, style: Object.assign({}, p.blocks[0].style) },
      ];
      this.caret.offset -= 1;
    } else if (this.caret.block > 0) {
      this.pushUndo();
      const prev = this.doc[this.caret.block - 1];
      const merged = this.paragraphText(prev) + this.paragraphText(p);
      prev.blocks = [
        { text: merged, style: Object.assign({}, prev.blocks[0].style) },
      ];
      this.doc.splice(this.caret.block, 1);
      this.caret.block--;
      this.caret.offset = this.paragraphLength(prev) - this.paragraphLength(p);
    }
  }

  private deleteForward() {
    if (this.sel) {
      this.pushUndo();
      this.deleteSelectionInternal();
      return;
    }
    const p = this.doc[this.caret.block];
    if (this.caret.offset < this.paragraphLength(p)) {
      this.pushUndo();
      const merged = this.removeRangeFromParagraph(
        p,
        this.caret.offset,
        this.caret.offset + 1
      );
      p.blocks = [
        { text: merged, style: Object.assign({}, p.blocks[0].style) },
      ];
    } else if (this.caret.block < this.doc.length - 1) {
      this.pushUndo();
      const next = this.doc[this.caret.block + 1];
      p.blocks = [
        {
          text: this.paragraphText(p) + this.paragraphText(next),
          style: Object.assign({}, p.blocks[0].style),
        },
      ];
      this.doc.splice(this.caret.block + 1, 1);
    }
  }

  private moveCaretLeft(mod: boolean) {
    if (this.sel && !mod) {
      const n = this.normalizeSel();
      this.caret = { block: n.start.block, offset: n.start.offset };
      this.sel = null;
      return;
    }
    if (this.caret.offset > 0) this.caret.offset--;
    else if (this.caret.block > 0) {
      this.caret.block--;
      this.caret.offset = this.paragraphLength(this.doc[this.caret.block]);
    }
    if (!mod) this.sel = null;
  }
  private moveCaretRight(mod: boolean) {
    if (this.sel && !mod) {
      const n = this.normalizeSel();
      this.caret = { block: n.end.block, offset: n.end.offset };
      this.sel = null;
      return;
    }
    if (this.caret.offset < this.paragraphLength(this.doc[this.caret.block]))
      this.caret.offset++;
    else if (this.caret.block < this.doc.length - 1) {
      this.caret.block++;
      this.caret.offset = 0;
    }
    if (!mod) this.sel = null;
  }

  private normalizeSel() {
    if (!this.sel) return null;
    const a = this.sel.start,
      b = this.sel.end;
    if (a.block < b.block || (a.block === b.block && a.offset <= b.offset))
      return { start: a, end: b };
    return { start: b, end: a };
  }

  private paragraphText(p: Paragraph) {
    return p.blocks.map((r) => r.text).join("");
  }
  private paragraphLength(p: Paragraph) {
    return this.paragraphText(p).length;
  }

  private substringParagraph(p: Paragraph, from: number, to: number) {
    let acc = 0;
    let res = "";
    for (const r of p.blocks) {
      const rt = r.text;
      if (acc + rt.length <= from) {
        acc += rt.length;
        continue;
      }
      const localFrom = Math.max(0, from - acc);
      const localTo = Math.max(0, Math.min(rt.length, to - acc));
      if (localTo > localFrom) res += rt.slice(localFrom, localTo);
      acc += rt.length;
      if (acc >= to) break;
    }
    return res;
  }
  private removeRangeFromParagraph(p: Paragraph, from: number, to: number) {
    const before = this.substringParagraph(p, 0, from);
    const after = this.substringParagraph(p, to, this.paragraphLength(p));
    return before + after;
  }

  private findRunIndexAtOffset(p: Paragraph, offset: number) {
    let acc = 0;
    for (let i = 0; i < p.blocks.length; i++) {
      const len = p.blocks[i].text.length;
      if (offset <= acc + len) return { runIndex: i, runOffset: offset - acc };
      acc += len;
    }
    return {
      runIndex: p.blocks.length - 1,
      runOffset: p.blocks[p.blocks.length - 1].text.length,
    };
  }

  private measureParagraphWidthUpToOffset(p: Paragraph, offset: number) {
    let acc = 0;
    let w = 0;
    for (const r of p.blocks) {
      if (offset <= acc + r.text.length) {
        const substr = r.text.slice(0, offset - acc);
        this.ctx.font = this.fontString(r.style);
        w += this.ctx.measureText(substr).width;
        return w;
      } else {
        this.ctx.font = this.fontString(r.style);
        w += this.ctx.measureText(r.text).width;
      }
      acc += r.text.length;
    }
    return w;
  }

  private fontString(style: TextStyle) {
    const size = (style.fontSize || this.tool.fontSize || 16) + "px";
    let f = "";
    if (style.italic) f += "italic ";
    if (style.bold) f += "bold ";
    f += size + " sans-serif";
    return f;
  }

  private hitTest(x: number, y: number) {
    const margin = 8;
    let cy = margin;
    for (let i = 0; i < this.doc.length; i++) {
      const p = this.doc[i];
      const fs = p.blocks[0].style.fontSize || this.tool.fontSize || 16;
      const lh = fs * 1.3;
      if (y >= cy && y <= cy + lh) {
        let acc = 0;
        let rx = margin;
        for (const run of p.blocks) {
          this.ctx.font = this.fontString(run.style);
          for (let j = 0; j <= run.text.length; j++) {
            const substr = run.text.slice(0, j);
            const w = this.ctx.measureText(substr).width;
            if (x < rx + w + 4) return { block: i, offset: acc + j };
          }
          rx += this.ctx.measureText(run.text).width;
          acc += run.text.length;
        }
        return { block: i, offset: this.paragraphLength(p) };
      }
      cy += (p.blocks[0].style.fontSize || this.tool.fontSize || 16) * 1.3;
    }
    const last = this.doc.length - 1;
    return { block: last, offset: this.paragraphLength(this.doc[last]) };
  }

  private drawSelectionBackground(
    blockIndex: number,
    x: number,
    y: number,
    lineHeight: number
  ) {
    const n = this.normalizeSel();
    if (!n) return;
    const p = this.doc[blockIndex];
    this.ctx.save();
    this.ctx.fillStyle = "rgba(100,150,255,0.25)";
    if (n.start.block === n.end.block) {
      const beforeW = this.measureParagraphWidthUpToOffset(p, n.start.offset);
      const selW =
        this.measureParagraphWidthUpToOffset(p, n.end.offset) - beforeW;
      this.ctx.fillRect(x + beforeW, y, selW, lineHeight);
    } else if (blockIndex === n.start.block) {
      const beforeW = this.measureParagraphWidthUpToOffset(p, n.start.offset);
      const selW =
        this.measureParagraphWidthUpToOffset(p, this.paragraphLength(p)) -
        beforeW;
      this.ctx.fillRect(x + beforeW, y, selW, lineHeight);
    } else if (blockIndex === n.end.block) {
      const selW = this.measureParagraphWidthUpToOffset(p, n.end.offset);
      this.ctx.fillRect(x, y, selW, lineHeight);
    } else {
      const fullW = this.measureParagraphWidthUpToOffset(
        p,
        this.paragraphLength(p)
      );
      this.ctx.fillRect(x, y, fullW, lineHeight);
    }
    this.ctx.restore();
  }

  private render() {
    const cw = this.canvas.width / this.dpr;
    const ch = this.canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, cw, ch);
    const margin = 8;
    let y = margin;
    for (let i = 0; i < this.doc.length; i++) {
      const p = this.doc[i];
      const fs = p.blocks[0].style.fontSize || this.tool.fontSize || 16;
      const lh = fs * 1.3;
      let x = margin;
      if (this.sel && this.isSelectionInBlock(i))
        this.drawSelectionBackground(i, x, y, lh);
      for (const run of p.blocks) {
        const style = run.style;
        this.ctx.font = this.fontString(style);
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = style.color || "#000";
        this.ctx.fillText(run.text, x, y);
        if (style.underline) {
          const w = this.ctx.measureText(run.text).width;
          const fsLocal = style.fontSize || this.tool.fontSize || 16;
          this.ctx.fillRect(x, y + fsLocal + 2, w, 1);
        }
        x += this.ctx.measureText(run.text).width;
      }
      if (this.caret.block === i && this.caretVisible) {
        const caretX =
          margin + this.measureParagraphWidthUpToOffset(p, this.caret.offset); // determine caret height from left character
        const leftIndex = Math.max(0, this.caret.offset - 1);
        const caretHeight = this.caretHeightForOffset(p, leftIndex);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(caretX, y, 1, caretHeight);
      }
      y += lh;
    }
  }

  private caretHeightForOffset(p: Paragraph, offset: number) {
    if (offset < 0) offset = 0;
    if (offset >= this.paragraphLength(p)) {
      // use last run font size
      const run = p.blocks[p.blocks.length - 1];
      const fs = run.style.fontSize || this.tool.fontSize || 16;
      return fs;
    }
    // find run that contains offset
    let acc = 0;
    for (const run of p.blocks) {
      if (offset <= acc + run.text.length) {
        return run.style.fontSize || this.tool.fontSize || 16;
      }
      acc += run.text.length;
    }
    return this.tool.fontSize || 16;
  }

  private isSelectionInBlock(blockIndex: number) {
    if (!this.sel) return false;
    const n = this.normalizeSel();
    return n.start.block <= blockIndex && n.end.block >= blockIndex;
  }
}
