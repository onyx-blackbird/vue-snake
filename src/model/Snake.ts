import { Direction } from './common';
import Position, { type IPosition } from './Position';

export interface ISnake {
	head: IPosition;
	body: IPosition[];
	tail: IPosition;
	direction: Direction;
	getNewHeadPosition(): IPosition;
	moveBody(prevHead: IPosition): void;
}

export default class Snake implements ISnake {
	private _head: IPosition;
	private _body: IPosition[] = [];
	private _tail: IPosition;
	private _direction: Direction = Direction.UNKNOWN;

	constructor(startPosition: IPosition) {
		this._head = startPosition;
		this._tail = startPosition;
	}

	get head(): IPosition {
		return this._head;
	}

	get body(): IPosition[] {
		return this._body;
	}

	get tail(): IPosition {
		return this._tail;
	}

	get direction(): Direction {
		return this._direction;
	}

	set direction(direction: Direction) {
		this._direction = direction;
	}

	public getNewHeadPosition(): IPosition {
		switch (this._direction) {
			case Direction.DOWN:
				return new Position(this._head.x, this._head.y + 1);
			case Direction.LEFT:
				return new Position(this._head.x - 1, this._head.y);
			case Direction.RIGHT:
				return new Position(this._head.x + 1, this._head.y);
			case Direction.UP:
				return new Position(this._head.x, this._head.y - 1);
			default:
				return new Position(this._head.x, this._head.y);
		}
	}

	public moveBody(prevHead: IPosition): void {
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
}
