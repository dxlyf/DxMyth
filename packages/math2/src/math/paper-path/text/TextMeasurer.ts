/**
 * 文本测量后端。
 *
 * 移植自 paper/src/view/View.js 的 `getTextWidth()` / `getFontMetrics()`
 * （第 529、555 行），但把 canvas 依赖收进可注入的接口里：
 * 模块加载时不碰 DOM，Node 下 import 本文件不会报错。
 */

/** 字体的 ascent / descent。 */
export interface FontMetrics {
    ascent: number;
    descent: number;
}

/** 字体测量后端。 */
export interface TextMeasurer {
    /** 多行文本的最大宽度。 */
    getTextWidth(font: string, lines: string[],
            letterSpacing?: number | string, direction?: string): number;
    /** 字体的 ascent / descent，取不到时返回 null。 */
    getFontMetrics(font: string): FontMetrics | null;
}

let measurer: TextMeasurer | null = null;

/** 设置自定义测量器；传 null 表示恢复为惰性创建浏览器测量器。 */
export function setTextMeasurer(value: TextMeasurer | null): void {
    measurer = value;
}

/**
 * 取当前测量器：
 * 1. 已通过 {@link setTextMeasurer} 设置则直接返回；
 * 2. 否则在有 DOM 的环境里惰性创建 canvas 测量器；
 * 3. 都没有时抛出清晰的错误。
 */
export function getTextMeasurer(): TextMeasurer {
    if (!measurer) {
        // 这里用 globalThis 读取 document，避免在本模块顶部依赖 DOM 类型。
        const doc = (globalThis as any).document;
        if (typeof doc !== 'undefined') {
            measurer = createCanvasTextMeasurer();
        } else {
            throw new Error(
                    '当前环境没有 document，也没有设置文本测量器。'
                    + '请先调用 setTextMeasurer() 提供一个实现。');
        }
    }
    return measurer;
}

/**
 * 浏览器实现：用离屏 canvas 的 measureText 测量。
 *
 * 只有调用本函数时才会访问 DOM，因此模块本身可以在 Node 里安全加载。
 */
export function createCanvasTextMeasurer(): TextMeasurer {
    const doc = (globalThis as any).document;
    if (!doc) {
        throw new Error('当前环境没有 document，无法创建 canvas 文本测量器。');
    }
    const canvas = doc.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('无法创建用于测量文本的 canvas 上下文。');
    }

    return {
        getTextWidth(font: string, lines: string[],
                letterSpacing?: number | string,
                direction?: string): number {
            const prevFont = ctx.font,
                prevLetterSpacing = (ctx as any).letterSpacing,
                prevDirection = ctx.direction,
                // 排版方向会影响字形（例如镜像括号），默认 ltr。
                textDirection = direction || 'ltr';
            ctx.font = font;
            // letterSpacing / direction 在旧浏览器里可能不支持。
            try {
                if (letterSpacing !== undefined)
                    (ctx as any).letterSpacing = letterSpacing;
            } catch (e) {
                // 忽略：不支持 letterSpacing 的环境按无间距测量。
            }
            try {
                if (prevDirection !== textDirection)
                    ctx.direction = textDirection;
            } catch (e) {
                // 忽略：不支持 direction 的环境按默认方向测量。
            }
            // 逐行测量，取最大宽度。
            let width = 0;
            for (let i = 0; i < lines.length; i++) {
                width = Math.max(width, ctx.measureText(lines[i]).width);
            }
            ctx.font = prevFont;
            try {
                (ctx as any).letterSpacing = prevLetterSpacing;
            } catch (e) {
                // 忽略。
            }
            try {
                if (prevDirection !== textDirection)
                    ctx.direction = prevDirection;
            } catch (e) {
                // 忽略。
            }
            return width;
        },

        getFontMetrics(font: string): FontMetrics | null {
            const prevFont = ctx.font;
            ctx.font = font;
            // 浏览器给的是字体自身的 ascent / descent，
            // node-canvas 给的是 em 框的，两者字段名不同。
            const measured = ctx.measureText('H') as any;
            let ascent = measured.fontBoundingBoxAscent,
                descent = measured.fontBoundingBoxDescent;
            if (ascent === undefined) {
                ascent = measured.emHeightAscent;
                descent = measured.emHeightDescent;
            }
            ctx.font = prevFont;
            return ascent !== undefined
                    ? { ascent: ascent, descent: descent }
                    : null;
        }
    };
}
