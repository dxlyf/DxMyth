// 常用的辅助函数

// 计算4x4矩阵的行列式
float determinantImp(mat4 m) {
    return 
        m[0][3] * m[1][2] * m[2][1] * m[3][0] - m[0][2] * m[1][3] * m[2][1] * m[3][0] - m[0][3] * m[1][1] * m[2][2] * m[3][0] + m[0][1] * m[1][3] * m[2][2] * m[3][0] +
        m[0][2] * m[1][1] * m[2][3] * m[3][0] - m[0][1] * m[1][2] * m[2][3] * m[3][0] - m[0][3] * m[1][2] * m[2][0] * m[3][1] + m[0][2] * m[1][3] * m[2][0] * m[3][1] +
        m[0][3] * m[1][0] * m[2][2] * m[3][1] - m[0][0] * m[1][3] * m[2][2] * m[3][1] - m[0][2] * m[1][0] * m[2][3] * m[3][1] + m[0][0] * m[1][2] * m[2][3] * m[3][1] +
        m[0][3] * m[1][1] * m[2][0] * m[3][2] - m[0][1] * m[1][3] * m[2][0] * m[3][2] - m[0][3] * m[1][0] * m[2][1] * m[3][2] + m[0][0] * m[1][3] * m[2][1] * m[3][2] +
        m[0][1] * m[1][0] * m[2][3] * m[3][2] - m[0][0] * m[1][1] * m[2][3] * m[3][2] - m[0][2] * m[1][1] * m[2][0] * m[3][3] + m[0][1] * m[1][2] * m[2][0] * m[3][3] +
        m[0][2] * m[1][0] * m[2][1] * m[3][3] - m[0][0] * m[1][2] * m[2][1] * m[3][3] - m[0][1] * m[1][0] * m[2][2] * m[3][3] + m[0][0] * m[1][1] * m[2][2] * m[3][3];
}

// 矩阵转置
mat4 transposeImp(mat4 m) {
    return mat4(
        m[0][0], m[1][0], m[2][0], m[3][0],
        m[0][1], m[1][1], m[2][1], m[3][1],
        m[0][2], m[1][2], m[2][2], m[3][2],
        m[0][3], m[1][3], m[2][3], m[3][3]
    );
}

// 矩阵求逆
mat4 inverseImp(mat4 m) {
    // 提取矩阵的列向量
    vec3 a = m[0].xyz;
    vec3 b = m[1].xyz;
    vec3 c = m[2].xyz;
    vec3 d = m[3].xyz;

    // 计算子矩阵的叉乘
    vec3 s = cross(a, b);
    vec3 t = cross(c, d);
    vec3 u = a * m[1].w - b * m[0].w;
    vec3 v = c * m[3].w - d * m[2].w;

    // 计算行列式
    float det = dot(s, v) + dot(t, u);
    
    // 如果行列式接近于 0，说明矩阵不可逆
    if (abs(det) < 1e-8) {
        return mat4(0.0); // 返回一个零矩阵表示错误情况
    }

    // 计算逆矩阵的转置（伴随矩阵）
    vec3 r0 = cross(b, v) + t * m[1].w;
    vec3 r1 = cross(v, a) - t * m[0].w;
    vec3 r2 = cross(d, u) + s * m[3].w;
    vec3 r3 = cross(u, c) - s * m[2].w;

    mat4 inv;
    inv[0] = vec4(r0, -dot(b, t));
    inv[1] = vec4(r1, dot(a, t));
    inv[2] = vec4(r2, -dot(d, s));
    inv[3] = vec4(r3, dot(c, s));

    // 用行列式归一化
    return inv / det;
}

// 创建透视投影矩阵
mat4 perspective(float fov, float aspect, float near, float far) {
    float tanHalfFOV = tan(radians(fov) / 2.0);
    return mat4(
        1.0 / (aspect * tanHalfFOV), 0.0, 0.0, 0.0,
        0.0, 1.0 / tanHalfFOV, 0.0, 0.0,
        0.0, 0.0, -(far + near) / (far - near), -1.0,
        0.0, 0.0, -(2.0 * far * near) / (far - near), 0.0
    );
}

