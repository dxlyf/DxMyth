// Shadertoy 材质展示馆
// 展示：金属、玻璃、塑料、漫反射、发光、透明、镜面、粗糙材质
// 常量定义
#define PI 3.14159265359

#define MAX_STEPS 100
#define MAX_DIST 500.0
#define SURF_DIST 0.001

// 材质类型定义
#define MAT_DIFFUSE 0
#define MAT_METAL 1
#define MAT_GLASS 2
#define MAT_PLASTIC 3
#define MAT_EMISSIVE 4
#define MAT_MIRROR 5
#define MAT_SUBSURFACE 6
#define MAT_CLEARCOAT 7
#define MAT_ANISOTROPIC 8
#define MAT_VELVET 9
#define MAT_TOON 10

struct Material {
    vec3 albedo;
    float roughness;
    float metallic;
    float ior;
    float transmission;
    vec3 emission;
    int type;
    float anisotropy;
    float clearcoat;
    float sheen;
};

struct Hit {
    float dist;
    vec3 pos;
    vec3 normal;
    Material mat;
};

// 噪声函数
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// SDF 基础形状
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float sdCylinder(vec3 p, vec3 c) {
    return length(p.xz - c.xy) - c.z;
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

float sdPlane(vec3 p, vec4 n) {
    return dot(p, n.xyz) + n.w;
}

// 场景SDF
Hit scene(vec3 p) {
    Hit hit;
    hit.dist = 1e10;
    
    float time = iTime;
    
    // 地面网格
    float ground = p.y + 1.0;
    if(ground < hit.dist) {
        hit.dist = ground;
        hit.pos = p;
        hit.normal = vec3(0.0, 1.0, 0.0);
        
        // 棋盘格地面
        vec2 grid = floor(p.xz * 2.0);
        float checker = mod(grid.x + grid.y, 2.0);
        
        hit.mat.albedo = mix(vec3(0.1), vec3(0.2), checker);
        hit.mat.roughness = 0.8;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_DIFFUSE;
        hit.mat.emission = vec3(0.0);
    }
    
    // 第一排：基础材质
    float col = 0.0;
    
    // 1. 漫反射材质（红色）
    vec3 p1 = p - vec3(-3.0, 0.0, 0.0);
    float sphere1 = sdSphere(p1, 0.5);
    if(sphere1 < hit.dist) {
        hit.dist = sphere1;
        hit.pos = p;
        hit.normal = normalize(p1);
        hit.mat.albedo = vec3(0.8, 0.2, 0.2);
        hit.mat.roughness = 0.9;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_DIFFUSE;
    }
    
    // 2. 金属材质（金色）
    vec3 p2 = p - vec3(-1.8, 0.0, 0.0);
    float sphere2 = sdSphere(p2, 0.5);
    if(sphere2 < hit.dist) {
        hit.dist = sphere2;
        hit.pos = p;
        hit.normal = normalize(p2);
        hit.mat.albedo = vec3(1.0, 0.86, 0.57);
        hit.mat.roughness = 0.1;
        hit.mat.metallic = 1.0;
        hit.mat.type = MAT_METAL;
    }
    
    // 3. 粗糙金属（铜）
    vec3 p3 = p - vec3(-0.6, 0.0, 0.0);
    float sphere3 = sdSphere(p3, 0.5);
    if(sphere3 < hit.dist) {
        hit.dist = sphere3;
        hit.pos = p;
        hit.normal = normalize(p3);
        hit.mat.albedo = vec3(0.83, 0.57, 0.36);
        hit.mat.roughness = 0.7;
        hit.mat.metallic = 1.0;
        hit.mat.type = MAT_METAL;
    }
    
    // 4. 玻璃材质
    vec3 p4 = p - vec3(0.6, 0.0, 0.0);
    float sphere4 = sdSphere(p4, 0.5);
    if(sphere4 < hit.dist) {
        hit.dist = sphere4;
        hit.pos = p;
        hit.normal = normalize(p4);
        hit.mat.albedo = vec3(0.95, 1.0, 0.98);
        hit.mat.roughness = 0.05;
        hit.mat.metallic = 0.0;
        hit.mat.ior = 1.5;
        hit.mat.transmission = 0.95;
        hit.mat.type = MAT_GLASS;
    }
    
    // 5. 塑料材质
    vec3 p5 = p - vec3(1.8, 0.0, 0.0);
    float sphere5 = sdSphere(p5, 0.5);
    if(sphere5 < hit.dist) {
        hit.dist = sphere5;
        hit.pos = p;
        hit.normal = normalize(p5);
        hit.mat.albedo = vec3(0.2, 0.6, 0.9);
        hit.mat.roughness = 0.3;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_PLASTIC;
        hit.mat.clearcoat = 0.5;
    }
    
    // 6. 发光材质
    vec3 p6 = p - vec3(3.0, 0.0, 0.0);
    float sphere6 = sdSphere(p6, 0.5);
    if(sphere6 < hit.dist) {
        hit.dist = sphere6;
        hit.pos = p;
        hit.normal = normalize(p6);
        hit.mat.albedo = vec3(0.1);
        hit.mat.roughness = 0.8;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_EMISSIVE;
        hit.mat.emission = vec3(2.0, 1.5, 0.8) * (0.8 + 0.2 * sin(time * 2.0));
    }
    
    // 第二排：高级材质
    // 7. 镜面材质
    vec3 p7 = p - vec3(-3.0, 1.5, 0.0);
    float box1 = sdBox(p7, vec3(0.4));
    if(box1 < hit.dist) {
        hit.dist = box1;
        hit.pos = p;
        hit.normal = normalize(p7 * vec3(1.0, 1.0, 1.0));
        hit.mat.albedo = vec3(1.0);
        hit.mat.roughness = 0.01;
        hit.mat.metallic = 1.0;
        hit.mat.type = MAT_MIRROR;
    }
    
    // 8. 次表面散射（玉石）
    vec3 p8 = p - vec3(-1.8, 1.5, 0.0);
    float torus1 = sdTorus(p8, vec2(0.4, 0.1));
    if(torus1 < hit.dist) {
        hit.dist = torus1;
        hit.pos = p;
        hit.normal = normalize(p8);
        hit.mat.albedo = vec3(0.4, 0.8, 0.6);
        hit.mat.roughness = 0.2;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_SUBSURFACE;
        hit.mat.transmission = 0.3;
    }
    
    // 9. 清漆材质（车漆）
    vec3 p9 = p - vec3(-0.6, 1.5, 0.0);
    float capsule1 = sdCapsule(p9, vec3(-0.3,0,0), vec3(0.3,0,0), 0.3);
    if(capsule1 < hit.dist) {
        hit.dist = capsule1;
        hit.pos = p;
        hit.normal = normalize(p9);
        hit.mat.albedo = vec3(0.9, 0.2, 0.2);
        hit.mat.roughness = 0.3;
        hit.mat.metallic = 0.8;
        hit.mat.type = MAT_CLEARCOAT;
        hit.mat.clearcoat = 0.5;
    }
    
    // 10. 各向异性材质（拉丝金属）
    vec3 p10 = p - vec3(0.6, 1.5, 0.0);
    float cylinder1 = sdCylinder(p10, vec3(0.0, 0.0, 0.3));
    if(cylinder1 < hit.dist) {
        hit.dist = cylinder1;
        hit.pos = p;
        hit.normal = normalize(vec3(p10.x, 0.0, p10.z));
        hit.mat.albedo = vec3(0.7);
        hit.mat.roughness = 0.4;
        hit.mat.metallic = 1.0;
        hit.mat.type = MAT_ANISOTROPIC;
        hit.mat.anisotropy = 0.7;
    }
    
    // 11. 天鹅绒材质
    vec3 p11 = p - vec3(1.8, 1.5, 0.0);
    float box2 = sdBox(p11, vec3(0.4));
    if(box2 < hit.dist) {
        hit.dist = box2;
        hit.pos = p;
        hit.normal = normalize(p11);
        hit.mat.albedo = vec3(0.5, 0.2, 0.6);
        hit.mat.roughness = 0.8;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_VELVET;
        hit.mat.sheen = 0.5;
    }
    
    // 12. 卡通材质
    vec3 p12 = p - vec3(3.0, 1.5, 0.0);
    float box3 = sdBox(p12, vec3(0.4));
    if(box3 < hit.dist) {
        hit.dist = box3;
        hit.pos = p;
        hit.normal = normalize(p12);
        hit.mat.albedo = vec3(0.3, 0.8, 0.4);
        hit.mat.roughness = 0.5;
        hit.mat.metallic = 0.0;
        hit.mat.type = MAT_TOON;
    }
    
    // 天空球（无限大球）
    float sky = sdSphere(p, 50.0);
    if(sky < hit.dist) {
        hit.dist = sky;
        hit.pos = p;
        hit.normal = normalize(p);
        hit.mat.albedo = vec3(0.0);
        hit.mat.emission = vec3(0.02, 0.03, 0.05);
        hit.mat.type = MAT_EMISSIVE;
    }
    
    return hit;
}

// 计算法线
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    float d = scene(p).dist;
    vec3 n = d - vec3(
        scene(p - e.xyy).dist,
        scene(p - e.yxy).dist,
        scene(p - e.yyx).dist
    );
    return normalize(n);
}

