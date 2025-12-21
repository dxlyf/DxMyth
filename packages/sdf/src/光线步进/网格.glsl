
#define PI 3.14159265359

float degToRad(float degrees) {
    return degrees * (PI / 180.0);
}
float radToDeg(float radians) {
    return radians * (180.0 / PI);
}
vec2 projectionCoord(vec2 fragCoord,float scale)
{
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x,iResolution.y) * 2.0*scale;
    return uv;
}
// 2d grid
void grid(vec2 uv,vec2 size,out vec3 color){
    vec2 p=uv*size;
    vec2 grid=fract(p);
    if(grid.x<dFdx(p.x)||grid.y<dFdy(p.y)){
        color+=vec3(1.);
    }
}
// 2d 棋盘格子
void chessboard(vec2 uv,vec2 size,out vec3 color){
    vec2 p=uv*size;
    vec2 p2=floor(p);
    if(mod(p2.x+p2.y,2.)<1.){
        color+=vec3(1);
    }else{
        color+=vec3(0);
    }
}
// 合成颜色
vec4 SourceOverBlend(vec4 source,vec4 destination){
    float alpha = source.a + destination.a * (1. - source.a);
    return vec4(
        (source.rgb * source.a + destination.rgb * destination.a * (1. - source.a)) / alpha,
        alpha
    );
}

// 三角形面积（使用叉积）
float triangleArea(vec3 A, vec3 B, vec3 C) {
    return length(cross(B - A, C - A)) * 0.5;
}

// 计算重心坐标
vec3 barycentric2(vec3 P, vec3 A, vec3 B, vec3 C) {
    float areaABC = triangleArea(A, B, C);
    
    float u = triangleArea(P, B, C) / areaABC;  // 对应顶点A
    float v = triangleArea(A, P, C) / areaABC;  // 对应顶点B
    float w = triangleArea(A, B, P) / areaABC;  // 对应顶点C
    
    return vec3(u, v, w);
}
// 三角形重心坐标
vec3 barycentric(vec2 p, vec2 a, vec2 b, vec2 c)
{
    vec3 v0 = vec3(b - a, 0.0);
    vec3 v1 = vec3(c - a, 0.0);
    vec3 v2 = vec3(p - a, 0.0);
    float d00 = dot(v0, v0);
    float d01 = dot(v0, v1);
    float d11 = dot(v1, v1);
    float d20 = dot(v2, v0);
    float d21 = dot(v2, v1);
    float denom = d00 * d11 - d01 * d01;
    float v = (d11 * d20 - d01 * d21) / denom;
    float w = (d00 * d21 - d01 * d20) / denom;
    float u = 1.0 - v - w;
    return vec3(u, v, w);
}
float dot2(vec2 v) {
    return dot(v, v);
}
float cross2(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}
bool isPointInTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    bool v0=cross2(b - a, p - a)>0.;
    bool v1=cross2(c - b, p - b)>0.;
    bool v2=cross2(a - c, p - c)>0.;
    return v0==v1 && v1==v2;
}
mat3 makeTRSP(vec2 translate,float angle,vec2 scale,vec2 pivot){
    float c=cos(angle),s=sin(angle);
    float m00=c*scale.x;
    float m10=s*scale.x;
    float m01=-s*scale.y;
    float m11=c*scale.y;

    float tx=translate.x+(m00*-pivot.x)+(m01*-pivot.y);
    float ty=translate.y+(m10*-pivot.x)+(m11*-pivot.y);
    return mat3(
        m00,m10,0.,
        m01,m11,0.,
        tx,ty,1.
    );
}
vec2 applyMat3(vec2 v, mat3 m) {
    vec3 v3 = vec3(v, 1.0);
    vec3 result = m * v3;
    return result.xy;
}
vec3 applyMat3(vec3 v, mat3 m) {
  return m * v;
}
vec3 applyMat4(vec3 v, mat4 m) {
    vec4 v3 = vec4(v, 1.0);
    vec4 result = m * v3;
    return result.xyz;
}
mat3 makeRotateMatrix(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c, s, 0.0,
        -s,  c, 0.0,
        0.0, 0.0, 1.0
    );
}

