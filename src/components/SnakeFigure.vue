<script setup lang="ts">
import type { PropType } from 'vue';

import { getCoordinates } from '@/model/Position';
import type ISnake from '@/model/Snake';

defineProps({
	snake: { type: Object as PropType<ISnake>, required: true },
	isGameOver: { type: Boolean },
});
</script>

<template>
	<div
		class="snake snake-head"
		:class="{ dead: isGameOver }"
		:style="getCoordinates(snake.head)"
	></div>
	<template v-if="snake.body.length > 0">
		<div
			v-for="(segment, index) in snake.body"
			class="snake snake-body"
			:key="index"
			:style="getCoordinates(segment)"
		></div>
	</template>
	<div class="snake snake-tail" :style="getCoordinates(snake.tail)"></div>
</template>
