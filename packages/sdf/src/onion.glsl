// The MIT License
// Copyright © 2018 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// When carving interiors of shapes ir when you want to give thickness to
// the object boundaries, a way to do it is to carve our a smaller copy of
// the object. That is very expensive though (twice as expensie!). There's
// a method that allows you ro create onions shells of any shape that is
// inexpensive and that returns an exact euclidean distance to the new
// generated shape.

// Related techniques:
//
// Elongation  : https://www.shadertoy.com/view/Ml3fWj
// Rounding    : https://www.shadertoy.com/view/Mt3BDj
// Onion       : https://www.shadertoy.com/view/MlcBDj
// Metric      : https://www.shadertoy.com/view/ltcfDj
// Combination : https://www.shadertoy.com/view/lt3BW2
// Repetition  : https://www.shadertoy.com/view/3syGzz
// Extrusion2D : https://www.shadertoy.com/view/4lyfzw
// Revolution2D: https://www.shadertoy.com/view/4lyfzw
//
// More information here: https://iquilezles.org/articles/distfunctions



//-------------------------------------------------

float onion( in float d, in float h )
{
    return abs(d)-h;
}

//-------------------------------------------------

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdSphere( in vec3 p, in float r )
{
    return length(p)-r;
}

//---------------------------------

float map(in vec3 pos)
{
    float d = 1e10;
    

    // sphere
    {
    vec3 q = pos - vec3(-3.0,0.0,-1.0);
    d = min( d, sdSphere( q.yzx, 0.4 ) );
    }
    
    // double onion sphere
    {
    vec3 q = pos - vec3(-3.0,0.0,1.0);
    d = min( d, onion(onion( sdSphere( q.yzx, 0.4 ), 0.05 ), 0.02) );
    }

    // cylinder
    {
    vec3 q = pos - vec3(-1.0,0.0,-1.0);
    d = min( d, sdCappedCylinder( q, vec2(0.4,0.2) ) );
    }
    
    // single onion cylinder
    {
    vec3 q = pos - vec3(-1.0,0.0,1.0);
    d = min( d, onion( sdCappedCylinder( q, vec2(0.4,0.2) ), 0.03) );
    }

    // torus
    {
    vec3 q = pos - vec3(1.0,0.0,-1.0);
    d = min( d, sdTorus( q, vec2(0.4,0.1) ) );
    }
    
    // single onion torus
    {
    vec3 q = pos - vec3(1.0,0.0,1.0);
    d = min( d, onion( sdTorus( q, vec2(0.4,0.1) ), 0.03) );
    }

    // torus
    {
    vec3 q = pos - vec3(3.0,0.0,-1.0);
    d = min( d, sdTorus( q.xzy, vec2(0.5,0.2) ) );
    }
    
    // triple onion torus
    {
    vec3 q = pos - vec3(3.0,0.0,1.0);
    d = min( d, onion(onion(onion(sdTorus( q.xzy, vec2(0.5,0.2) ), 0.08), 0.04), 0.02) );
    }

    // cut it all in half so we can see the interiors
    d = max( d, pos.y );
    
    return d;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    const float ep = 0.0001;
    vec2 e = vec2(1.0,-1.0)*0.5773;
    return normalize( e.xyy*map( pos + e.xyy*ep ) + 
					  e.yyx*map( pos + e.yyx*ep ) + 
					  e.yxy*map( pos + e.yxy*ep ) + 
					  e.xxx*map( pos + e.xxx*ep ) );
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow( in vec3 ro, in vec3 rd, float tmin, float tmax, const float k )
{
	float res = 1.0;
    float t = tmin;
    for( int i=0; i<50; i++ )
    {
		float h = map( ro + rd*t );
        res = min( res, k*h/t );
        t += clamp( h, 0.02, 0.20 );
        if( res<0.005 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}


#define AA 2

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
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
 
        vec3 ro = vec3(0.0,3.0,6.0);
        vec3 rd = normalize(vec3(p-vec2(0.0,1.0),-2.0));

        float t = 5.0;
        for( int i=0; i<64; i++ )
        {
            vec3 p = ro + t*rd;
            float h = map(p);
            if( abs(h)<0.001 || t>10.0 ) break;
            t += h;
        }

        vec3 col = vec3(0.0);

        if( t<10.0 )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            vec3  lig = normalize(vec3(1.0,0.8,-0.2));
            float dif = clamp(dot(nor,lig),0.0,1.0);
            float sha = calcSoftshadow( pos, lig, 0.001, 1.0, 32.0 );
            float amb = 0.5 + 0.5*nor.y;
            col = vec3(0.05,0.1,0.15)*amb + 
                  vec3(1.00,0.9,0.80)*dif*sha;
        }

        col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	fragColor = vec4( tot, 1.0 );
}