mat3 makeRotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        1,0,0,
        0,c,-s,
        0,s,c
    );
}
mat3 makeRotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c,0,s,
        0,1,0,
        -s,0,c
    );
}
mat3 makeRotateAxis(vec3 axis, float angle) {
    float c=cos(angle),s=sin(angle);
    float t=1.-c;
    float x=axis.x,y=axis.y,z=axis.z;
    float tx=x*t,ty=y*t,tz=z*t;
    // w=n*p
    // V||=(n·p)n
    // vT=p-V||
    // vT'=vT*cos+sin*w
    // v'=vT'+v||=cos*(p-(n·p)n)+sin*(n*p)+(n·p)n
    // v'=p*cos+sin*(n*p)+(n·p)n*(1-cos)


    // p=[1,0,0]*cos+sin*[0,z,-y]+x*n*(1-cos)
    // p=[0,1,0]*cos+sin*[-z,0,x]+y*n*(1-cos)
    // p=[0,0,1]*cos+sin*[y,-x,0]+z*n*(1-cos)
    return transpose(mat3(
        tx*x+c,tx*y+z*s,tx*z-y*s,
        ty*x-z*s,ty*y+c,ty*z+x*s,
        tx*z+y*s,ty*z-x*s,z*z*t+c));

}
mat3 CameraMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 z=normalize(eye - center);
    vec3 x=normalize(cross(up, z));
    vec3 y=normalize(cross(z, x));
    return (mat3(x,y,z));
}
mat4 CameraViewMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 z=normalize(eye - center);
    vec3 x=normalize(cross(up, z));
    vec3 y=normalize(cross(z, x));
    return mat4(
        vec4(x,0),
        vec4(y,0),
        vec4(z,0),
        vec4(-dot(eye,x),-dot(eye,y),-dot(eye,z),1)
    );
}

float sdRect(vec2 p, vec2 size)
{
    vec2 d=abs(p)-size;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}
float sdCircle(vec2 p, float r)
{
    return length(p)-r;
}
float sdSegment(vec2 p, vec2 a, vec2 b,float w)
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h)-max(dFdx(p.x),dFdy(p.y))*0.5;
}



// 方法2：更优化的版本（Inigo Quilez 方法）
float sdTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 ba = b - a;
    vec2 cb = c - b;
    vec2 ac = a - c;
    
    vec2 pa = p - a;
    vec2 pb = p - b;
    vec2 pc = p - c;
    

    // 判断是否在三角形内（所有边同侧）
    bool inside =isPointInTriangle(p,a,b,c);
    
    // 到三条边的距离
    float d = min(min(
        dot2(ba * clamp(dot(ba, pa) / dot2(ba), 0.0, 1.0) - pa),
        dot2(cb * clamp(dot(cb, pb) / dot2(cb), 0.0, 1.0) - pb)),
        dot2(ac * clamp(dot(ac, pc) / dot2(ac), 0.0, 1.0) - pc));
    
    return (inside ? -1.0 : 1.0) * sqrt(d);
}
float sdArrow(vec2 p,vec2 size,float angle){
    mat3 m=makeRotateMatrix(degToRad(angle-90.));
    vec2 halfSize=size*0.5;
    vec2 a=vec2(0.,size.y);
    vec2 b=vec2(-halfSize.x,0);
    vec2 c=vec2(halfSize.x,0);
    return sdTriangle(p,applyMat3(a,m),applyMat3(b,m),applyMat3(c,m));
}
float sdSegmentArrow(vec2 p, vec2 a, vec2 b){
    vec2 dir=normalize(b-a);
    float angle=radToDeg(atan(dir.y,dir.x));
    float d1=sdSegment(p,a,b,1.);
    float d2=sdArrow(p-b,vec2(0.05),angle);
    float d3=sdArrow(p-a,vec2(0.05),angle+180.);
    return min(min(d1,d2),d3);
}
float sdPolygonSide(vec2 p,float r,int side,float startAngle,bool fill){
    float angle=2.*PI/float(side);
    float d=1e10;
    float wind=0.;
    for(int i=0;i<side;i++){
        float a1=float(i)*angle+startAngle;
        float a2=float(i+1)*angle+startAngle;
        vec2 v1=vec2(cos(a1),sin(a1))*r;
        vec2 v2=vec2(cos(a2),sin(a2))*r;
        float d2=sdSegment(p,v1,v2,1.);
        d=min(d,d2);
        if(fill){
            if(p.y>v1.y!=p.y>v2.y&&p.x<v1.x+(v2.x - v1.x) * (p.y - v1.y) / (v2.y - v1.y)){
                wind++;
            }
        }
    }
    if(fill){;
        return mod(wind,2.)!=0.?-length(p):d;
    }
    return d;
}
float sdPolygonSide(vec2 p,float r,int side){
    return sdPolygonSide(p,r,side,0.,true);
}