// 菲涅尔效应
float fresnelSchlick(float cosTheta, float F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// 各向异性GGX分布
float ggxAnisotropic(float NdotH, float HdotX, float HdotY, float ax, float ay) {
    float denom = HdotX * HdotX / (ax * ax) + HdotY * HdotY / (ay * ay) + NdotH * NdotH;
    return 1.0 / (3.14159 * ax * ay * denom * denom);
}

// 光线步进
Hit rayMarch(vec3 ro, vec3 rd) {
    Hit hit;
    hit.dist = 0.0;
    
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * hit.dist;
        Hit sceneHit = scene(p);
        float d = sceneHit.dist;
        
        hit.dist += d;
        if(d < SURF_DIST) {
            hit.pos = p;
            hit.normal = calcNormal(p);
            hit.mat = sceneHit.mat;
            break;
        }
        
        if(hit.dist > MAX_DIST) {
            hit.dist = MAX_DIST;
            hit.pos = ro + rd * hit.dist;
            hit.normal = normalize(hit.pos);
            hit.mat.albedo = vec3(0.0);
            hit.mat.emission = vec3(0.02, 0.03, 0.05);
            hit.mat.type = MAT_EMISSIVE;
            break;
        }
    }
    
    return hit;
}


// 菲涅尔函数（全局定义）
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// GGX 法线分布函数
float DistributionGGX(float NdotH, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH2 = NdotH * NdotH;
    
    float nom = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    
    return nom / denom;
}

