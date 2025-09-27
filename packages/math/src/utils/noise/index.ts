/**
 * 主要噪声类型
白噪声 (White Noise) - 完全随机的噪声，所有频率具有相同能量

粉红噪声 (Pink Noise) - 频率分布更自然，能量与频率成反比

柏林噪声 (Perlin Noise) - 梯度噪声，产生自然连贯的随机模式

单纯形噪声 (Simplex Noise) - 柏林噪声的改进版本，计算效率更高

值噪声 (Value Noise) - 基于随机值的插值噪声

沃利噪声 (Worley Noise) - 基于点距离的细胞噪声
 

使用说明
白噪声：完全随机，适用于需要完全无规律噪声的场景

值噪声：比白噪声更平滑，但可能产生明显的网格图案

柏林噪声：产生自然的连贯图案，适用于地形生成、云彩模拟等

粉红噪声：频谱更均衡，适用于音频处理或需要自然随机变化的场景
*/

// 噪声类型枚举
enum NoiseType {
    WHITE = 'white',
    PINK = 'pink',
    PERLIN = 'perlin',
    SIMPLEX = 'simplex',
    VALUE = 'value'
}

// 基础噪声生成器
class NoiseGenerator {
    static PERMUTATION_TABLE: number[] = [];
    static GRADIENTS_2D: number[][] = [];
    static GRADIENTS_3D: number[][][] = [];

    // 初始化 permutation table 和梯度向量

    // 白噪声生成 - 完全随机
    static whiteNoise(x: number, y: number = 0, z: number = 0): number {
        const seed = x * 18397 + y * 20483 + z * 29303;
        return NoiseGenerator.fract(Math.sin(seed) * 43758.5453);
    }

    // 值噪声 - 基于网格点的插值
    static valueNoise(x: number, y: number = 0): number {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        // 平滑插值函数
        const u = NoiseGenerator.fade(x);
        const v = NoiseGenerator.fade(y);

        // 网格四个角的哈希值
        const A = NoiseGenerator.PERMUTATION_TABLE[X] + Y;
        const B = NoiseGenerator.PERMUTATION_TABLE[X + 1] + Y;

        // 双线性插值
        return NoiseGenerator.lerp(
            v,
            NoiseGenerator.lerp(u, NoiseGenerator.PERMUTATION_TABLE[A] / 255, NoiseGenerator.PERMUTATION_TABLE[B] / 255),
            NoiseGenerator.lerp(u, NoiseGenerator.PERMUTATION_TABLE[A + 1] / 255, NoiseGenerator.PERMUTATION_TABLE[B + 1] / 255)
        ) * 2 - 1; // 将范围从[0,1]映射到[-1,1]
    }

    // 柏林噪声 - 基于梯度的连贯噪声
    static perlinNoise(x: number, y: number = 0, z: number = 0): number {
        // 简化版2D柏林噪声实现
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        // 平滑插值函数
        const u = NoiseGenerator.fade(x);
        const v = NoiseGenerator.fade(y);

        // 网格四个角的梯度索引
        const A = NoiseGenerator.PERMUTATION_TABLE[X] + Y;
        const AA = NoiseGenerator.PERMUTATION_TABLE[A];
        const AB = NoiseGenerator.PERMUTATION_TABLE[A + 1];
        const B = NoiseGenerator.PERMUTATION_TABLE[X + 1] + Y;
        const BA = NoiseGenerator.PERMUTATION_TABLE[B];
        const BB = NoiseGenerator.PERMUTATION_TABLE[B + 1];

        // 计算四个角点的影响
        const g0 = NoiseGenerator.GRADIENTS_2D[AA % 8];
        const g1 = NoiseGenerator.GRADIENTS_2D[BA % 8];
        const g2 = NoiseGenerator.GRADIENTS_2D[AB % 8];
        const g3 = NoiseGenerator.GRADIENTS_2D[BB % 8];

        // 计算点积
        const t0 = NoiseGenerator.dot2(g0, [x, y]);
        const t1 = NoiseGenerator.dot2(g1, [x - 1, y]);
        const t2 = NoiseGenerator.dot2(g2, [x, y - 1]);
        const t3 = NoiseGenerator.dot2(g3, [x - 1, y - 1]);

        // 双线性插值
        return NoiseGenerator.lerp(
            v,
            NoiseGenerator.lerp(u, t0, t1),
            NoiseGenerator.lerp(u, t2, t3)
        );
    }

    // 粉红噪声 - 使用白噪声并通过滤波降低高频
    static pinkNoise(length: number, octaves: number = 4): number[] {
        const result: number[] = new Array(length).fill(0);

        for (let i = 0; i < octaves; i++) {
            const frequency = Math.pow(2, i);
            const amplitude = 1 / frequency;

            for (let j = 0; j < length; j++) {
                result[j] += NoiseGenerator.whiteNoise(j * frequency) * amplitude;
            }
        }

        // 归一化
        const max = Math.max(...result.map(Math.abs));
        return result.map(val => val / max);
    }

    // 工具函数：线性插值
    private static lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    // 工具函数：平滑插值曲线 (5t^4 - 10t^3 + 10t^2)
    private static fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // 工具函数：小数部分
    private static fract(n: number): number {
        return n - Math.floor(n);
    }

