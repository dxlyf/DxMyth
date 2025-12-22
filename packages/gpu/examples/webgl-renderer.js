// webgl-renderer.js
class WebGLRenderer {
    constructor() {
        this.canvas = document.getElementById('glCanvas');
        this.gl = null;
        this.program = null;
        this.vao = null;
        this.indicesCount = 0;
        
        // 着色器代码
        this.vertexShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 a_position;
            in vec3 a_normal;
            in vec2 a_texCoord;
            in vec3 a_tangent;
            
            uniform mat4 u_model;
            uniform mat4 u_view;
            uniform mat4 u_projection;
            
            out vec3 v_worldPos;
            out vec3 v_normal;
            out vec2 v_texCoord;
            out vec3 v_tangent;
            out vec3 v_bitangent;
            
            void main() {
                mat4 modelView = u_view * u_model;
                mat4 mvp = u_projection * modelView;
                
                vec4 worldPosition = u_model * vec4(a_position, 1.0);
                
                v_worldPos = worldPosition.xyz;
                v_normal = mat3(u_model) * a_normal;
                v_texCoord = a_texCoord;
                v_tangent = mat3(u_model) * a_tangent;
                v_bitangent = cross(v_normal, v_tangent);
                
                gl_Position = mvp * vec4(a_position, 1.0);
            }
        `;
        
        this.fragmentShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 v_worldPos;
            in vec3 v_normal;
            in vec2 v_texCoord;
            in vec3 v_tangent;
            in vec3 v_bitangent;
            
            uniform vec3 u_cameraPos;
            
            // 材质属性
            uniform vec3 u_albedo;
            uniform float u_metallic;
            uniform float u_roughness;
            uniform float u_ao;
            uniform bool u_useNormalMap;
            
            // 光照属性
            uniform vec3 u_lightPos;
            uniform vec3 u_lightColor;
            uniform float u_lightIntensity;
            uniform vec3 u_ambientColor;
            uniform float u_ambientIntensity;
            uniform bool u_useShadows;
            uniform bool u_useFog;
            
            // 纹理
            uniform sampler2D u_albedoMap;
            uniform sampler2D u_normalMap;
            uniform sampler2D u_metallicMap;
            uniform sampler2D u_roughnessMap;
            uniform sampler2D u_aoMap;
            
            out vec4 fragColor;
            
            const float PI = 3.14159265359;
            const float EPSILON = 0.0001;
            
            // PBR函数
            float DistributionGGX(vec3 N, vec3 H, float roughness) {
                float a = roughness * roughness;
                float a2 = a * a;
                float NdotH = max(dot(N, H), 0.0);
                float NdotH2 = NdotH * NdotH;
                float denom = (NdotH2 * (a2 - 1.0) + 1.0);
                return a2 / (PI * denom * denom + EPSILON);
            }
            
            float GeometrySchlickGGX(float NdotV, float roughness) {
                float r = (roughness + 1.0);
                float k = (r * r) / 8.0;
                return NdotV / (NdotV * (1.0 - k) + k + EPSILON);
            }
            
            float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
                float NdotV = max(dot(N, V), 0.0);
                float NdotL = max(dot(N, L), 0.0);
                float ggx1 = GeometrySchlickGGX(NdotV, roughness);
                float ggx2 = GeometrySchlickGGX(NdotL, roughness);
                return ggx1 * ggx2;
            }
            
            vec3 FresnelSchlick(float cosTheta, vec3 F0) {
                return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
            }
            
            vec3 CalculatePBR(vec3 N, vec3 V, vec3 albedo, float metallic, float roughness, float ao, vec3 lightPos, vec3 lightColor) {
                vec3 F0 = mix(vec3(0.04), albedo, metallic);
                vec3 Lo = vec3(0.0);
                
                // 计算每个光照
                vec3 L = normalize(lightPos - v_worldPos);
                vec3 H = normalize(V + L);
                float distance = length(lightPos - v_worldPos);
                float attenuation = 1.0 / (distance * distance);
                vec3 radiance = lightColor * u_lightIntensity * attenuation;
                
                // Cook-Torrance BRDF
                float NDF = DistributionGGX(N, H, roughness);
                float G = GeometrySmith(N, V, L, roughness);
                vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);
                
                vec3 numerator = NDF * G * F;
                float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + EPSILON;
                vec3 specular = numerator / denominator;
                
                vec3 kS = F;
                vec3 kD = vec3(1.0) - kS;
                kD *= 1.0 - metallic;
                
                float NdotL = max(dot(N, L), 0.0);
                Lo += (kD * albedo / PI + specular) * radiance * NdotL;
                
                // 环境光
                vec3 ambient = u_ambientColor * u_ambientIntensity * albedo * ao;
                
                return ambient + Lo;
            }
            
            vec3 ApplyFog(vec3 color, float distance) {
                if (!u_useFog) return color;
                float fogDensity = 0.02;
                float fogFactor = exp(-fogDensity * distance);
                fogFactor = clamp(fogFactor, 0.0, 1.0);
                vec3 fogColor = vec3(0.5, 0.6, 0.7);
                return mix(fogColor, color, fogFactor);
            }
            
            void main() {
                // 获取材质属性
                vec3 albedo = texture(u_albedoMap, v_texCoord).rgb * u_albedo;
                float metallic = texture(u_metallicMap, v_texCoord).r * u_metallic;
                float roughness = texture(u_roughnessMap, v_texCoord).r * u_roughness;
                float ao = texture(u_aoMap, v_texCoord).r * u_ao;
                
                // 获取法线
                vec3 N = normalize(v_normal);
                if (u_useNormalMap) {
                    vec3 tangentNormal = texture(u_normalMap, v_texCoord).xyz * 2.0 - 1.0;
                    mat3 TBN = mat3(normalize(v_tangent), normalize(v_bitangent), N);
                    N = normalize(TBN * tangentNormal);
                }
                
                // 视角方向
                vec3 V = normalize(u_cameraPos - v_worldPos);
                
                // 计算PBR光照
                vec3 color = vec3(0.0);
                
                // 主光源
                color += CalculatePBR(N, V, albedo, metallic, roughness, ao, 
                                    u_lightPos, u_lightColor);
                
                // 辅助光源
                vec3 secondaryLightPos = vec3(-3.0, 2.0, 2.0);
                vec3 secondaryLightColor = vec3(0.3, 0.5, 1.0) * 0.5;
                color += CalculatePBR(N, V, albedo, metallic, roughness, ao,
                                    secondaryLightPos, secondaryLightColor);
                
                // 应用雾效
                float viewDistance = length(u_cameraPos - v_worldPos);
                color = ApplyFog(color, viewDistance);
                
                // 色调映射和Gamma校正
                color = color / (color + vec3(1.0));
                color = pow(color, vec3(1.0 / 2.2));
                
                fragColor = vec4(color, 1.0);
            }
        `;
        
        // 相机参数
        this.camera = {
            distance: 5.0,
            rotationX: 0.0,
            rotationY: 0.0,
            fov: 60.0,
            autoRotate: true
        };
        
        // 渲染状态
        this.renderState = {
            metallic: 0.5,
            roughness: 0.5,
            ao: 1.0,
            useNormalMap: true,
            lightIntensity: 1.0,
            ambientIntensity: 0.1,
            useShadows: true,
            useFog: false,
            wireframe: false
        };
        
        // 鼠标控制
        this.mouse = {
            isDragging: false,
            lastX: 0,
            lastY: 0
        };
        
        // 纹理
        this.textures = {};
        
        // 性能统计
        this.stats = {
            fps: 60,
            frameCount: 0,
            lastTime: 0,
            triangles: 0,
            drawCalls: 0
        };
        
        this.init();
    }
    
