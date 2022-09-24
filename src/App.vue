<script setup lang="ts">
import { nextTick, ref } from 'vue';

import GameGrid from '@/components/GameGrid.vue';

const options = ref([
	{ text: '320x200', value: { w: 16, h: 10 } },
	{ text: '400x320', value: { w: 20, h: 16 } },
	{ text: '600x400', value: { w: 30, h: 20 } },
	{ text: '800x600', value: { w: 40, h: 30 } },
	{ text: '1200x800', value: { w: 60, h: 40 } },
]);

const size = ref('');
const startGame = ref(false);
const gameSize = ref();
const start = () => {
	// reset GameGrid
	startGame.value = false;
	nextTick(() => {
		gameSize.value = size.value;
		startGame.value = true;
	});
};
</script>

<template>
	<header>
		<select v-model="size">
			<option disabled :value="{ w: 0, h: 0 }">Select game size</option>
			<option
				v-for="option in options"
				:key="option.text"
				:value="option.value"
			>
				{{ option.text }}
			</option>
		</select>
		<button @click="start">Start Game</button>
	</header>
	<GameGrid v-if="startGame" :gameSize="gameSize"></GameGrid>
</template>
