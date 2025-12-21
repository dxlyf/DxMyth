#iChannel7 "file://../../../iquilezles/images/print.png"

#iChannel7::MinFilter "NearestMipMapLinear" // Nearest Linear NearestMipMapLinear NearestMipMapNearest LinearMipMapNearest  LinearMipMapLinear 
#iChannel7::MagFilter "Linear" // Nearest Linear
#iChannel7::WrapMode "Repeat" // Clamp Repeat Mirror


#define  NUM_ASCII_MAP int[](48,49,50,51,52,53,54,55,56,57)

//['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'] 
// 65-90 A-Z 
// 97-122 a-z
// 91 [ 92
// 48-57 0-9 
// 58 :  44 ,  x 120 X 88 y 121 z 122 Y 89 Z 90
float print( in float sdf, inout vec2 p, in int str[200])
{
    if( p.y<0.0|| p.y>1.0 ) return sdf;
    float d = 1e20;
    for( int i=0; i<str.length(); i++ )
    {
        int c = str[i];
        if( c==0 ) break;
        if( p.x>0.0 && p.x<1.0 )
        {
            vec2 q = p/16.0;
            d = min(d,textureGrad( iChannel7, vec2(c,15-c/16)/16.0+q, dFdx(q), dFdy(q) ).w);
        }
        p.x -= 0.5;
    }
    return min(d,sdf);
}


vec3 drawText(vec3 col,vec2 p,int str[200]){
    const float text_scale = 0.15;
    vec2 q = p/text_scale;
    float text=1e20;
    text=print(text,q,str);
    col = mix(col,vec3(0.0),1.0-smoothstep( 0.06,0.08,text-0.5));
    col = mix(col,vec3(1.0),1.0-smoothstep(-0.01,0.01,text-0.5));
    return col;
}
vec3 drawText(vec3 col,vec2 p,vec2 v,int maxDecimalLen){

    int i=0;
    int str[200];
    int integerLen;// 整数部分长度
    int decimalLen;// 小数部分长度
   // int maxDecimalLen=5;// 小数显示最大长度

    str[i++]=120;
    str[i++]=58;
   
    float s=v.x<0.?-1.:1.;// 符号
    // 如果是负数
    if(s==-1.){
        str[i++]=45;
    }
    // 计算值的位数
    integerLen=countDigits(v.x);
    float lastValue=abs(v.x);
    for(int k=integerLen-1;k>=0;k--){
         float decimalBase=pow(10.,float(k));
         int curValue=int(lastValue/decimalBase);// 读取每个位置上的数字
         str[i++]=NUM_ASCII_MAP[curValue];
         lastValue=lastValue-float(curValue)*decimalBase;
    }
    // 计算小数位
    if(lastValue>0.){
        str[i++]=46;// 小数点
        lastValue=abs(lastValue);
        for(int k=0;k<maxDecimalLen;k++){
            lastValue*=10.;
            float intPart=floor(lastValue);
            float fractPart=lastValue-intPart;
            if(fractPart<=0.){
                break;
            }
             str[i++]=NUM_ASCII_MAP[int(intPart)];
            lastValue=fractPart;
        }
    }

    str[i++]=44;
    str[i++]=121;
    str[i++]=58;
    // 计算值的位数
    integerLen=countDigits(v.y);
    lastValue=abs(v.y);
    for(int k=integerLen-1;k>=0;k--){
         float decimalBase=pow(10.,float(k));
         int curValue=int(lastValue/decimalBase);// 读取每个位置上的数字
         str[i++]=NUM_ASCII_MAP[curValue];
         lastValue=lastValue-float(curValue)*decimalBase;
    }
     // 计算小数位
    if(lastValue>0.){
         str[i++]=46;
         lastValue=abs(lastValue);
        for(int k=0;k<maxDecimalLen;k++){
            lastValue*=10.;
            float intPart=floor(lastValue);
            float fractPart=lastValue-intPart;
     
            if(fractPart<=0.0){
                break;
            }
            str[i++]=NUM_ASCII_MAP[int(intPart)];
            lastValue=fractPart;
        }
    }
    return drawText(col,p,str);
}
    // ecamples 
    // // draw text
    // {
    //     const float text_scale = 0.15;
    //     vec2 q = (p-vec2(-0.85,-0.95))/text_scale;
    //     float text = 1e20;
    //          if( tile==0 ){text = print(text,q,int[](81,117, 97,100,114,97,116,105,99,0,0,0));}
    //     else if( tile==1 ){text = print(text,q,int[](67,117, 98,105,99,0,0,0,0,0,0,0));}
    //     else if( tile==2 ){text = print(text,q,int[](81,117, 97,114,116,105,99,0,0,0,0,0));}
    //     else if( tile==3 ){text = print(text,q,int[](67,105,114,99,117,108,97,114,0,0,0,0));}
    //     else if( tile==4 ){text = print(text,q,int[](69,120,112,111,110,101,110,116,105,97,108,0));}
    //     else if( tile==5 ){text = print(text,q,int[](83,105,103,109,111,105,100,0,0,0,0,0));}
    //     else if( tile==6 ){text = print(text,q,int[](83,113,117,97,114,101,32,114,111,111,116,0));}
    //     else if( tile==7 ){text = print(text,q,int[](67,105,114,99,117,108,97,114,32,0,0,0));
    //                        text = print(text,q,int[](71,101,111,109,101,116,114,105,99,97,108,0));}
    //     col = mix(col,vec3(0.0),1.0-smoothstep( 0.06,0.08,text-0.5));
    //     col = mix(col,vec3(1.0),1.0-smoothstep(-0.01,0.01,text-0.5));
    // }
 
