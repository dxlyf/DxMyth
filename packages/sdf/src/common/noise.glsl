// 一维噪声函数 (float -> float)
float noise1D(float x) {
    return fract(sin(x) * 43758.5453);
}

// 二维噪声函数 (vec2 -> float)
float noise2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 三维噪声函数 (vec3 -> float)
float noise3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
}

// 一维向量噪声函数 (float -> vec2)
vec2 noise1DVec2(float x) {
    return vec2(noise1D(x), noise1D(x + 1.0));
}

// 二维向量噪声函数 (vec2 -> vec2)
vec2 noise2DVec2(vec2 p) {
    return vec2(noise2D(p), noise2D(p + vec2(1.0, 1.0)));
}

// 三维向量噪声函数 (vec3 -> vec2)
vec2 noise3DVec2(vec3 p) {
    return vec2(noise3D(p), noise3D(p + vec3(1.0, 1.0, 1.0)));
}

// 一维向量噪声函数 (float -> vec3)
vec3 noise1DVec3(float x) {
    return vec3(noise1D(x), noise1D(x + 1.0), noise1D(x + 2.0));
}

// 二维向量噪声函数 (vec2 -> vec3)
vec3 noise2DVec3(vec2 p) {
    return vec3(noise2D(p), noise2D(p + vec2(1.0, 1.0)), noise2D(p + vec2(2.0, 2.0)));
}

// 三维向量噪声函数 (vec3 -> vec3)
vec3 noise3DVec3(vec3 p) {
    return vec3(noise3D(p), noise3D(p + vec3(1.0, 1.0, 1.0)), noise3D(p + vec3(2.0, 2.0, 2.0)));
}

// 一维随机函数 (float -> float)
float random1D(float x) {
    return fract(sin(x) * 43758.5453);
}

// 二维随机函数 (vec2 -> float)
float random2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 三维随机函数 (vec3 -> float)
float random3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
}


vec2 random2x1(float x) {
    return vec2(random1D(x), random1D(x + 1.0));
}

float random1x2(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 random2x2(vec2 st) {
    return vec2(random1x2(st), random1x2(st + 1.0));
}


vec3 random3x1(float x) {
    float a=random1D(x);
    float b=random1D(x*a);
    float c=random1D(x*b);
    return vec3(a,b,c);
}

vec3 random3x2(vec2 st) {
    float a=random2D(st);
    float b=random2D(st*a);
    float c=random2D(st*b);
    return vec3(a,b,c);
}

vec3 random3x3(vec3 st) {
    float a=random3D(st);
    float b=random3D(st*a);
    float c=random3D(st*b);
    return vec3(a,b,c);
}



// fBm 函数（分形布朗运动）
float fbm(vec2 p, int octaves) {
    float total = 0.0;
    float frequency = 1.0;
    float amplitude = 0.5;

    for (int i = 0; i < octaves; i++) {
        total += noise2D(p * frequency) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return total;
}



// GLSL implementation of Perlin Noise (1D, 2D, 3D)
// Perlin Noise（柏林噪声）
// Perlin Noise 的实现比较复杂，需要基于梯度向量进行插值。下面是一个 1D、2D 和 3D 的 Perlin Noise 实现。
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// 1D Perlin Noise
float perlinNoise1D(float x) {
    float i0 = floor(x);
    float i1 = i0 + 1.0;
    float x0 = x - i0;
    float x1 = x0 - 1.0;

    float n0 = fract(sin(i0) * 43758.5453);
    float n1 = fract(sin(i1) * 43758.5453);

    float fade_x = fade(x0);
    return mix(n0, n1, fade_x);
}

// 2D Perlin Noise
float perlinNoise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = dot(i, vec2(127.1, 311.7));
    float b = dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7));
    float c = dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7));
    float d = dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7));

    float u = fade(f.x);
    float v = fade(f.y);

    return mix(mix(sin(a), sin(b), u), mix(sin(c), sin(d), u), v);
}


