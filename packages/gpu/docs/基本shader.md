我来为你写一套完整的、功能齐全的3D着色器，包含现代图形编程中常见的特性。

## 完整的3D顶点着色器

```glsl
#version 330 core

// ========== 输入属性 ==========
layout(location = 0) in vec3 a_position;     // 顶点位置
layout(location = 1) in vec3 a_normal;       // 顶点法线
layout(location = 2) in vec2 a_texCoord;     // 纹理坐标
layout(location = 3) in vec3 a_tangent;      // 切线（用于法线贴图）
layout(location = 4) in vec3 a_bitangent;    // 副切线（可选）

// ========== 变换矩阵 ==========
uniform mat4 u_model;                // 模型矩阵
uniform mat4 u_view;                 // 视图矩阵
uniform mat4 u_projection;           // 投影矩阵
uniform mat3 u_normalMatrix;         // 法线矩阵（可选，可在CPU计算传入）

// ========== 输出到片段着色器 ==========
out vec3 v_worldPos;                 // 世界空间位置
out vec3 v_viewPos;                  // 视图空间位置
out vec3 v_normal;                   // 世界空间法线
out vec2 v_texCoord;                 // 纹理坐标
out vec4 v_clipPos;                  // 裁剪空间位置（用于深度计算）
out vec4 v_prevClipPos;              // 上一帧裁剪位置（用于运动模糊）
out mat3 v_TBN;                      // 切线空间矩阵（用于法线贴图）

// ========== 可选：骨骼动画 ==========
#ifdef USE_SKINNING
    layout(location = 5) in vec4 a_boneWeights;    // 骨骼权重
    layout(location = 6) in ivec4 a_boneIndices;   // 骨骼索引
    
    #define MAX_BONES 100
    uniform mat4 u_boneMatrices[MAX_BONES];        // 骨骼变换矩阵
#endif

// ========== 可选：实例化渲染 ==========
#ifdef USE_INSTANCING
    layout(location = 7) in mat4 a_instanceModel;  // 每个实例的模型矩阵
    layout(location = 11) in mat3 a_instanceNormalMatrix; // 实例法线矩阵
#endif

// ========== 可选：曲面细分 ==========
#ifdef USE_TESSELLATION
    out vec3 v_tessNormal;          // 用于曲面细分控制着色器
    out vec2 v_tessTexCoord;
#endif

void main()
{
    // ========== 计算最终模型矩阵 ==========
    mat4 modelMatrix = u_model;
    mat3 normalMatrix = u_normalMatrix;
    
    #ifdef USE_INSTANCING
        modelMatrix = a_instanceModel * u_model;
        normalMatrix = a_instanceNormalMatrix * normalMatrix;
    #endif
    
    // ========== 骨骼动画变换 ==========
    #ifdef USE_SKINNING
        mat4 boneTransform = mat4(0.0);
        for(int i = 0; i < 4; i++)
        {
            int boneIndex = a_boneIndices[i];
            float weight = a_boneWeights[i];
            if(weight > 0.0 && boneIndex >= 0 && boneIndex < MAX_BONES)
            {
                boneTransform += u_boneMatrices[boneIndex] * weight;
            }
        }
        modelMatrix = modelMatrix * boneTransform;
    #endif
    
    // ========== 计算各种空间的位置 ==========
    vec4 worldPosition = modelMatrix * vec4(a_position, 1.0);
    vec4 viewPosition = u_view * worldPosition;
    vec4 clipPosition = u_projection * viewPosition;
    
    v_worldPos = worldPosition.xyz;
    v_viewPos = viewPosition.xyz;
    v_clipPos = clipPosition;
    
    // 用于深度值的线性计算
    v_clipPos.z = -viewPosition.z; // 存储视图空间深度（正值）
    
    // ========== 法线变换 ==========
    if(u_normalMatrix[0][0] == 0.0) // 如果没有传入法线矩阵，则动态计算
    {
        normalMatrix = transpose(inverse(mat3(modelMatrix)));
    }
    v_normal = normalize(normalMatrix * a_normal);
    
    // ========== 切线空间矩阵（用于法线贴图） ==========
    #ifdef USE_NORMAL_MAPPING
        vec3 T = normalize(normalMatrix * a_tangent);
        vec3 N = v_normal;
        // 重新正交化
        T = normalize(T - dot(T, N) * N);
        vec3 B = cross(N, T);
        v_TBN = mat3(T, B, N);
    #endif
    
    // ========== 传递其他数据 ==========
    v_texCoord = a_texCoord;
    
    // ========== 上一帧位置（用于运动模糊/时间性抗锯齿） ==========
    #ifdef USE_TEMPORAL
        uniform mat4 u_prevMVP;
        v_prevClipPos = u_prevMVP * vec4(a_position, 1.0);
    #endif
    
    // ========== 曲面细分数据 ==========
    #ifdef USE_TESSELLATION
        v_tessNormal = v_normal;
        v_tessTexCoord = v_texCoord;
    #endif
    
    // ========== 设置最终顶点位置 ==========
    gl_Position = clipPosition;
    
    // ========== 可选：将深度值传递给几何着色器 ==========
    #ifdef USE_GEOMETRY_SHADER
        gl_PointSize = 1.0; // 如果使用点精灵
    #endif
}
```

