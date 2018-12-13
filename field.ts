import { Painter } from "./painter";
import { getRandomInt } from "./random";

export enum FieldSize
{
    Width = 20, Height = 20
}

export enum BlockSize
{
    Width = 10, Height = 10
}

export enum BlockType
{
    Empty, SnakeBlock, Fruit
}

export class Field
{
    private _m: any[] = [];

    public constructor()
    {
        for (let y = 0; y < FieldSize.Height; ++y)
        {
            let columns: BlockType[] = [];
            for (let x = 0; x < FieldSize.Width; ++x)
            {
                columns[x] = BlockType.Empty;
            }
            this._m[y] = columns;
        }
        this.NewFruit();
    }

    public SetBlock(type: BlockType, x: number, y: number)
    {
        this._m[y][x] = type;
    }

    public GetBlock(x: number, y: number): BlockType
    {
        return this._m[y][x];
    }

    public Draw(p: Painter): void
    {
        for (let y = 0; y < FieldSize.Height; ++y)
        {
            for (let x = 0; x < FieldSize.Width; ++x)
            {
                switch (this._m[y][x])
                {
                    case BlockType.Empty:
                        break;
                    case BlockType.SnakeBlock:
                        p.Bar(x * BlockSize.Width + BlockSize.Width / 2,
                            y * BlockSize.Height + BlockSize.Height / 2,
                            BlockSize.Width - 1, BlockSize.Height - 1);
                        break;
                    case BlockType.Fruit:
                        p.Circle(x * BlockSize.Width + BlockSize.Width / 2,
                            y * BlockSize.Height + BlockSize.Height / 2, BlockSize.Width - 1);
                        break;
                }
            }
        }
    }

    public NewFruit(): void
    {
        let x: number;
        let y: number;
        do
        {
            x = getRandomInt(0, FieldSize.Width - 1);
            y = getRandomInt(0, FieldSize.Height - 1);
        } while (this.GetBlock(x, y) != BlockType.Empty);
        this.SetBlock(BlockType.Fruit, x, y);
    }
}
