// The MIT License
// Copyright © 2019 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Bounding box of an arbitrarily oriented cone. 
//
// More bounding boxes:
//  https://www.shadertoy.com/playlist/DXyczw
// and
//   https://iquilezles.org/articles/bboxes3d/
//
// Other cone functions:
//   Cone bbox:         https://www.shadertoy.com/view/WdjSRK
//   Cone distance:     https://www.shadertoy.com/view/tsSXzK
//   Cone intersection: https://www.shadertoy.com/view/llcfRf


#define AA 3

struct bound3
{
    vec3 mMin;
    vec3 mMax;
};
    
//---------------------------------------------------------------------------------------
// bounding box for a cone (https://iquilezles.org/articles/diskbbox)
//---------------------------------------------------------------------------------------
bound3 aabbCone( in vec3 pa, in vec3 pb, in float ra, in float rb )
{
    vec3 a = pb - pa;
    vec3 e = sqrt(1.0-a*a/dot(a,a));
    vec3 ea = e*ra;
    vec3 eb = e*rb;
    return bound3( min(pa-ea, pb-eb),
                   max(pa+ea, pb+eb) );
}

// https://iquilezles.org/articles/intersectors/
float dot2( in vec3 v ) { return dot(v,v); }
vec4 iCappedCone( in vec3  ro, in vec3  rd, 
                  in vec3  pa, in vec3  pb, 
                  in float ra, in float rb )
{
    vec3  ba = pb - pa;
    vec3  oa = ro - pa;
    vec3  ob = ro - pb;
    
    float m0 = dot(ba,ba);
    float m1 = dot(oa,ba);
    float m2 = dot(ob,ba); 
    float m3 = dot(rd,ba);

    //caps
         if( m1<0.0 ) { if( dot2(oa*m3-rd*m1)<(ra*ra*m3*m3) ) return vec4(-m1/m3,-ba*inversesqrt(m0)); }
    else if( m2>0.0 ) { if( dot2(ob*m3-rd*m2)<(rb*rb*m3*m3) ) return vec4(-m2/m3, ba*inversesqrt(m0)); }
    
    // body
    float rr = ra - rb;
    float hy = m0 + rr*rr;
    float m4 = dot(rd,oa);
    float m5 = dot(oa,oa);
    
    float k2 = m0*m0    - m3*m3*hy;
    float k1 = m0*m0*m4 - m1*m3*hy + m0*ra*(rr*m3*1.0        );
    float k0 = m0*m0*m5 - m1*m1*hy + m0*ra*(rr*m1*2.0 - m0*ra);
    
    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return vec4(-1.0);

    float t = (-k1-sqrt(h))/k2;

    float y = m1 + t*m3;
    if( y>0.0 && y<m0 ) 
    {
        return vec4(t, normalize(m0*(m0*(oa+t*rd)+rr*ba*ra)-ba*hy*y));
    }
    
    return vec4(-1.0);
}

// ray-box intersection
// https://iquilezles.org/articles/intersectors/
vec2 iBox( in vec3 ro, in vec3 rd, in vec3 cen, in vec3 rad ) 
{
    vec3 m = 1.0/rd;
    vec3 n = m*(ro-cen);
    vec3 k = abs(m)*rad;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
	float tN = max( max( t1.x, t1.y ), t1.z );
	float tF = min( min( t2.x, t2.y ), t2.z );
	if( tN > tF || tF < 0.0) return vec2(-1.0);
	return vec2( tN, tF );
}

