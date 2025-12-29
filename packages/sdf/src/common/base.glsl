

#define PI 3.141592653589793
#define PI2 PI*2.
#define PI_2 PI/2.

// 光线推进的起始距离 
#define RAYMARCH_NEAR 0.1
// 光线推进的最远距离
#define RAYMARCH_FAR 128.
// 光线推进次数
#define RAYMARCH_TIME 512
// 当推进后的点位距离物体表面小于RAYMARCH_PRECISION时，默认此点为物体表面的点
#define RAYMARCH_PRECISION 0.001 

// 点光源位置
#define LIGHT_POS vec3(3,4, -1)

// 相邻点的抗锯齿的行列数
#define AA 2

// 栅格图像的z位置
#define SCREEN_Z -1.

struct MapResult{
   float dist;
   vec3 color;
   int type;

};
struct RayCastResult{
   bool hit;
   vec3 pos;
   vec3 normal;
   vec3 color;
   int type;

   float dist;
};
struct TilingData{
   int tile;
   vec2 id;
   vec2 tileSize;
   vec2 uv;
   vec2 coord;//-1 ~ 1
   vec2 mouseCoord;//
   vec2 tileCoord;//0 - tileSize
};

vec2 projectionCoordImp(vec2 coord,vec2 resolution,float scale){
	return scale*2.*(coord-resolution.xy*.5)/min(resolution.x,resolution.y);	
	
}
vec2 projectionCoord(vec2 coord,float scale){
	return projectionCoordImp(coord,iResolution.xy,scale);
	
}
vec2 projectionCoord(vec2 coord){
	return projectionCoordImp(coord,iResolution.xy,1.);
	
}

TilingData tilingGrid(vec2 fragCoord,ivec2 grid){
    TilingData tilingData;
    // 显示4x2的网格
    vec2 res = vec2(iResolution.x/float(grid.x),iResolution.y/float(grid.y));
    // 0-4 0-2 之间的整数
    vec2 fpid = floor(fragCoord/res);// 每个tile，设唯一标识
    vec2 fmid = floor(iMouse.xy/res);// 鼠标点击的tile
    vec2 px = fragCoord - fpid*res;// 每个tile的局部坐标
    vec2 mx = iMouse.xy - fmid*res;
    // 为每个tile索引位置，从左上角开始：0-grid.x*grid.y
    int  tile = ((grid.y-1)-int(fpid.y))*grid.x + int(fpid.x);
    // 0 ~ 1
    vec2 uv=px/res;
    vec2 muv=mx/res;

    // -1 ~ 1
    vec2 coord=projectionCoordImp(px,res,1.);
    vec2 mouseCoord=projectionCoordImp(mx,res,1.);

    tilingData.tileSize=res;
    tilingData.tileCoord=px;
    tilingData.id=fpid;
    tilingData.tile=tile;
    tilingData.uv=uv;
    tilingData.coord=coord;
    tilingData.mouseCoord=mouseCoord;
    return tilingData;
}

// 坐标轴
vec4 AxisHelper(in vec2 coord, in float axisWidth, in vec4 xAxisColor, in vec4 yAxisColor) {
  vec4 color = vec4(0);
  float dx = dFdx(coord.x) * axisWidth;
  float dy = dFdy(coord.y) * axisWidth;
  if(abs(coord.x) < dx) {
    color = yAxisColor;
  } else if(abs(coord.y) < dy) {
    color = xAxisColor;
  } 
  return color;
}

// 栅格
vec4 GridHelper(in vec2 coord, in float gridWidth, in vec4 gridColor) {
  vec4 color = vec4(0);
  float dx = dFdx(coord.x) * gridWidth;
  float dy = dFdy(coord.y) * gridWidth;
  vec2 fraction = fract(coord);
  if(fraction.x < dx || fraction.y < dy) {
    color = gridColor;
  }
  return color;
}

// 投影坐标系辅助对象
vec4 ProjectionHelper(in vec2 coord, in float axisWidth, in vec4 xAxisColor, in vec4 yAxisColor, in float gridWidth, in vec4 gridColor) {
  // 坐标轴
  vec4 axisHelper = AxisHelper(coord, axisWidth, xAxisColor, yAxisColor);
  // 栅格
  vec4 gridHelper = GridHelper(coord, gridWidth, gridColor);
  // =投影坐标系
  return bool(axisHelper.a) ? axisHelper : gridHelper;
}
vec3 interplateColor(vec4 colorStops[3],float t){

    vec3 col=colorStops[0].rgb;
    float offset=colorStops[0].w;
    for(int i=1;i<3;i++){
      vec3  current=colorStops[i].rgb;
      float offset2=colorStops[i].w;
      float ct=clamp((t-offset)/(offset2-offset),0.,1.);
      col=mix(col,current,ct);   
      offset=offset2;
    }
   return col;
}
float interplate(float start,float end,float value){
   return clamp((value-start)/(end-start),0.,1.);
}
float checkers(vec2 coord){
  vec2 grid = floor(coord);
  return mod(grid.x + grid.y, 2.);
}
// 三角形分段函数
vec2 Triangle(in vec2 x) {
  vec2 h = fract(x * .5) - .5;
  return 1. - 2. * abs(h);// 返回 [0,1]=[0,1,0]
}

// 棋盘格
float CheckersGrad(in vec2 uv, in vec2 ddx, in vec2 ddy) {
  // 模糊力度
   vec2 w = max(abs(ddx), abs(ddy)) + .001;
  // 强化模糊
  //vec2 w = max(abs(ddx), abs(ddy)) * 4. + .001;
  // 三角形分段函数的导数
  vec2 i = (Triangle(uv + 0.5 * w) - Triangle(uv - 0.5 * w)) / w;   
  // xor 
  return 0.5 - 0.5 * i.x * i.y;
}

float radToDeg(float rad) {
    return rad * 180.0 / PI;
}

float degToRad(float deg) {
    return deg * PI / 180.0;
}