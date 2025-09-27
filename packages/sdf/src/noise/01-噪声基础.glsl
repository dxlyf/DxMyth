
// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
float funcSin(float x){
  float amplitude = 1.;// 振幅/幅度
  float frequency = 1.;// 频率
  float y = amplitude * sin(x * frequency);
   return y;
}
float funcFbm(float x){
  float amplitude = 1.;
  float frequency = 1.;

  float y = sin(x * frequency);
  float t = 0.01*(-iTime*130.0);
  y += sin(x*frequency*2.1 + t)*4.5;
  y += sin(x*frequency*1.72 + t*1.121)*4.0;
  y += sin(x*frequency*2.221 + t*0.437)*5.0;
  y += sin(x*frequency*3.1122+ t*4.269)*2.5;
  y *= amplitude*0.06;
  return y;
}


float noise12(in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise22(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = noise12(i);
    float b = noise12(i + vec2(1.0, 0.0));
    float c = noise12(i + vec2(0.0, 1.0));
    float d = noise12(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise22(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}
float fbm2(in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(noise22(st));
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


// 白躁声
float N11(vec2 p){
    return fract(143.454543*sin(dot(p,vec2(123.1234,1254.14234))));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec3 color=vec3(0);
  vec2 uv=(fragCoord.xy*2.-iResolution.xy)/min(iResolution.x,iResolution.y);
  
  vec2 suv=uv*5.;
  vec2 fuv=fract(suv);
  vec2 id=floor(suv);
  color=vec3(0);

  color+=vec3(N11(uv));
  color+=vec3(1,0,0)*step(abs(uv.y-N11(uv)),0.1);
  // 最终的颜色
  fragColor = vec4(color,1);
}