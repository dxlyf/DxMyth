/**
 * Canvas 完整混合与合成操作
 * 包括所有 globalCompositeOperation 模式和混合模式
 */

class CanvasComposite {
    /**
     * 应用合成操作
     * @param {ImageData} sourceData - 源图像数据（新绘制的）
     * @param {ImageData} targetData - 目标图像数据（已有的）
     * @param {string} operation - 合成操作
     * @param {number} opacity - 不透明度 (0-1)
     * @returns {ImageData} - 合成后的图像数据
     */
    static applyComposite(sourceData:ImageData, targetData:ImageData, operation:string, opacity = 1) {
        // 确保尺寸相同
        if (sourceData.width !== targetData.width || 
            sourceData.height !== targetData.height) {
            throw new Error('Image dimensions must match');
        }

        const result = new ImageData(
            new Uint8ClampedArray(sourceData.data),
            sourceData.width,
            sourceData.height
        );

        const s = sourceData.data;
        const t = targetData.data;
        const r = result.data;
        
        const length = s.length;

        // 获取合成函数
        const compositeFunction = this.getCompositeFunction(operation);
        
        // 逐像素应用合成
        for (let i = 0; i < length; i += 4) {
            const sR = s[i];
            const sG = s[i + 1];
            const sB = s[i + 2];
            const sA = s[i + 3] / 255;
            
            const tR = t[i];
            const tG = t[i + 1];
            const tB = t[i + 2];
            const tA = t[i + 3] / 255;
            
            // 应用合成
            const composite = compositeFunction.call(this,sR, sG, sB, sA, tR, tG, tB, tA, opacity);
            
            // 存储结果
            r[i] = Math.round(composite.r);
            r[i + 1] = Math.round(composite.g);
            r[i + 2] = Math.round(composite.b);
            r[i + 3] = Math.round(composite.a * 255);
        }

        return result;
    }

    /**
     * 获取合成函数
     */
    static getCompositeFunction(operation:string) {
        const functions = {
            // Porter-Duff 12种标准合成操作
            'source-over': this.compositeSourceOver,
            'source-in': this.compositeSourceIn,
            'source-out': this.compositeSourceOut,
            'source-atop': this.compositeSourceAtop,
            'destination-over': this.compositeDestinationOver,
            'destination-in': this.compositeDestinationIn,
            'destination-out': this.compositeDestinationOut,
            'destination-atop': this.compositeDestinationAtop,
            'lighter': this.compositeLighter,
            'copy': this.compositeCopy,
            'xor': this.compositeXor,
            
            // 非标准但常用的混合模式（之前实现的）
            'multiply': this.compositeMultiply,
            'screen': this.compositeScreen,
            'overlay': this.compositeOverlay,
            'darken': this.compositeDarken,
            'lighten': this.compositeLighten,
            'color-dodge': this.compositeColorDodge,
            'color-burn': this.compositeColorBurn,
            'hard-light': this.compositeHardLight,
            'soft-light': this.compositeSoftLight,
            'difference': this.compositeDifference,
            'exclusion': this.compositeExclusion,
            'hue': this.compositeHue,
            'saturation': this.compositeSaturation,
            'color': this.compositeColor,
            'luminosity': this.compositeLuminosity,
            
            // 其他Canvas合成操作
            'plus-darker': this.compositePlusDarker,    // Chrome非标准
            'plus-lighter': this.compositePlusLighter   // Chrome非标准
        };

        return functions[operation.toLowerCase()] || this.compositeSourceOver;
    }

    /**
     * =============== Porter-Duff 12种标准合成操作 ===============
     * 基于 Porter & Duff 的 "Compositing Digital Images" 论文
     */
    