## 完整的3D片段着色器

```glsl
#version 330 core

// ========== 从顶点着色器输入 ==========
in vec3 v_worldPos;
in vec3 v_viewPos;
in vec3 v_normal;
in vec2 v_texCoord;
in vec4 v_clipPos;
in vec4 v_prevClipPos;

#ifdef USE_NORMAL_MAPPING
    in mat3 v_TBN;
#endif

// ========== 材质属性 ==========
struct Material {
    vec3 albedo;            // 基础颜色
    float metallic;         // 金属度 (0-1)
    float roughness;        // 粗糙度 (0-1)
    float ao;               // 环境光遮蔽 (0-1)
    
    // 纹理采样器
    sampler2D albedoMap;
    sampler2D normalMap;
    sampler2D metallicMap;
    sampler2D roughnessMap;
    sampler2D aoMap;
    sampler2D emissionMap;
    
    // 是否使用纹理
    bool useAlbedoMap;
    bool useNormalMap;
    bool useMetallicMap;
    bool useRoughnessMap;
    bool useAoMap;
    bool useEmissionMap;
    
    vec3 emission;          // 自发光颜色
    float opacity;          // 透明度
    float alphaCutoff;      // Alpha测试阈值
};

uniform Material u_material;

// ========== 光源定义 ==========
struct DirectionalLight {
    vec3 direction;
    vec3 color;
    float intensity;
};

struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
    float radius;
    
    // 衰减参数
    float constant;
    float linear;
    float quadratic;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float intensity;
    
    float cutOff;      // 内锥角余弦
    float outerCutOff; // 外锥角余弦
    
    // 衰减参数
    float constant;
    float linear;
    float quadratic;
};

// 光源数组
#define MAX_DIR_LIGHTS 4
#define MAX_POINT_LIGHTS 16
#define MAX_SPOT_LIGHTS 8

uniform DirectionalLight u_dirLights[MAX_DIR_LIGHTS];
uniform PointLight u_pointLights[MAX_POINT_LIGHTS];
uniform SpotLight u_spotLights[MAX_SPOT_LIGHTS];

uniform int u_numDirLights;
uniform int u_numPointLights;
uniform int u_numSpotLights;

// ========== 环境光 ==========
uniform vec3 u_ambientColor;
uniform samplerCube u_skybox;       // 天空盒（用于反射）
uniform samplerCube u_irradianceMap; // 辐照度图（用于漫反射IBL）
uniform samplerCube u_prefilterMap; // 预滤波环境图（用于镜面反射IBL）
uniform sampler2D u_brdfLUT;        // BRDF查找表

// ========== 相机参数 ==========
uniform vec3 u_cameraPos;           // 相机世界位置

// ========== 阴影参数 ==========
#ifdef USE_SHADOWS
    uniform sampler2DShadow u_shadowMap;
    uniform mat4 u_lightSpaceMatrix;
    uniform float u_shadowBias;
    
    #ifdef USE_PCF
        uniform float u_shadowPCFRadius;
    #endif
#endif

// ========== 后处理效果参数 ==========
uniform float u_time;               // 时间（用于动画效果）
uniform vec2 u_viewportSize;        // 视口尺寸
uniform bool u_useFog;              // 是否启用雾效
uniform vec3 u_fogColor;            // 雾颜色
uniform float u_fogDensity;         // 雾密度

// ========== 输出 ==========
layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragNormal;    // G-Buffer: 法线
layout(location = 2) out vec4 fragAlbedo;    // G-Buffer: 反照率+金属度
layout(location = 3) out vec4 fragPosition;  // G-Buffer: 位置+粗糙度

// ========== 常量 ==========
const float PI = 3.14159265359;
const float EPSILON = 0.0001;

// ========== PBR函数 ==========
// 法线分布函数 (GGX/Trowbridge-Reitz)
float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;

    float nom = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, EPSILON);
}

// 几何函数 (Schlick GGX)
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;

    float nom = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / max(denom, EPSILON);
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx1 = GeometrySchlickGGX(NdotV, roughness);
    float ggx2 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

// Fresnel方程 (Schlick近似)
vec3 FresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

vec3 FresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

// ========== 工具函数 ==========
vec3 GetNormalFromMap()
{
    #ifdef USE_NORMAL_MAPPING
        vec3 tangentNormal = texture(u_material.normalMap, v_texCoord).xyz * 2.0 - 1.0;
        return normalize(v_TBN * tangentNormal);
    #else
        return normalize(v_normal);
    #endif
}

vec3 CalculatePBR(vec3 N, vec3 V, vec3 albedo, float metallic, float roughness, float ao)
{
    vec3 F0 = mix(vec3(0.04), albedo, metallic);
    
    // 反射方程
    vec3 Lo = vec3(0.0);
    
    // 方向光
    for(int i = 0; i < u_numDirLights; i++)
    {
        vec3 L = normalize(-u_dirLights[i].direction);
        vec3 H = normalize(V + L);
        
        float distance = length(u_dirLights[i].direction);
        float attenuation = 1.0 / (distance * distance);
        vec3 radiance = u_dirLights[i].color * u_dirLights[i].intensity * attenuation;
        
        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);
        
        vec3 numerator = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + EPSILON;
        vec3 specular = numerator / denominator;
        
        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;
        
        float NdotL = max(dot(N, L), 0.0);
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;
    }
    
    // 点光源
    for(int i = 0; i < u_numPointLights; i++)
    {
        vec3 L = normalize(u_pointLights[i].position - v_worldPos);
        vec3 H = normalize(V + L);
        
        float distance = length(u_pointLights[i].position - v_worldPos);
        float attenuation = 1.0 / (u_pointLights[i].constant + 
                                 u_pointLights[i].linear * distance + 
                                 u_pointLights[i].quadratic * (distance * distance));
        attenuation = clamp(attenuation, 0.0, 1.0);
        vec3 radiance = u_pointLights[i].color * u_pointLights[i].intensity * attenuation;
        
        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);
        
        vec3 numerator = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + EPSILON;
        vec3 specular = numerator / denominator;
        
        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;
        
        float NdotL = max(dot(N, L), 0.0);
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;
    }
    
    // 环境光 (IBL)
    vec3 F = FresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
    vec3 kS = F;
    vec3 kD = 1.0 - kS;
    kD *= 1.0 - metallic;
    
    vec3 irradiance = texture(u_irradianceMap, N).rgb;
    vec3 diffuse = irradiance * albedo;
    
    // 采样预滤波环境图和BRDF LUT
    const float MAX_REFLECTION_LOD = 4.0;
    vec3 R = reflect(-V, N);
    vec3 prefilteredColor = textureLod(u_prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;
    vec2 brdf = texture(u_brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;
    vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);
    
    vec3 ambient = (kD * diffuse + specular) * ao;
    
    return ambient + Lo;
}

// ========== 阴影计算 ==========
float CalculateShadow(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
{
    #ifdef USE_SHADOWS
        // 执行透视除法
        vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
        // 变换到[0,1]范围
        projCoords = projCoords * 0.5 + 0.5;
        
        if(projCoords.z > 1.0)
            return 0.0;
            
        #ifdef USE_PCF
            float shadow = 0.0;
            vec2 texelSize = 1.0 / textureSize(u_shadowMap, 0);
            for(int x = -1; x <= 1; ++x)
            {
                for(int y = -1; y <= 1; ++y)
                {
                    float pcfDepth = texture(u_shadowMap, 
                        vec3(projCoords.xy + vec2(x, y) * texelSize, projCoords.z - u_shadowBias));
                    shadow += pcfDepth;
                }
            }
            shadow /= 9.0;
            return shadow;
        #else
            float closestDepth = texture(u_shadowMap, vec3(projCoords.xy, projCoords.z - u_shadowBias));
            return closestDepth;
        #endif
    #else
        return 1.0;
    #endif
}

// ========== 雾效计算 ==========
vec3 ApplyFog(vec3 color, float distance)
{
    if(!u_useFog) return color;
    
    float fogFactor = exp(-u_fogDensity * distance * distance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    
    return mix(u_fogColor, color, fogFactor);
}

void main()
{
    // ========== Alpha测试 ==========
    if(u_material.opacity < u_material.alphaCutoff)
        discard;
    
    // ========== 获取材质属性 ==========
    vec3 albedo = u_material.useAlbedoMap ? 
        texture(u_material.albedoMap, v_texCoord).rgb : u_material.albedo;
    
    float metallic = u_material.useMetallicMap ? 
        texture(u_material.metallicMap, v_texCoord).r : u_material.metallic;
    
    float roughness = u_material.useRoughnessMap ? 
        texture(u_material.roughnessMap, v_texCoord).r : u_material.roughness;
    
    float ao = u_material.useAoMap ? 
        texture(u_material.aoMap, v_texCoord).r : u_material.ao;
    
    vec3 emission = u_material.useEmissionMap ? 
        texture(u_material.emissionMap, v_texCoord).rgb * u_material.emission : 
        u_material.emission;
    
    // ========== 获取法线 ==========
    vec3 N = GetNormalFromMap();
    vec3 V = normalize(u_cameraPos - v_worldPos);
    
    // ========== 计算PBR光照 ==========
    vec3 color = CalculatePBR(N, V, albedo, metallic, roughness, ao);
    
    // ========== 添加自发光 ==========
    color += emission;
    
    // ========== 应用阴影 ==========
    #ifdef USE_SHADOWS
        vec4 fragPosLightSpace = u_lightSpaceMatrix * vec4(v_worldPos, 1.0);
        float shadow = CalculateShadow(fragPosLightSpace, N, 
            normalize(-u_dirLights[0].direction));
        color *= shadow;
    #endif
    
    // ========== 应用雾效 ==========
    float viewDistance = length(u_cameraPos - v_worldPos);
    color = ApplyFog(color, viewDistance);
    
    // ========== 色调映射 ==========
    #ifdef USE_HDR
        // Reinhard色调映射
        color = color / (color + vec3(1.0));
        // Gamma校正
        color = pow(color, vec3(1.0/2.2));
    #endif
    
    // ========== 输出最终颜色 ==========
    fragColor = vec4(color, u_material.opacity);
    
    // ========== G-Buffer输出（用于延迟渲染） ==========
    #ifdef DEFERRED_RENDERING
        fragNormal = vec4(N * 0.5 + 0.5, 1.0);
        fragAlbedo = vec4(albedo, metallic);
        fragPosition = vec4(v_worldPos, roughness);
    #endif
}
```

