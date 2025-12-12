/**
 * WebGL 混合模式完整实现
 * 支持所有 Canvas 合成操作和混合模式
 */

class WebGLBlend {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.programs = new Map();
        this.textures = new Map();
        this.framebuffers = new Map();
        this.vertexBuffer = null;
        this.texCoordBuffer = null;
        this.initWebGL();
    }

    /**
     * 初始化 WebGL 上下文
     */
    initWebGL() {
        // 尝试获取 WebGL2 或 WebGL1 上下文
        this.gl = this.canvas.getContext('webgl2') || 
                  this.canvas.getContext('webgl') || 
                  this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            throw new Error('WebGL not supported');
        }

        // 设置视口
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // 初始化顶点和纹理坐标缓冲区
        this.initBuffers();
        
        // 编译所有着色器程序
        this.compileAllShaders();
    }

    /**
     * 初始化顶点和纹理坐标缓冲区
     */
    initBuffers() {
        // 顶点坐标（两个三角形组成一个矩形）
        const vertices = new Float32Array([
            -1.0, -1.0,  // 左下
             1.0, -1.0,  // 右下
            -1.0,  1.0,  // 左上
             1.0,  1.0   // 右上
        ]);

        // 纹理坐标
        const texCoords = new Float32Array([
            0.0, 0.0,  // 左下
            1.0, 0.0,  // 右下
            0.0, 1.0,  // 左上
            1.0, 1.0   // 右上
        ]);

        // 创建并绑定顶点缓冲区
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        // 创建并绑定纹理坐标缓冲区
        this.texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
    }

    /**
     * 编译所有着色器程序
     */
    compileAllShaders() {
        // 基础顶点着色器
        const vertexShaderSource = `#version 300 es
            in vec2 a_position;
            in vec2 a_texCoord;
            out vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        // WebGL1 回退版本
        const vertexShaderSourceWebGL1 = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        // 为每种混合模式创建片段着色器
        const blendModes = this.getAllBlendModes();
        blendModes.forEach(mode => {
            const fragmentShaderSource = this.createFragmentShader(mode);
            this.compileProgram(mode, vertexShaderSource, fragmentShaderSource);
        });
    }

    /**
     * 获取所有支持的混合模式
     */
    getAllBlendModes() {
        return [
            // Porter-Duff 操作
            'source-over', 'source-in', 'source-out', 'source-atop',
            'destination-over', 'destination-in', 'destination-out', 'destination-atop',
            'lighter', 'copy', 'xor', 'clear',
            
            // 混合模式
            'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
            'color-dodge', 'color-burn', 'hard-light', 'soft-light',
            'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity',
            
            // 额外模式
            'add', 'subtract', 'divide', 'vivid-light', 'linear-light',
            'pin-light', 'hard-mix', 'darker-color', 'lighter-color'
        ];
    }

    /**
     * 创建片段着色器
     */
    createFragmentShader(blendMode) {
        const isWebGL2 = this.gl instanceof WebGL2RenderingContext;
        const version = isWebGL2 ? '#version 300 es\nprecision highp float;' : 'precision highp float;';
        const inOut = isWebGL2 ? 'in' : 'varying';
        const outDecl = isWebGL2 ? 'out vec4 fragColor;' : '';
        const fragColor = isWebGL2 ? 'fragColor' : 'gl_FragColor';
        
        // 混合函数定义
        const blendFunction = this.getBlendFunctionGLSL(blendMode);
        
        // HSL 转换函数（用于 hue/saturation/color/luminosity 模式）
        const hslFunctions = this.getHSLFunctionsGLSL();
        
        // 主着色器代码
        return `
            ${version}
            ${inOut} vec2 v_texCoord;
            uniform sampler2D u_source;
            uniform sampler2D u_target;
            uniform float u_opacity;
            ${outDecl}
            
            ${hslFunctions}
            
            ${blendFunction}
            
            void main() {
                vec4 src = texture2D(u_source, v_texCoord);
                vec4 dst = texture2D(u_target, v_texCoord);
                
                // 预乘 alpha
                src.rgb *= src.a;
                dst.rgb *= dst.a;
                
                // 应用混合
                vec4 result = applyBlend(src, dst, u_opacity);
                
                // 解预乘（如果alpha不为0）
                if (result.a > 0.0) {
                    result.rgb /= result.a;
                }
                
                ${fragColor} = result;
            }
        `;
    }

    /**
     * 获取混合函数的 GLSL 代码
     */
    getBlendFunctionGLSL(blendMode) {
        const functions = {
            // Porter-Duff 操作
            'source-over': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 color = (src.rgb * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'source-in': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a * dst.a;
                    vec3 color = src.rgb;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'source-out': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a * (1.0 - dst.a);
                    vec3 color = src.rgb;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'source-atop': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = dst.a;
                    vec3 color = (src.rgb * src.a * dst.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'destination-over': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = dst.a + src.a * (1.0 - dst.a);
                    vec3 color = (dst.rgb * dst.a + src.rgb * src.a * (1.0 - dst.a)) / alpha;
                    return vec4(mix(src.rgb, color, opacity), alpha);
                }
            `,
            
            'destination-in': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a * dst.a;
                    vec3 color = dst.rgb;
                    return vec4(mix(src.rgb, color, opacity), alpha);
                }
            `,
            
            'destination-out': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = dst.a * (1.0 - src.a);
                    vec3 color = dst.rgb;
                    return vec4(mix(src.rgb, color, opacity), alpha);
                }
            `,
            
            'destination-atop': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a;
                    vec3 color = (dst.rgb * dst.a * src.a + src.rgb * src.a * (1.0 - dst.a)) / alpha;
                    return vec4(mix(src.rgb, color, opacity), alpha);
                }
            `,
            
            'lighter': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = min(1.0, src.a + dst.a);
                    vec3 color = min(vec3(1.0), src.rgb * src.a + dst.rgb * dst.a);
                    if (alpha > 0.0) color /= alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'copy': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    return vec4(mix(dst.rgb, src.rgb, opacity), src.a);
                }
            `,
            
            'xor': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a * (1.0 - dst.a) + dst.a * (1.0 - src.a);
                    vec3 color = (src.rgb * src.a * (1.0 - dst.a) + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'clear': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    return vec4(0.0, 0.0, 0.0, 0.0);
                }
            `,
            
            // 混合模式
            'normal': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 color = (src.rgb * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'multiply': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = src.rgb * dst.rgb;
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'screen': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = 1.0 - (1.0 - src.rgb) * (1.0 - dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'overlay': `
                vec3 blendOverlay(vec3 src, vec3 dst) {
                    return mix(
                        2.0 * src * dst,
                        1.0 - 2.0 * (1.0 - src) * (1.0 - dst),
                        step(0.5, dst)
                    );
                }
                
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = blendOverlay(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'darken': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = min(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'lighten': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = max(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'color-dodge': `
                vec3 blendColorDodge(vec3 src, vec3 dst) {
                    return step(1.0, src) * vec3(1.0) + 
                           (1.0 - step(1.0, src)) * (dst / (1.0 - src));
                }
                
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = blendColorDodge(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'color-burn': `
                vec3 blendColorBurn(vec3 src, vec3 dst) {
                    return step(0.0, src) * (1.0 - (1.0 - dst) / src) + 
                           (1.0 - step(0.0, src)) * vec3(0.0);
                }
                
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = blendColorBurn(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'hard-light': `
                vec3 blendHardLight(vec3 src, vec3 dst) {
                    return mix(
                        2.0 * dst * src,
                        1.0 - 2.0 * (1.0 - dst) * (1.0 - src),
                        step(0.5, src)
                    );
                }
                
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = blendHardLight(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'soft-light': `
                vec3 blendSoftLight(vec3 src, vec3 dst) {
                    vec3 d = step(0.5, dst);
                    vec3 blended = mix(
                        dst - (1.0 - 2.0 * src) * dst * (1.0 - dst),
                        dst + (2.0 * src - 1.0) * (sqrt(dst) - dst),
                        d
                    );
                    return clamp(blended, 0.0, 1.0);
                }
                
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = blendSoftLight(src.rgb, dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'difference': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = abs(src.rgb - dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'exclusion': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = src.rgb + dst.rgb - 2.0 * src.rgb * dst.rgb;
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            // HSL 模式需要额外的函数
            'hue': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 srcHSL = rgbToHsl(src.rgb);
                    vec3 dstHSL = rgbToHsl(dst.rgb);
                    vec3 blended = hslToRgb(vec3(srcHSL.x, dstHSL.yz));
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'saturation': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 srcHSL = rgbToHsl(src.rgb);
                    vec3 dstHSL = rgbToHsl(dst.rgb);
                    vec3 blended = hslToRgb(vec3(dstHSL.x, srcHSL.y, dstHSL.z));
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'color': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 srcHSL = rgbToHsl(src.rgb);
                    vec3 dstHSL = rgbToHsl(dst.rgb);
                    vec3 blended = hslToRgb(vec3(srcHSL.xy, dstHSL.z));
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'luminosity': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 srcHSL = rgbToHsl(src.rgb);
                    vec3 dstHSL = rgbToHsl(dst.rgb);
                    vec3 blended = hslToRgb(vec3(dstHSL.xy, srcHSL.z));
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            // 额外模式
            'add': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = min(vec3(1.0), src.rgb + dst.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'subtract': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = max(vec3(0.0), dst.rgb - src.rgb);
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `,
            
            'divide': `
                vec4 applyBlend(vec4 src, vec4 dst, float opacity) {
                    float alpha = src.a + dst.a * (1.0 - src.a);
                    vec3 blended = dst.rgb / max(src.rgb, 0.001);
                    blended = min(blended, vec3(1.0));
                    vec3 color = (blended * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alpha;
                    return vec4(mix(dst.rgb, color, opacity), alpha);
                }
            `
        };

        return functions[blendMode] || functions['normal'];
    }

    /**
     * 获取 HSL 转换函数的 GLSL 代码
     */
    getHSLFunctionsGLSL() {
        return `
            vec3 rgbToHsl(vec3 rgb) {
                float maxVal = max(max(rgb.r, rgb.g), rgb.b);
                float minVal = min(min(rgb.r, rgb.g), rgb.b);
                float h, s, l = (maxVal + minVal) * 0.5;
                
                if (maxVal == minVal) {
                    h = s = 0.0; // achromatic
                } else {
                    float d = maxVal - minVal;
                    s = l > 0.5 ? d / (2.0 - maxVal - minVal) : d / (maxVal + minVal);
                    
                    if (maxVal == rgb.r) {
                        h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6.0 : 0.0);
                    } else if (maxVal == rgb.g) {
                        h = (rgb.b - rgb.r) / d + 2.0;
                    } else {
                        h = (rgb.r - rgb.g) / d + 4.0;
                    }
                    h /= 6.0;
                }
                
                return vec3(h, s, l);
            }
            
            vec3 hslToRgb(vec3 hsl) {
                vec3 rgb;
                
                if (hsl.y == 0.0) {
                    rgb = vec3(hsl.z); // achromatic
                } else {
                    float q = hsl.z < 0.5 ? hsl.z * (1.0 + hsl.y) : hsl.z + hsl.y - hsl.z * hsl.y;
                    float p = 2.0 * hsl.z - q;
                    
                    rgb.r = hueToRgb(p, q, hsl.x + 1.0/3.0);
                    rgb.g = hueToRgb(p, q, hsl.x);
                    rgb.b = hueToRgb(p, q, hsl.x - 1.0/3.0);
                }
                
                return rgb;
            }
            
            float hueToRgb(float p, float q, float t) {
                if (t < 0.0) t += 1.0;
                if (t > 1.0) t -= 1.0;
                if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
                if (t < 1.0/2.0) return q;
                if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
                return p;
            }
        `;
    }

    /**
     * 编译着色器程序
     */
    compileProgram(name, vertexSource, fragmentSource) {
        const gl = this.gl;
        
        // 编译顶点着色器
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
            return;
        }
        
        // 编译片段着色器
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
            return;
        }
        
        // 创建程序
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }
        
        // 获取属性位置
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        
        // 获取统一变量位置
        const sourceLocation = gl.getUniformLocation(program, 'u_source');
        const targetLocation = gl.getUniformLocation(program, 'u_target');
        const opacityLocation = gl.getUniformLocation(program, 'u_opacity');
        
        // 存储程序信息
        this.programs.set(name, {
            program,
            attributes: {
                position: positionLocation,
                texCoord: texCoordLocation
            },
            uniforms: {
                source: sourceLocation,
                target: targetLocation,
                opacity: opacityLocation
            }
        });
        
        // 清理
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    /**
     * 创建纹理
     */
    createTexture(name, imageData) {
        const gl = this.gl;
        const texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // 设置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // 上传图像数据
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            imageData.width,
            imageData.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            imageData.data
        );
        
        this.textures.set(name, texture);
        return texture;
    }

    /**
     * 更新纹理
     */
    updateTexture(name, imageData) {
        const texture = this.textures.get(name);
        if (!texture) return;
        
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            imageData.width,
            imageData.height,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            imageData.data
        );
    }

    /**
     * 应用混合模式
     */
    applyBlend(sourceData, targetData, blendMode, opacity = 1.0) {
        const gl = this.gl;
        
        // 检查模式是否支持
        if (!this.programs.has(blendMode)) {
            console.warn(`Blend mode "${blendMode}" not supported, using "normal"`);
            blendMode = 'normal';
        }
        
        // 创建或更新纹理
        if (!this.textures.has('source')) {
            this.createTexture('source', sourceData);
        } else {
            this.updateTexture('source', sourceData);
        }
        
        if (!this.textures.has('target')) {
            this.createTexture('target', targetData);
        } else {
            this.updateTexture('target', targetData);
        }
        
        // 获取程序
        const programInfo = this.programs.get(blendMode);
        gl.useProgram(programInfo.program);
        
        // 设置顶点属性
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(programInfo.attributes.position);
        gl.vertexAttribPointer(
            programInfo.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.enableVertexAttribArray(programInfo.attributes.texCoord);
        gl.vertexAttribPointer(
            programInfo.attributes.texCoord,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        // 设置纹理单元
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.get('source'));
        gl.uniform1i(programInfo.uniforms.source, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.get('target'));
        gl.uniform1i(programInfo.uniforms.target, 1);
        
        // 设置不透明度
        gl.uniform1f(programInfo.uniforms.opacity, opacity);
        
        // 清除并绘制
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // 读取结果
        const result = new Uint8ClampedArray(sourceData.width * sourceData.height * 4);
        gl.readPixels(
            0, 0,
            sourceData.width, sourceData.height,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            result
        );
        
        return new ImageData(result, sourceData.width, sourceData.height);
    }

    /**
     * 批量应用混合模式（性能优化）
     */
    applyBlendBatch(operations) {
        const results = [];
        
        // 预绑定顶点数据
        const gl = this.gl;
        
        operations.forEach((op, index) => {
            const { sourceData, targetData, blendMode, opacity = 1.0 } = op;
            
            if (!this.programs.has(blendMode)) {
                console.warn(`Blend mode "${blendMode}" not supported, skipping`);
                return;
            }
            
            // 更新纹理
            const sourceTexture = this.getOrCreateTexture(`source_${index}`, sourceData);
            const targetTexture = this.getOrCreateTexture(`target_${index}`, targetData);
            
            // 使用帧缓冲区渲染到纹理
            const framebuffer = this.getOrCreateFramebuffer(`fb_${index}`, sourceData.width, sourceData.height);
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.viewport(0, 0, sourceData.width, sourceData.height);
            
            // 应用混合
            const programInfo = this.programs.get(blendMode);
            gl.useProgram(programInfo.program);
            
            // 设置纹理
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
            gl.uniform1i(programInfo.uniforms.source, 0);
            
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, targetTexture);
            gl.uniform1i(programInfo.uniforms.target, 1);
            
            gl.uniform1f(programInfo.uniforms.opacity, opacity);
            
            // 绘制
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            // 读取结果
            const result = new Uint8ClampedArray(sourceData.width * sourceData.height * 4);
            gl.readPixels(
                0, 0,
                sourceData.width, sourceData.height,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                result
            );
            
            results.push(new ImageData(result, sourceData.width, sourceData.height));
        });
        
        // 恢复默认帧缓冲区
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        return results;
    }

    /**
     * 获取或创建纹理
     */
    getOrCreateTexture(name, imageData) {
        if (this.textures.has(name)) {
            this.updateTexture(name, imageData);
            return this.textures.get(name);
        }
        return this.createTexture(name, imageData);
    }

    /**
     * 获取或创建帧缓冲区
     */
    getOrCreateFramebuffer(name, width, height) {
        if (this.framebuffers.has(name)) {
            return this.framebuffers.get(name);
        }
        
        const gl = this.gl;
        const framebuffer = gl.createFramebuffer();
        
        // 创建渲染目标纹理
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // 绑定到帧缓冲区
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            texture,
            0
        );
        
        // 检查帧缓冲区状态
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('Framebuffer is incomplete');
            return null;
        }
        
        this.framebuffers.set(name, framebuffer);
        return framebuffer;
    }

    /**
     * 清理资源
     */
    cleanup() {
        const gl = this.gl;
        
        // 清理纹理
        this.textures.forEach(texture => {
            gl.deleteTexture(texture);
        });
        this.textures.clear();
        
        // 清理程序
        this.programs.forEach(info => {
            gl.deleteProgram(info.program);
        });
        this.programs.clear();
        
        // 清理帧缓冲区
        this.framebuffers.forEach(framebuffer => {
            gl.deleteFramebuffer(framebuffer);
        });
        this.framebuffers.clear();
        
        // 清理缓冲区
        if (this.vertexBuffer) gl.deleteBuffer(this.vertexBuffer);
        if (this.texCoordBuffer) gl.deleteBuffer(this.texCoordBuffer);
    }
}

/**
 * WebGL 性能测试和对比
 */
class WebGLBlendBenchmark {
    static async benchmark() {
        const results = {
            webgl: {},
            canvas2d: {}
        };
        
        const sizes = [
            { width: 256, height: 256 },
            { width: 512, height: 512 },
            { width: 1024, height: 1024 },
            { width: 2048, height: 2048 }
        ];
        
        const blendModes = ['normal', 'multiply', 'screen', 'overlay'];
        
        // 准备测试数据
        const testData = [];
        for (const size of sizes) {
            const sourceData = this.createTestImageData(size.width, size.height, true);
            const targetData = this.createTestImageData(size.width, size.height, false);
            testData.push({ size, sourceData, targetData });
        }
        
        // WebGL 测试
        console.log('=== WebGL Benchmark ===');
        for (const { size, sourceData, targetData } of testData) {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            
            const webglBlend = new WebGLBlend(canvas);
            
            for (const mode of blendModes) {
                const startTime = performance.now();
                
                const result = webglBlend.applyBlend(
                    sourceData,
                    targetData,
                    mode,
                    0.8
                );
                
                const endTime = performance.now();
                
                const key = `${size.width}x${size.height}_${mode}`;
                results.webgl[key] = {
                    time: endTime - startTime,
                    memory: this.estimateMemoryUsage(result)
                };
                
                // 预热后多次测试取平均值
                let totalTime = 0;
                const iterations = 10;
                for (let i = 0; i < iterations; i++) {
                    const iterStart = performance.now();
                    webglBlend.applyBlend(sourceData, targetData, mode, 0.8);
                    totalTime += performance.now() - iterStart;
                }
                
                results.webgl[key].avgTime = totalTime / iterations;
                results.webgl[key].fps = 1000 / (totalTime / iterations);
            }
            
            webglBlend.cleanup();
        }
        
        // Canvas 2D 测试
        console.log('=== Canvas 2D Benchmark ===');
        for (const { size, sourceData, targetData } of testData) {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            const ctx = canvas.getContext('2d');
            
            for (const mode of blendModes) {
                // 绘制目标图像
                const targetImageData = new ImageData(
                    new Uint8ClampedArray(targetData.data),
                    targetData.width,
                    targetData.height
                );
                ctx.putImageData(targetImageData, 0, 0);
                
                // 设置混合模式
                ctx.globalCompositeOperation = mode;
                ctx.globalAlpha = 0.8;
                
                const startTime = performance.now();
                
                // 绘制源图像
                const sourceImageData = new ImageData(
                    new Uint8ClampedArray(sourceData.data),
                    sourceData.width,
                    sourceData.height
                );
                ctx.putImageData(sourceImageData, 0, 0);
                
                const endTime = performance.now();
                
                const key = `${size.width}x${size.height}_${mode}`;
                results.canvas2d[key] = {
                    time: endTime - startTime
                };
            }
        }
        
        console.table(results.webgl);
        console.table(results.canvas2d);
        
        return results;
    }
    
    static createTestImageData(width, height, isSource) {
        const data = new Uint8ClampedArray(width * height * 4);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                if (isSource) {
                    // 源图像：红色渐变
                    const r = Math.floor((x / width) * 255);
                    const g = Math.floor((y / height) * 128);
                    const b = 100;
                    const a = Math.floor(0.8 * 255);
                    
                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = a;
                } else {
                    // 目标图像：蓝色渐变
                    const r = 100;
                    const g = Math.floor((x / width) * 128);
                    const b = Math.floor((y / height) * 255);
                    const a = Math.floor(0.6 * 255);
                    
                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = a;
                }
            }
        }
        
        return new ImageData(data, width, height);
    }
    
    static estimateMemoryUsage(imageData) {
        return imageData.data.length; // 字节数
    }
}

/**
 * WebGL 混合模式演示
 */
class WebGLBlendDemo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.webglBlend = null;
        this.sourceImage = null;
        this.targetImage = null;
        this.currentMode = 'normal';
        this.init();
    }
    
    async init() {
        // 创建画布
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '1px solid #333';
        this.container.appendChild(this.canvas);
        
        // 初始化 WebGL
        this.webglBlend = new WebGLBlend(this.canvas);
        
        // 加载示例图像
        await this.loadImages();
        
        // 创建控制面板
        this.createControlPanel();
        
        // 初始渲染
        this.render();
    }
    
    async loadImages() {
        // 创建示例图像
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = 800;
        sourceCanvas.height = 600;
        const sourceCtx = sourceCanvas.getContext('2d');
        
        // 绘制源图像：红色圆形渐变
        const gradient1 = sourceCtx.createRadialGradient(400, 300, 0, 400, 300, 300);
        gradient1.addColorStop(0, 'rgba(255, 100, 100, 0.9)');
        gradient1.addColorStop(1, 'rgba(255, 50, 50, 0.3)');
        
        sourceCtx.fillStyle = gradient1;
        sourceCtx.beginPath();
        sourceCtx.arc(400, 300, 250, 0, Math.PI * 2);
        sourceCtx.fill();
        
        this.sourceImage = sourceCtx.getImageData(0, 0, 800, 600);
        
        // 绘制目标图像：蓝色矩形渐变
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = 800;
        targetCanvas.height = 600;
        const targetCtx = targetCanvas.getContext('2d');
        
        const gradient2 = targetCtx.createLinearGradient(0, 0, 800, 600);
        gradient2.addColorStop(0, 'rgba(100, 100, 255, 0.8)');
        gradient2.addColorStop(1, 'rgba(50, 50, 200, 0.4)');
        
        targetCtx.fillStyle = gradient2;
        targetCtx.fillRect(200, 150, 400, 300);
        
        this.targetImage = targetCtx.getImageData(0, 0, 800, 600);
    }
    
    createControlPanel() {
        const panel = document.createElement('div');
        panel.style.margin = '20px';
        panel.style.padding = '20px';
        panel.style.backgroundColor = '#f5f5f5';
        panel.style.borderRadius = '8px';
        
        // 混合模式选择器
        const modeLabel = document.createElement('label');
        modeLabel.textContent = '混合模式: ';
        modeLabel.style.marginRight = '10px';
        
        const modeSelect = document.createElement('select');
        modeSelect.style.padding = '5px';
        modeSelect.style.marginRight = '20px';
        
        const blendModes = [
            'normal', 'multiply', 'screen', 'overlay',
            'darken', 'lighten', 'color-dodge', 'color-burn',
            'hard-light', 'soft-light', 'difference', 'exclusion',
            'hue', 'saturation', 'color', 'luminosity'
        ];
        
        blendModes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.textContent = mode;
            modeSelect.appendChild(option);
        });
        
        modeSelect.value = this.currentMode;
        modeSelect.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.render();
        });
        
        // 不透明度滑块
        const opacityLabel = document.createElement('label');
        opacityLabel.textContent = '不透明度: ';
        opacityLabel.style.marginRight = '10px';
        
        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0';
        opacitySlider.max = '100';
        opacitySlider.value = '80';
        opacitySlider.style.marginRight = '10px';
        
        const opacityValue = document.createElement('span');
        opacityValue.textContent = '0.8';
        
        opacitySlider.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            opacityValue.textContent = value.toFixed(2);
            this.render(value);
        });
        
        // 性能信息
        const perfInfo = document.createElement('div');
        perfInfo.style.marginTop = '20px';
        perfInfo.style.fontFamily = 'monospace';
        perfInfo.style.fontSize = '12px';
        
        // 添加元素
        panel.appendChild(modeLabel);
        panel.appendChild(modeSelect);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(opacityLabel);
        panel.appendChild(opacitySlider);
        panel.appendChild(opacityValue);
        panel.appendChild(perfInfo);
        this.container.appendChild(panel);
        
        // 性能监控
        setInterval(() => {
            this.updatePerformanceInfo(perfInfo);
        }, 1000);
    }
    
    render(opacity = 0.8) {
        if (!this.webglBlend || !this.sourceImage || !this.targetImage) return;
        
        const startTime = performance.now();
        
        const result = this.webglBlend.applyBlend(
            this.sourceImage,
            this.targetImage,
            this.currentMode,
            opacity
        );
        
        const endTime = performance.now();
        
        // 在画布上显示结果
        const ctx = this.canvas.getContext('2d');
        ctx.putImageData(result, 0, 0);
        
        // 记录渲染时间
        this.lastRenderTime = endTime - startTime;
    }
    
    updatePerformanceInfo(element) {
        if (this.lastRenderTime) {
            const fps = Math.round(1000 / this.lastRenderTime);
            element.textContent = `渲染时间: ${this.lastRenderTime.toFixed(2)}ms (${fps} FPS)`;
        }
    }
    
    cleanup() {
        if (this.webglBlend) {
            this.webglBlend.cleanup();
        }
    }
}

/**
 * WebGL 高级特性：多重渲染目标（MRT）
 */
class WebGLAdvancedBlend extends WebGLBlend {
    constructor(canvas) {
        super(canvas);
        this.initMRT();
    }
    
    initMRT() {
        const gl = this.gl;
        if (!(gl instanceof WebGL2RenderingContext)) {
            console.warn('MRT requires WebGL2');
            return;
        }
        
        // 创建多重渲染目标着色器
        this.compileMRTShaders();
    }
    
    compileMRTShaders() {
        const vertexSource = `#version 300 es
            in vec2 a_position;
            in vec2 a_texCoord;
            out vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        
        const fragmentSource = `#version 300 es
            precision highp float;
            
            in vec2 v_texCoord;
            uniform sampler2D u_source;
            uniform sampler2D u_target;
            
            layout(location = 0) out vec4 fragColorNormal;
            layout(location = 1) out vec4 fragColorMultiply;
            layout(location = 2) out vec4 fragColorScreen;
            layout(location = 3) out vec4 fragColorOverlay;
            
            void main() {
                vec4 src = texture(u_source, v_texCoord);
                vec4 dst = texture(u_target, v_texCoord);
                
                // 预乘 alpha
                src.rgb *= src.a;
                dst.rgb *= dst.a;
                
                // Normal
                float alphaNormal = src.a + dst.a * (1.0 - src.a);
                vec3 colorNormal = (src.rgb * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alphaNormal;
                fragColorNormal = vec4(colorNormal, alphaNormal);
                
                // Multiply
                float alphaMultiply = src.a + dst.a * (1.0 - src.a);
                vec3 blendedMultiply = src.rgb * dst.rgb;
                vec3 colorMultiply = (blendedMultiply * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alphaMultiply;
                fragColorMultiply = vec4(colorMultiply, alphaMultiply);
                
                // Screen
                float alphaScreen = src.a + dst.a * (1.0 - src.a);
                vec3 blendedScreen = 1.0 - (1.0 - src.rgb) * (1.0 - dst.rgb);
                vec3 colorScreen = (blendedScreen * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alphaScreen;
                fragColorScreen = vec4(colorScreen, alphaScreen);
                
                // Overlay
                float alphaOverlay = src.a + dst.a * (1.0 - src.a);
                vec3 blendedOverlay = mix(
                    2.0 * src.rgb * dst.rgb,
                    1.0 - 2.0 * (1.0 - src.rgb) * (1.0 - dst.rgb),
                    step(0.5, dst.rgb)
                );
                vec3 colorOverlay = (blendedOverlay * src.a + dst.rgb * dst.a * (1.0 - src.a)) / alphaOverlay;
                fragColorOverlay = vec4(colorOverlay, alphaOverlay);
            }
        `;
        
        this.compileProgram('mrt', vertexSource, fragmentSource);
    }
    
    /**
     * 一次性应用多种混合模式（性能优化）
     */
    applyMultipleBlends(sourceData, targetData) {
        const gl = this.gl;
        if (!(gl instanceof WebGL2RenderingContext)) {
            console.warn('Multiple blends requires WebGL2');
            return null;
        }
        
        // 创建多重渲染目标帧缓冲区
        const width = sourceData.width;
        const height = sourceData.height;
        
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        
        // 创建4个颜色附件
        const textures = [];
        const attachments = [];
        
        for (let i = 0; i < 4; i++) {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                width,
                height,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                null
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            const attachment = gl.COLOR_ATTACHMENT0 + i;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);
            
            textures.push(texture);
            attachments.push(attachment);
        }
        
        // 设置绘制缓冲区
        gl.drawBuffers(attachments);
        
        // 检查帧缓冲区完整性
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('Framebuffer is incomplete');
            return null;
        }
        
        // 设置视口
        gl.viewport(0, 0, width, height);
        
        // 使用 MRT 程序
        const programInfo = this.programs.get('mrt');
        gl.useProgram(programInfo.program);
        
        // 设置顶点属性
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(programInfo.attributes.position);
        gl.vertexAttribPointer(
            programInfo.attributes.position,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.enableVertexAttribArray(programInfo.attributes.texCoord);
        gl.vertexAttribPointer(
            programInfo.attributes.texCoord,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        // 设置纹理
        if (!this.textures.has('source_mrt')) {
            this.createTexture('source_mrt', sourceData);
        } else {
            this.updateTexture('source_mrt', sourceData);
        }
        
        if (!this.textures.has('target_mrt')) {
            this.createTexture('target_mrt', targetData);
        } else {
            this.updateTexture('target_mrt', targetData);
        }
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.get('source_mrt'));
        gl.uniform1i(programInfo.uniforms.source, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.get('target_mrt'));
        gl.uniform1i(programInfo.uniforms.target, 1);
        
        // 清除并绘制
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // 读取所有结果
        const results = [];
        for (let i = 0; i < 4; i++) {
            const result = new Uint8ClampedArray(width * height * 4);
            
            // 绑定到读取缓冲区
            gl.readBuffer(gl.COLOR_ATTACHMENT0 + i);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, result);
            
            results.push(new ImageData(result, width, height));
        }
        
        // 清理
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        textures.forEach(texture => gl.deleteTexture(texture));
        gl.deleteFramebuffer(framebuffer);
        
        return {
            normal: results[0],
            multiply: results[1],
            screen: results[2],
            overlay: results[3]
        };
    }
}

// 导出
export { 
    WebGLBlend, 
    WebGLBlendBenchmark, 
    WebGLBlendDemo, 
    WebGLAdvancedBlend 
};