// 创建正交投影矩阵
mat4 orthographic(float left, float right, float bottom, float top, float near, float far) {
    return mat4(
        2.0 / (right - left), 0.0, 0.0, 0.0,
        0.0, 2.0 / (top - bottom), 0.0, 0.0,
        0.0, 0.0, -2.0 / (far - near), 0.0,
        -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1.0
    );
}

// 创建视图矩阵
mat4 lookAt2(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(-dot(s, eye), -dot(u, eye), dot(f, eye), 1.0)
    );
}
// 创建视图矩阵
mat4 lookAt(vec3 eye, vec3 center, vec3 up) {
    vec3 z = normalize(eye-center);
    vec3 x = normalize(cross(up, z));
    vec3 y = cross(z, x);
    return mat4(
        vec4(x.x,y.x,z.x,0),
        vec4(x.y,y.y,z.y, 0.0),
        vec4(x.z,y.z,z.z, 0.0),
        vec4(-dot(x, eye), -dot(y, eye), dot(z, eye), 1.0)
    );
}


// 相机矩阵 列主序
mat4 cameraMatrix(vec3 eye, vec3 center, vec3 up) {
     vec3 z = normalize(eye-center);
    vec3 x = normalize(cross(up, z));
    vec3 y = cross(z, x);
    return mat4(vec4(x,0),vec4(y,0),vec4(z,0),vec4(eye,1));
}

// 视图矩阵
mat4 viewMatrix2(vec3 eye,vec3 center, vec3 up) {
    mat4 m=cameraMatrix(eye,center,up);
    return inverse(m);
}
// 正交旋转矩阵，逆等于转置
mat3 orthogonalRotationMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 z = normalize(eye-center);
    vec3 x = normalize(cross(up, z));
    vec3 y = cross(z, x);
    return mat3(x,y,z);
}

