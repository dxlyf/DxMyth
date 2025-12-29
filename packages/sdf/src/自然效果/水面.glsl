#include "../common/base.glsl"
#include "../common/mat3.glsl"
#include "../common/mat4.glsl"
#include "../common/quaternion.glsl"
#include "../common/sdf.glsl"
#define DISABLE_AA 
float sdGroudPlane(vec3 p){
    return p.y;
}

MapResult map(vec3 p){
    MapResult result[2];
    result[0]=MapResult(sdGroudPlane(p),vec3(0.6),1);
   // result[1]=MapResult(sdSky(p),vec3(0.5,0.7,1),2);
    result[1]=MapResult(sdBox(p-vec3(0,1.,0),vec3(1)),vec3(0.5),3);
    MapResult minObj=result[0];
    for(int i=1;i<2;i++){ 
        if(minObj.dist>result[i].dist){
            minObj=result[i];
        }
    }
    return minObj;
}
vec3 mapNormal(vec3 p){
    float h = 0.0001;
    vec2 e = vec2(1, -1);
    return normalize(
        e.yxy * map(p + e.yxx * h).dist +
        e.xxx * map(p + e.xxx * h).dist +
        e.xyy * map(p + e.xyy * h).dist +
        e.yyx * map(p + e.yyx * h).dist
    );
}
RayCastResult rayCast(vec3 ro,vec3 rd){
    RayCastResult castResult;
    castResult.hit=false;
    float t=RAYMARCH_NEAR;

    for(int i=0;i<RAYMARCH_TIME&&t<RAYMARCH_FAR;i++){
        vec3 pos=ro+rd*t;
        MapResult ret = map(pos);
        float d=ret.dist;
        if(d<RAYMARCH_PRECISION){
            vec3 normal=mapNormal(pos);
            castResult.hit=true;
            castResult.pos=pos;
            castResult.color=ret.color;
            castResult.type=ret.type;
            castResult.normal=normal;
            break;
        }
        t+=d;
    }
    return castResult;
}

vec3 cameraPos=vec3(0,3,4);
vec3 addLight(RayCastResult result){
    vec3 ambient = vec3(0.);  // 降低环境光，让阴影更明显
    vec3 lightPos = vec3(0, 6, 0);  // 提高光源位置
    vec3 lightDir = normalize(lightPos - result.pos);
    
    // 漫反射
    float diff = max(dot(lightDir, result.normal), 0.0);
    vec3 diffuse = vec3(1.0) * diff;
    
    // 镜面反射（可选）
    vec3 viewDir = normalize(cameraPos - result.pos);
    vec3 reflectDir = reflect(-lightDir, result.normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    return result.color* (diffuse + ambient);
   // return result.color * (diffuse + ambient) + vec3(0.5) * spec;
}

vec3 render(vec2 uv){
 // vec4 q=quatFromAxis(vec3(0,1,0),degToRad(iTime*2.));
 // mat4 m2=makeRotateAxis(vec3(0,1,0),degToRad(10.));
 // cameraPos=applyQuat(cameraPos,q);
  //cameraPos=applyMat4(cameraPos,m2);
  vec3 col=vec3(0); 
  mat3 m=cameraMatrix(cameraPos,vec3(0,0,-5),vec3(0,1,0));
  vec3 rayDir=normalize(m*vec3(uv,-1));
  RayCastResult result=rayCast(cameraPos,rayDir);
  if(result.hit){
        col=addLight(result);
  }else{
    //  if(rayDir.z<0.){
    //     // 天蓝色天空
    //     vec3 skyColor = vec3(0.5, 0.7, 1.0);
    //     col=skyColor;
    //  }
       // 天蓝色天空
    vec3 skyColor = vec3(0.5, 0.7, 1.0);
    col=mix( vec3(0.5, 0.7, 1.0), vec3(0., 0.7, 1.0),smoothstep(0.,1.,uv.y));
  }
  return col;

}
vec3 renderAA(vec2 fragCoord){
    vec3 col=vec3(0);
    // 0-1 -1 1 
    // 0=-1 1=1
    // 0*C+D=-1
    // D=-1
    // 0*c+-1=-1
    // 1*2+D=1
    for(int y=0;y<AA;y++){
        for(int x=0;x<AA;x++){
            vec2 offset=vec2(float(x),float(y)) / float(AA)-0.5;
            vec2 uv=projectionCoord(fragCoord+offset,1.);
            col+=render(uv);
        }
    }
    return col/float(AA*AA);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv=projectionCoord(fragCoord,1.);
    vec3 col=vec3(0);
    #ifdef DISABLE_AA
         col=renderAA(fragCoord);
        // Gamma校正
       //  col = pow(col, vec3(1./2.2));
    #else 
         col=render(uv);
    #endif
    fragColor = vec4(col,1.0);
 

}