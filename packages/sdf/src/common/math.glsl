

// 返回-pi-pi
float atan2(float y,float x){
    vec2 v=normalize(vec2(x,y));
    float angle=acos(v.x);
    return v.y>=0.?angle:-angle;
}

// 平滑最小值

// // exponential
// float smin( float a, float b, float k )
// {
//     k *= 1.0;
//     float r = exp2(-a/k) + exp2(-b/k);
//     return -k*log2(r);
// }
// // root
// float smin( float a, float b, float k )
// {
//     k *= 2.0;
//     float x = b-a;
//     return 0.5*( a+b-sqrt(x*x+k*k) );
// }
// // sigmoid
// float smin( float a, float b, float k )
// {
//     k *= log(2.0);
//     float x = b-a;
//     return a + x/(1.0-exp2(x/k));
// }
// // quadratic polynomial
// float smin( float a, float b, float k )
// {
//     k *= 4.0;
//     float h = max( k-abs(a-b), 0.0 )/k;
//     return min(a,b) - h*h*k*(1.0/4.0);
// }
// // cubic polynomial
// float smin( float a, float b, float k )
// {
//     k *= 6.0;
//     float h = max( k-abs(a-b), 0.0 )/k;
//     return min(a,b) - h*h*h*k*(1.0/6.0);
// }
// // quartic polynomial
// float smin( float a, float b, float k )
// {
//     k *= 16.0/3.0;
//     float h = max( k-abs(a-b), 0.0 )/k;
//     return min(a,b) - h*h*h*(4.0-h)*k*(1.0/16.0);
// }
// // circular
// float smin( float a, float b, float k )
// {
//     k *= 1.0/(1.0-sqrt(0.5));
//     float h = max( k-abs(a-b), 0.0 )/k;
//     return min(a,b) - k*0.5*(1.0+h-sqrt(1.0-h*(h-2.0)));
// }
// // circular geometrical
// float smin( float a, float b, float k )
// {
//     k *= 1.0/(1.0-sqrt(0.5));
//     return max(k,min(a,b)) -
//            length(max(k-vec2(a,b),0.0));
// }

// 随机一个整数
int randomInteger(int _min,int _max,float t){
    float n=fract(sin(t)*433.54313);
    int v=int(float(_max-_min)*n);
    return _min+v;
}
float cross1x2(vec2 a,vec2 b){
    return a.x*b.y-a.y*b.x;
}

float smin( float a, float b, float k, int type )
{
    // Quadratic
    if( type==0 )
    {
        k *= 4.0;
        float h = max(k-abs(a-b),0.0);
        return min(a, b) - h*h*0.25/k;
    }
    // Cubic
    if( type==1 )
    {
        k *= 6.0;
        float h = max( k-abs(a-b), 0.0 )/k;
        return min( a, b ) - h*h*h*k*(1.0/6.0);
    }
    // Quartic
    if( type==2 )
    {
        k *= 16.0/3.0;
        float h = max( k-abs(a-b), 0.0 )/k;
        return min( a, b ) - h*h*h*(4.0-h)*k*(1.0/16.0);
    }
    // Circular
    if( type==3 )
    {
        k *= 1.0/(1.0-sqrt(0.5));
        float h = max( k-abs(a-b), 0.0 )/k;
        return min(a,b) - k*0.5*(1.0+h-sqrt(1.0-h*(h-2.0)));
    }
    // Exponential
    if( type==4 )
    {
        return -k*log2( exp2( -a/k ) + exp2( -b/k ) );
    }
    // Sigmoid
    if( type==5 )
    {
        k *= log(2.0);
        float x = b-a;
        return a + x/(1.0-exp2(x/k));
    }
    // SquareRoot
    if( type==6 )
    {
        k *= 2.0;
        float x = b-a;
        return 0.5*( a+b-sqrt(x*x+k*k) );
    }
    // Circular Geometrical
    if( type==7 )
    {
        k *= 1.0/(1.0-sqrt(0.5));
        return max(k,min(a,b))-length(max(vec2(k-a,k-b), 0.0));
    }
}

// 计算10进制值的位数长度
int countDigits(float num) {
    // 取绝对值，防止负数情况
    num = abs(num);
    
    // 如果是 0，直接返回 1 位
    if (num < 1.0) {
        return 1;
    }
    // 计数器初始化为 0
    int digits = 0;
    
    // 循环除以 10，直到 num 小于 1
    while (num >= 1.0) {
        num /= 10.0;
        digits++;
    }
    return digits;
}

// 计算10进制值的位数长度
int countDigits2(float num) {
    // 取绝对值，防止负数情况
    num = abs(num);
    if(num<10.){
        return 1;
    }
    int digits=int(floor(log(num)/log(10.))+1.);
    return digits;
}
// 计算小数长度
int countFractionalDigits(float num, int maxDigits) {
    num = abs(num); // 取绝对值，确保处理正数
    int count = 0;
    num = num - floor(num); // 提取小数部分

    // 如果没有小数部分，直接返回0
    if (num == 0.0) return 0;

    for (int i = 0; i < maxDigits; i++) {
        num *= 10.0; // 小数部分向左移一位
        float intPart = floor(num); // 取整数部分
        float fracPart = num - intPart; // 更新小数部分

        // 如果剩下的部分为0，则结束
        if (fracPart == 0.0) {
            return count + 1; // 当前位也需要计入
        }

        count++; // 增加计数
        num = fracPart; // 更新为新的小数部分
    }
    
    return count; // 返回最大精度范围内的位数
}