// 从四元数创建旋转矩阵
mat4 fromQuaternion(vec4 q) {
    float x = q.x, y = q.y, z = q.z, w = q.w;
    float x2 = x + x, y2 = y + y, z2 = z + z;
    float xx = x * x2, yy = y * y2, zz = z * z2;
    float xy = x * y2, yz = y * z2, zx = z * x2;
    float wx = w * x2, wy = w * y2, wz = w * z2;

    return mat4(
        1.0 - (yy + zz), xy + wz, zx - wy, 0.0,
        xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
        zx + wy, yz - wx, 1.0 - (xx + yy), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 从欧拉角创建旋转矩阵
mat4 fromEuler(vec3 euler) {
    float cx = cos(euler.x), sx = sin(euler.x);
    float cy = cos(euler.y), sy = sin(euler.y);
    float cz = cos(euler.z), sz = sin(euler.z);

    return mat4(
        cy * cz, -cy * sz, sy, 0.0,
        cz * sx * sy + cx * sz, cx * cz - sx * sy * sz, -cy * sx, 0.0,
        -cx * cz * sy + sx * sz, cz * sx + cx * sy * sz, cx * cy, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 绕任意轴旋转的矩阵
mat4 rotateAxis(vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    float oc = 1.0 - c;

    return mat4(
        oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
        oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
        oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 组合缩放、旋转、平移（SRT）矩阵
mat4 composeTRS(vec3 scale, vec4 quaternion, vec3 translation) {
    mat4 scaleMatrix = mat4(
        scale.x, 0.0, 0.0, 0.0,
        0.0, scale.y, 0.0, 0.0,
        0.0, 0.0, scale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rotationMatrix = fromQuaternion(quaternion);
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        translation, 1.0
    );

    return translationMatrix * rotationMatrix * scaleMatrix;
}


// 计算 4x4 矩阵的伴随矩阵
mat4 adjugate(mat4 m) {
    mat4 adj;
    adj[0] = vec4(
        m[1][1] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) - m[2][1] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) + m[3][1] * (m[1][2] * m[2][3] - m[1][3] * m[2][2]),
        -(m[1][0] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) - m[2][0] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) + m[3][0] * (m[1][2] * m[2][3] - m[1][3] * m[2][2])),
        m[1][0] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) - m[2][0] * (m[1][1] * m[3][3] - m[1][3] * m[3][1]) + m[3][0] * (m[1][1] * m[2][3] - m[1][3] * m[2][1]),
        -(m[1][0] * (m[2][1] * m[3][2] - m[2][2] * m[3][1]) - m[2][0] * (m[1][1] * m[3][2] - m[1][2] * m[3][1]) + m[3][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]))
    );
    adj[1] = vec4(
        -(m[0][1] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) - m[2][1] * (m[0][2] * m[3][3] - m[0][3] * m[3][2]) + m[3][1] * (m[0][2] * m[2][3] - m[0][3] * m[2][2])),
        m[0][0] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) - m[2][0] * (m[0][2] * m[3][3] - m[0][3] * m[3][2]) + m[3][0] * (m[0][2] * m[2][3] - m[0][3] * m[2][2]),
        -(m[0][0] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) - m[2][0] * (m[0][1] * m[3][3] - m[0][3] * m[3][1]) + m[3][0] * (m[0][1] * m[2][3] - m[0][3] * m[2][1])),
        m[0][0] * (m[2][1] * m[3][2] - m[2][2] * m[3][1]) - m[2][0] * (m[0][1] * m[3][2] - m[0][2] * m[3][1]) + m[3][0] * (m[0][1] * m[2][2] - m[0][2] * m[2][1])
    );
    adj[2] = vec4(
        m[0][1] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) - m[1][1] * (m[0][2] * m[3][3] - m[0][3] * m[3][2]) + m[3][1] * (m[0][2] * m[1][3] - m[0][3] * m[1][2]),
        -(m[0][0] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) - m[1][0] * (m[0][2] * m[3][3] - m[0][3] * m[3][2]) + m[3][0] * (m[0][2] * m[1][3] - m[0][3] * m[1][2])),
        m[0][0] * (m[1][1] * m[3][3] - m[1][3] * m[3][1]) - m[1][0] * (m[0][1] * m[3][3] - m[0][3] * m[3][1]) + m[3][0] * (m[0][1] * m[1][3] - m[0][3] * m[1][1]),
        -(m[0][0] * (m[1][1] * m[3][2] - m[1][2] * m[3][1]) - m[1][0] * (m[0][1] * m[3][2] - m[0][2] * m[3][1]) + m[3][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1]))
    );
    adj[3] = vec4(
        -(m[0][1] * (m[1][2] * m[2][3] - m[1][3] * m[2][2]) - m[1][1] * (m[0][2] * m[2][3] - m[0][3] * m[2][2]) + m[2][1] * (m[0][2] * m[1][3] - m[0][3] * m[1][2])),
        m[0][0] * (m[1][2] * m[2][3] - m[1][3] * m[2][2]) - m[1][0] * (m[0][2] * m[2][3] - m[0][3] * m[2][2]) + m[2][0] * (m[0][2] * m[1][3] - m[0][3] * m[1][2]),
        -(m[0][0] * (m[1][1] * m[2][3] - m[1][3] * m[2][1]) - m[1][0] * (m[0][1] * m[2][3] - m[0][3] * m[2][1]) + m[2][0] * (m[0][1] * m[1][3] - m[0][3] * m[1][1])),
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[1][0] * (m[0][1] * m[2][2] - m[0][2] * m[2][1]) + m[2][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1])
    );
    return adj;
}

// 绕X轴旋转矩阵
mat4 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, c, -s, 0.0,
        0.0, s, c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 绕Y轴旋转矩阵