// 几何遮蔽函数（Smith方法）
float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    
    float nom = NdotV;
    float denom = NdotV * (1.0 - k) + k;
    
    return nom / denom;
}

float GeometrySmith(float NdotV, float NdotL, float roughness) {
    float ggx1 = GeometrySchlickGGX(NdotV, roughness);
    float ggx2 = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

// 完整的 PBR 计算函数
vec3 calculatePBR(vec3 normal, vec3 viewDir, Material mat, 
                  vec3 lightDir, vec3 radiance) {
    
    // 1. 基础计算
    float NdotL = max(dot(normal, lightDir), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);
    
    if(NdotL <= 0.0) return vec3(0.0);
    
    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVec), 0.0);
    float VdotH = max(dot(viewDir, halfVec), 0.0);
    
    // 2. 计算各BRDF项
    // 菲涅尔基础反射率
    vec3 F0 = mix(vec3(0.04), mat.albedo, mat.metallic);
    
    // 菲涅尔项（vec3）
    vec3 F = fresnelSchlick(VdotH, F0);
    
    // 法线分布项（float）
    float D = DistributionGGX(NdotH, mat.roughness);
    
    // 几何遮蔽项（float）
    float G = GeometrySmith(NdotV, NdotL, mat.roughness);
    
    // 3. Cook-Torrance BRDF
    vec3 numerator = F * D * G;  // F是vec3，所以结果是vec3
    float denominator = 4.0 * NdotV * NdotL + 0.0001;
    vec3 specular = numerator / denominator;
    
    // 4. 能量守恒：漫反射比例
    vec3 kD = (vec3(1.0) - F) * (1.0 - mat.metallic);
    
    // 5. 漫反射项（Lambert）
    vec3 diffuse = kD * mat.albedo / PI;
    
    // 6. 组合 BRDF
    vec3 BRDF = diffuse + specular;
    
    // 7. 最终辐射度
    return BRDF * radiance * NdotL;
}
// 计算光照
vec3 calculateLighting(vec3 p, vec3 normal, vec3 viewDir, Material mat) {

    // 光源设置
    vec3 lightPositions[2];
    lightPositions[0] = vec3(5.0, 10.0, 5.0);
    lightPositions[1] = vec3(-5.0, 8.0, -5.0);
    
    vec3 lightColors[2];
    lightColors[0] = vec3(1.0, 0.95, 0.9) * 2.0;  // 暖光
    lightColors[1] = vec3(0.8, 0.9, 1.0) * 1.5;   // 冷光
    
    // 环境光照
    vec3 ambient = mat.albedo * 0.03;
    
    // 初始化结果
    vec3 Lo = vec3(0.0);
    
    // 对每个光源计算
    for(int i = 0; i < 2; i++) {
        vec3 lightDir = normalize(lightPositions[i] - p);
        float distance = length(lightPositions[i] - p);
        float attenuation = 1.0 / (distance * distance);
        vec3 radiance = lightColors[i] * attenuation;
        
        Lo += calculatePBR(normal, viewDir, mat, lightDir, radiance);
    }
    
    // 环境光 + 直接光照
    vec3 color = ambient + Lo;
    
    // 处理自发光
    if(mat.type == MAT_EMISSIVE) {
        color += mat.emission;
    }
    
    return color;
}

