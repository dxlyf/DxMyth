
#define CAMERA_POS vec3(0,0,10)
#define SPHERE_POS vec3(0,0,-5)
#define SPHERE_RADIUS 1.
#define MAX_DIST 200.
#define MAX_STEPS 200
#define LIGHT_POS vec3(-2,3,0)

float SDFSphere(vec3 p){
	return length(p-SPHERE_POS)-SPHERE_RADIUS;
}
vec3 rayDir(vec2 coord){
    return normalize(vec3(coord,0)-CAMERA_POS);
}

// 计算球体的法线
vec3 SDFNormal(in vec3 p) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1);
  return normalize(k.xyy * SDFSphere(p + k.xyy * h) +
    k.yyx * SDFSphere(p + k.yyx * h) +
    k.yxy * SDFSphere(p + k.yxy * h) +
    k.xxx * SDFSphere(p + k.xxx * h));
}
vec3 AxisHelper(vec2 uv){
	vec2 zuv=uv*5.;
	vec3 color=vec3(0);
	vec2 fuv=abs(fract(zuv));
	float axisWidth=1.;
	float dx=fwidth(zuv.x)*axisWidth;
	float dy=fwidth(zuv.y)*axisWidth;
	if(abs(zuv.x)<dx){
	   color.g=1.;
	}
	else if(abs(zuv.y)<dy){
	   color.r=1.;
	}
	else if(fuv.x<dx){
	   color=vec3(1);
	}
	else if(fuv.y<dy){
	   color=vec3(1);
	}
	
	return color;
}
float circle(vec2 uv,vec2 center,float radius,float blur){
    float d=length(uv-center);
    return 1.-smoothstep(radius-blur,radius+blur,d);
}
float circleStroke(vec2 uv,vec2 center,float radius,float lineWidth){
    float d=length(uv-center);
	
    return step(radius-lineWidth/2.,d)-step(radius+lineWidth/2.,d);
}
float lineSegment(vec2 uv,vec2 start,vec2 end,float width){
    vec2 p=uv-start;
    vec2 dir=end-start;
    float ratio=dot(p,dir)/dot(dir,dir);
    if(ratio<0.||ratio>1.){
	return 0.;
    }
    float len=clamp(length(p-ratio*dir),0.,1.);
    return step(len,width*dFdx(uv.x));
}
float polygon(vec2 uv,vec2 center,float radius,int sides,float rotate){
    vec2 p=uv-center;
    float p2=PI*2.;
  
    float rad=p2/float(sides);
    float theta=atan(p.x,p.y)+PI+rotate; 
    float d=cos(floor(theta/rad+.5)*rad-theta)*length(p);
    return step(d,radius);
}
vec3 rayMarch(vec2 coord){
	float d0=0.;
	vec3 rd=rayDir(coord);
	vec3 color=vec3(0);
	for(int i=0;i<MAX_STEPS;i++){
		vec3 p=CAMERA_POS+rd*d0;
		float d1=SDFSphere(p);
		d0+=d1;
		if(d1<0.01){
		   vec3 n=SDFNormal(p);
		   vec3 lightDir=normalize(LIGHT_POS-p);
		   float c=clamp(dot(n,lightDir),0.,1.);
			
		   color=vec3(1,0,0)*c;
		   break;
		}
		if(d0>MAX_DIST){
			break;
		}
	
	}
	
	return color;
}	

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

	vec2 uv = ( fragCoord.xy*2. - iResolution.xy )/min(iResolution.x,iResolution.y);

	vec3 color=rayMarch(uv);
	fragColor = vec4(color, 1.0 );

}