float sdSphere(vec3 p,float r){
    return length(p)-r;
}
float sdBox(vec3 p,vec3 size){
    vec3 d=abs(p)-size;
    return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);
}
float map(vec3 p){
    return min(sdSphere(p-vec3(0,0,0),1.),sdBox(p-vec3(0,2,0),vec3(0.5)));
}
vec3 mapNormal(vec3 p){
    float h=0.0001;
    vec2 xy=vec2(1,-1);
    float d=map(p);
    return normalize(
        vec3(
            (map(p+vec3(h,0,0))-d)/h,
            (map(p+vec3(0,h,0))-d)/h,
            (map(p+vec3(0,0,h))-d)/h
        )
    );
    // return normalize(vec3(
    //     xy.yxy*map(p+xy.yxy*h)+
    //     xy.xxx*map(p+xy.xxx*h)+
    //     xy.xyy*map(p+xy.xyy*h)+
    //     xy.yyx*map(p+xy.yyx*h)
    // ));
}   
/**
环境光照(Ambient Lighting)：即使在黑暗的情况下，世界上通常也仍然有一些光亮（月亮、远处的光），所以物体几乎永远不会是完全黑暗的。为了模拟这个，我们会使用一个环境光照常量，它永远会给物体一些颜色。
漫反射光照(Diffuse Lighting)：模拟光源对物体的方向性影响(Directional Impact)。它是冯氏光照模型中视觉上最显著的分量。物体的某一部分越是正对着光源，它就会越亮。
镜面光照(Specular Lighting)：模拟有光泽物体上面出现的亮点。镜面光照的颜色相比于物体的颜色会更倾向于光的颜色。。
*/
void rayMatrch(vec2 uv,inout vec3 col){

    mat3 yRot=makeRotateAxis(vec3(1,0,0),iTime*0.2);
    vec3 origin=vec3(0,3,1.5);
    mat3 cameraMatrix=CameraMatrix(origin,vec3(0,2,0),vec3(0.,1.,0.));
  //  cameraMatrix=inverse(cameraMatrix);
    vec3 rayDir=normalize(applyMat3(vec3(uv,-1),cameraMatrix));

    float d=0.1;
    float far=40.;
    for(int i=0;i<50;i++){
        vec3 p=origin+rayDir*d;
        p=yRot*p;
        float dist=map(p);
        d+=dist;
        if(dist<0.0001){
            vec3 normal=mapNormal(p);
            // 环境光
            float ambientStrength = .3;// 环境光强度
            vec3 ambientColor=vec3(1); // 环境光颜色

            vec3 ambient = ambientStrength * ambientColor;
            vec3 lightPos=vec3(0,3,-2); // 光源位置
            vec3 lightDir=normalize(lightPos-p); // 光源方向
            vec3 lightColor=vec3(1); // 光源颜色
            float diff =clamp(dot(normal,lightDir),0.,1.);// 漫反射光照强度
            vec3 diffuse=diff*lightColor;
            // 镜面光
            float specularStrength = .5; // 镜面光强度
            vec3 viewDir=normalize(origin-p); // 视角方向
            vec3 reflectDir=reflect(-lightDir,normal); // 反射光线方向
            float spec = pow(max(dot(viewDir,reflectDir),0.),16.); // 镜面光照强度
            vec3 specular = specularStrength * spec * lightColor;

            vec3 objectColor=vec3(1,0,0);
            col=(ambient + diffuse + specular) * objectColor;
            break;
        }
        if(d>far){
            break;
        }
    }

}
mat3 makeScaleAxis(vec2 axis,float k){
    // v||=(v·n)n
    // vT=v-V||
    // vT'=vT
    // v||'=V||*k
    // v'=v||'+vT'
    // v=[1,0]=(v·n)n*k+v-(v·n)n=(v·n)n*(k-1)+v
    // v(1,0)=x*n*(k-1)+[1,0]
    // v(0,1)=y*n*(k-1)+[0,1]
    float t=(k-1.);
    float x=axis.x,y=axis.y; 
    float tx=x*t,ty=y*t;
    // return transpose(mat3(
    //     tx*x+1.,tx*y,0,
    //     ty*x,ty*y+1.,0,
    //     0,0,1
    // ));
    return mat3(
        x*x*(k-1.)+1.,x*y*(k-1.),0,
        y*x*(k-1.),y*y*(k-1.)+1.,0,
        0,0,1);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv=projectionCoord(floor(fragCoord),1.);
    vec3 col=vec3(0.);
     //rayMatrch(uv,col);
    //  float d=sdRect(applyMat3(uv,makeScaleAxis(vec2(1,0),2.2)),vec2(0.2));
    // if(d<0.){
    //     col=vec3(1,0,0);
    // }
    mat3 m=makeScaleAxis(vec2(0,1),1.);

    vec2 a=vec2(0,0.5);
    vec2 b=vec2(-0.5,0);
    vec2 c=vec2(0.5,0);
    float d=sdTriangle(uv,applyMat3(a,m),applyMat3(b,m),applyMat3(c,m));
    if(d<0.){
        col=vec3(1,0,0);
    }
    fragColor = vec4(col,1.0);
}