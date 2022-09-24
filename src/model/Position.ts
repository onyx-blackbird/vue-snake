import type { CSSProperties } from 'vue';
import { GridSize } from './common';

export interface IPosition {
	x: number;
	y: number;
}

export default class Position implements IPosition {
	private _x: number;
	private _y: number;

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	set x(x: number) {
		this._x = x;
	}

	set y(y: number) {
		this._y = y;
	}
}

export const getCoordinates = (position: IPosition): CSSProperties => {
	return {
		left: position.x * GridSize + 'px',
		top: position.y * GridSize + 'px',
	};
};
