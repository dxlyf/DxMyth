
precision highp float;

float PI=acos(0.)*2.;
float PI2 = acos(0.)*4.;

const int COLOR_COUNT=3;
const vec3 colors[COLOR_COUNT]=vec3[](
    vec3(1,0,0),
    vec3(0,1,0),
    vec3(0,0,1)
);
const float stops[COLOR_COUNT]=float[](
    0.,0.5,1.
);
float sdfRect(vec2 p,vec2 b){
    vec2 s=abs(p)-b;

    return length(max(s,0.))+min(0.,max(s.x,s.y));
}
vec3 gradientColor(float t){
    if(t<=0.){
        return colors[0];
    }
    if(t>=1.){
        return colors[COLOR_COUNT-1];
    }
    for(int i=1;i<COLOR_COUNT;i++){
        float t0=stops[i-1];
        float t1=stops[i];
        
        if(t0<=t&&t<=t1){
            float cur_t=clamp((t-t0)/(t1-t0),0.,1.);
            return mix(colors[i-1],colors[i],cur_t);
        }
    }
    return colors[COLOR_COUNT-1];
}
vec3 linearGradient(vec2 p,vec2 start,vec2 end){
    vec2 dist=end-start;
    float t=clamp(dot(p-start,dist)/dot(dist,dist),0.,1.);
    return gradientColor(t);
}
/**
    P(t)=c0+(c1-c0)t 
    R(t)=ro+(r1-r0)t 
    |P-P(t)|=Rt(t)
*/
vec3 radialGradient(vec2 p,vec2 start,float r0,vec2 end,float r1){
    vec2 delta=end-start;
    float dr=r1-r0;
    // 圆心重合特例：直接按点到圆心的距离线性采样
    if(delta.x==0.&&delta.y==0.){
        return gradientColor((length(p-start)-r0)/dr);
    }
    vec2 v=p-start;
    // 二次方程 A*t*t+B*t+C=0 的系数（A=0 时退化为线性，即圆锥面）
    float A=dot(delta,delta)-dr*dr;
    float B=-2.*(dot(delta,v)+r0*dr);
    float C=dot(v,v)-r0*r0;
    if(abs(A)<1e-6){
        // 线性退化：B*t+C=0
        return gradientColor(clamp(-C/B,0.,1.));
    }
    float d=B*B-4.*A*C;
    if(d<0.){
        return gradientColor(0.);
    }
    float sqrtD=sqrt(d);
    float inv=0.5/A;
    float t0=(-B+sqrtD)*inv;
    float t1=(-B-sqrtD)*inv;
    if(t0>=0.&&t0<=1.){
        return gradientColor(t0);
    }
    if(t1>=0.&&t1<=1.){
        return gradientColor(t1);
    }
    return gradientColor(clamp(min(t0,t1),0.,1.));
}
vec3 conicGradient(vec2 p,vec2 center,float startAngle){
    vec2 dist=p-center;
    float _startAngle=startAngle/180.*PI;
    float radian=atan(dist.y,dist.x);
    radian-=_startAngle;
    radian=mod(radian,PI2);
    if(radian<0.){
       radian+=PI2;
    }
    float t0=radian/PI2;
    return gradientColor(t0);
}
vec2 projectionScale(vec2 coord,float scale){
    return scale*(coord-iResolution.xy*0.5)/min(iResolution.x,iResolution.y);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec2 uv=vec2(fragCoord.x,iResolution.y-fragCoord.y);
    vec3 col=vec3(0);
    float d=sdfRect(uv-vec2(250,150),vec2(150,50));
    if(d<=0.){
        vec2 p=uv-vec2(100,100);
        if(p.x<=100.){
            col=linearGradient(p,vec2(0,0),vec2(100,100));
        } else if(p.x<=200.){
            col=radialGradient(p,vec2(80,50),50.,vec2(150,50),0.);
        }else if(p.x<=300.){
            col=conicGradient(p,vec2(250,50),0.);
        }
        
    }

    fragColor = vec4(col,1.0);
 

}