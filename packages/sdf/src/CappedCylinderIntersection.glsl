// The MIT License
// Copyright © 2016 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Intersection of a ray and a capped cylinder oriented in an arbitrary direction
//
// List of ray-surface intersectors at https://www.shadertoy.com/playlist/l3dXRf
//
// and https://iquilezles.org/articles/intersectors
//
// Other cylinder functions:
//   Cylinder intersection: https://www.shadertoy.com/view/4lcSRn
//   Cylinder bounding box: https://www.shadertoy.com/view/MtcXRf
//   Cylinder distance:     https://www.shadertoy.com/view/wdXGDr


vec4 iCylinder( in vec3 ro, in vec3 rd, in vec3 pa, in vec3 pb, float ra ) 
{
    vec3  ba = pb - pa;
    vec3  oc = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoc = dot(ba,oc);
    
    float k2 = baba            - bard*bard;
    float k1 = baba*dot(oc,rd) - baoc*bard;
    float k0 = baba*dot(oc,oc) - baoc*baoc - ra*ra*baba;
    
    /*
    // in case you really need to handle parallel raycasts
    if( k2==0.0 )
    {
        float ta = -dot(ro-pa,ba)/bard;
        float tb = ta + baba/bard;
        
        vec4 pt = (bard>0.0) ? vec4(pa,-ta) : vec4(pb,tb);
        
        vec3 q = ro + rd*abs(pt.w) - pt.xyz;
        if( dot(q,q)>ra*ra ) return vec4(-1.0);
        
        return vec4( abs(pt.w), sign(pt.w)*ba/sqrt(baba) );
    }
    */
    
    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return vec4(-1.0);
    h = sqrt(h);
    float t = (-k1-h)/k2;

    // body
    float y = baoc + t*bard;
    if( y>0.0 && y<baba ) return vec4( t, (oc+t*rd - ba*y/baba)/ra );
    
    // caps
    t = ( ((y<0.0) ? 0.0 : baba) - baoc)/bard;
    if( abs(k1+k2*t)<h ) return vec4( t, ba*sign(y)/sqrt(baba) );

    return vec4(-1.0);
}

// cylinder normal at point p
vec3 nCylinder( in vec3 p, in vec3 a, in vec3 b, in float ra )
{
    // body
    vec3  pa = p - a;
    vec3  ba = b - a;
    float baba = dot(ba,ba);
    float paba = dot(pa,ba);
    return (pa - ba*paba/baba)/ra;
}

// same as above, but specialized to the Y axis
vec4 iCylinderVertical( in vec3 ro, in vec3 rd, float he, float ra )
{
    float k2 = 1.0        - rd.y*rd.y;
    float k1 = dot(ro,rd) - ro.y*rd.y;
    float k0 = dot(ro,ro) - ro.y*ro.y - ra*ra;
    
    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return vec4(-1.0);
    h = sqrt(h);
    float t = (-k1-h)/k2;

    // body
    float y = ro.y + t*rd.y;
    if( y>-he && y<he ) return vec4( t, (ro + t*rd - vec3(0.0,y,0.0))/ra );
    
    // caps
    t = ( ((y<0.0)?-he:he) - ro.y)/rd.y;
    if( abs(k1+k2*t)<h ) return vec4( t, vec3(0.0,sign(y),0.0) );

    return vec4(-1.0);
}

vec3 pattern( in vec2 uv )
{
    vec3 col = vec3(0.6);
    col += 0.4*smoothstep(-0.01,0.01,cos(uv.x*0.5)*cos(uv.y*0.5)); 
    col *= smoothstep(-1.0,-0.98,cos(uv.x))*smoothstep(-1.0,-0.98,cos(uv.y));
    return col;
}

#define AA 3

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // camera movement	
	float an = 0.5*iTime;
	vec3 ro = vec3( 1.0*cos(an), 0.4, 1.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    vec3 tot = vec3(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        #else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        #endif

	    // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

        const vec3  capA = vec3(-0.3,-0.1,-0.1);
        const vec3  capB = vec3(0.3,0.1,0.4);
        const float capR = 0.2;
        
	    vec3 col = vec3(0.08)*(1.0-0.3*length(p)) + 0.02*rd.y;

        vec4 tnor = iCylinder( ro, rd, capA, capB, capR );
        if( tnor.x>0.0 )
        {
            float t = tnor.x;
            vec3  pos = ro + t*rd;
            vec3  nor = tnor.yzw;
            vec3  lig = normalize(vec3(0.7,0.6,0.3));
            vec3  hal = normalize(-rd+lig);
            float dif = clamp( dot(nor,lig), 0.0, 1.0 );
            float amb = clamp( 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0)), 0.0, 1.0 );
            float occ = 0.5 + 0.5*nor.y;

            vec3 w = normalize(capB-capA);
            vec3 u = normalize(cross(w,vec3(0,0,1)));
            vec3 v = normalize(cross(u,w) );
            vec3 q = (pos-capA)*mat3(u,v,w);
            col = pattern( vec2(12.0,64.0)*vec2(atan(q.y,q.x),q.z) );


            col *= vec3(0.2,0.3,0.4)*amb*occ + vec3(1.0,0.9,0.7)*dif;
            col += 0.4*pow(clamp(dot(hal,nor),0.0,1.0),12.0)*dif;
        }

        col = sqrt( col );
	
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

    // dither to remove banding in the background
    tot += fract(sin(fragCoord.x*vec3(13,1,11)+fragCoord.y*vec3(1,7,5))*158.391832)/255.0;


    fragColor = vec4( tot, 1.0 );
}