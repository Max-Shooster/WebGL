  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // Global declarations of objects you will be drawing
  

  // GLSL programs
  let programs = [];
  
  // VAOs for the objects
  var myPlanet = null;
  var myCloudTree = null;
  var myRocks = null;

  // textures
  let planetTexture;
  let rockTexture;
  let cloudTreeTexture;

  // rotation
  var sphere_angles = [180.0, 180.0, 0.0];
  var angles = sphere_angles;
  var anglesReset = [180.0, 180.0,  0.0];

  var angleInc = 5.0;


 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {

  myPlanet = new Planet();
  myPlanet.VAO = bindVAO (myPlanet, programs[0]);

  myCloudTree = new CloudTree();
  myCloudTree.VAO = bindVAO (myCloudTree, programs[0]);

  myRocks = new Rocks();
  myRocks.VAO = bindVAO (myRocks, programs[0]);

}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    // function useProgram.
    gl.useProgram (program);
    
    // set up your projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, 0.5, 1, -5, 1, 300.0);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

    // set up your view
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -400], [20, -20, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);

}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // get some texture space from the gpu
    planetTexture = gl.createTexture();
    rockTexture = gl.createTexture();
    cloudTreeTexture = gl.createTexture();

    // load the actual image
    var planetImage = document.getElementById ('planet-texture');
    var rockImage = document.getElementById ('rocks-texture');
    var cloudTreeImage = document.getElementById ('cloudtree-texture');
        
    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, planetTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, planetImage.width, planetImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, planetImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    gl.bindTexture (gl.TEXTURE_2D, rockTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rockImage.width, rockImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, rockImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.bindTexture (gl.TEXTURE_2D, cloudTreeTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cloudTreeImage.width, cloudTreeImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, cloudTreeImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        
}

//
//  This function draws all of the shapes required for your scene
//
function drawShapes() {

    gl.useProgram (programs[0]);

    // set up rotation uniform
    gl.uniform3fv (programs[0].uTheta, new Float32Array(angles));

    // drawing the Planet rotating around Y  180 degrees
    let planetMatrix = glMatrix.mat4.create();
    // send the Planet model matrix to the shader and draw.
    glMatrix.mat4.translate(planetMatrix, planetMatrix, [20, -30, 0]);
    gl.uniformMatrix4fv (programs[0].uModelT, false, planetMatrix);
    gl.bindVertexArray(myPlanet.VAO);
    gl.activeTexture (gl.TEXTURE0);
    gl.bindTexture (gl.TEXTURE_2D, planetTexture);
    gl.uniform1i (programs[0].uThePlanetTexture, 0);
    gl.drawElements(gl.TRIANGLES, myPlanet.indices.length, gl.UNSIGNED_SHORT, 0);

    // Draw Clouds and Trees
    let cloudTreeMatrix = glMatrix.mat4.create();
    // send the clouds and trees model matrix to the shader and draw.
    glMatrix.mat4.translate(cloudTreeMatrix, cloudTreeMatrix, [20, -30, 0]);
    gl.uniformMatrix4fv (programs[0].uModelT, false, cloudTreeMatrix);
    gl.bindVertexArray(myCloudTree.VAO);
    // Cloud tree TEXTURE
    gl.activeTexture (gl.TEXTURE2);
    gl.bindTexture (gl.TEXTURE_2D, cloudTreeTexture);
    gl.uniform1i (programs[0].uThePlanetTexture, 2);
    gl.drawElements(gl.TRIANGLES, myCloudTree.indices.length, gl.UNSIGNED_SHORT, 0);

    // Draw Rocks
    let rocksMatrix = glMatrix.mat4.create();
    // send the rocks model matrix to the shader and draw.
    glMatrix.mat4.translate(rocksMatrix, rocksMatrix, [20, -30, 0]);
    gl.uniformMatrix4fv (programs[0].uModelT, false, rocksMatrix);
    gl.bindVertexArray(myRocks.VAO);
    // Rock TEXTURE
    gl.activeTexture (gl.TEXTURE1);
    gl.bindTexture (gl.TEXTURE_2D, rockTexture);
    gl.uniform1i (programs[0].uThePlanetTexture, 1);
    gl.drawElements(gl.TRIANGLES, myRocks.indices.length, gl.UNSIGNED_SHORT, 0);

    }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {

    programs.push(initProgram('sphereMap-V', 'sphereMap-F'));
    programs.push(initProgram('wireframe-V', 'wireframe-F'));

    // Use this program instance
    gl.useProgram(programs[0]);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    programs[0].aVertexPosition = gl.getAttribLocation(programs[0], 'aVertexPosition');
    programs[0].aBary = gl.getAttribLocation(programs[0], 'bary');
    programs[0].uModelT = gl.getUniformLocation (programs[0], 'modelT');
    programs[0].uViewT = gl.getUniformLocation (programs[0], 'viewT');
    programs[0].uProjT = gl.getUniformLocation (programs[0], 'projT');
    programs[0].aUV = gl.getAttribLocation(programs[0], 'aUV');
    programs[0].uTheta = gl.getUniformLocation (programs[0], 'theta');

    programs[0].uThePlanetTexture = gl.getUniformLocation (programs[0], 'thePlanetTexture');

    programs[0].aNormal = gl.getAttribLocation(programs[0], 'aNormal');
    programs[0].ambientLight = gl.getUniformLocation (programs[0], 'ambientLight');
    programs[0].lightPosition = gl.getUniformLocation (programs[0], 'lightPosition');
    programs[0].lightColor = gl.getUniformLocation (programs[0], 'lightColor');
    programs[0].baseColor = gl.getUniformLocation (programs[0], 'baseColor');
    programs[0].specHighlightColor = gl.getUniformLocation (programs[0], 'specHighlightColor');
    programs[0].ka = gl.getUniformLocation (programs[0], 'ka');
    programs[0].kd = gl.getUniformLocation (programs[0], 'kd');
    programs[0].ks = gl.getUniformLocation (programs[0], 'ks');
    programs[0].ke = gl.getUniformLocation (programs[0], 'ke');

    programs[1].aVertexPosition = gl.getAttribLocation(programs[1], 'aVertexPosition');
    programs[1].aBary = gl.getAttribLocation(programs[1], 'bary');
    programs[1].uModelT = gl.getUniformLocation (programs[1], 'modelT');
    programs[1].uViewT = gl.getUniformLocation (programs[1], 'viewT');
    programs[1].uProjT = gl.getUniformLocation (programs[1], 'projT');

  }


  // creates a VAO and returns its ID
  function bindVAO (shape, program) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.verts), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(programs[0].aVertexPosition);
      gl.vertexAttribPointer(programs[0].aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      
      // add code for any additional vertex attribute
    // create, bind, and fill buffer for uv's
    // uvs can be obtained from the uv member of the
    // shape object.  2 floating point values (u,v) per vertex are
    // stored in this array.
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uvs), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aUV);
    gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
  }

  function setUpPhong(program) {
    
    // Recall that you must set the program to be current using
    // the gl useProgram function
    gl.useProgram (program);

    //
    // LIGHT PARAMETERS
    gl.uniform3f (program.ambientLight, 1, 1, 1);
    gl.uniform3f (program.lightPosition, 10000, 10000, 10000);
    gl.uniform3f (program.lightColor, 1.0, 1.0, 1.0);
    //OBJECT COLOR PARAMETERS
    gl.uniform3f (program.baseColor, 1, 1, 1);
    gl.uniform3f (program.specHighlightColor, 1, 1, 1);
    // PHONG PARAMETERS
    gl.uniform1f (program.ka, 1.0);
    gl.uniform1f (program.kd, 1.0);
    gl.uniform1f (program.ks, 1.0);
    gl.uniform1f (program.ke, 5.0);
    
}


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    //console.log(fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aUV = gl.getAttribLocation(program, 'aUV');
    // uniforms - you will need to add references for any additional
    // uniforms that you add to your shaders
    program.uThePlanetTexture = gl.getUniformLocation (program, 'thePlanetTexture');
    program.uTheta = gl.getUniformLocation (program, 'theta');
    //
    program.uTheRockTexture = gl.getUniformLocation (program, 'theRockTexture');
    program.uTheCloudTreeTexture = gl.getUniformLocation (program, 'theCloudTreeTexture');

    return program;
  }


  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
    //console.log(gotKey);

    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,0.0)
    gl.depthFunc(gl.GREATER)
    gl.clearDepth(0.0)
    gl.clear(gl.COLOR_BUFFER_BIT| gl.GL_DEPTH_BUFFER_BIT);

    // Read, compile, and link your shaders
    initPrograms();
    
    // create and bind your current object
    createShapes();

    // Set up camera
    setUpCamera(programs[0]);

    // set up your textures
    setUpTextures();

    setUpPhong(programs[0]);

    // do a draw
    draw();
  }
