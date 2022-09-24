<script setup lang="ts">
import {
	computed,
	onMounted,
	onBeforeUnmount,
	ref,
	reactive,
	type PropType,
} from 'vue';

import seedrandom from 'seedrandom';

import SnakeFigure from './SnakeFigure.vue';
import { Direction, GridSize, type GameSize } from '@/model/common';
import Position, { getCoordinates } from '@/model/Position';
import useSnake from '@/model/Snake';

const props = defineProps({
	gameSize: { type: Object as PropType<GameSize>, required: true },
});

const RNG = seedrandom();

const snake = useSnake(props.gameSize.w / 2, props.gameSize.h / 2);
const maxX = computed(() => props.gameSize.w - 1);
const maxY = computed(() => props.gameSize.h - 1);
const gridSize = computed(() => {
	return {
		width: props.gameSize.w * GridSize + 'px',
		height: props.gameSize.h * GridSize + 'px',
	};
});

const getNewFoodPosition = (): Position => {
	let foodX, foodY;
	do {
		foodX = Math.round(RNG() * maxX.value);
		foodY = Math.round(RNG() * maxY.value);
	} while (foodX == snake.head.x && foodY == snake.head.y);
	return new Position(foodX, foodY);
};

const food = reactive(getNewFoodPosition());

const placeFood = (): void => {
	let foodPostion = getNewFoodPosition();
	food.x = foodPostion.x;
	food.y = foodPostion.y;
};

const interval = ref(200);
let timeoutId = 0;
const gameOver = (): void => {
	clearTimeout(timeoutId);
	window.removeEventListener('keydown', onKeyDown);
	console.log('GAME OVER');
};
const willCollide = (position: Position): boolean => {
	if (position.x < 0) return true;
	if (position.x > maxX.value) return true;
	if (position.y < 0) return true;
	if (position.y > maxY.value) return true;
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
	if (snake.head.x == food.x && snake.head.y == food.y) {
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
			if (
				snake.direction != Direction.DOWN &&
				snake.direction != Direction.UP
			) {
				snake.direction = Direction.DOWN;
				checkAndMove();
			}
			break;
		case 'ArrowLeft':
			if (
				snake.direction != Direction.LEFT &&
				snake.direction != Direction.RIGHT
			) {
				snake.direction = Direction.LEFT;
				checkAndMove();
			}
			break;
		case 'ArrowRight':
			if (
				snake.direction != Direction.RIGHT &&
				snake.direction != Direction.LEFT
			) {
				snake.direction = Direction.RIGHT;
				checkAndMove();
			}
			break;
		case 'ArrowUp':
			if (
				snake.direction != Direction.UP &&
				snake.direction != Direction.DOWN
			) {
				snake.direction = Direction.UP;
				checkAndMove();
			}
			break;
	}
};

onMounted((): void => {
	window.addEventListener('keydown', onKeyDown);
});
onBeforeUnmount((): void => {
	window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
	<div class="grid" :style="gridSize">
		<div class="food" :style="getCoordinates(food)"></div>
		<SnakeFigure :snake="snake"></SnakeFigure>
	</div>
</template>