float hash1( in vec2 p )
{
    return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 tot = vec3(0.0);
    
#if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (2.0*(fragCoord+o)-iResolution.xy)/iResolution.y;
#else    
        vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
#endif

        // camera position
        vec3 ro = vec3( 1.0, 0.6, 1.5 );
        vec3 ta = vec3( 0.0, 0.0, 0.0 );
        // camera matrix
        vec3 ww = normalize( ta - ro );
        vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
        vec3 vv = normalize( cross(uu,ww));
        // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 2.0*ww );

        // cylidner animation
        float time = iTime;
        vec3  c_pa = -0.2 + 0.3*sin(time*vec3(1.23,1.41,1.07)+vec3(5.0,0.0,3.0));
        vec3  c_pb =  0.2 + 0.3*sin(time*vec3(1.11,1.27,1.47)+vec3(4.0,3.0,1.0));
        float c_ra =  0.3 + 0.2*sin(time*1.3+0.5);
        float c_rb =  0.3 + 0.2*sin(time*1.4+2.5);

        // render
        vec3 col = vec3(0.2)*(1.0-0.3*length(p));

        // raytrace
        vec4 tnor = iCappedCone( ro, rd, c_pa, c_pb, c_ra, c_rb );
        float t = tnor.x;
        float tmin = 1e10;
        if( t>0.0 )
        {
            tmin = t;
            // shading/lighting	
            vec3 pos = ro + t*rd;
            vec3 nor = tnor.yzw;
            float dif = clamp( dot(nor,vec3(0.5,0.9,0.2)), 0.0, 1.0 );
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
            col = sqrt( vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif );
            //col *= vec3(1.0,0.8,0.4);
        }


        // compute bounding box of cylinder
        bound3 bbox = aabbCone( c_pa, c_pb, c_ra, c_rb );

        // raytrace bounding box
        vec3 bcen = 0.5*(bbox.mMin+bbox.mMax);
        vec3 brad = 0.5*(bbox.mMax-bbox.mMin);
        vec2 tbox = iBox( ro, rd, bcen, brad );
        if( tbox.x>0.0 )
        {
            // back face
            if( tbox.y < tmin )
            {
                vec3 pos = ro + rd*tbox.y;
                vec3 e = smoothstep( brad-0.02, brad-0.01, abs(pos-bcen) );
                float al = 1.0 - 0.9*(1.0-e.x*e.y)*(1.0-e.y*e.z)*(1.0-e.z*e.x);
                col = mix( col, vec3(0.2,0.7,1.0), al );
            }
            // front face
            if( tbox.x < tmin )
            {
                vec3 pos = ro + rd*tbox.x;
                vec3 e = smoothstep( brad-0.02, brad-0.01, abs(pos-bcen) );
                float al = 1.0 - 0.9*(1.0-e.x*e.y)*(1.0-e.y*e.z)*(1.0-e.z*e.x);
                col = mix( col, vec3(0.2,0.7,1.0), al );
            }
        }

        // no gamma required here, it's done in line 118

        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif

    // dithering
    tot += ((hash1(fragCoord.xy)+hash1(fragCoord.yx+13.1))/2.0 - 0.5)/256.0;


	fragColor = vec4( tot, 1.0 );
}
bound3 aabbSegment( in vec3 pa, in vec3 pb, in float ra )
{
    vec3 a = pb - pa;
    return bound3( min(pa, pb) - ra,
                   max(pa, pb) + ra );
}

bound3 aabbCone( in vec3 pa, in vec3 pb, in float ra, in float rb )
{
    vec3 a = pb - pa;
    vec3 e = sqrt(1.0-a*a/dot(a,a));
    vec3 ea = e*ra;
    vec3 eb = e*rb;
    return bound3( min(pa-ea, pb-eb),
                   max(pa+ea, pb+eb) );
}


bound3 aabbCylinder( in vec3 pa, in vec3 pb, in float ra )
{
    vec3 a = pb - pa;
    vec3 e = ra*sqrt(1.0-a*a/dot(a,a));
    return bound3( min(pa, pb)-e,
                   max(pa, pb)+e );
}
bound3 aabbDisk( in vec3 ce, in vec3 no, in float ra )
{
    vec3 e = ra*sqrt(1.0-no*no);
    return bound3(ce-e, ce+e);
}
bound3 aabbEllipse( in vec3 ce, in vec3 au, in vec3 av )
{
    vec3 e = sqrt( au*au + av*av );
    return bound3( ce-e, ce+e );
}

bound3 aabbBezier( in vec3 p0, in vec3 p1, in vec3 p2 )
{
    vec3 a = p0-2.0*p1+p2;
    vec3 b = p1-p0;
    vec3 t = clamp(-b/a,0.0,1.0);
    vec3 q = p0+t*(2.0*b+t*a);
    return bound3(min(min(p0,p2),q),
                  max(max(p0,p2),q));
}

bound3 aabbBezier( in vec3 p0, in vec3 p1, in vec3 p2, in vec3 p3 )
{
    vec3 c  = -p0+    p1;
    vec3 b  =  p0-2.0*p1+    p2;
    vec3 a  = -p0+3.0*p1-3.0*p2+p3;
    vec3 g  = sqrt(max(b*b-a*c,0.0));
    vec3 t1 = clamp((-b-g)/a,0.0,1.0);
    vec3 t2 = clamp((-b+g)/a,0.0,1.0);
    vec3 q1 = p0+t1*(3.0*c+t1*(3.0*b+t1*a));
    vec3 q2 = p0+t2*(3.0*c+t2*(3.0*b+t2*a));
    return bound3(min(min(p0,p3),min(q1,q2)),
                  max(max(p0,p3),max(q1,q2)));
}