// 反射和折射计算
vec3 traceRay(vec3 ro, vec3 rd, inout vec3 throughput, inout int depth) {
    vec3 col = vec3(0.0);
    
    for(int i = 0; i < 4; i++) { // 最大反弹次数
        depth++;
        if(depth > 4) break;
        
        Hit hit = rayMarch(ro, rd);
        
        // 如果击中天空，直接返回天空颜色
        if(hit.dist >= MAX_DIST - 0.1) {
            col += throughput * hit.mat.emission;
            break;
        }
        
        // 自发光材质
        if(hit.mat.type == MAT_EMISSIVE) {
            col += throughput * hit.mat.emission;
            break;
        }
        
        // 计算本地光照
        vec3 viewDir = -rd;
        vec3 localColor = calculateLighting(hit.pos, hit.normal, viewDir, hit.mat);
        col += throughput * localColor;
        
        // 根据材质类型决定下一步
        if(hit.mat.type == MAT_GLASS) {
            // 玻璃：反射 + 折射
            float cosTheta = dot(-rd, hit.normal);
            float F = fresnelSchlick(cosTheta, 0.04);
            
            // 反射
            if(F > 0.1) {
                vec3 reflectDir = reflect(rd, hit.normal);
                ro = hit.pos + reflectDir * SURF_DIST;
                rd = reflectDir;
                throughput *= F;
            } else {
                // 折射
                float ior = hit.mat.ior;
                float eta = cosTheta > 0.0 ? 1.0/ior : ior;
                vec3 refractDir = refract(rd, hit.normal, eta);
                if(length(refractDir) > 0.0) {
                    ro = hit.pos + refractDir * SURF_DIST;
                    rd = refractDir;
                    throughput *= (1.0 - F) * hit.mat.transmission;
                } else {
                    // 全反射
                    vec3 reflectDir = reflect(rd, hit.normal);
                    ro = hit.pos + reflectDir * SURF_DIST;
                    rd = reflectDir;
                }
            }
        } else if(hit.mat.type == MAT_MIRROR || hit.mat.metallic > 0.9) {
            // 完美反射
            vec3 reflectDir = reflect(rd, hit.normal);
            ro = hit.pos + reflectDir * SURF_DIST;
            rd = reflectDir;
            throughput *= hit.mat.albedo;
        } else {
            // 其他材质：简单散射或结束
            if(hash(gl_FragCoord.xy + float(i)) > 0.7) break;
            
            // 随机散射方向
            vec3 scatterDir = normalize(hit.normal + normalize(vec3(
                hash(gl_FragCoord.xy + vec2(i, 0)),
                hash(gl_FragCoord.xy + vec2(i, 1)),
                hash(gl_FragCoord.xy + vec2(i, 2))
            ) * 2.0 - 1.0));
            
            ro = hit.pos + scatterDir * SURF_DIST;
            rd = scatterDir;
            throughput *= hit.mat.albedo * 0.7;
        }
        
        // 俄罗斯轮盘赌终止
        float p = max(throughput.r, max(throughput.g, throughput.b));
        if(hash(gl_FragCoord.xy * float(depth)) > p) break;
        throughput /= p;
    }
    
    return col;
}

