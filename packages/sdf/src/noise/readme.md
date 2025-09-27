扰动纹理坐标： 一种常见的方法是使用躁声来扰动纹理坐标。通过在纹理坐标上叠加躁声，可以使纹理在场景中产生自然的变化和扭曲。这可以通过将躁声的输出值添加到原始纹理坐标上来实现。通过调整躁声的频率和振幅等参数，你可以控制扰动的程度和速度。

颜色扰动： 另一种常见的方法是将躁声应用到颜色属性上。你可以使用躁声来调整颜色的亮度、对比度、饱和度等属性，从而在场景中创建更丰富的颜色效果。这可以通过将躁声的输出值与原始颜色值相乘或相加来实现。

位置扰动： 你还可以使用躁声来扰动对象的位置。通过在对象的位置坐标上叠加躁声，可以使对象在场景中产生随机的运动和抖动效果。这可以通过将躁声的输出值添加到对象的位置坐标上来实现。

其他属性扰动： 除了纹理坐标、颜色和位置之外，你还可以将躁声应用到其他属性上，如法线、透明度等。这可以帮助你在场景中创建更多样化的效果。

调整参数和变量： 调整躁声的参数和变量是创建复杂效果的关键。通过调整躁声的频率、振幅、种子等参数，你可以控制效果的外观和行为。此外，你还可以使用时间作为输入来创建动态的效果，例如随时间变化的纹理扰动或运动效果。

## shadertoy
```glsl

// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iTime;                 // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform float     iFrameRate;            // shader frame rate
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)
                

```
## 介绍
噪声大概在80年代中期的样子就被广泛使用在程序里面了，当时的电脑RAM存储空间都比较低，所以经常利用这种程序生成的图像来当作游戏物体的纹理贴图。噪声发展到现在已经开发出了多种类型的噪声，运用在各种场景里面，在程序生成艺术（procedural generate art）里面噪声也是占有非常重要的一部分。探索噪声是一个非常有意思的过程，因为探索的过程也具有一定的随机性，通过经验和算法的调配也许你会得到一些你意想不到的画面。

在图形学中我们也经常利用噪声来绘制各种物体、形状、纹理，例如我们经常用Value噪声来制作火焰的效果，利用高维度的噪声来进行体量渲染（Volumetric Render）以及运用到大量的群体随机性的模拟。

可以说利用噪声我们完全可以绘制出自然界任何的场景和物体，因为噪声就是用来解决那些看起来随机但是又很自然的事务。

## 噪声的种类
噪声一般分为两大类，一种是以晶格为划分域的、另一种是以点来划分域的。如下所示：

|类别|名称|
 |-|-|
 基于晶格<br/>(Lattice based)|第一种是梯度噪声（Gradient Noise）:包括Perlin噪声(又稱為柏林噪声),Simplex噪声,Wavelet噪声等。<br/>第二种是Value噪声（Value Noise）
 基于点(Point Based)|Worley噪声（又称Voronoi噪声）

 基于晶格类型的实现比较多，在实践中使用到的也比较多。我们先来讲讲基于晶格的两个子分类：梯度噪声、Value噪声

## Perlin噪声
Perlin噪声（Perlin noise，又稱為柏林噪声）指由Ken Perlin发明的自然噪声生成算法，具有在函数上的连续性，并可在多次调用时给出一致的数值。 在电子游戏领域中可以透过使用Perlin噪声生成具连续性的地形；或是在艺术领域中使用Perlin噪声生成图样。

## Simplex噪声
Simplex Noise
对于 Ken Perlin 来说他的算法所取得的成功是远远不够的。他觉得可以更好。在 2001 年的 Siggraph（译者注：Siggraph是由美国计算机协会「计算机图形专业组」组织的计算机图形学顶级年度会议）上，他展示了 “simplex noise”，simplex noise 比之前的算法有如下优化：
- 它有着更低的计算复杂度和更少乘法计算。
- 它可以用更少的计算量达到更高的维度。
- 制造出的 noise 没有明显的人工痕迹。
- 有着定义得很精巧的连续的 gradients（梯度），可以大大降低计算成本。
- 特别易于硬件实现。
我知道你一定在想：“这人是谁？”是的，他的工作非常杰出！但是说真的，他是如何优化算法的呢？我们已经知道在二维中他是如何在四个点（正方形的四个角）之间插值的；所以没错你已经猜到了，对于三维（这里有个示例）和四维我们需要插入 8 个和 16 个点。对吧？也就是说对于 N 维你需要插入 2 的 n 次方个点（2^N）。但是 Ken 很聪明地意识到尽管很显然填充屏幕的形状应该是方形，在二维中最简单的形状却是等边三角形。所以他把正方形网格（我们才刚学了怎么用）替换成了单纯形等边三角形的网格。


