
#include "base.glsl"
#define MAX_STEPS 500 
#define NEAR 0.01
#define FAR 100.
#define EPSILON 0.001
#define CAMERA_POS vec3(0.,1.5,0)
#define CAMERA_TARGET vec3(0,1,-4)
#define LIGHT_POS vec3(3.,4.,2.)
#define LIGHT_COLOR vec3(1)
#define SPHERE_POS vec3(0,1,-4)
#define BOX_POS vec3(-3,1,-4)
#define AA 2  // 2x2 = 4 samples

struct MapResult{
    float d;
    vec3 color;
    int type;
};
float sdPlane(vec3 p,vec3 n){
    return dot(p,n);    
}
//  // 完整的玻璃着色器
// vec3 glassShading(vec3 rayDir, vec3 normal, vec3 hitPos, vec3 glassColor, float ior) {
//     // 1. 菲涅尔效应：计算反射比例
//     float cosTheta = dot(-rayDir, normal);
//     float fresnel = fresnelSchlick(cosTheta, ior);
    
//     // 2. 反射部分
//     vec3 reflectedDir = reflect(rayDir, normal);
//     RayCastResult reflectResult = rayCast(hitPos + reflectedDir * 0.01, reflectedDir);
//     vec3 reflectColor = reflectResult.hit ? reflectResult.color : getSkyColor(reflectedDir);
    
//     // 3. 折射部分
//     vec3 refractedDir = refract(rayDir, normal, 1.0/ior);
//     if(length(refractedDir) > 0.0) {  // 折射可能发生全反射
//         RayCastResult refractResult = rayCast(hitPos + refractedDir * 0.01, refractedDir);
//         vec3 refractColor = refractResult.hit ? refractResult.color : getSkyColor(refractedDir);
        
//         // 玻璃颜色会影响折射光
//         refractColor *= glassColor;
        
//         // 4. 混合反射和折射（根据菲涅尔系数）
//         return mix(refractColor, reflectColor, fresnel);
//     } else {
//         // 全反射
//         return reflectColor;
//     }
// }

// 菲涅尔近似公式
float fresnelSchlick(float cosTheta, float ior) {
    float r0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    return r0 + (1.0 - r0) * pow(1.0 - cosTheta, 5.0);
}
MapResult map(vec3 p){

    int len=3;
    MapResult d[3];
    d[0]=MapResult(sdGroundPlane(p),vec3(1),1);
    d[1]=MapResult(sphere(p-SPHERE_POS,1.),vec3(0.8),2);
    d[2]=MapResult(box(p-vec3(-5,2,-6),vec3(0.1,5,5)),vec3(1),3);
    MapResult minD=d[0];
    for(int i=1;i<len;i++){
        if(d[i].d<minD.d){
             minD=d[i];
        }
    }
    return minD;
}
vec3 mapNormal(vec3 p){
    float h=0.0001;
    vec2 xy=vec2(1,-1);
    return normalize(vec3(
        xy.yxy*map(p+xy.yxy*h).d+
        xy.xxx*map(p+xy.xxx*h).d+
        xy.xyy*map(p+xy.xyy*h).d+
        xy.yyx*map(p+xy.yyx*h).d
    ));
}
float quatLength(vec4 q){
    return sqrt(dot(q,q));
}
vec4 quatConjugate(vec4 q){
    return vec4(-q.xyz,q.w);
}
vec4 quatInverse(vec4 q){
    return quatConjugate(q)/quatLength(q);
}
vec4 quatMul(vec4 a,vec4 b){
    vec4 q=vec4(0);
    q.w=a.w*b.w-dot(a.xyz,b.xyz);
    q.xyz=a.w*b.xyz+b.w*a.xyz+cross(a.xyz,b.xyz);
    return q;
}
vec4 quatFromAngleAxis(float angle,vec3 axis){
    float halfAngle=angle*0.5;
    return vec4(-normalize(axis)*sin(halfAngle),cos(halfAngle));
}
vec3 applyQuat(vec3 v,vec4 q){
    vec4 p=vec4(v,0);
    return quatMul(quatMul(q,p),quatInverse(q)).xyz;
}
vec4 quatFromEuler(vec3 euler){
    vec3 xAxis=vec3(1,0,0);
    vec3 yAxis=vec3(0,1,0);
    vec3 zAxis=vec3(0,0,1);
    vec4 qx=quatFromAngleAxis(euler.x,xAxis);
    vec4 qy=quatFromAngleAxis(euler.y,yAxis);
    vec4 qz=quatFromAngleAxis(euler.z,zAxis);

    return quatMul(qx,quatMul(qy,qz));
}
mat3 mat3FromQuat(vec4 q){
    vec3 qx=applyQuat(vec3(1,0,0),q);
    vec3 qy=applyQuat(vec3(0,1,0),q);
    vec3 qz=applyQuat(vec3(0,0,1),q);

    return mat3(qx,qy,qz);
}

