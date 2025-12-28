#include "../common/base.glsl"
#include "../common/mat3.glsl"
#include "../common/mat4.glsl"
#include "../common/quaternion.glsl"


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    vec3 col  = vec3 (0.,0.,0.);
    vec2 uv=projectionCoord(fragCoord);
    if(sin(uv.x*PI)<0.){
        col.r=1.0;
    }
    
    fragColor = vec4(col,1.0);
}