    // 1. source-over (默认) - 源在目标上方
    static compositeSourceOver(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (sR * sA + tR * tA * (1 - sA)) / a;
        const g = (sG * sA + tG * tA * (1 - sA)) / a;
        const b = (sB * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 2. source-in - 只显示源和目标重叠的部分
    static compositeSourceIn(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA * tA;
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = sR;
        const g = sG;
        const b = sB;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 3. source-out - 只显示源不与目标重叠的部分
    static compositeSourceOut(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA * (1 - tA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = sR;
        const g = sG;
        const b = sB;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 4. source-atop - 源在上，只显示与目标重叠部分
    static compositeSourceAtop(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = tA; // 最终alpha等于目标alpha
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (sR * sA * tA + tR * tA * (1 - sA)) / a;
        const g = (sG * sA * tA + tG * tA * (1 - sA)) / a;
        const b = (sB * sA * tA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 5. destination-over - 目标在源上方
    static compositeDestinationOver(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = tA + sA * (1 - tA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (tR * tA + sR * sA * (1 - tA)) / a;
        const g = (tG * tA + sG * sA * (1 - tA)) / a;
        const b = (tB * tA + sB * sA * (1 - tA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 6. destination-in - 只显示目标和源重叠的部分
    static compositeDestinationIn(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA * tA;
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = tR;
        const g = tG;
        const b = tB;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 7. destination-out - 只显示目标不与源重叠的部分
    static compositeDestinationOut(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = tR;
        const g = tG;
        const b = tB;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 8. destination-atop - 目标在上，只显示与源重叠部分
    static compositeDestinationAtop(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA; // 最终alpha等于源alpha
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (tR * tA * sA + sR * sA * (1 - tA)) / a;
        const g = (tG * tA * sA + sG * sA * (1 - tA)) / a;
        const b = (tB * tA * sA + sB * sA * (1 - tA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 9. lighter (以前叫 'plus' 或 'add') - 颜色值相加
    static compositeLighter(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = Math.min(1, sA + tA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.min(255, (sR * sA + tR * tA)) / a;
        const g = Math.min(255, (sG * sA + tG * tA)) / a;
        const b = Math.min(255, (sB * sA + tB * tA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 10. copy - 只显示源，忽略目标
    static compositeCopy(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const r = sR;
        const g = sG;
        const b = sB;
        const a = sA;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 11. xor - 只显示不重叠的部分
    static compositeXor(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA * (1 - tA) + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (sR * sA * (1 - tA) + tR * tA * (1 - sA)) / a;
        const g = (sG * sA * (1 - tA) + tG * tA * (1 - sA)) / a;
        const b = (sB * sA * (1 - tA) + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // 12. clear - 清除目标区域（在合成中直接设置alpha为0）
    static compositeClear(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        return { r: 0, g: 0, b: 0, a: 0 };
    }

    /**
     * =============== 混合模式（复用之前的实现，但适配新接口） ===============
     */
    
    static compositeMultiply(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = (sR * tR) / 255;
        const g = (sG * tG) / 255;
        const b = (sB * tB) / 255;
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeScreen(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = 255 - ((255 - sR) * (255 - tR)) / 255;
        const g = 255 - ((255 - sG) * (255 - tG)) / 255;
        const b = 255 - ((255 - sB) * (255 - tB)) / 255;
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeOverlay(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const blend = (b, a) => {
            return a <= 128 ? 
                (2 * a * b) / 255 : 
                255 - (2 * (255 - a) * (255 - b)) / 255;
        };
        
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = blend(tR, sR);
        const g = blend(tG, sG);
        const b = blend(tB, sB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeDarken(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.min(sR, tR);
        const g = Math.min(sG, tG);
        const b = Math.min(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeLighten(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.max(sR, tR);
        const g = Math.max(sG, tG);
        const b = Math.max(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeColorDodge(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const dodge = (sc, tc) => {
            if (tc === 255) return 255;
            const result = (255 * sc) / (255 - tc);
            return Math.min(255, result);
        };
        
        const r = dodge(sR, tR);
        const g = dodge(sG, tG);
        const b = dodge(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeColorBurn(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const burn = (sc, tc) => {
            if (tc === 0) return 0;
            const result = 255 - (255 * (255 - sc)) / tc;
            return Math.max(0, result);
        };
        
        const r = burn(sR, tR);
        const g = burn(sG, tG);
        const b = burn(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeHardLight(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const blend = (sc, tc) => {
            return sc <= 128 ? 
                (2 * sc * tc) / 255 : 
                255 - (2 * (255 - sc) * (255 - tc)) / 255;
        };
        
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = blend(sR, tR);
        const g = blend(sG, tG);
        const b = blend(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeSoftLight(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const blend = (sc, tc) => {
            const scNorm = sc / 255;
            const tcNorm = tc / 255;
            
            if (scNorm <= 0.5) {
                return (2 * tcNorm * scNorm + tcNorm * tcNorm * (1 - 2 * scNorm)) * 255;
            } else {
                const d = tcNorm < 0.25 ? 
                    ((16 * tcNorm - 12) * tcNorm + 4) * tcNorm : 
                    Math.sqrt(tcNorm);
                return ((tcNorm + 2 * scNorm - 1) * (2 * tcNorm - d) + d * tcNorm) * 255;
            }
        };
        
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = blend(sR, tR);
        const g = blend(sG, tG);
        const b = blend(sB, tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeDifference(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.abs(sR - tR);
        const g = Math.abs(sG - tG);
        const b = Math.abs(sB - tB);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeExclusion(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = sR + tR - (2 * sR * tR) / 255;
        const g = sG + tG - (2 * sG * tG) / 255;
        const b = sB + tB - (2 * sB * tB) / 255;
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    // RGB 到 HSL 颜色转换
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // 灰色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    }
    
    // HSL 到 RGB 颜色转换
    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // 灰色
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    static compositeHue(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        // 获取源颜色的色相
        const [sH, , ] = this.rgbToHsl(sR, sG, sB);
        // 获取目标颜色的饱和度和亮度
        const [, tS, tL] = this.rgbToHsl(tR, tG, tB);
        
        // 组合新的颜色
        const [r, g, b] = this.hslToRgb(sH, tS, tL);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeSaturation(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        // 获取源颜色的饱和度
        const [, sS, ] = this.rgbToHsl(sR, sG, sB);
        // 获取目标颜色的色相和亮度
        const [tH, , tL] = this.rgbToHsl(tR, tG, tB);
        
        // 组合新的颜色
        const [r, g, b] = this.hslToRgb(tH, sS, tL);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeColor(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        // 获取源颜色的色相和饱和度
        const [sH, sS, ] = this.rgbToHsl(sR, sG, sB);
        // 获取目标颜色的亮度
        const [, , tL] = this.rgbToHsl(tR, tG, tB);
        
        // 组合新的颜色
        const [r, g, b] = this.hslToRgb(sH, sS, tL);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositeLuminosity(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        const a = sA + tA * (1 - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        // 获取源颜色的亮度
        const [, , sL] = this.rgbToHsl(sR, sG, sB);
        // 获取目标颜色的色相和饱和度
        const [tH, tS, ] = this.rgbToHsl(tR, tG, tB);
        
        // 组合新的颜色
        const [r, g, b] = this.hslToRgb(tH, tS, sL);
        
        const blendedR = (r * sA + tR * tA * (1 - sA)) / a;
        const blendedG = (g * sA + tG * tA * (1 - sA)) / a;
        const blendedB = (b * sA + tB * tA * (1 - sA)) / a;
        
        return {
            r: this.applyOpacity(blendedR, opacity),
            g: this.applyOpacity(blendedG, opacity),
            b: this.applyOpacity(blendedB, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    /**
     * =============== Chrome 非标准扩展 ===============
     */
    
    static compositePlusDarker(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        // 颜色值和alpha都相减
        const a = Math.max(0, tA - sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.max(0, tR - sR);
        const g = Math.max(0, tG - sG);
        const b = Math.max(0, tB - sB);
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    static compositePlusLighter(sR, sG, sB, sA, tR, tG, tB, tA, opacity) {
        // 颜色值和alpha都相加（但限制在255）
        const a = Math.min(1, tA + sA);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        
        const r = Math.min(255, tR + sR);
        const g = Math.min(255, tG + sG);
        const b = Math.min(255, tB + sB);
        
        return {
            r: this.applyOpacity(r, opacity),
            g: this.applyOpacity(g, opacity),
            b: this.applyOpacity(b, opacity),
            a: this.applyOpacity(a, opacity)
        };
    }

    /**
     * =============== 工具函数 ===============
     */
    
    static applyOpacity(value, opacity) {
        return value * opacity;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}

/**
 * 完整测试套件
 */
class CompositeTestSuite {
    static testAllOperations() {
        const operations = [
            // Porter-Duff 操作
            'source-over', 'source-in', 'source-out', 'source-atop',
            'destination-over', 'destination-in', 'destination-out', 'destination-atop',
            'lighter', 'copy', 'xor', 'clear',
            
            // 混合模式
            'multiply', 'screen', 'overlay', 'darken', 'lighten',
            'color-dodge', 'color-burn', 'hard-light', 'soft-light',
            'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
        ];

        const results = {};
        
        // 创建测试图像
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d',{
            willReadFrequently: true
        });
        
         // 源图像：红色圆形
        ctx.clearRect(0, 0, 100, 100);
        ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(30, 30, 20, 0, Math.PI * 2);
        ctx.fill();
        const sourceData = ctx.getImageData(0, 0, 100, 100);
        
        // 目标图像：蓝色圆形
        ctx.clearRect(0, 0, 100, 100);
        ctx.fillStyle = 'rgba(0, 0, 255, 1)';
        ctx.beginPath();
        ctx.arc(40, 40, 20, 0, Math.PI * 2);
        ctx.fill();

        const targetData = ctx.getImageData(0, 0, 100, 100);
        
        // 测试所有操作
        operations.forEach(operation => {
            try {
       

                const startTime = performance.now();
                const result = CanvasComposite.applyComposite(
                    sourceData,
                    targetData,
                    operation,
                    1.0
                );
                const endTime = performance.now();
                
                ctx.clearRect(0, 0, 100, 100);

                ctx.fillStyle = 'rgba(0, 0, 255, 1)';
                ctx.globalCompositeOperation='source-over'
                ctx.beginPath();
                ctx.arc(40, 40, 20, 0, Math.PI * 2);
                ctx.fill();

                    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
                ctx.globalCompositeOperation=operation
                ctx.beginPath();
                ctx.arc(30, 30, 20, 0, Math.PI * 2);
                ctx.fill();
                const nativeData=ctx.getImageData(0, 0, 100, 100);
                // 创建可视化
                this.createVisualization(operation, result,nativeData);
                
            } catch (error) {
            
            }
        });

        
    
        return results;
    }
    
    static createVisualization(name:string, imageData:ImageData,nativeCompositedata:ImageData) {
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.margin = '10px';
        container.style.textAlign = 'center';
        
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.border = '1px solid #ccc';
        canvas.getContext('2d').putImageData(imageData, 0, 0);


        const nativeCanvas = document.createElement('canvas');
        nativeCanvas.width = 100;
        nativeCanvas.height = 100;
        nativeCanvas.style.border = '1px solid #ccc';
        nativeCanvas.getContext('2d').putImageData(nativeCompositedata, 0, 0);
        
        const label = document.createElement('div');
        label.textContent = name;
        label.style.fontSize = '12px';
        label.style.marginTop = '5px';
        
        container.appendChild(canvas);
         container.appendChild(nativeCanvas);
        container.appendChild(label);
        document.body.appendChild(container);
    }
}



CompositeTestSuite.testAllOperations()
// 导出
export { 
    CanvasComposite, 
    CompositeTestSuite, 
};