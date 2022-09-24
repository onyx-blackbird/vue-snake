export const GridSize: number = 20;

export enum Direction {
	UP,
	DOWN,
	LEFT,
	RIGHT,
	UNKNOWN,
}

export interface Coordinates {
	left: string;
	top: string;
}

export interface GameSize {
	w: number;
	h: number;
}
