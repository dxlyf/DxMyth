#include "../common/base.glsl"
#include "../common/sdf.glsl"
void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec3 col=vec3(0);
    vec2 uv=projectionCoord(fragCoord,4.);
    vec2 n=vec2(0,1);
    vec2 f=fwidth(uv);
    float w=(f.x+f.y);
    col=AxisHelper(uv,1.,vec4(1,0,0,1),vec4(0,1,0,1)).rgb;
    /**
    入射方向：从外部指向表面
    法线方向：从表面指向外部
    **/
    vec2 p0=normalize(vec2(-1,1));
    vec2 p1=reflect(-p0,normalize(n));
    vec2 p2=refract(-p0,normalize(n),1./1.5);
    if(sdSegment(uv,vec2(0),n,1.*w)<0.){
        col=vec3(1,1,0);
    }
    if(sdSegment(uv,vec2(0),p0,1.*w)<0.){
        col=vec3(1,1,0);
    }
    if(sdSegment(uv,vec2(0),p1,1.*w)<0.){
        col=vec3(1,1,0);
    }
    if(sdSegment(uv,vec2(0),p2,1.*w)<0.){
        col=vec3(1,0,1);
    }
    fragColor=vec4(col, 1.0);
}