    async init() {
        try {
            // 初始化WebGL2上下文
            this.gl = this.canvas.getContext('webgl2', {
                alpha: false,
                antialias: true,
                powerPreference: 'high-performance'
            });
            
            if (!this.gl) {
                throw new Error('WebGL2 not supported');
            }
            
            // 设置Canvas尺寸
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            
            // 初始化WebGL状态
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            
            // 编译着色器
            this.program = this.createProgram(
                this.vertexShaderSource,
                this.fragmentShaderSource
            );
            
            // 加载纹理
            await this.loadTextures();
            
            // 创建默认模型（立方体）
            this.createCube();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 初始化UI
            this.initUI();
            
            // 开始渲染循环
            this.loading.style.display = 'none';
            requestAnimationFrame((time) => this.render(time));
            
        } catch (error) {
            console.error('初始化失败:', error);
            this.loading.textContent = '初始化失败: ' + error.message;
        }
    }
    
    createShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`着色器编译失败: ${error}`);
        }
        
        return shader;
    }
    
    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(fragmentSource, this.gl.FRAGMENT_SHADER);
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const error = this.gl.getProgramInfoLog(program);
            throw new Error(`程序链接失败: ${error}`);
        }
        
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
        
        return program;
    }
    
    async loadTextures() {
        // 创建程序化纹理
        this.textures.albedo = this.createProceduralTexture(512, 512, (x, y) => {
            const scale = 10.0;
            const r = Math.sin(x * scale) * Math.cos(y * scale) * 0.3 + 0.7;
            const g = Math.cos(x * scale * 0.7) * Math.sin(y * scale * 0.7) * 0.3 + 0.7;
            const b = Math.sin(x * scale * 1.3) * Math.cos(y * scale * 1.3) * 0.3 + 0.7;
            return [r * 255, g * 255, b * 255, 255];
        });
        
        this.textures.normal = this.createProceduralTexture(512, 512, (x, y) => {
            const scale = 20.0;
            const nx = Math.sin(x * scale) * 0.5 + 0.5;
            const ny = Math.cos(y * scale) * 0.5 + 0.5;
            return [nx * 255, ny * 255, 255, 255];
        });
        
        this.textures.metallic = this.createProceduralTexture(512, 512, (x, y) => {
            const pattern = Math.sin(x * 5) * Math.sin(y * 5) * 0.3 + 0.5;
            return [pattern * 255, pattern * 255, pattern * 255, 255];
        });
        
        this.textures.roughness = this.createProceduralTexture(512, 512, (x, y) => {
            const pattern = Math.sin(x * 3) * Math.cos(y * 3) * 0.2 + 0.5;
            return [pattern * 255, pattern * 255, pattern * 255, 255];
        });
        
        this.textures.ao = this.createProceduralTexture(512, 512, (x, y) => {
            return [255, 255, 255, 255];
        });
    }
    
    createProceduralTexture(width, height, pixelCallback) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const pixel = pixelCallback(x / width, y / height);
                imageData.data[i] = pixel[0];
                imageData.data[i + 1] = pixel[1];
                imageData.data[i + 2] = pixel[2];
                imageData.data[i + 3] = pixel[3];
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, 
                          this.gl.UNSIGNED_BYTE, canvas);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        
        return texture;
    }
    
    createCube() {
        const positions = [
            // 前面
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            // 后面
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,
            // 上面
            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,
            // 下面
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
            // 右面
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5, -0.5,  0.5,
            // 左面
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
        ];
        
        const normals = [
            // 前面
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            // 后面
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            // 上面
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            // 下面
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            // 右面
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            // 左面
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
        ];
        
        const texCoords = [
            // 前面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // 后面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // 上面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // 下面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // 右面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // 左面
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        
        const tangents = [];
        for (let i = 0; i < positions.length / 3; i++) {
            tangents.push(1.0, 0.0, 0.0);
        }
        
        const indices = [
            // 前面
            0, 1, 2, 0, 2, 3,
            // 后面
            4, 5, 6, 4, 6, 7,
            // 上面
            8, 9, 10, 8, 10, 11,
            // 下面
            12, 13, 14, 12, 14, 15,
            // 右面
            16, 17, 18, 16, 18, 19,
            // 左面
            20, 21, 22, 20, 22, 23,
        ];
        
        this.indicesCount = indices.length;
        this.stats.triangles = indices.length / 3;
        
        // 创建VAO
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        
        // 创建缓冲区
        const buffers = {
            position: this.createBuffer(new Float32Array(positions), this.gl.ARRAY_BUFFER),
            normal: this.createBuffer(new Float32Array(normals), this.gl.ARRAY_BUFFER),
            texCoord: this.createBuffer(new Float32Array(texCoords), this.gl.ARRAY_BUFFER),
            tangent: this.createBuffer(new Float32Array(tangents), this.gl.ARRAY_BUFFER),
            indices: this.createBuffer(new Uint16Array(indices), this.gl.ELEMENT_ARRAY_BUFFER)
        };
        
        // 设置顶点属性
        this.setupVertexAttrib(buffers.position, 'a_position', 3);
        this.setupVertexAttrib(buffers.normal, 'a_normal', 3);
        this.setupVertexAttrib(buffers.texCoord, 'a_texCoord', 2);
        this.setupVertexAttrib(buffers.tangent, 'a_tangent', 3);
        
        this.gl.bindVertexArray(null);
    }
    
    createBuffer(data, type) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(type, buffer);
        this.gl.bufferData(type, data, this.gl.STATIC_DRAW);
        return buffer;
    }
    
    setupVertexAttrib(buffer, name, size) {
        const location = this.gl.getAttribLocation(this.program, name);
        if (location === -1) return;
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
    }
    
    resizeCanvas() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDragging = true;
            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.mouse.isDragging) return;
            
            const dx = e.clientX - this.mouse.lastX;
            const dy = e.clientY - this.mouse.lastY;
            
            this.camera.rotationY += dx * 0.01;
            this.camera.rotationX += dy * 0.01;
            this.camera.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotationX));
            
            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;
        });
        
        document.addEventListener('mouseup', () => {
            this.mouse.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
        
        // 滚轮缩放
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.distance += e.deltaY * 0.01;
            this.camera.distance = Math.max(1.0, Math.min(20.0, this.camera.distance));
            this.updateCameraDistanceUI();
        });
        
        this.canvas.style.cursor = 'grab';
    }
    
    initUI() {
        this.loading = document.getElementById('loading');
        this.statsElement = document.getElementById('stats');
        
        // 材质控制
        const metallicSlider = document.getElementById('metallicSlider');
        const metallicValue = document.getElementById('metallicValue');
        metallicSlider.addEventListener('input', (e) => {
            this.renderState.metallic = parseFloat(e.target.value);
            metallicValue.textContent = this.renderState.metallic.toFixed(2);
        });
        
        const roughnessSlider = document.getElementById('roughnessSlider');
        const roughnessValue = document.getElementById('roughnessValue');
        roughnessSlider.addEventListener('input', (e) => {
            this.renderState.roughness = parseFloat(e.target.value);
            roughnessValue.textContent = this.renderState.roughness.toFixed(2);
        });
        
        const aoSlider = document.getElementById('aoSlider');
        const aoValue = document.getElementById('aoValue');
        aoSlider.addEventListener('input', (e) => {
            this.renderState.ao = parseFloat(e.target.value);
            aoValue.textContent = this.renderState.ao.toFixed(2);
        });
        
        // 光照控制
        const lightIntensitySlider = document.getElementById('lightIntensitySlider');
        const lightIntensityValue = document.getElementById('lightIntensityValue');
        lightIntensitySlider.addEventListener('input', (e) => {
            this.renderState.lightIntensity = parseFloat(e.target.value);
            lightIntensityValue.textContent = this.renderState.lightIntensity.toFixed(2);
        });
        
        const ambientSlider = document.getElementById('ambientSlider');
        const ambientValue = document.getElementById('ambientValue');
        ambientSlider.addEventListener('input', (e) => {
            this.renderState.ambientIntensity = parseFloat(e.target.value);
            ambientValue.textContent = this.renderState.ambientIntensity.toFixed(2);
        });
        
        // 相机控制
        const fovSlider = document.getElementById('fovSlider');
        const fovValue = document.getElementById('fovValue');
        fovSlider.addEventListener('input', (e) => {
            this.camera.fov = parseInt(e.target.value);
            fovValue.textContent = `${this.camera.fov}°`;
        });
        
        const cameraDistanceSlider = document.getElementById('cameraDistanceSlider');
        cameraDistanceSlider.addEventListener('input', (e) => {
            this.camera.distance = parseFloat(e.target.value);
            this.updateCameraDistanceUI();
        });
        
        // 复选框
        document.getElementById('normalMapping').addEventListener('change', (e) => {
            this.renderState.useNormalMap = e.target.checked;
        });
        
        document.getElementById('shadowsCheckbox').addEventListener('change', (e) => {
            this.renderState.useShadows = e.target.checked;
        });
        
        document.getElementById('fogCheckbox').addEventListener('change', (e) => {
            this.renderState.useFog = e.target.checked;
        });
        
        document.getElementById('autoRotate').addEventListener('change', (e) => {
            this.camera.autoRotate = e.target.checked;
        });
        
        // 按钮
        document.getElementById('resetCameraBtn').addEventListener('click', () => {
            this.camera.distance = 5.0;
            this.camera.rotationX = 0.0;
            this.camera.rotationY = 0.0;
            this.updateCameraDistanceUI();
        });
        
        document.getElementById('wireframeBtn').addEventListener('click', () => {
            this.renderState.wireframe = !this.renderState.wireframe;
            if (this.renderState.wireframe) {
                this.gl.polygonMode(this.gl.FRONT_AND_BACK, this.gl.LINE);
            } else {
                this.gl.polygonMode(this.gl.FRONT_AND_BACK, this.gl.FILL);
            }
        });
    }
    
    updateCameraDistanceUI() {
        const cameraDistanceValue = document.getElementById('cameraDistanceValue');
        const cameraDistanceSlider = document.getElementById('cameraDistanceSlider');
        cameraDistanceValue.textContent = this.camera.distance.toFixed(1);
        cameraDistanceSlider.value = this.camera.distance;
    }
    
    getModelMatrix() {
        const model = mat4.create();
        mat4.identity(model);
        
        if (this.camera.autoRotate) {
            this.camera.rotationY += 0.005;
        }
        
        mat4.rotateY(model, model, this.camera.rotationY);
        mat4.rotateX(model, model, this.camera.rotationX);
        
        return model;
    }
    
    getViewMatrix() {
        const view = mat4.create();
        const eye = [
            Math.sin(this.camera.rotationY) * Math.cos(this.camera.rotationX) * this.camera.distance,
            Math.sin(this.camera.rotationX) * this.camera.distance,
            Math.cos(this.camera.rotationY) * Math.cos(this.camera.rotationX) * this.camera.distance
        ];
        
        mat4.lookAt(view, eye, [0, 0, 0], [0, 1, 0]);
        return view;
    }
    
    getProjectionMatrix() {
        const projection = mat4.create();
        const aspect = this.canvas.width / this.canvas.height;
        mat4.perspective(projection, 
                        this.camera.fov * Math.PI / 180, 
                        aspect, 
                        0.1, 
                        100.0);
        return projection;
    }
    
    setUniform(name, type, value) {
        const location = this.gl.getUniformLocation(this.program, name);
        if (location === null) return;
        
        switch (type) {
            case 'mat4':
                this.gl.uniformMatrix4fv(location, false, value);
                break;
            case 'vec3':
                this.gl.uniform3fv(location, value);
                break;
            case 'float':
                this.gl.uniform1f(location, value);
                break;
            case 'bool':
                this.gl.uniform1i(location, value ? 1 : 0);
                break;
            case 'int':
                this.gl.uniform1i(location, value);
                break;
            case 'sampler2D':
                this.gl.uniform1i(location, value);
                break;
        }
    }
    
    render(time) {
        this.stats.frameCount++;
        
        // 计算FPS
        if (time - this.stats.lastTime >= 1000) {
            this.stats.fps = this.stats.frameCount;
            this.stats.frameCount = 0;
            this.stats.lastTime = time;
            this.updateStats();
        }
        
        // 清除画布
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // 使用着色器程序
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);
        
        // 获取矩阵
        const modelMatrix = this.getModelMatrix();
        const viewMatrix = this.getViewMatrix();
        const projectionMatrix = this.getProjectionMatrix();
        
        // 计算相机位置
        const cameraPos = [
            Math.sin(this.camera.rotationY) * Math.cos(this.camera.rotationX) * this.camera.distance,
            Math.sin(this.camera.rotationX) * this.camera.distance,
            Math.cos(this.camera.rotationY) * Math.cos(this.camera.rotationX) * this.camera.distance
        ];
        
        // 设置uniforms
        this.setUniform('u_model', 'mat4', modelMatrix);
        this.setUniform('u_view', 'mat4', viewMatrix);
        this.setUniform('u_projection', 'mat4', projectionMatrix);
        this.setUniform('u_cameraPos', 'vec3', cameraPos);
        
        // 材质uniforms
        this.setUniform('u_albedo', 'vec3', [1.0, 0.5, 0.2]);
        this.setUniform('u_metallic', 'float', this.renderState.metallic);
        this.setUniform('u_roughness', 'float', this.renderState.roughness);
        this.setUniform('u_ao', 'float', this.renderState.ao);
        this.setUniform('u_useNormalMap', 'bool', this.renderState.useNormalMap);
        
        // 光照uniforms
        this.setUniform('u_lightPos', 'vec3', [3.0, 3.0, 3.0]);
        this.setUniform('u_lightColor', 'vec3', [1.0, 1.0, 1.0]);
        this.setUniform('u_lightIntensity', 'float', this.renderState.lightIntensity);
        this.setUniform('u_ambientColor', 'vec3', [1.0, 1.0, 1.0]);
        this.setUniform('u_ambientIntensity', 'float', this.renderState.ambientIntensity);
        this.setUniform('u_useShadows', 'bool', this.renderState.useShadows);
        this.setUniform('u_useFog', 'bool', this.renderState.useFog);
        
        // 设置纹理
        this.setTexture('u_albedoMap', this.textures.albedo, 0);
        this.setTexture('u_normalMap', this.textures.normal, 1);
        this.setTexture('u_metallicMap', this.textures.metallic, 2);
        this.setTexture('u_roughnessMap', this.textures.roughness, 3);
        this.setTexture('u_aoMap', this.textures.ao, 4);
        
        // 绘制
        this.gl.drawElements(this.gl.TRIANGLES, this.indicesCount, this.gl.UNSIGNED_SHORT, 0);
        this.stats.drawCalls++;
        
        this.gl.bindVertexArray(null);
        
        // 下一帧
        requestAnimationFrame((t) => this.render(t));
    }
    
    setTexture(name, texture, unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.setUniform(name, 'int', unit);
    }
    
    updateStats() {
        this.statsElement.innerHTML = `
            FPS: ${this.stats.fps}<br>
            Triangles: ${this.stats.triangles}<br>
            Draw Calls: ${this.stats.drawCalls}
        `;
        this.stats.drawCalls = 0;
    }
}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加mat4库（如果不存在）
    if (typeof mat4 === 'undefined') {
        // 简单的mat4库实现
        const mat4 = {
            create: function() {
                return new Float32Array(16);
            },
            identity: function(out) {
                out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
                out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
                out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
                out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
                return out;
            },
            rotateY: function(out, a, rad) {
                const s = Math.sin(rad);
                const c = Math.cos(rad);
                
                const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
                const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                
                out[0] = a00 * c - a20 * s;
                out[1] = a01 * c - a21 * s;
                out[2] = a02 * c - a22 * s;
                out[3] = a03 * c - a23 * s;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a00 * s + a20 * c;
                out[9] = a01 * s + a21 * c;
                out[10] = a02 * s + a22 * c;
                out[11] = a03 * s + a23 * c;
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            },
            rotateX: function(out, a, rad) {
                const s = Math.sin(rad);
                const c = Math.cos(rad);
                
                const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
                const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10 * c + a20 * s;
                out[5] = a11 * c + a21 * s;
                out[6] = a12 * c + a22 * s;
                out[7] = a13 * c + a23 * s;
                out[8] = a20 * c - a10 * s;
                out[9] = a21 * c - a11 * s;
                out[10] = a22 * c - a12 * s;
                out[11] = a23 * c - a13 * s;
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            },
            lookAt: function(out, eye, center, up) {
                const eyex = eye[0], eyey = eye[1], eyez = eye[2];
                const upx = up[0], upy = up[1], upz = up[2];
                const centerx = center[0], centery = center[1], centerz = center[1];
                
                let z0 = eyex - centerx;
                let z1 = eyey - centery;
                let z2 = eyez - centerz;
                
                let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
                z0 *= len;
                z1 *= len;
                z2 *= len;
                
                let x0 = upy * z2 - upz * z1;
                let x1 = upz * z0 - upx * z2;
                let x2 = upx * z1 - upy * z0;
                
                len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
                if (!len) {
                    x0 = 0; x1 = 0; x2 = 0;
                } else {
                    len = 1 / len;
                    x0 *= len;
                    x1 *= len;
                    x2 *= len;
                }
                
                let y0 = z1 * x2 - z2 * x1;
                let y1 = z2 * x0 - z0 * x2;
                let y2 = z0 * x1 - z1 * x0;
                
                len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
                if (!len) {
                    y0 = 0; y1 = 0; y2 = 0;
                } else {
                    len = 1 / len;
                    y0 *= len;
                    y1 *= len;
                    y2 *= len;
                }
                
                out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
                out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
                out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
                out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
                out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
                out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
                out[15] = 1;
                return out;
            },
            perspective: function(out, fovy, aspect, near, far) {
                const f = 1.0 / Math.tan(fovy / 2);
                
                out[0] = f / aspect;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = f;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[15] = 0;
                
                if (far != null && far !== Infinity) {
                    const nf = 1 / (near - far);
                    out[10] = (far + near) * nf;
                    out[14] = 2 * far * near * nf;
                } else {
                    out[10] = -1;
                    out[14] = -2 * near;
                }
                return out;
            }
        };
        window.mat4 = mat4;
    }
    
    // 初始化渲染器
    const renderer = new WebGLRenderer();
    window.renderer = renderer;
});