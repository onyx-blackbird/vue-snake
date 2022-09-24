<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';

import seedrandom from 'seedrandom';

import SnakeFigure from './components/SnakeFigure.vue';
import { Direction } from './model/common';
import Position, { getCoordinates } from '@/model/Position';
import useSnake from './model/Snake';

const maxX = 39;
const maxY = 29;
const RNG = seedrandom();

const snake = useSnake(20, 15);
const food = reactive({
	position: null as null | Position,
});
const interval = ref(200);

const getNewFoodPosition = (): Position => {
	var foodX = Math.round(RNG() * maxX);
	var foodY = Math.round(RNG() * maxY);
	return new Position(foodX, foodY);
};

const placeFood = (): void => {
	let foodPostion = getNewFoodPosition();
	while (foodPostion.x == snake.head.x && foodPostion.y == snake.head.y) {
		foodPostion = getNewFoodPosition();
	}
	food.position = foodPostion;
};

let timeoutId = 0;
const gameOver = (): void => {
	clearTimeout(timeoutId);
	window.removeEventListener('keydown', onKeyDown);
	console.log('GAME OVER');
};
const willCollide = (position: Position): boolean => {
	if (position.x < 0) return true;
	if (position.x > maxX) return true;
	if (position.y < 0) return true;
	if (position.y > maxY) return true;
	for (let i = 0; i < snake.body.length; i++) {
		const segment = snake.body[i];
		if (segment.x === position.x && segment.y === position.y) return true;
	}
	if (snake.tail.x === position.x && snake.tail.y === position.y) return true;
	return false;
};
const getNewHeadPosition = (): Position => {
	switch (snake.direction) {
		case Direction.DOWN:
			return new Position(snake.head.x, snake.head.y + 1);
		case Direction.LEFT:
			return new Position(snake.head.x - 1, snake.head.y);
		case Direction.RIGHT:
			return new Position(snake.head.x + 1, snake.head.y);
		case Direction.UP:
			return new Position(snake.head.x, snake.head.y - 1);
		default:
			return new Position(snake.head.x, snake.head.y);
	}
};
const checkAndMove = (): void => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		checkAndMove();
	}, interval.value);
	const prevHead = new Position(snake.head.x, snake.head.y);
	const newHead = getNewHeadPosition();
	if (willCollide(newHead)) {
		gameOver();
		return;
	} else {
		snake.head.x = newHead.x;
		snake.head.y = newHead.y;
	}
	if (snake.head.x == food.position?.x && snake.head.y == food.position.y) {
		snake.body.unshift(prevHead);
		placeFood();
		if (interval.value > 50) {
			interval.value -= 10;
		}
	} else {
		snake.moveBody(prevHead);
	}
};

const onKeyDown = (event: KeyboardEvent): void => {
	switch (event.key) {
		case 'ArrowDown':
			if (snake.direction != Direction.DOWN) {
				snake.direction = Direction.DOWN;
				checkAndMove();
			}
			break;
		case 'ArrowLeft':
			if (snake.direction != Direction.LEFT) {
				snake.direction = Direction.LEFT;
				checkAndMove();
			}
			break;
		case 'ArrowRight':
			if (snake.direction != Direction.RIGHT) {
				snake.direction = Direction.RIGHT;
				checkAndMove();
			}
			break;
		case 'ArrowUp':
			if (snake.direction != Direction.UP) {
				snake.direction = Direction.UP;
				checkAndMove();
			}
			break;
	}
};

onMounted((): void => {
	window.addEventListener('keydown', onKeyDown);
	placeFood();
});
onBeforeUnmount((): void => {
	window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
	<div class="grid">
		<div
			v-if="food.position != null"
			class="food"
			:style="getCoordinates(food.position)"
		></div>
		<SnakeFigure :snake="snake"></SnakeFigure>
	</div>
</template>
