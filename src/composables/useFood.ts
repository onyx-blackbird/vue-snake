import { reactive } from 'vue';

import seedrandom from 'seedrandom';

import Position, { type IPosition } from '@/model/Position';
import type ISnake from '@/model/Snake';

const RNG = seedrandom();

export default function useFood(maxX: number, maxY: number, snake: ISnake) {
	const isSnakeBody = (foodX: number, foodY: number): boolean => {
		if (foodX === snake.head.x && foodY === snake.head.y) return true;
		if (foodX === snake.tail.x &&  foodY === snake.tail.y) return true;
		for (let i = 0; i < snake.body.length; i++) {
			const segment = snake.body[i];
			if (foodX === segment.x && foodY === segment.y) return true;
		}
		return false;
	};

	const getNewFoodPosition = (): IPosition => {
		let foodX, foodY;
		do {
			foodX = Math.round(RNG() * maxX);
			foodY = Math.round(RNG() * maxY);
		} while (isSnakeBody(foodX, foodY));
		return new Position(foodX, foodY);
	};

	const food = reactive(getNewFoodPosition());

	const placeFood = (): void => {
		const foodPostion = getNewFoodPosition();
		food.x = foodPostion.x;
		food.y = foodPostion.y;
	};
	return {
		food,
		placeFood,
	};
}