    // 工具函数：二维点积
    private static dot2(g: number[], p: number[]): number {
        return g[0] * p[0] + g[1] * p[1];
    }
}

// 创建并随机填充 permutation table (256个值)
for (let i = 0; i < 256; i++) {
    NoiseGenerator.PERMUTATION_TABLE[i] = Math.floor(Math.random() * 256);
}

// 复制一份使表长度为512（便于循环查找）
NoiseGenerator.PERMUTATION_TABLE = [
    ...NoiseGenerator.PERMUTATION_TABLE,
    ...NoiseGenerator.PERMUTATION_TABLE
];

// 初始化2D梯度向量
for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    NoiseGenerator.GRADIENTS_2D[i] = [Math.cos(angle), Math.sin(angle)];
}


// GLSL风格噪声函数实现
class GLSLNoise {
    // 2D随机函数 (对应GLSL的random)
    static random(st: [number, number]): number {
      return GLSLNoise.fract(
        Math.sin(GLSLNoise.dot(st, [12.9898, 78.233])) * 43758.5453123
      );
    }
  
    // 2D噪声函数 (基于Morgan McGuire的实现)
    static noise(st: [number, number]): number {
      const i = [Math.floor(st[0]), Math.floor(st[1])];
      const f = [GLSLNoise.fract(st[0]), GLSLNoise.fract(st[1])];
  
      // 四个角的随机值
      const a = GLSLNoise.random(i as [number, number]);
      const b = GLSLNoise.random([i[0] + 1.0, i[1]] as [number, number]);
      const c = GLSLNoise.random([i[0], i[1] + 1.0] as [number, number]);
      const d = GLSLNoise.random([i[0] + 1.0, i[1] + 1.0] as [number, number]);
  
      // 平滑插值 - 使用三次Hermite曲线
      const u = f.map(val => val * val * (3.0 - 2.0 * val)) as [number, number];
  
      // 混合四个角的百分比
      return GLSLNoise.mix(a, b, u[0]) +
             (c - a) * u[1] * (1.0 - u[0]) +
             (d - b) * u[0] * u[1];
    }
  
    // FBM (分形布朗运动) - 多 octave 噪声
    static fbm(
      st: [number, number], 
      octaves: number = 5, 
      lacunarity: number = 2.0, 
      gain: number = 0.5
    ): number {
      let value = 0.0;
      let amplitude = 0.5;
      let frequency = 1.0;
  
      // 初始化
      for (let i = 0; i < octaves; i++) {
        value += amplitude * GLSLNoise.noise([
          st[0] * frequency,
          st[1] * frequency
        ]);
        frequency *= lacunarity;
        amplitude *= gain;
      }
  
      return value;
    }
  
    // 湍流效果 (Turbulence)
    static turbulence(
      st: [number, number], 
      octaves: number = 5
    ): number {
      let value = 0.0;
      let frequency = 1.0;
      let amplitude = 1.0;
  
      for (let i = 0; i < octaves; i++) {
        value += amplitude * Math.abs(GLSLNoise.noise([
          st[0] * frequency,
          st[1] * frequency
        ]));
        frequency *= 2.0;
        amplitude *= 0.5;
      }
  
      return value;
    }
  
    // ridged multifractal 噪声
    static ridgedMultifractal(
      st: [number, number], 
      octaves: number = 5, 
      lacunarity: number = 2.0, 
      gain: number = 0.5,
      offset: number = 1.0
    ): number {
      let value = 0.0;
      let amplitude = 0.5;
      let frequency = 1.0;
      let weight = 1.0;
  
      // 第一octave特殊处理
      let signal = offset - Math.abs(GLSLNoise.noise([
        st[0] * frequency,
        st[1] * frequency
      ]));
      signal *= signal;
      value = signal * amplitude;
      
      // 后续octaves
      for (let i = 1; i < octaves; i++) {
        frequency *= lacunarity;
        amplitude *= gain;
        weight = Math.min(signal * weight, 1.0);
        
        signal = offset - Math.abs(GLSLNoise.noise([
          st[0] * frequency,
          st[1] * frequency
        ]));
        signal *= signal;
        signal *= weight;
        
        value += signal * amplitude;
      }
  
      return value;
    }
  
    // 工具函数：小数部分
    private static fract(n: number): number {
      return n - Math.floor(n);
    }
  
    // 工具函数：二维点积
    private static dot(a: [number, number], b: [number, number]): number {
      return a[0] * b[0] + a[1] * b[1];
    }
  
    // 工具函数：线性插值
    private static mix(x: number, y: number, a: number): number {
      return x * (1 - a) + y * a;
    }
  }
  
  
  // 生成噪声纹理的辅助函数
  function generateNoiseTexture(
    width: number, 
    height: number, 
    noiseFunc: (st: [number, number]) => number,
    scale: number = 1.0
  ): number[][] {
    const texture: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const st: [number, number] = [x / width * scale, y / height * scale];
        row.push(noiseFunc(st));
      }
      texture.push(row);
    }
    
    return texture;
  }
