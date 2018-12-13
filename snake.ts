
import { Field, FieldSize, BlockType } from "./field";
import { getRandomInt } from "./random";

export enum SnakeDirection
{
    Left, Up, Right, Down
}

export class Snake
{
    private _snakeBlocks: { x: number, y: number }[] = [];
    private _direction: SnakeDirection;
    private _lastMove: SnakeDirection;

    public constructor()
    {
        this._snakeBlocks.push({ x: FieldSize.Width / 2, y: FieldSize.Height / 2 });
        this._direction = getRandomInt(0, 3) as SnakeDirection;
        this._lastMove = this._direction;
    }

    public Tick(field: Field): boolean
    {
        this._lastMove = this._direction;
        let p = Object.create(this._snakeBlocks[0]);

        switch (this._direction)
        {
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

        if (p.x < 0 || p.x >= FieldSize.Width || p.y < 0 || p.y >= FieldSize.Height)
        {
            return false;
        }

        if (field.GetBlock(p.x, p.y) == BlockType.SnakeBlock)
        {
            return false;
        }

        this._snakeBlocks.unshift(p);

        if (field.GetBlock(p.x, p.y) != BlockType.Fruit)
        {
            field.SetBlock(BlockType.SnakeBlock, p.x, p.y);
            let x = this._snakeBlocks[this._snakeBlocks.length - 1].x;
            let y = this._snakeBlocks[this._snakeBlocks.length - 1].y;
            field.SetBlock(BlockType.Empty, x, y);
            this._snakeBlocks.pop();
        }
        else
        {
            field.SetBlock(BlockType.SnakeBlock, p.x, p.y);
            field.NewFruit();
        }

        if (this._snakeBlocks.length >= FieldSize.Width * FieldSize.Height - 1)
        {
            return false;
        }

        return true;
    }

    public KeyEvent(d: SnakeDirection)
    {
        if (d == this._direction)
        {
            return;
        }

        switch (d)
        {
            case SnakeDirection.Left:
                if (this._lastMove == SnakeDirection.Right)
                {
                    return;
                }
                break;
            case SnakeDirection.Up:
                if (this._lastMove == SnakeDirection.Down)
                {
                    return;
                }
                break;
            case SnakeDirection.Right:
                if (this._lastMove == SnakeDirection.Left)
                {
                    return;
                }
                break;
            case SnakeDirection.Down:
                if (this._lastMove == SnakeDirection.Up)
                {
                    return;
                }
                break;
        }

        this._direction = d;
    }
}