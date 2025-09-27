
// https://iquilezles.org/articles/functions/
// 从n超始到m
// x在m之间
float almostIdentity( float x, float m, float n )
{
    if( x>m ) return x;
    float a = 2.0*n - m;
    float b = 2.0*m - 3.0*n;
    float t = x/m;
    return (a*t + b)*t*t + n;
}
float almostIdentity( float x, float n )
{
    return sqrt(x*x+n*n);
}
float integralSmoothstep( float x, float T )
{
    if( x>T ) return x - T/2.0;
    return x*x*x*(1.0-x*0.5/T)/T/T;
}
float expImpulse( float x, float k )
{
    float h = k*x;
    return h*exp(1.0-h);
}

float quaImpulse( float k, float x )
{
    return 2.0*sqrt(k)*x/(1.0+k*x*x);
}
float polyImpulse( float k, float n, float x )
{
    return (n/(n-1.0))*
           pow((n-1.0)*k,1.0/n)*
           x/(1.0+k*pow(x,n));
}
float expSustainedImpulse( float x, float f, float k )
{
    float s = max(x-f,0.0);
    return min( x*x/(f*f), 1.0+(2.0/f)*s*exp(-k*s));
}
#define PI 3.149576
float sinc( float x, float k )
{
    float a = PI*(k*x-1.0);
    return sin(a)/a;
}
float trunc_fallof( float x, float m )
{
    x /= m;
    return (x-2.0)*x+1.0;
}

float almostUnitIdentity( float x )
{
    return x*x*(2.0-x);
}

float gain( float x, float k ) 
{
    float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
    return (x<0.5)?a:1.0-a;
}

float parabola( float x, float k )
{
    return pow( 4.0*x*(1.0-x), k );
}
float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float pcurve( float x, float a, float b )
{
    float k = pow(a+b,a+b)/(pow(a,a)*pow(b,b));
    return k*pow(x,a)*pow(1.0-x,b);
}
float cubicPulse( float c, float w, float x )
{
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

float expStep( float x, float n )
{
    return exp2( -exp2(n)*pow(x,n) );
}
float rationalBump( float x, float k )
{
    return 1.0/(1.0+k*x*x);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {

	vec2 uv =fragCoord.xy;
    uv.y=iResolution.y-uv.y;

    vec3 color=vec3(0,0,0);
    vec2 t=uv/iResolution.xy;
    float siny=sin(radians(t.x*360.*5.));
    // 将sin {-1,1}之间转换为 {0,1}之间
    float k=siny*0.5+0.5;
    float y2=almostIdentity(t.x,1.,0.)*iResolution.y;
    y2=integralSmoothstep(t.x,.5)*iResolution.y;
    y2=expStep(t.x,2.)*iResolution.y;
    
    float y=k*100.+200.;
    if(abs(uv.y-y)<3.){
        //color.r=1.;
    }
    if(abs(fragCoord.y-y2)<1.){
        color.r=1.;
    }
	fragColor = vec4(color, 1.0 );

}