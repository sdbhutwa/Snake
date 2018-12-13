/// <reference path="./lib/gl-matrix.d.ts" />

import { FieldSize, BlockSize } from "./field";

import
{
    gl, simpleShaderProgram,
    shaderVertexPositionAttribute,
    u_FragColor, u_ModelTransform,
    u_ProjTransform
} from "./globals";

export class Painter
{
    public Bar(x: number, y: number, width: number, height: number): void
    {
        this.ActiveShader([0.0, 1.0, 0.0, 1.0]);
        this.SetProjectionMatrix();
        this.Transform(x, y, width, height);

        // Draw with the above settings
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    public Circle(x: number, y: number, diameter: number): void
    {
        this.ActiveShader([1.0, 0.0, 0.0, 1.0]);
        this.SetProjectionMatrix();
        this.Transform(x, y, diameter, diameter);

        // Draw with the above settings
        gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    }

    private SetProjectionMatrix()
    {
        let projMatrix = mat4.create();
        mat4.ortho(projMatrix,
            0, FieldSize.Width * BlockSize.Width,
            FieldSize.Height * BlockSize.Width, 0, 1, -1);
        gl.uniformMatrix4fv(u_ProjTransform, false, projMatrix);
    }

    private ActiveShader(color: number[])
    {
        // Enable the shader to use
        gl.useProgram(simpleShaderProgram);

        // Enable the vertex position attribute
        gl.enableVertexAttribArray(shaderVertexPositionAttribute);

        // Set Color
        gl.uniform4fv(u_FragColor, color);
    }

    private Transform(x: number, y: number, w: number, h: number)
    {
        // Creates a blank identity matrix
        let matrix = mat4.create();

        // Compute translation and scaling
        mat4.translate(matrix, matrix, vec3.fromValues(x, y, 0.0));
        //mat4.rotateZ(matrix, matrix, 0.0);
        mat4.scale(matrix, matrix, vec3.fromValues(w, h, 1.0));

        // Loads the modelTransform matrix into WebGL to be used by the vertex shader
        gl.uniformMatrix4fv(u_ModelTransform, false, matrix);
    }
}