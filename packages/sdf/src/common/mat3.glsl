mat3 makeRotation(float rad){
    float c=cos(rad);
    float s=sin(rad);
    return mat3(
        c,s,0,
        -s,c,0,
        0,0,1
    );
}
mat3 makeTranslate(vec2 tranlate){
    return mat3(
        1,0,0,
        0,1,0,
        tranlate,1
    );
}
mat3 makeScale(vec2 s){
    return mat3(
        s.x,0,0,
        0,s.y,0,
        0,0,1
    );
}
mat3 makeTRS(vec2 s,float r,vec2 t){
    float c1=cos(r);
    float s1=sin(r);
    return mat3(
        c1*s.x,s1*s.x,0,
        -s1*s.y,c1*s.y,0,
        t.x,t.y,1
    );
}
