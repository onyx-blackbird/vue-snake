import { reactive } from 'vue';
import { Direction } from './common';
import Position from './Position';

export class Snake {
	private _head: Position;
	private _body: Position[] = [];
	private _tail: Position;
	private _direction: Direction = Direction.UNKNOWN;

	constructor(startPosition: Position) {
		this._head = startPosition;
		this._tail = startPosition;
	}

	get head(): Position {
		return this._head;
	}

	get body(): Position[] {
		return this._body;
	}

	get tail(): Position {
		return this._tail;
	}

	get direction(): Direction {
		return this._direction;
	}

	set direction(direction: Direction) {
		this._direction = direction;
	}

	public moveBody(prevHead: Position): void {
		if (this._body.length == 0) {
			switch (this._direction) {
				case Direction.DOWN:
					this._tail = new Position(this._head.x, this._head.y - 1);
					break;
				case Direction.LEFT:
					this._tail = new Position(this._head.x + 1, this._head.y);
					break;
				case Direction.RIGHT:
					this._tail = new Position(this._head.x - 1, this._head.y);
					break;
				case Direction.UP:
					this._tail = new Position(this._head.x, this._head.y + 1);
					break;
			}
		} else {
			const lastSegment = this._body[this._body.length - 1];
			this._tail.x = lastSegment.x;
			this._tail.y = lastSegment.y;
			for (let i = this._body.length - 1; i > 0; i--) {
				this._body[i].x = this._body[i - 1].x;
				this._body[i].y = this._body[i - 1].y;
			}
			this._body[0].x = prevHead.x;
			this._body[0].y = prevHead.y;
		}
	}

	public reset(x: number, y: number) {
		const startPosition = new Position(x, y);
		this._head = startPosition;
		this._tail = startPosition;
		this._body = [];
		this._direction = Direction.UNKNOWN;
	}
}

export default function useSnake(x: number, y: number) {
	const snake = reactive(new Snake(new Position(x, y)));
	return snake;
}
