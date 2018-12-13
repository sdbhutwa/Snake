(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = require("./random");
var FieldSize;
(function (FieldSize) {
    FieldSize[FieldSize["Width"] = 20] = "Width";
    FieldSize[FieldSize["Height"] = 20] = "Height";
})(FieldSize = exports.FieldSize || (exports.FieldSize = {}));
var BlockSize;
(function (BlockSize) {
    BlockSize[BlockSize["Width"] = 10] = "Width";
    BlockSize[BlockSize["Height"] = 10] = "Height";
})(BlockSize = exports.BlockSize || (exports.BlockSize = {}));
var BlockType;
(function (BlockType) {
    BlockType[BlockType["Empty"] = 0] = "Empty";
    BlockType[BlockType["SnakeBlock"] = 1] = "SnakeBlock";
    BlockType[BlockType["Fruit"] = 2] = "Fruit";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var Field = (function () {
    function Field() {
        this._m = [];
        for (var y = 0; y < FieldSize.Height; ++y) {
            var columns = [];
            for (var x = 0; x < FieldSize.Width; ++x) {
                columns[x] = BlockType.Empty;
            }
            this._m[y] = columns;
        }
        this.NewFruit();
    }
    Field.prototype.SetBlock = function (type, x, y) {
        this._m[y][x] = type;
    };
    Field.prototype.GetBlock = function (x, y) {
        return this._m[y][x];
    };
    Field.prototype.Draw = function (p) {
        for (var y = 0; y < FieldSize.Height; ++y) {
            for (var x = 0; x < FieldSize.Width; ++x) {
                switch (this._m[y][x]) {
                    case BlockType.Empty:
                        break;
                    case BlockType.SnakeBlock:
                        p.Bar(x * BlockSize.Width + BlockSize.Width / 2, y * BlockSize.Height + BlockSize.Height / 2, BlockSize.Width - 1, BlockSize.Height - 1);
                        break;
                    case BlockType.Fruit:
                        p.Circle(x * BlockSize.Width + BlockSize.Width / 2, y * BlockSize.Height + BlockSize.Height / 2, BlockSize.Width - 1);
                        break;
                }
            }
        }
    };
    Field.prototype.NewFruit = function () {
        var x;
        var y;
        do {
            x = random_1.getRandomInt(0, FieldSize.Width - 1);
            y = random_1.getRandomInt(0, FieldSize.Height - 1);
        } while (this.GetBlock(x, y) != BlockType.Empty);
        this.SetBlock(BlockType.Fruit, x, y);
    };
    return Field;
}());
exports.Field = Field;
},{"./random":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var field_1 = require("./field");
var snake_1 = require("./snake");
var Game = (function () {
    function Game() {
        this._field = null;
        this._snake = null;
        this._field = new field_1.Field();
        this._snake = new snake_1.Snake();
    }
    Game.prototype.Tick = function () {
        if (!this._snake.Tick(this._field)) {
            this._field = new field_1.Field();
            this._snake = new snake_1.Snake();
        }
    };
    Game.prototype.Draw = function (p) {
        this._field.Draw(p);
    };
    Game.prototype.KeyEvent = function (d) {
        this._snake.KeyEvent(d);
    };
    return Game;
}());
exports.Game = Game;
},{"./field":1,"./snake":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gl = null;
exports.simpleShaderProgram = null;
exports.u_FragColor = null;
exports.u_ModelTransform = null;
exports.u_ProjTransform = null;
var gSquareVertexBuffer = null;
function initGL(canvas) {
    // Get the rendering context
    exports.gl = getWebGLContext(canvas);
    if (exports.gl == null) {
        console.log("Failed to get the rendering context");
        return false;
    }
    initSquareBuffer();
    if (!initSimpleShader("VertexShader", "FragmentShader")) {
        return false;
    }
    exports.u_FragColor = exports.gl.getUniformLocation(exports.simpleShaderProgram, "u_FragColor");
    if (!exports.u_FragColor) {
        console.log("Failed to get u_FragColor location");
        return false;
    }
    exports.u_ModelTransform = exports.gl.getUniformLocation(exports.simpleShaderProgram, "u_ModelTransform");
    if (!exports.u_ModelTransform) {
        console.log("Failed to get u_ModelTransfrom location");
        return false;
    }
    exports.u_ProjTransform = exports.gl.getUniformLocation(exports.simpleShaderProgram, "u_ProjTransform");
    if (!exports.u_ProjTransform) {
        console.log("Faile to get u_ProjTransform location");
        return false;
    }
    return true;
}
exports.initGL = initGL;
function getWebGLContext(canvas) {
    var gl = null;
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl == null) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        console.log(e);
    }
    return gl;
}
function initSquareBuffer() {
    // Define the vertices for a square
    var verticesOfSquare = [
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
    gSquareVertexBuffer = exports.gl.createBuffer();
    // Activate vertexBuffer
    exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, gSquareVertexBuffer);
    // Loads verticesOfSquare into the vertexBuffer
    exports.gl.bufferData(exports.gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), exports.gl.STATIC_DRAW);
}
function initSimpleShader(vertexShaderID, fragmentShaderID) {
    // Load and compile vertex and fragment shaders
    var vertexShader = loadAndCompileShader(vertexShaderID, exports.gl.VERTEX_SHADER);
    var fragmentShader = loadAndCompileShader(fragmentShaderID, exports.gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
        return false;
    }
    // Create and link the shaders to a program
    exports.simpleShaderProgram = exports.gl.createProgram();
    exports.gl.attachShader(exports.simpleShaderProgram, vertexShader);
    exports.gl.attachShader(exports.simpleShaderProgram, fragmentShader);
    exports.gl.linkProgram(exports.simpleShaderProgram);
    // Check for error
    if (!exports.gl.getProgramParameter(exports.simpleShaderProgram, exports.gl.LINK_STATUS)) {
        console.log("Error linking shader");
        return false;
    }
    // Gets a reference to the a_Position variable within the shaders
    exports.shaderVertexPositionAttribute = exports.gl.getAttribLocation(exports.simpleShaderProgram, "a_Position");
    if (exports.shaderVertexPositionAttribute < 0) {
        console.log("Failed to get a reference to the a_Position variable");
        return false;
    }
    // Activates the vertex buffer
    exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, gSquareVertexBuffer);
    // Discribe the characteristic of the vertex position attribute
    exports.gl.vertexAttribPointer(exports.shaderVertexPositionAttribute, 3, // each vertex element is a 3-float (x, y, z)
    exports.gl.FLOAT, // data type is FLOAT
    false, // if the content is normalized vectors
    0, // number of bytes to skip in bitween elements
    0 // offsets to the first element
    );
    return true;
}
function loadAndCompileShader(id, shaderType) {
    // Get the shader source from index.html
    var shaderText = document.getElementById(id);
    var shaderSource = shaderText.firstChild.textContent;
    // Create the shader based on the shader type: vertex or fragment
    var compiledShader = exports.gl.createShader(shaderType);
    // Compile the created shader
    exports.gl.shaderSource(compiledShader, shaderSource);
    exports.gl.compileShader(compiledShader);
    // Check for errors and return results (null if error)
    if (!exports.gl.getShaderParameter(compiledShader, exports.gl.COMPILE_STATUS)) {
        console.log("A shader compiling error occured: " + exports.gl.getShaderInfoLog(compiledShader));
        return null;
    }
    return compiledShader;
}
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var painter_1 = require("./painter");
var game_1 = require("./game");
var snake_1 = require("./snake");
var globals_1 = require("./globals");
var game = new game_1.Game();
var painter = new painter_1.Painter();
function display() {
    globals_1.gl.clear(globals_1.gl.COLOR_BUFFER_BIT);
    game.Draw(painter);
}
function timer() {
    game.Tick();
    display();
}
function keyEvent(event) {
    switch (event.keyCode) {
        case 65: // A
        case 37:
            game.KeyEvent(snake_1.SnakeDirection.Left);
            break;
        case 87: // W
        case 38:
            game.KeyEvent(snake_1.SnakeDirection.Up);
            break;
        case 68: // D
        case 39:
            game.KeyEvent(snake_1.SnakeDirection.Right);
            break;
        case 83: // S
        case 40:
            game.KeyEvent(snake_1.SnakeDirection.Down);
            break;
    }
}
function main() {
    // Retrieve the canvas element
    var canvas = document.getElementById("renderCanvas");
    if (canvas == null) {
        console.log("Failed to retrieve the canvas element");
        return;
    }
    // Initialize GL
    if (!globals_1.initGL(canvas)) {
        console.log("Failed to initialize GL");
        return;
    }
    globals_1.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    window.addEventListener("keydown", keyEvent);
    setInterval(timer, 300);
}
main();
},{"./game":2,"./globals":3,"./painter":5,"./snake":7}],5:[function(require,module,exports){
"use strict";
/// <reference path="./lib/gl-matrix.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var field_1 = require("./field");
var globals_1 = require("./globals");
var Painter = (function () {
    function Painter() {
    }
    Painter.prototype.Bar = function (x, y, width, height) {
        this.ActiveShader([0.0, 1.0, 0.0, 1.0]);
        this.SetProjectionMatrix();
        this.Transform(x, y, width, height);
        // Draw with the above settings
        globals_1.gl.drawArrays(globals_1.gl.TRIANGLE_STRIP, 0, 4);
    };
    Painter.prototype.Circle = function (x, y, diameter) {
        this.ActiveShader([1.0, 0.0, 0.0, 1.0]);
        this.SetProjectionMatrix();
        this.Transform(x, y, diameter, diameter);
        // Draw with the above settings
        globals_1.gl.drawArrays(globals_1.gl.TRIANGLE_STRIP, 4, 4);
    };
    Painter.prototype.SetProjectionMatrix = function () {
        var projMatrix = mat4.create();
        mat4.ortho(projMatrix, 0, field_1.FieldSize.Width * field_1.BlockSize.Width, field_1.FieldSize.Height * field_1.BlockSize.Width, 0, 1, -1);
        globals_1.gl.uniformMatrix4fv(globals_1.u_ProjTransform, false, projMatrix);
    };
    Painter.prototype.ActiveShader = function (color) {
        // Enable the shader to use
        globals_1.gl.useProgram(globals_1.simpleShaderProgram);
        // Enable the vertex position attribute
        globals_1.gl.enableVertexAttribArray(globals_1.shaderVertexPositionAttribute);
        // Set Color
        globals_1.gl.uniform4fv(globals_1.u_FragColor, color);
    };
    Painter.prototype.Transform = function (x, y, w, h) {
        // Creates a blank identity matrix
        var matrix = mat4.create();
        // Compute translation and scaling
        mat4.translate(matrix, matrix, vec3.fromValues(x, y, 0.0));
        //mat4.rotateZ(matrix, matrix, 0.0);
        mat4.scale(matrix, matrix, vec3.fromValues(w, h, 1.0));
        // Loads the modelTransform matrix into WebGL to be used by the vertex shader
        globals_1.gl.uniformMatrix4fv(globals_1.u_ModelTransform, false, matrix);
    };
    return Painter;
}());
exports.Painter = Painter;
},{"./field":1,"./globals":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {float} a random floating point number
 */
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandom = getRandom;
/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.getRandomInt = getRandomInt;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var field_1 = require("./field");
var random_1 = require("./random");
var SnakeDirection;
(function (SnakeDirection) {
    SnakeDirection[SnakeDirection["Left"] = 0] = "Left";
    SnakeDirection[SnakeDirection["Up"] = 1] = "Up";
    SnakeDirection[SnakeDirection["Right"] = 2] = "Right";
    SnakeDirection[SnakeDirection["Down"] = 3] = "Down";
})(SnakeDirection = exports.SnakeDirection || (exports.SnakeDirection = {}));
var Snake = (function () {
    function Snake() {
        this._snakeBlocks = [];
        this._snakeBlocks.push({ x: field_1.FieldSize.Width / 2, y: field_1.FieldSize.Height / 2 });
        this._direction = random_1.getRandomInt(0, 3);
        this._lastMove = this._direction;
    }
    Snake.prototype.Tick = function (field) {
        this._lastMove = this._direction;
        var p = Object.create(this._snakeBlocks[0]);
        switch (this._direction) {
            case SnakeDirection.Left:
                p.x--;
                break;
            case SnakeDirection.Up:
                p.y--;
                break;
            case SnakeDirection.Right:
                p.x++;
                break;
            case SnakeDirection.Down:
                p.y++;
                break;
        }
        if (p.x < 0 || p.x >= field_1.FieldSize.Width || p.y < 0 || p.y >= field_1.FieldSize.Height) {
            return false;
        }
        if (field.GetBlock(p.x, p.y) == field_1.BlockType.SnakeBlock) {
            return false;
        }
        this._snakeBlocks.unshift(p);
        if (field.GetBlock(p.x, p.y) != field_1.BlockType.Fruit) {
            field.SetBlock(field_1.BlockType.SnakeBlock, p.x, p.y);
            var x = this._snakeBlocks[this._snakeBlocks.length - 1].x;
            var y = this._snakeBlocks[this._snakeBlocks.length - 1].y;
            field.SetBlock(field_1.BlockType.Empty, x, y);
            this._snakeBlocks.pop();
        }
        else {
            field.SetBlock(field_1.BlockType.SnakeBlock, p.x, p.y);
            field.NewFruit();
        }
        if (this._snakeBlocks.length >= field_1.FieldSize.Width * field_1.FieldSize.Height - 1) {
            return false;
        }
        return true;
    };
    Snake.prototype.KeyEvent = function (d) {
        if (d == this._direction) {
            return;
        }
        switch (d) {
            case SnakeDirection.Left:
                if (this._lastMove == SnakeDirection.Right) {
                    return;
                }
                break;
            case SnakeDirection.Up:
                if (this._lastMove == SnakeDirection.Down) {
                    return;
                }
                break;
            case SnakeDirection.Right:
                if (this._lastMove == SnakeDirection.Left) {
                    return;
                }
                break;
            case SnakeDirection.Down:
                if (this._lastMove == SnakeDirection.Up) {
                    return;
                }
                break;
        }
        this._direction = d;
    };
    return Snake;
}());
exports.Snake = Snake;
},{"./field":1,"./random":6}]},{},[4])
