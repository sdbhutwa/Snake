
export let gl: WebGLRenderingContext = null;
export let simpleShaderProgram: WebGLProgram = null;
export let shaderVertexPositionAttribute: number;
export let u_FragColor: WebGLUniformLocation = null;
export let u_ModelTransform: WebGLUniformLocation = null;
export let u_ProjTransform: WebGLUniformLocation = null;

let gSquareVertexBuffer: WebGLBuffer = null;

export function initGL(canvas: HTMLCanvasElement): boolean
{
    // Get the rendering context
    gl = getWebGLContext(canvas);
    if (gl == null)
    {
        console.log("Failed to get the rendering context");
        return false;
    }

    initSquareBuffer();

    if (!initSimpleShader("VertexShader", "FragmentShader"))
    {
        return false;
    }

    u_FragColor = gl.getUniformLocation(simpleShaderProgram, "u_FragColor");
    if (!u_FragColor)
    {
        console.log("Failed to get u_FragColor location");
        return false;
    }

    u_ModelTransform = gl.getUniformLocation(simpleShaderProgram, "u_ModelTransform");
    if (!u_ModelTransform)
    {
        console.log("Failed to get u_ModelTransfrom location");
        return false;
    }

    u_ProjTransform = gl.getUniformLocation(simpleShaderProgram, "u_ProjTransform");
    if (!u_ProjTransform)
    {
        console.log("Faile to get u_ProjTransform location");
        return false;
    }

    return true;
}

function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext
{
    let gl: WebGLRenderingContext = null;

    try
    {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (gl == null)
        {
            throw "Browser does not support WebGL";
        }
    }
    catch (e)
    {
        console.log(e);
    }

    return gl;
}

function initSquareBuffer(): void
{
    // Define the vertices for a square
    let verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0,

        0.0, 0.5, 0.0,
        -0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.0, -0.5, 0.0
    ];

    // Create a buffer on the gl context
    gSquareVertexBuffer = gl.createBuffer();

    // Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gSquareVertexBuffer);

    // Loads verticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
}

function initSimpleShader(vertexShaderID: string, fragmentShaderID: string): boolean
{
    // Load and compile vertex and fragment shaders
    let vertexShader = loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER);
    let fragmentShader = loadAndCompileShader(fragmentShaderID, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader)
    {
        return false;
    }

    // Create and link the shaders to a program
    simpleShaderProgram = gl.createProgram();
    gl.attachShader(simpleShaderProgram, vertexShader);
    gl.attachShader(simpleShaderProgram, fragmentShader);
    gl.linkProgram(simpleShaderProgram);

    // Check for error
    if (!gl.getProgramParameter(simpleShaderProgram, gl.LINK_STATUS))
    {
        console.log("Error linking shader");
        return false;
    }

    // Gets a reference to the a_Position variable within the shaders
    shaderVertexPositionAttribute = gl.getAttribLocation(simpleShaderProgram, "a_Position");
    if (shaderVertexPositionAttribute < 0)
    {
        console.log("Failed to get a reference to the a_Position variable")
        return false;
    }

    // Activates the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gSquareVertexBuffer);

    // Discribe the characteristic of the vertex position attribute
    gl.vertexAttribPointer(shaderVertexPositionAttribute,
        3,          // each vertex element is a 3-float (x, y, z)
        gl.FLOAT,   // data type is FLOAT
        false,      // if the content is normalized vectors
        0,          // number of bytes to skip in bitween elements
        0           // offsets to the first element
    );

    return true;
}

function loadAndCompileShader(id: string, shaderType: number): WebGLShader
{
    // Get the shader source from index.html
    let shaderText = document.getElementById(id);
    let shaderSource = shaderText.firstChild.textContent;

    // Create the shader based on the shader type: vertex or fragment
    let compiledShader = gl.createShader(shaderType);

    // Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Check for errors and return results (null if error)
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS))
    {
        console.log(`A shader compiling error occured: ${gl.getShaderInfoLog(compiledShader)}`);
        return null;
    }

    return compiledShader;
}