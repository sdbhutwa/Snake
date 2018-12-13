
import { Painter } from "./painter";
import { Field } from "./field";
import { Snake, SnakeDirection } from "./snake";

export class Game
{
    private _field: Field = null;
    private _snake: Snake = null;

    public constructor()
    {
        this._field = new Field();
        this._snake = new Snake();
    }

    public Tick(): void
    {
        if (!this._snake.Tick(this._field))
        {
            this._field = new Field();
            this._snake = new Snake();
        }
    }

    public Draw(p: Painter): void
    {
        this._field.Draw(p);
    }

    public KeyEvent(d: SnakeDirection)
    {
        this._snake.KeyEvent(d);
    }
}