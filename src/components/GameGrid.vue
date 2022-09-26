<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, type PropType } from 'vue';

import SnakeFigure from './SnakeFigure.vue';
import { Direction, GridSize, type GameSize } from '@/model/common';
import Position, { getCoordinates, type IPosition } from '@/model/Position';

import useFood from '@/composables/useFood';
import useSnake from '@/composables/useSnake';

const props = defineProps({
	gameSize: { type: Object as PropType<GameSize>, required: true },
});

const maxX = props.gameSize.w - 1;
const maxY = props.gameSize.h - 1;
const gridSize = {
	width: props.gameSize.w * GridSize + 'px',
	height: props.gameSize.h * GridSize + 'px',
};

const snake = useSnake(props.gameSize.w / 2, props.gameSize.h / 2);
const { food, placeFood } = useFood(maxX, maxY, snake);
const score = ref(0);
const isGameOver = ref(false);
const interval = ref(200);
let timeoutId = 0;
const gameOver = (): void => {
	clearTimeout(timeoutId);
	window.removeEventListener('keydown', onKeyDown);
	isGameOver.value = true;
};
const willCollide = (position: IPosition): boolean => {
	if (position.x < 0) return true;
	if (position.x > maxX) return true;
	if (position.y < 0) return true;
	if (position.y > maxY) return true;
	for (let i = 0; i < snake.body.length; i++) {
		const segment = snake.body[i];
		if (position.x === segment.x && position.y === segment.y) return true;
	}
	if (position.x === snake.tail.x && position.y === snake.tail.y) return true;
	return false;
};
const checkAndMove = (): void => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		checkAndMove();
	}, interval.value);
	const prevHead = new Position(snake.head.x, snake.head.y);
	const newHead = snake.getNewHeadPosition();
	if (willCollide(newHead)) {
		gameOver();
		return;
	} else {
		snake.head.x = newHead.x;
		snake.head.y = newHead.y;
	}
	if (snake.head.x == food.x && snake.head.y == food.y) {
		score.value++;
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
		case 's':
			if (
				snake.direction != Direction.DOWN &&
				snake.direction != Direction.UP
			) {
				snake.direction = Direction.DOWN;
				checkAndMove();
			}
			break;
		case 'ArrowLeft':
		case 'a':
			if (
				snake.direction != Direction.LEFT &&
				snake.direction != Direction.RIGHT
			) {
				snake.direction = Direction.LEFT;
				checkAndMove();
			}
			break;
		case 'ArrowRight':
		case 'd':
			if (
				snake.direction != Direction.RIGHT &&
				snake.direction != Direction.LEFT
			) {
				snake.direction = Direction.RIGHT;
				checkAndMove();
			}
			break;
		case 'ArrowUp':
		case 'w':
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
	<p>User arrow or WASD keys to change direction</p>
	<div class="score">
		<span>Score: {{ score }}</span>
		<span class="food"></span>
	</div>
	<div v-if="isGameOver" class="game-over">GAME OVER</div>
	<div class="grid" :style="gridSize">
		<div class="food" :style="getCoordinates(food)"></div>
		<SnakeFigure :snake="snake" :is-game-over="isGameOver"></SnakeFigure>
	</div>
</template>
