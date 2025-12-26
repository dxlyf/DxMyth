// The MIT License
// Copyright © 2025 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Axis Aligned Bounding Box of a triangle

// More bounding boxes:
//   https://www.shadertoy.com/playlist/mcGBDK
// and
//   https://iquilezles.org/articles/bboxes2d/






// signed distance to a 2D triangle
// https://www.shadertoy.com/view/XsXSz4
float dot2( in vec2 v ) { return dot(v,v); }
float sdTriangle( in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2 )
{
	vec2 e0=p1-p0, v0=p-p0; float d0=dot2(v0-e0*clamp(dot(v0,e0)/dot(e0,e0),0.0,1.0));
	vec2 e1=p2-p1, v1=p-p1; float d1=dot2(v1-e1*clamp(dot(v1,e1)/dot(e1,e1),0.0,1.0));
	vec2 e2=p0-p2, v2=p-p2; float d2=dot2(v2-e2*clamp(dot(v2,e2)/dot(e2,e2),0.0,1.0));
    
    float o = e0.x*e2.y-e0.y*e2.x;
    vec2 d = min(min(vec2(d0,o*(v0.x*e0.y-v0.y*e0.x)),
                     vec2(d1,o*(v1.x*e1.y-v1.y*e1.x))),
                     vec2(d2,o*(v2.x*e2.y-v2.y*e2.x)));
	return -sqrt(d.x)*sign(d.y);
}


vec4 aabbTriangle( in vec2 p0, in vec2 p1, in vec2 p2)
{
    return vec4( min(p0,min(p1,p2)),
                 max(p0,max(p1,p2)) );
}


vec4 aabbOrientedBox( in vec2 a, in vec2 b, in float r )
{
    vec2 v = r*abs(normalize(vec2(b.y-a.y,b.x-a.x)));
    return vec4(min(a,b)-v,max(a,b)+v);
}
vec4 aabbSegment( in vec2 a, in vec2 b, in float r )
{
    return vec4(min(a,b)-r,max(a,b)+r);
}

vec4 boxPie( in vec2 c, in vec2 d, in float a, in float r )
{
    float si = sin(a);
    float co = cos(a);
    vec2 m =    (d.xy)*co;
    vec2 n = abs(d.yx)*si;
    return c.xyxy + r*vec4(
       (d.x>-co) ? min(m.x-n.x,0.0) : -1.0,
       (d.y>-co) ? min(m.y-n.y,0.0) : -1.0,
       (d.x< co) ? max(m.x+n.x,0.0) :  1.0,
       (d.y< co) ? max(m.y+n.y,0.0) :  1.0 );
}

vec4 aabbBezier( in vec2 p0, in vec2 p1, in vec2 p2 )
{
    vec2 a = p0-2.0*p1+p2;
    vec2 b = p1-p0;
    vec2 t = clamp(-b/a,0.0,1.0);
    vec2 q = p0+t*(2.0*b+t*a);
    return vec4(min(min(p0,p2),q),
                max(max(p0,p2),q));
}

vec4 aabbBezier( in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p3 )
{
    vec2 c  = -p0+    p1;
    vec2 b  =  p0-2.0*p1+    p2;
    vec2 a  = -p0+3.0*p1-3.0*p2+p3;
    vec2 g  = sqrt(max(b*b-a*c,0.0));
    vec2 t1 = clamp((-b-g)/a,0.0,1.0);
    vec2 t2 = clamp((-b+g)/a,0.0,1.0);
    vec2 q1 = p0+t1*(3.0*c+t1*(3.0*b+t1*a));
    vec2 q2 = p0+t2*(3.0*c+t2*(3.0*b+t2*a));
    return vec4(min(min(p0,p3),min(q1,q2)),
                max(max(p0,p3),max(q1,q2)));
}
vec4 aabbParabola( in float w, in float h, in float r )
{
    return vec4(-w-r,min(h,0.0)-r,
                 w+r,max(h,0.0)+r);
}


vec4 aabbCutDisk( in float r, in float h )
{
    float m = h>0.0 ? sqrt(r*r-h*h) : r;
    return vec4(-m,h,m,r);
}

vec4 aabbEgg( in float he, in float ra, in float rb, in float bu )
{
    float wi = max(ra, rb);
    float r = 0.5*(he+ra+rb)/bu;
    float da = r - ra;
    float db = r - rb;
    float h = db*db - da*da;
    if( abs(h)<he*he )
    {
        float y = (h-he*he)/(2.0*he);
        wi = max(wi, r - sqrt(da*da-y*y));
    }
    return vec4(-wi, -ra, wi, he + rb);
}

vec4 boxStar( in float r, in int n, in float w)
{
    float an = 6.283185/float(n);
    vec2 kk = vec2( cos( round(float(n)/2.0)*an ),
                    sin( round(float(n)/4.0)*an ) );
    return r*vec4(-kk.y,kk.x,kk.y,1.0);
}
vec4 boxVesicaSegment( in vec2 a, in vec2 b, in float w )
{
    vec2  c  = (b+a)*0.5;
    vec2  v  = (b-a)*0.5;
    float v2 = dot(v,v);
    float d  = 0.5*(v2-w*w)/w;
    float h  = -v2/(d+w);
    vec2  p  = abs(v.yx)*d/sqrt(v2);
    vec2  q  = max(p-d-w,h);
    return vec4( min(min(a,b),c+q), 
                 max(max(a,b),c-q) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // normalized pixel coordinates
    vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    vec2 m = (2.0*iMouse.xy-iResolution.xy)/iResolution.y;
    float px = 2.0/iResolution.y;
    
    // animate
	vec2 v1 = vec2(1.2,0.6)*cos( iTime + vec2(0.0,2.00) + 0.0 );
	vec2 v2 = vec2(1.2,0.6)*cos( iTime + vec2(0.0,1.50) + 1.5 );
	vec2 v3 = vec2(1.2,0.6)*cos( iTime + vec2(0.0,3.00) + 4.0 );
    
    // distance and bounding box
    float dis = sdTriangle(p, v1, v2, v3 );
    vec4  box = aabbTriangle( v1, v2, v3 );

    // draw shape
    vec3 col = (dis>0.0) ? vec3(0.15) : vec3(0.65);
	col += 0.03*sin(dis*150.0);
	col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,1.5*px,abs(dis)-0.002) );

    // draw bounding box
    {
    vec2 cen = 0.5*(box.zw+box.xy);
    vec2 rad = 0.5*(box.zw-box.xy);
    float d = abs(max(abs(p.x-cen.x)-rad.x,
                      abs(p.y-cen.y)-rad.y))-0.002;
    col = mix(col, vec3(0.2,0.7,1.0), smoothstep(1.5*px,0.0,d));
    }
    
	fragColor = vec4(col, 1.0);
}