// 3D Perlin Noise
float perlinNoise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float n = dot(i, vec3(1.0, 57.0, 113.0));

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( dot(random3x3(i + vec3(0,0,0)), f - vec3(0,0,0)), 
                           dot(random3x3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                       mix( dot(random3x3(i + vec3(0,1,0)), f - vec3(0,1,0)), 
                           dot(random3x3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
                   mix(mix( dot(random3x3(i + vec3(0,0,1)), f - vec3(0,0,1)), 
                           dot(random3x3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                       mix( dot(random3x3(i + vec3(0,1,1)), f - vec3(0,1,1)), 
                           dot(random3x3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
}

// Simplex Noise（单纯形噪声）
//Simplex Noise 是 Perlin Noise 的改进版本，在高维上性能更好。
// GLSL Simplex Noise (2D)
float simplexNoise2D(vec2 v) {
    const vec2 C = vec2(0.211324865405187, 0.366025403784439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 g = step(x0.yx, x0.xy);
    vec2 l = 1.0 - g;
    vec2 i1 = min(g.xy, l.xy);
    vec2 i2 = max(g.xy, l.xy);

    vec2 x1 = x0 - i1 + C.xx;
    vec2 x2 = x0 - i2 + C.yy;
    vec2 x3 = x0 - 1.0 + 2.0 * C.xx;

    vec4 p = permute(permute(i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));

    vec4 x_ = floor(j * (1.0 / 7.0));
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * 0.142857142857;
    vec4 y = y_ * 0.142857142857;
    vec4 v_ = vec4(0.5) - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3));

    vec4 s = step(v_, vec4(0.0));
    vec4 px = mix(vec4(0.0), vec4(0.5), s);
    vec4 py = mix(vec4(0.0), vec4(0.5), s);
    vec4 ph = max(vec4(0.0), v_);

    return dot(px, vec4(dot(x0, y_.xy), dot(x1, y_.zw), dot(x2, y_.xy), dot(x3, y_.zw)));
}


// GLSL Value Noise (1D, 2D, 3D)
// Value Noise（值噪声）
// Value Noise 是通过随机分配格点值并插值生成噪声。

// 1D Value Noise
float valueNoise1D(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);

    return mix(fract(sin(i) * 43758.5453), fract(sin(i + 1.0) * 43758.5453), u);
}

// 2D Value Noise
float valueNoise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 3D Value Noise
float valueNoise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a = fract(sin(dot(i, vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float b = fract(sin(dot(i + vec3(1.0, 0.0, 0.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float c = fract(sin(dot(i + vec3(0.0, 1.0, 0.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float d = fract(sin(dot(i + vec3(1.0, 1.0, 0.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float e = fract(sin(dot(i + vec3(0.0, 0.0, 1.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float f_ = fract(sin(dot(i + vec3(1.0, 0.0, 1.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float g = fract(sin(dot(i + vec3(0.0, 1.0, 1.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);
    float h = fract(sin(dot(i + vec3(1.0, 1.0, 1.0), vec3(127.1, 311.7, 78.233))) * 43758.5453);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
               mix(mix(e, f_, u.x), mix(g, h, u.x), u.y), u.z);
}

 // Worley Noise（瓦利噪声）
// Worley Noise 通过计算点到最近点的距离生成细胞噪声。
// GLSL Worley Noise (2D)
float worleyNoise2D(vec2 uv) {
    float distance = 1.0;
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);

    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 neighbor = vec2(id + offset);
            vec2 point = vec2(random1x2(neighbor), random1x2(neighbor * 2.0)) + offset;
            float dist = length(gv - point);
            distance = min(distance, dist);
        }
    }
    return distance;
}

// White Noise（白噪声）
/// 简单的随机噪声。
// GLSL White Noise (1D, 2D, 3D)
float whiteNoise1D(float x) {
    return fract(sin(x) * 43758.5453);
}

float whiteNoise2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float whiteNoise3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 34.567))) * 43758.5453);
}

// 经典伪随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
// 比random更自然，相邻点之间平滑过渡
// 用于模拟云、地形、水波等连续变化
// 二维值噪声（Value Noise） 
/**
原因：
值噪声的网格特性：基础的noise函数基于整数网格插值，会形成明显的"块状"结构
频率倍增放大缺陷：当frequency *= 2.0时，高频噪声放大了网格缺陷
各向异性：在某些方向上的特征比另一些方向更明显

🔧 解决方案：4种改进方法
方案1：使用梯度噪声（Perlin Noise）替代值噪声
*/
float noise(vec2 p) {
    vec2 ip = floor(p);  // 整数部分
    vec2 fp = fract(p);  // 小数部分
    
    // 四个角点
    float a = random(ip);
    float b = random(ip + vec2(1.0, 0.0));
    float c = random(ip + vec2(0.0, 1.0));
    float d = random(ip + vec2(1.0, 1.0));
    
    // 平滑插值
    vec2 u = fp * fp * (3.0 - 2.0 * fp); // smoothstep函数
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 改进的梯度噪声（Perlin Noise）
float gradientNoise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    
    // 四个角点的随机梯度向量
    vec2 grad00 = vec2(random(ip), random(ip + vec2(0.1, 0.0))) * 2.0 - 1.0;
    vec2 grad10 = vec2(random(ip + vec2(1.0, 0.0)), random(ip + vec2(1.1, 0.0))) * 2.0 - 1.0;
    vec2 grad01 = vec2(random(ip + vec2(0.0, 1.0)), random(ip + vec2(0.1, 1.0))) * 2.0 - 1.0;
    vec2 grad11 = vec2(random(ip + vec2(1.0, 1.0)), random(ip + vec2(1.1, 1.0))) * 2.0 - 1.0;
    
    // 点积计算
    float dot00 = dot(grad00, fp);
    float dot10 = dot(grad10, fp - vec2(1.0, 0.0));
    float dot01 = dot(grad01, fp - vec2(0.0, 1.0));
    float dot11 = dot(grad11, fp - vec2(1.0, 1.0));
    
    // 平滑插值
    vec2 u = fp * fp * (3.0 - 2.0 * fp);
    
    return mix(mix(dot00, dot10, u.x), mix(dot01, dot11, u.x), u.y);
}

//// 方案1：使用梯度噪声（Perlin Noise）替代值噪声
// 使用梯度噪声的fbm
float fbmPerlin(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < octaves; i++) {
        value += amplitude * gradientNoise(p * frequency); // ← 使用梯度噪声
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value * 0.5 + 0.5; // 归一化到[0,1]
}
// 方案2：添加旋转层消除方向性（简单有效）
// 旋转fbm - 消除晶状方向性
float fbmRotated(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 旋转矩阵，每层旋转不同角度
    float rotationAngle = 0.5; // 弧度
    
    for (int i = 0; i < octaves; i++) {
        // 每层旋转不同角度，打破网格对齐
        float angle = rotationAngle * float(i);
        mat2 rot = mat2(cos(angle), -sin(angle),
                       sin(angle), cos(angle));
        
        value += amplitude * noise(rot * p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}
// 方案3：调整fbm参数（最快修复）
// 优化参数消除晶状
float fbmCloud(vec2 p, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 关键调整：使用非2的倍数的频率倍增
    float lacunarity = 1.98; // 略小于2.0，打破规则性
    
    // 关键调整：非等比例振幅衰减
    float gain = 0.48;
    
    // 添加时间偏移，让云朵动起来
    vec2 offset = vec2(time * 0.1, time * 0.05);
    
    for (int i = 0; i < 6; i++) {
        // 每层添加不同偏移，打乱模式
        vec2 layerOffset = offset * (0.5 + float(i) * 0.2);
        value += amplitude * noise(p * frequency + layerOffset);
        
        amplitude *= gain;
        frequency *= lacunarity;
    }
    
    // 后处理：平滑化
    value = smoothstep(0.2, 0.8, value);
    
    return value;
}
// 方案4：Simplex噪声（性能较好）
// Simplex噪声（2D简化版）
float simplexNoise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2
    const float K2 = 0.211324865; // (3-sqrt(3))/6
    
    // 1. 将坐标变换到Simplex网格
    vec2 s = (p + (p.x + p.y) * K1) * 0.5;
    vec2 i = floor(s + (s.x + s.y) * K2);
    vec2 t = (i - (i.x + i.y) * K2) * 2.0 - p;
    
    // 2. 确定哪个单纯形包含点
    vec2 i1 = t.x > t.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 i2 = vec2(1.0, 1.0);
    
    // 3. 计算三个顶点的贡献
    vec2 x1 = t;
    vec2 x2 = t - i1 + K2 * 2.0;
    vec2 x3 = t - i2 + K2 * 4.0;
    
    // 4. 计算权重
    vec3 w = max(0.5 - vec3(dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    w = w * w * w * w;
    
    // 5. 计算梯度贡献
    vec3 h = w * vec3(dot(random(i), x1), 
                      dot(random(i + i1), x2), 
                      dot(random(i + i2), x3));
    
    return dot(vec3(70.0), h);
}
// 也称为"分形噪声"或"八度噪声"
// 模拟自相似的自然现象（云、地形、火焰）
// fbm函数：多层噪声叠加
// 使用值噪声有块状
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;  // 初始振幅
    float frequency = 1.0;  // 初始频率
    
    for (int i = 0; i < octaves; i++) {
        // 叠加不同频率的噪声
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;    // 每层振幅减半
        frequency *= 2.0;    // 每层频率加倍
    }
    
    return value;
}
// 不同参数组合产生不同效果：
// 1. 平缓地形：gain=0.3, lacunarity=2.0
// 2. 陡峭山脉：gain=0.7, lacunarity=2.2
// 3. 细腻纹理：gain=0.5, lacunarity=1.8
// 控制fbm外观的关键参数
float customFbm(vec2 p, 
                int octaves,     // 层数：细节丰富度
                float lacunarity,// 频率倍增系数（通常2.0）
                float gain)      // 振幅衰减系数（通常0.5）
{
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for (int i = 0; i < octaves; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= gain;
        frequency *= lacunarity;
    }
    
    return value;
}

// 2. 创建山脉地形
float createMountain(vec2 uv) {
    // 基础地形：低频fbm给出大形状
    float base = fbm(uv * 0.5, 3) * 2.0 - 1.0;
    
    // 添加中等细节：中频fbm
    float detail = fbm(uv * 2.0, 4) * 0.3;
    
    // 添加精细细节：高频fbm
    float fine = fbm(uv * 8.0, 2) * 0.1;
    
    return base + detail + fine;
}

// 3. 创建云朵
float createCloud(vec2 uv, float time) {
    vec2 cloudUV = uv * 2.0 + vec2(time * 0.1, 0.0);
    
    // 多层fbm创建蓬松云朵
    float cloud = fbm(cloudUV, 5);
    
    // 调整云朵形状
    cloud = smoothstep(0.3, 0.7, cloud);
    
    return cloud;
}
// Blue Noise（蓝噪声）
// 蓝噪声通常需要更复杂的预计算，直接在 GLSL 中实现较为困难，一般使用预计算图案。

// Fractal Brownian Motion (fBm)（分形布朗运动）
// 通过多次调用噪声函数，叠加不同频率和振幅的噪声。
// GLSL fBm (1D, 2D, 3D)
float fbm1D(float x) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * perlinNoise1D(x * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float fbm2D(vec2 uv) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * perlinNoise2D(uv * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float fbm3D(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * perlinNoise3D(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
