

// 点与段线距离
vec3 linePointDistance(vec2 a,vec2 b,vec2 p,float lineWidth){
    vec2 ab=b-a;
    vec2 dir=normalize(ab);
    float projLen=dot(p,dir);
    vec2 proj=a+dir*projLen;
    float dist=length(p-proj);
    if(dist<=lineWidth){
        return vec3(proj,1);
    }
    return vec3(0);
}

// 如果存在交点
// 参数化求u和t
// x1+t(x2-x1)=x3+u(x4-x3)
// y1+t(y2-y1)=y3+u(y4-y3)
vec3 lineLineIntersection(vec2 a,vec2 b,vec2 c,vec2 d){
     vec2 ab=b-a;
     vec2 cd=d-c;
     float det=cross1x2(ab,cd);
     if(det==0.){
        return vec3(0);
     }
     vec2 ac=c-a;
     float u=cross1x2(ac,ab)/det;
     float v=cross1x2(ac,cd)/det;
     if(u<0.||v<0.||u>1.||v>1.){
        return vec3(0);
     }
     return vec3(a+ab*v,1);
}
vec3 lineLineIntersection(vec2 a,vec2 b,vec2 c,vec2 d,float strokeWidth){
     vec3 result=lineLineIntersection(a,b,c,d);
     if(result.z<=0.){
        return vec3(0);
     }
     vec2 dir=normalize(b-a);
     vec2 intersectionPoint=result.xy;
     intersectionPoint=intersectionPoint-dir*strokeWidth*0.5;
     return vec3(intersectionPoint,1);
}
vec3 lineLineIntersection2(vec2 lineA,vec2 lineB,vec2 lineC,vec2 lineD){
     vec2 ab=lineB-lineA;
     vec2 cd=lineD-lineC;
     // Ax+By+C=0 
     // A+B+C=0 A2+B2+C2=0   
     //斜截式 y=kx+b  kx-y+b = 0  y-kx=b;   
     //点斜式 y-y0=(x-x0)k (y-y0)/(x-x0)=k 斜率
     // y=(x-x0)k+y0  代入 y-kx=b  (x-x0)k+y0-kx=b y0-x0k=b
     //  Ax+By+C=0  
    //   Dx+Ey+F=0 
   
     float k=ab.y/ab.x;
     float b=lineA.y-lineA.x*k;
     float A=k;
     float B=-1.;
     float C=b;

     float k2=cd.y/cd.x;
     float b2=lineC.y-lineC.x*k2;
     float D=k2;
     float E=-1.;
     float F=b2;

     /**
        解法一
        1.
            Ax+By=-C
            Dx+Ey=-F
        //使用代入法或消元法求解：消去y ,求x
        2.
         乘以E
         E(Ax+By)=C*E
         EAx+EBy=-CE
         乘以B
         B(Dx+Ey)=F*B
         BDx+BEy=-FB

         3.加减消元
         求x:
          (EAx+EBy)-(BDx+BEy)=-CE+FB
          x(EA-BD)+y(EB-BE)=-CE+FB   // EB-BE=0
           x(EA-BD)=-CE+FB
           x=(-CE+FB)/(EA-BD)
           求y:
           Ax+By+C=0 
           By=-C-Ax
           y=(-C-Ax)/B   

    */ 
     float x=(-C*E+F*B)/(E*A-B*D);
     float y=(-C-A*x)/B;

    /**解法2:
        y=kx+b    kx-y+b=0
        y=k2x+b2  k2x-y+b2=0
        方程相等：
         kx+b=k2x+b2
         kx=k2x+b2-b
         kx-k2x=b2-b
         x(k-k2)=b2-b
         x=(b2-b)/(k-k2)
         求y:
         y=kx+b
         y=k*(b2-b)/(k-k2)+b

    */
    //  x=(b2-b)/(k-k2);
    //  y=(k*(b2-b)/(k-k2))+b;

     if(x<min(lineA.x,lineB.x)||
     x>max(lineA.x,lineB.x)||
     y<min(lineA.y,lineB.y)||
     y>max(lineA.y,lineB.y)||
     x<min(lineC.x,lineD.x)||
     x>max(lineC.x,lineD.x)||
     y<min(lineC.y,lineD.y)||
     y>max(lineC.y,lineD.y
     )){
        return vec3(0);
     }

     return vec3(x,y,1);
}
vec3 lineCircleIntersection(vec2 a,vec2 b,vec2 center,float r){
 
    // c-a=ca 
    // b-a=ba   t=dot(ca,ba)/dot(ba,ba)  proj=a+b*t
    // proj-ca=;
    vec2 ab=b-a;
    vec2 ac=center-a;
    float t=dot(ac,ab)/dot(ab,ab);
    vec2 proj=ab*t;
    vec2 bc=proj-ac;
    float dist=dot(bc,bc);
    float rr=r*r;
    if(dist<=rr){
        vec2 intersection;
        float d=length(proj)-sqrt(rr-dist);
        intersection=a+normalize(ab)*d;
        return vec3(intersection,1);
    }
    return vec3(0);
}
vec3 lineCircleIntersection2(vec2 a,vec2 b,vec2 center,float r){
    // 射线方程：p(t)=p+td
    // 圆的方程: length(p-c)=r
    // 点乘分解 length(p-c)=r =sqrt(dot(p-c))=r = dot(p-c)=r*r
    // r^2=dot(p-c)=(px-cx)*(px-cx)+(py-cy)*(py-cy)=
    //(px-cx)^2+(py-cy)^2=(px^2-2pxcx+cx^2)+(py^2-2pycy+cy^2)=px^2+py^2-2(pxcx+pycy)+cx^2+cy^2=p•p-2p•c+c•c
    
    // 代入 p+td-c=r*r
    //cos =dot(a^,b^) =a/||a|| • b/||b||=a.x/||a||*b.x/||b||+a.y/||a||*b.y/||b||
    // cos=a•b/||a||/||b||
    // k=cos*||a|| = a•b/||b||
    // proj=k*b^
    
    vec2  dir=normalize(b-a);
    vec2  ac=center-a;// e边  ||e||^2-||a||^2=||b||^2
    float a_len=dot(ac,dir);
    vec2  proj=dir*a_len;
    float dist=length(proj-ac);
    if(dist<=r){
         float a_square=a_len*a_len;
        float e_square=dot(ac,ac);
        float b_square=e_square-a_square;
        float f_square=r*r-b_square;
        float t=a_len-sqrt(f_square);
        return vec3(a+dir*t,1);
    }
    return vec3(0);
}

vec3 lineRectIntersection(vec2 a,vec2 b,vec2 center,vec2 size){

    vec2 leftTop=center+vec2(-size.x,size.y);
    vec2 rightTop=center+vec2(size.x,size.y);
    
    vec2 leftBottom=center+vec2(-size.x,-size.y);
    vec2 rightBottom=center+vec2(size.x,-size.y);


    vec2 direction=normalize(b-a);
    vec2 t1 = (leftTop-a)/direction;
    vec2 t2 = (rightBottom-a)/direction;


    float tMin = max(min(t1.x, t2.x), min(t1.y, t2.y));
    float tMax = min(max(t1.x, t2.x), max(t1.y, t2.y));

    // 判断是否相交
     if (tMin <= tMax && tMax >= 0.) {
            // 计算相交点坐标
            return vec3(a+direction*tMin,1);
     } 
    
    return vec3(0);
}