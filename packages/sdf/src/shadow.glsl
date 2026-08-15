vec2 erf(vec2 x) {
  vec2 s = sign(x), a = abs(x);
  x = 1.0 + (0.278393 + (0.230389 + 0.078108 * (a * a)) * a) * a;
  x *= x;
  return s - s / (x * x);
}
float sdfRect(vec2 p,vec2 b){
    vec2 s=abs(p)-b;
    return length(max(s,0.))+min(0.,max(s.x,s.y));
}
float sdfRect(vec2 p,vec2 b,float r){
    vec2 s=abs(p)-b+r;
    return length(max(s,0.))+min(0.,max(s.x,s.y))-r;
}
float blur_along_x(float x, float y, float sigma, float corner, vec2 half_size) {
  float delta = min(half_size.y - corner - abs(y), 0.);
  float curved =
  half_size.x - corner + sqrt(max(0., corner * corner - delta * delta));
  vec2 integral =
  0.5 + 0.5 * erf((x + vec2(-curved, curved)) * (sqrt(0.5) / sigma));
  return integral.y - integral.x;
}
// Return the mask for the shadow of a box from lower to upper
float rect_shadow(vec2 pixel_position, vec2 origin, vec2 size, float sigma) {
  vec2 bottom_right = origin + size;
  vec2 x_distance = vec2(pixel_position.x - origin.x, pixel_position.x - bottom_right.x);
  vec2 y_distance = vec2(pixel_position.y - origin.y, pixel_position.y - bottom_right.y);
  vec2 integral_x = 0.5 + 0.5 * erf(x_distance * (sqrt(0.5) / sigma));
  vec2 integral_y = 0.5 + 0.5 * erf(y_distance * (sqrt(0.5) / sigma));
  return (integral_x.x - integral_x.y) * (integral_y.x - integral_y.y);
}

vec2 projectionScale(vec2 coord,float scale){
    return scale*(coord-iResolution.xy*0.5)/min(iResolution.x,iResolution.y);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec2 uv=projectionScale(fragCoord,2.);
    //vec2(fragCoord.x,iResolution.y-fragCoord.y);
    vec3 col=vec3(1);
    float d=sdfRect(uv,vec2(0.5),0.);
    if(d<=0.){
        col=vec3(1,0,0);
    }
    float d2=rect_shadow(uv,vec2(0),vec2(0.5),2.);
    if(d2<=0.){
        col=vec3(0);
    }
    fragColor = vec4(col,1.0);
 

}