Perlin噪声还是比较好理解的，这个Simplex就很绕人了，虽然基本原理是一样的，都是采用晶格点生成梯度，通过梯度向量与晶格点到p点的向量进行点乘后加权计算得出噪声。不同的地方是，相比于Perlin噪声的O(2^n)的复杂度，Simplex噪声的复杂度是O(n^2)，在高纬度上有着更好的优化。但是与Perlin噪声不同的是，其采用的不是晶格，而是单形。在2D情况下，Perlin的晶格以正方形为单位，Simplex的晶格以正三角形为单位。在三维情况下，Perlin的晶格以立方体为单位，Simplex的晶格以四面体为单位。


 ## 梯度噪声
 梯度噪声的主要原理是将坐标系划分成一块一块的晶格之后在晶格的每个顶点处生成一个随机的梯度（可以理解成方向向量），然后在计算噪声的时候会综合计算该噪声所在的晶格的顶点上的方向向量（图中绿色箭头）进行聚合计算（可以理解成加权计算合力）。


Perlin噪声就属于这一类，所以这样一来我们就可以封装一个Perlin噪声的函数了：
 ```glsl
// reference shadertoy
float perlinNoise(vec2 p) {
    vec2 pi = floor(p);
    vec2 pf = fract(p);

    vec2 w = pf * pf * (3.0 - 2.0 * pf);

    return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)), 
                   dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x), 
               mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)), 
                   dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),
               w.y);
}
 ```

 ## FBM
 这样看起来似乎并不怎么自然，不就是渐变的效果而已嘛，但是如果再加上了fbm（分形布朗运动）之后，那就大不一样了。
 ```glsl
const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm6( vec2 p ) {
  float f = 0.0;

  f += 0.500000*perlinNoise( p ); p = mtx*p*2.02;
  f += 0.250000*perlinNoise( p ); p = mtx*p*2.03;
  f += 0.125000*perlinNoise( p ); p = mtx*p*2.01;
  f += 0.062500*perlinNoise( p ); p = mtx*p*2.04;
  f += 0.031250*perlinNoise( p ); p = mtx*p*2.01;
  f += 0.015625*perlinNoise( p );

  return f/0.96875;
}
 ```
 除此之外，Simplex噪声也是属于这种原理，只不过它的晶格的定义有所不一样。Perlin噪声的晶格是和噪声空间（噪声的维度）保持平行的，比如1D的是单位线段、2D空间是正方形、3D空间是立方体以此类推。

但是Simplex噪声采用的是最小包围晶格，比如1D的是单位线段、2D空间是三角形、3D空间是三角锥，然后以此类推。这样的的话就可以保证Simplex噪声在高维度的时候能有更好的计算性能，因为需要更少的插值计算。

更多的信息可以查看这里 Simplex噪声。


## Value噪声
Value噪声就很简单了，它是区别于梯度噪声的，将晶格顶点的随机梯度向量直接简单粗暴的以随机数值来代替。在计算时直接进行加权插值即可，减少了很多点乘操作，因此它的性能也比Perlin噪声要更好一点。
```glsl

float valueNoise(vec2 p) {
  vec2 w = floor(p);
  vec2 k = fract(p);
  k = k*k*(3.-2.*k); // smooth it

  float n = w.x*10. + w.y*48.;

  float a = hash(n);
  float b = hash(n+10.);
  float c = hash(n+48.);
  float d = hash(n+58.);

  return mix(
    mix(a, b, k.x),
    mix(c, d, k.x),
    k.y);
}
```
因为插值计算得更简单，所以看起来的初步效果会比较硬，会有明显的晶格（小方块）的痕迹：

但是不要怕，没有什么事情是fbm（分形布朗运动）不能解决的（如果有那就多用几遍）
```glsl
const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm6( vec2 p ) {
  float f = 0.0;

  f += 0.500000*valueNoise( p ); p = mtx*p*2.02;
  f += 0.250000*valueNoise( p ); p = mtx*p*2.03;
  f += 0.125000*valueNoise( p ); p = mtx*p*2.01;
  f += 0.062500*valueNoise( p ); p = mtx*p*2.04;
  f += 0.031250*valueNoise( p ); p = mtx*p*2.01;
  f += 0.015625*valueNoise( p );

  return f/0.96875;
}
```

粗糙的初始噪声经过fbm之后都会变的非常自然。