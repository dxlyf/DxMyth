const e=`precision highp float`,t=`
    ${e};
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main() {
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }`,n=`
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    void main() {
      vTexCoord = aPosition;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }`;export{e as highPsourceCode,t as identityFragmentShader,n as vertexSource};
//# sourceMappingURL=baseFilter.min.mjs.map