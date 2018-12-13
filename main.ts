
import { Painter } from "./painter";
import { Game } from "./game";
import { SnakeDirection } from "./snake";

import
{
    gl, initGL
} from "./globals";

let game = new Game();
let painter = new Painter();

function display()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    game.Draw(painter);
}

function timer()
{
    game.Tick();
    display();
}

function keyEvent(event: KeyboardEvent)
{
    switch (event.keyCode)
    {
        case 65: // A
        case 37: // Left Arrow
            game.KeyEvent(SnakeDirection.Left);
            break;
        case 87: // W
        case 38: // Up Arrow
            game.KeyEvent(SnakeDirection.Up);
            break;
        case 68: // D
        case 39: // Right Arrow
            game.KeyEvent(SnakeDirection.Right);
            break;
        case 83: // S
        case 40: // Down Arrow
            game.KeyEvent(SnakeDirection.Down);
            break;
    }
}

function main()
{
    // Retrieve the canvas element
    let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    if (canvas == null)
    {
        console.log("Failed to retrieve the canvas element");
        return;
    }

    // Initialize GL
    if (!initGL(canvas))
    {
        console.log("Failed to initialize GL");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    window.addEventListener("keydown", keyEvent);

    setInterval(timer, 300);
}

main();