// 主函数
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // 坐标转换
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    // 时间动画
    float time = iTime;
    
    // 相机设置
    vec3 ro = vec3(0.0, 3.0, 3.0);
    vec3 lookat = vec3(0.0,-2.0, 0.0);
    
    // 相机旋转
    // float camRot = time * 0.05;
    // ro.xz = vec2(
    //     cos(camRot) * ro.x - sin(camRot) * ro.z,
    //     sin(camRot) * ro.x + cos(camRot) * ro.z
    // );
    
    // 相机矩阵
    vec3 forward = normalize(lookat - ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = normalize(cross(forward, right));
    
    // 景深效果（可选）
    vec3 rd = normalize(forward + right * uv.x + up * uv.y);
   // rd=normalize(uv.x*right+uv.y*up+2.0*forward);
    // 光线追踪
    vec3 throughput = vec3(1.0);
    int depth = 0;
    vec3 col = traceRay(ro, rd, throughput, depth);
    
    // 色调映射
    col = col / (col + vec3(1.0));
    
    // Gamma校正
    col = pow(col, vec3(1.0/2.2));
    
    // 添加胶片颗粒（可选）
    float grain = hash(fragCoord + time) * 0.02;
    col += vec3(grain);
    
    // 添加标题文字（通过距离场）
    vec2 textUV = fragCoord / iResolution.xy;
    textUV.y = 1.0 - textUV.y;
    
    // 简单的文字效果
    float text = 0.0;
    if(textUV.y > 0.9 && textUV.y < 0.95) {
        // "MATERIAL SHOWCASE"
        float x = textUV.x;
        if(x > 0.3 && x < 0.7) {
            text = sin(x * 50.0 + time * 2.0) * 0.5 + 0.5;
            col = mix(col, vec3(1.0), text * 0.3);
        }
    }
    
    // 添加材质标签
    vec2 gridPos = (fragCoord / iResolution.xy) * vec2(6.0, 2.0);
    vec2 cellPos = fract(gridPos);
    vec2 cellID = floor(gridPos);
    
    if(cellID.y < 2.0 && cellID.x < 6.0 && cellPos.y > 0.85) {
        // 标签位置
        vec2 labelUV = cellPos;
        labelUV.y -= 0.85;
        
        // 简单的标签框
        float border = 1.0 - smoothstep(0.0, 0.02, 
            min(min(labelUV.x, 1.0 - labelUV.x), min(labelUV.y, 1.0 - labelUV.y)));
        
        if(border > 0.5) {
            // 材质名称数组（简化显示）
            int matIndex = int(cellID.x + cellID.y * 6.0);
            vec3 labelCol = vec3(0.0);
            
            if(matIndex == 0) labelCol = vec3(0.8, 0.2, 0.2);
            else if(matIndex == 1) labelCol = vec3(1.0, 0.86, 0.57);
            else if(matIndex == 2) labelCol = vec3(0.83, 0.57, 0.36);
            else if(matIndex == 3) labelCol = vec3(0.95, 1.0, 0.98);
            else if(matIndex == 4) labelCol = vec3(0.2, 0.6, 0.9);
            else if(matIndex == 5) labelCol = vec3(2.0, 1.5, 0.8);
            else if(matIndex == 6) labelCol = vec3(1.0);
            else if(matIndex == 7) labelCol = vec3(0.4, 0.8, 0.6);
            else if(matIndex == 8) labelCol = vec3(0.9, 0.2, 0.2);
            else if(matIndex == 9) labelCol = vec3(0.7);
            else if(matIndex == 10) labelCol = vec3(0.5, 0.2, 0.6);
            else if(matIndex == 11) labelCol = vec3(0.3, 0.8, 0.4);
            
            col = mix(col, labelCol, 0.3);
        }
    }
    
    // 最终输出
    fragColor = vec4(col, 1.0);
}