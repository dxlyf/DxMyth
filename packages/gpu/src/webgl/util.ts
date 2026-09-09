import {parseTemplate} from 'src/utils/template'
type GLContext=WebGL2RenderingContext;
function handleSource( string:string, errorLine:number ) {

	const lines = string.split( '\n' );
	const lines2 = [];

	const from = Math.max( errorLine - 6, 0 );
	const to = Math.min( errorLine + 6, lines.length );

	for ( let i = from; i < to; i ++ ) {

		const line = i + 1;
		lines2.push( `${line === errorLine ? '>' : ' '} ${line}: ${lines[ i ]}` );

	}

	return lines2.join( '\n' );

}

function getShaderErrors( gl:GLContext, shader: WebGLShader, type:string ) {

	const status = gl.getShaderParameter( shader, gl.COMPILE_STATUS );

	const shaderInfoLog = gl.getShaderInfoLog( shader ) || '';
	const errors = shaderInfoLog.trim();

	if ( status && errors === '' ) return '';

	const errorMatches = /ERROR: 0:(\d+)/.exec( errors );
	if ( errorMatches ) {

		// --enable-privileged-webgl-extension
		// log( '**' + type + '**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		const errorLine = parseInt( errorMatches[ 1 ] );
		return type.toUpperCase() + '\n\n' + errors + '\n\n' + handleSource( gl.getShaderSource( shader ), errorLine );

	} else {

		return errors;

	}

}
export function createWebGLShader(gl: GLContext, source: string, type: number) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //     console.error(`Shader compile error: ${type==gl.VERTEX_SHADER?"vertex":"fragment"}`,gl.getShaderInfoLog(shader));
    // }
    return shader;
}
export function createWebGLProgram(gl: GLContext, vertexSource: string, fragmentSource: string) {
    const vertexShader = createWebGLShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = createWebGLShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const vertexErrors = getShaderErrors( gl, vertexShader, 'vertex' );
		const fragmentErrors = getShaderErrors( gl, fragmentShader, 'fragment' );
        const programLog = gl.getProgramInfoLog(program);
        console.error(`Program link error:`,programLog);
        console.error(`Vertex shader errors:`,vertexErrors);
        console.error(`Fragment shader errors:`,fragmentErrors);
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
}
function createShaderTemplater(vert:string){
    return parseTemplate(vert)
}
 
type AttributeActiveInfo={
    name:string,
    type:number,
    size:number,
}
type UnifromActiveInfo={
    name:string,
    type:number,
    size:number,
}
export function getWebGLActiveAttributes(gl: GLContext, program: WebGLProgram) {
    const attributes=new Map<string,AttributeActiveInfo>()
    const count = gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES)
    for(let i=0;i<count;i++){
        const attrib=gl.getActiveAttrib(program,i)
        attributes.set(attrib.name,{
            name:attrib.name,
            type:attrib.type,
            size:attrib.size,
        })
    }
    return attributes
}
export function getWebGLActiveUniforms(gl: GLContext, program: WebGLProgram) {
    const uniforms=new Map<string,UnifromActiveInfo>()
    const count = gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS)
    for(let i=0;i<count;i++){
        const uniformInfo=gl.getActiveUniform(program,i)
        uniforms.set(uniformInfo.name,{
            name:uniformInfo.name,
            type:uniformInfo.type,
            size:uniformInfo.size,
        })
    }
    return uniforms
}