RayMarchingResult rayCast(vec3 rayOrigin,vec3 rayDir){
    RayMarchingResult result;
    result.color=vec3(0);
    result.hit=false;
    float t=NEAR;
    for(int i=0;i<MAX_STEPS;i++){
        vec3 p=rayOrigin+rayDir*t;

        MapResult mapResult=map(p);
        float d=mapResult.d;
        t+=d;
        if(d<EPSILON){  
            //p=rayOrigin+rayDir*t;
            vec3 normal=mapNormal(p);
            result.hit=true;
            result.point=p;
            result.color=mapResult.color;
            result.normal=normal;
            result.type=mapResult.type;
            result.reflect=reflect(rayDir,normal);
            break;
        }
        if(t>FAR){
            break;
        }
    }
 

   
    return result;
}
float Shadow(vec3 rayOrigin,vec3 rayDir){
     float t=NEAR;
     float result=1.;
    for(int i=0;i<MAX_STEPS;i++){
        vec3 p=rayOrigin+rayDir*t;
        MapResult ret=map(p);
        t+=ret.d;
        if(ret.d<EPSILON){  
           // vec3 normal=mapNormal(p);
            result=ret.d/t;
            break;
        }
        if(t>FAR){
            break;
        }
    }
    return result;
}
float SoftShadow(vec3 rayOrigin,vec3 rayDir,float k){
     float t=NEAR;
     float result=1.;
    for(int i=0;i<MAX_STEPS;i++){
        vec3 p=rayOrigin+rayDir*t;
        MapResult ret=map(p);
        t+=ret.d;
        if(ret.d<EPSILON){  
           // vec3 normal=mapNormal(p);
           return 0.;
        }
        result=min(result,k*ret.d/t);
        if(t>FAR){
            break;
        }
    }
    return result;
}

vec3 addLight(RayMarchingResult result){
             // 环境光
            float ambientStrength=1.;
            vec3 ambientColor=vec3(0.1);
            vec3 ambient=ambientStrength*ambientColor;
            // 漫反射
            vec3 lightPos=LIGHT_POS;
            vec3 lightDir=normalize(lightPos-result.point);
         //   vec3 lightDir=normalize(vec3(0,0,-1));

            vec3 lightColor=LIGHT_COLOR;
            float diffuseStrength=max(dot(lightDir,result.normal),0.);
          //  diffuseStrength=sqrt(diffuseStrength);//mix(0.,1.2,diffuseStrength);
            vec3 diffuse=diffuseStrength*lightColor;
            // 镜面反射
            //视线方向，从相机出发，看向物体的方向
            vec3 viewDir=normalize(CAMERA_POS-result.point);
            float specularStrength=pow(max(dot(viewDir,reflect(-lightDir,result.normal)),0.),16.);
            vec3 specular=specularStrength*lightColor;

            // 阴影
            float shadow = SoftShadow(result.point,normalize(LIGHT_POS-result.point),8.);
            diffuse *= shadow * 0.5 + 0.5;
            // 最终颜色
            vec3 finalColor=result.color*(diffuse+ambient+specular);

            // 反射
            // 如果是镜子
            if(result.type==1){
                RayMarchingResult ret=rayCast(result.point,result.reflect);
                if(ret.hit){
                    finalColor=finalColor*0.4+ret.color*0.6;
                    
                }
            }
            return finalColor;
}

RayMarchingResult render(vec2 uv){
    vec3 rayOrigin=CAMERA_POS;
    vec3 rayDir=vec3(uv,-1);
    mat3 cameraMatrix=lookAt(rayOrigin,CAMERA_TARGET,vec3(0.,1.,0.));
    rayDir=normalize(cameraMatrix*rayDir);
    RayMarchingResult result=rayCast(rayOrigin,rayDir);
    if(result.hit){
        result.color=addLight(result);
    }
    return result;
}
// 抗锯齿
void renderAnti(vec2 fragCoord,out vec3 col){

     for(int y=0;y<AA;y++){
            for(int x=0;x<AA;x++){
                vec2 offset=(vec2(x,y)/float(AA)-float(AA/2));
                vec2 uv=projectionOnScrren(fragCoord+offset,1.);
                RayMarchingResult result=render(uv);
                col+=result.color;
            }
    }
    col=col/float(AA*AA);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec3 col=vec3(0);
    renderAnti(fragCoord,col);
  
    fragColor=vec4(col, 1.0);
}