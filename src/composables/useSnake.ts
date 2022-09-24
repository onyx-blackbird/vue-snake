import { reactive } from 'vue';
import Position from '@/model/Position';
import Snake, { type ISnake } from '@/model/Snake';

export default function useSnake(x: number, y: number): ISnake {
	const snake = reactive(new Snake(new Position(x, y)));
	return snake as ISnake;
}
