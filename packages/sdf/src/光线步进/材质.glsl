#define PI 3.14159265359
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001

// ============================================================
// 基础结构
// ============================================================

struct Hit {
    float dist;
    int matId;
};

struct Material {
    // Base
    vec3  baseColor;
    float metallic;
    float roughness;
    float specular;

    // Clearcoat
    float clearcoat;
    float clearcoatRoughness;

    // Sheen
    float sheen;
    vec3  sheenColor;

    // Transmission
    float transmission;
    float ior;

    // Emission
    vec3 emissive;
};

// ============================================================
// SDF
// ============================================================

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

Hit mapScene(vec3 p) {
    Hit h;
    h.dist = 1e9;
    h.matId = -1;

    float d;

    d = sdSphere(p - vec3(-3.0, 0.0, 5.0), 1.0);
    if (d < h.dist) { h.dist = d; h.matId = 1; }

    d = sdSphere(p - vec3(-1.5, 0.0, 5.0), 1.0);
    if (d < h.dist) { h.dist = d; h.matId = 2; }

    d = sdSphere(p - vec3(0.0, 0.0, 5.0), 1.0);
    if (d < h.dist) { h.dist = d; h.matId = 3; }

    d = sdSphere(p - vec3(1.5, 0.0, 5.0), 1.0);
    if (d < h.dist) { h.dist = d; h.matId = 4; }

    d = sdSphere(p - vec3(3.0, 0.0, 5.0), 1.0);
    if (d < h.dist) { h.dist = d; h.matId = 5; }

    return h;
}

// ============================================================
// 材质库（Blender 风格）
// ============================================================

Material getMaterial(int id) {
    // 粗糙塑料
    if (id == 1) return Material(
        vec3(0.8, 0.1, 0.1),
        0.0, 0.7, 0.5,
        0.0, 0.0,
        0.0, vec3(0.0),
        0.0, 1.45,
        vec3(0.0)
    );

    // 光滑塑料
    if (id == 2) return Material(
        vec3(0.9),
        0.0, 0.2, 0.5,
        0.0, 0.0,
        0.0, vec3(0.0),
        0.0, 1.45,
        vec3(0.0)
    );

    // 金
    if (id == 3) return Material(
        vec3(1.0, 0.77, 0.33),
        1.0, 0.25, 0.5,
        0.0, 0.0,
        0.0, vec3(0.0),
        0.0, 1.45,
        vec3(0.0)
    );

    // 汽车漆（Clearcoat）
    if (id == 4) return Material(
        vec3(0.1, 0.4, 1.0),
        1.0, 0.35, 0.5,
        1.0, 0.05,
        0.0, vec3(0.0),
        0.0, 1.45,
        vec3(0.0)
    );

    // 发光玻璃
    if (id == 5) return Material(
        vec3(0.6, 0.8, 1.0),
        0.0, 0.1, 0.5,
        0.0, 0.0,
        0.0, vec3(0.0),
        1.0, 1.45,
        vec3(2.0, 2.0, 4.0)
    );

    return Material(vec3(0.0),0.,0.,0.,0.,0.,0.,vec3(0.),0.,1.45,vec3(0));
}

// ============================================================
// 法线 & Ray March
// ============================================================

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy).dist - mapScene(p - e.xyy).dist,
        mapScene(p + e.yxy).dist - mapScene(p - e.yxy).dist,
        mapScene(p + e.yyx).dist - mapScene(p - e.yyx).dist
    ));
}

Hit rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    Hit h;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        h = mapScene(p);
        if (h.dist < SURF_DIST || dO > MAX_DIST) break;
        dO += h.dist;
    }
    h.dist = dO;
    return h;
}

// ============================================================
// PBR 函数
// ============================================================

float D_GGX(float NdotH, float a) {
    float a2 = a * a;
    float d = (NdotH * NdotH) * (a2 - 1.0) + 1.0;
    return a2 / (PI * d * d);
}

float G_Smith(float NdotV, float NdotL, float a) {
    float k = (a + 1.0);
    k = (k * k) / 8.0;
    float gv = NdotV / (NdotV * (1.0 - k) + k);
    float gl = NdotL / (NdotL * (1.0 - k) + k);
    return gv * gl;
}

vec3 F_Schlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// ============================================================
// Principled BSDF（核心）
// ============================================================

vec3 shadePrincipled(vec3 P, vec3 N, vec3 V, Material m) {
    vec3 lightPos = vec3(5.0, 6.0, -3.0);
    vec3 L = normalize(lightPos - P);
    vec3 H = normalize(V + L);

    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);
    float NdotH = max(dot(N, H), 0.0);
    float HdotV = max(dot(H, V), 0.0);

    float a = max(m.roughness * m.roughness, 0.04);

    // F0
    vec3 dielectricF0 = vec3(0.04 * m.specular);
    vec3 F0 = mix(dielectricF0, m.baseColor, m.metallic);

    vec3 F = F_Schlick(HdotV, F0);
    float D = D_GGX(NdotH, a);
    float G = G_Smith(NdotV, NdotL, a);

    vec3 specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);

    vec3 kS = F;
    vec3 kD = (1.0 - kS) * (1.0 - m.metallic) * (1.0 - m.transmission);

    vec3 diffuse = kD * m.baseColor / PI;

    // Clearcoat（第二层 GGX）
    if (m.clearcoat > 0.0) {
        float ac = max(m.clearcoatRoughness * m.clearcoatRoughness, 0.04);
        float Dc = D_GGX(NdotH, ac);
        float Gc = G_Smith(NdotV, NdotL, ac);
        vec3 Fc = F_Schlick(HdotV, vec3(0.04));
        specular += m.clearcoat * (Dc * Gc * Fc / max(4.0 * NdotV * NdotL, 0.001));
    }

    // 简化 Sheen
    vec3 sheen = m.sheen * m.sheenColor * pow(1.0 - NdotV, 5.0);

    vec3 radiance = vec3(4.0);

    return (diffuse + specular) * radiance * NdotL
           + sheen
           + m.emissive;
}

// ============================================================
// Main
// ============================================================

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, -6.5);
    vec3 rd = normalize(vec3(uv, 1.0));

    vec3 color = vec3(0.0);
    Hit h = rayMarch(ro, rd);

    if (h.dist < MAX_DIST) {
        vec3 p = ro + rd * h.dist;
        vec3 n = getNormal(p);
        vec3 v = normalize(-rd);
        Material mat = getMaterial(h.matId);
        color = shadePrincipled(p, n, v, mat);
    }

    // ACES-ish tone map
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.4545));

    fragColor = vec4(color, 1.0);
}
