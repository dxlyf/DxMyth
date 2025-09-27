
#define NEAR 0.
#define FAR 100.
#define MAX_STEP 100

float sdSphere(vec3 p,float r){
    return length(p)-r;
}
float sdBox(vec3 p,vec3 b){
    vec3 d=abs(p)-b;
    return min(max(max(b.x,b.y),b.z),0.)+length(max(d,0.));
}
vec3 sdfSphereNormal(in vec3 p,float b) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1);
  return normalize(k.xyy * sdSphere(p + k.xyy * h,b) +
    k.yyx * sdSphere(p + k.yyx * h,b) +
    k.yxy * sdSphere(p + k.yxy * h,b) +
    k.xxx * sdSphere(p + k.xxx * h,b));
}
vec3 sdfBoxNormal(in vec3 p,vec3 b) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1);
  return normalize(k.xyy * sdBox(p + k.xyy * h,b) +
    k.yyx * sdBox(p + k.yyx * h,b) +
    k.yxy * sdBox(p + k.yxy * h,b) +
    k.xxx * sdBox(p + k.xxx * h,b));
}
struct Light{
    vec3 position;
    vec3 color;
};
struct Sphere{
    vec3 position;
    vec3 color;
    float r;
};
struct Box{
    vec3 position;
    vec3 color;
    vec3 size;
};



mat4 lookAt(vec3 pos,vec3 target,vec3 up){
    vec3 z=normalize(pos-target);
    vec3 x=normalize(cross(up,z));
    vec3 y=normalize(cross(z,x));
    vec4 w=vec4(-dot(x,pos),-dot(y,pos),-dot(z,pos),1);
    return mat4(vec4(x,0),vec4(y,0),vec4(z,0),w);
}
mat4 rotateYMatrix(float r){
    float rcos=cos(r);
    float rsin=sin(r);
    vec4 x=vec4(rcos,0,-rsin,0);
    vec4 y=vec4(0,1,0,0);
    vec4 z=vec4(rsin,0,rcos,0);
    return mat4(x,y,z,vec4(0,0,0,1));
}

void rayMarchSphere(vec3 rayOrigin,vec3 rayDir,Sphere sphere,out vec3 color){
     float t=NEAR;
     vec3 ambientLight=vec3(0.3);
     Light pointLight=Light(vec3(1,3,-1),vec3(1));
     for(int i=0;i<=MAX_STEP;i++){
        vec3 coord=rayOrigin+rayDir*t;
        float d=sdSphere(coord-sphere.position,sphere.r);
        if(d<0.0001){
            vec3 lightNormalize=normalize(pointLight.position-coord);
           // vec3 n=normalize(coord);
            vec3 n=sdfSphereNormal(coord,sphere.r);
            float diffuse=max(dot(n,lightNormalize),0.);

            color=sphere.color*(ambientLight+pointLight.color*diffuse);
            break;
        }
        t+=d;
    }
}
void rayMarchBox(vec2 uv,vec3 rayOrigin,vec3 rayDir,Box box,out vec3 color){
     float t=NEAR;
     vec3 ambientLight=vec3(.2,.2,.2);
     Light pointLight=Light(vec3(0,3,3),vec3(1));
     mat4 viewMartix=lookAt(rayOrigin,box.position,vec3(0,1,0));
     rayDir=normalize(viewMartix[2].xyz)*vec3(uv,-1);
     mat4 rotateMat=rotateYMatrix(iTime);
    // 法线矩阵，处理顶点法向量的旋转和缩放
    // 法线矩阵=模型矩阵(去除位移列转成3x3,再转置)
     mat3 normalMat=transpose(mat3(rotateMat));
     mat4 modelViewMat=viewMartix*rotateMat;
     for(int i=0;i<=MAX_STEP;i++){
        vec3 coord=(rayOrigin+rayDir*t);
        vec3 localCoord=(rotateMat*vec4(coord,1)).xyz;
        vec3 viewCoord=(modelViewMat*vec4(coord,1.)).xyz;
        vec3 modelPos=(modelViewMat*vec4(box.position,1.)).xyz;
        float d=sdBox(viewCoord-modelPos,box.size);
        if(d<0.0001){
            vec3 lightNormalize=normalize(pointLight.position-localCoord);
            vec3 n=normalMat*sdfBoxNormal(localCoord,box.size);  
            float diffuse=max(dot(n,lightNormalize),0.);
            color=box.color*(ambientLight+pointLight.color*diffuse);
            break;
        }
        t+=d;
    }
}
void rayMarch(vec2 uv,out vec3 color){
    vec3 rayOrigin=vec3(0,0,5);
    vec3 rayDir=normalize(vec3(uv,0)-rayOrigin);
    float fw=max(fwidth(uv.x),fwidth(uv.y));
    Sphere sphere=Sphere(vec3(0,0,0),vec3(1,0,0),1.);
    Box box=Box(vec3(0,0,0),vec3(0,0,1),vec3(.5));
   // rayMarchSphere(rayOrigin,rayDir,sphere,color);
    rayMarchBox(uv,rayOrigin,rayDir,box,color);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {

	vec2 uv = ( fragCoord.xy*2. - iResolution.xy )/min(iResolution.x,iResolution.y);
    vec3 color=vec3(0);
	rayMarch(uv,color);
	fragColor = vec4(color, 1.0 );

}