mat4 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat4(
        c, 0.0, s, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -s, 0.0, c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 绕Z轴旋转矩阵
mat4 rotateZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat4(
        c, -s, 0.0, 0.0,
        s, c, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 makeRotateAxis(vec3 axis, float angle) {
    float c=cos(angle);
    float s=sin(angle);
    // R(n,theta)
    // 满足:vR(n,theta)=v'
    // p 分解为 v0,v1
    // v0=平行为axis =(p·n)n
    // v1=垂直于axis的平面 =p - v0
    // w=n*v1=n*(p-v0)=n*p
    // v1'=v1*cos+w*sin
    // p'=v0+v1'= (p-(p·n)n)*cos+(n*p)sin+(p·n)n== p*cos+(n*p)sin+(p·n)n*(1-cos)
    /**
        x轴基向量:[1,0,0]
        [nx,1
         ny,0   = [0,nz,-ny]
         nz,0]
        w=n*p=(0,nz,-ny)
        t=1-cos
        p'=(cos,0,0)+(0,nzsin,-nysin)+(nx^2*t,nxny*t,nxnz*t)=(nx^2*t+cos,nxny*t+nzsin,nxnz*t-nysin)

        y轴基向量:[0,1,0]
        [nx,0
         ny,1   = [-nz,0,nx]
         nz,0]
        w=n*p=(-nz,0,nx)
        t=1-cos
        p'=(0,cos,0)+(-nzsin,0,nxsin)+(nynx*t,ny^2*t,nynz*t)=(nynx*t-nzsin,ny^2*t+cos,nynz*t+nxsin)

        z轴基向量:[0,0,1]
        [nx,0
         ny,0   = [ny,-nx,0]
         nz,1]
        w=n*p=(ny,-nx,0)
        t=1-cos
        p'=(0,0,cos)+(nysin,-nxsin,0)+(nznx*t,nzny*t,nz^2*t)=(nznx*t+nysin,nzny*t-nxsin,nz^2*t+cos)

        列主序:
        m00=nx^2*t+cos      m01=nynx*t-nzsin    m02=nznx*t+nysin    
        m10=nxny*t+nzsin    m11=ny^2*t+cos      m12=nzny*t-nxsin    
        m20=nxnz*t-nysin    m21=nynz*t+nxsin    m22=nz^2*t+cos    

        [
         m00,m01,m02,
         m10,m11,m12,
         m20,m21,m22, 
        ]
    */
     float t=1.-c;
     float nx=axis.x,ny=axis.y,nz=axis.z;
     float tx=nx*t,ty=ny*t,tz=nz*t;
    vec3 x=vec3(tx*nx+c,tx*ny+nz*s,tx*nz-ny*s);
    vec3 y=vec3(tx*ny-nz*s,ty*ny+c,ty*nz+nx*s);
    vec3 z=vec3(tx*nz+ny*s,ty*nz-nx*s,nz*nz*t+c);
    return transpose(mat4(vec4(x,0),vec4(y,0),vec4(z,0),vec4(0,0,0,1)));    

    // vec4 x=mat3(vec4(tx,0,0.c),vec4(0,tx,-s,0),vec4(0,s,tx,0))*vec4(axis,1);
    // vec4 y=mat3(vec4(ty,0,s,0),vec4(0,ty,0,c),vec4(-s,0,ty,0))*vec4(axis,1);
    // vec4 z=mat3(vec4(tz,-s,0,0),vec4(s,tz,0,0),vec4(0,0,tz,c))*vec4(axis,1);

    // return mat4(x,y,z,vec4(0,0,0,1));
}
mat4 makeScaleAxis(vec3 axis,float k){
    /**
        v0=(v·n)n
        v1=v-v0
        v0'=v0*k
        v1'=v1
        v'=v0'+v1'=(v·n)n*k+v-(v·n)n=(k-1)*(v·n)n+v
        
        [1,0,0]=((k-1)*nx^2+1,(k-1)*nxny,(k-1)*nxnz)
        [0,1,0]=((k-1)*nynx,(k-1)*ny^2+1,(k-1)*nynz)
        [0,0,1]=((k-1)*nznx,(k-1)*nzny,(k-1)*nz^2+1)

    */
    float t=k-1.;
    float nx=axis.x;
    float ny=axis.y;
    float nz=axis.z;
    float tx=nx*t;
    float ty=ny*t;
    float tz=nz*t;
    vec4 x=vec4(tx*nx+1.,tx*ny,tx*nz,0);
    vec4 y=vec4(ty*nx,ty*ny+1.,ty*nz,0);
    vec4 z=vec4(tz*nx,tz*ny,tz*nz+1.,0);
    return transpose(mat4(x,y,z,vec4(0,0,0,1)));
}
/**
    透视投影矩阵
    fovy:视角
    aspect:宽高比
    zNear:近裁剪面
    zFar:远裁剪面

*/
mat4 makePerspective(float fovy,float aspect,float zNear,float zFar){
    float f=1./tan(fovy*.5);
    float nf=zNear-zFar;
    return mat4(vec4(f/aspect,0,0,0),vec4(0,f,0,0),vec4(0,0,(zNear+zFar)/nf,-1),vec4(0,0,-2.*zNear*zFar/nf,0));
}
vec3 applyMat4(vec3 v,mat4 m){
    vec4 res=m*vec4(v,1);
    res.xyz/=res.w;
    return res.xyz;
}