## 配套的C++结构定义（可选）

```cpp
// C++端的材质结构定义（与GLSL对齐）
struct Material {
    glm::vec3 albedo = glm::vec3(1.0f);
    float metallic = 0.0f;
    float roughness = 0.5f;
    float ao = 1.0f;
    
    GLuint albedoMap = 0;
    GLuint normalMap = 0;
    GLuint metallicMap = 0;
    GLuint roughnessMap = 0;
    GLuint aoMap = 0;
    GLuint emissionMap = 0;
    
    bool useAlbedoMap = false;
    bool useNormalMap = false;
    bool useMetallicMap = false;
    bool useRoughnessMap = false;
    bool useAoMap = false;
    bool useEmissionMap = false;
    
    glm::vec3 emission = glm::vec3(0.0f);
    float opacity = 1.0f;
    float alphaCutoff = 0.1f;
};
```

## 使用说明

### 1. **特性开关**
通过定义不同的宏来启用/禁用功能：
```glsl
#define USE_NORMAL_MAPPING
#define USE_SHADOWS
#define USE_PCF
#define USE_SKINNING
#define USE_INSTANCING
#define DEFERRED_RENDERING
#define USE_HDR
#define USE_TEMPORAL
```

### 2. **编译指令**
在C++端加载着色器前添加版本和宏定义：
```cpp
std::string version = "#version 330 core\n";
std::string defines = "#define USE_NORMAL_MAPPING\n";
std::string vertexSource = version + defines + vertexShaderCode;
```

### 3. **G-Buffer延迟渲染**
如果要使用延迟渲染，需要：
1. 创建多个渲染目标（MRT）
2. 在片段着色器中输出到不同的颜色附件
3. 第二个渲染通道使用这些G-Buffer数据进行光照计算

### 4. **PBR工作流**
- **金属度工作流**：使用`metallic`和`roughness`参数
- **贴图支持**：所有PBR参数都可以使用纹理贴图
- **IBL**：需要预计算的辐照度图和预滤波环境图

### 5. **性能优化**
- 将常量计算移到顶点着色器
- 使用组合矩阵（MVP）减少GPU计算
- 对于静态物体，预计算法线矩阵
- 使用UBO管理全局uniform

这套着色器提供了现代3D渲染的完整基础，包括：
- ✅ PBR光照模型
- ✅ 法线贴图
- ✅ 阴影映射
- ✅ 环境光遮蔽
- ✅ 天空盒反射
- ✅ 雾效
- ✅ 透明度支持
- ✅ 骨骼动画
- ✅ 实例化渲染
- ✅ 延迟渲染支持
- ✅ HDR和色调映射

你可以根据自己的需求添加或移除功能模块。