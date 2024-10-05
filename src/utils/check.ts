export function isDigitString(line: string): boolean {
	const digitLineRegex = /^[+-]?\d*\.?\d+$/;

	return digitLineRegex.test(line);
}

const biggerThenGoal = (value: number, goal: number): boolean => value > goal;
const lessThenZero = (value: number): boolean => value < 0;
export const isOutOfScope = (
	value: number,
	goal: number,
	negativeCounter: boolean,
): boolean =>
	(!negativeCounter && lessThenZero(value)) ||
	(goal ? biggerThenGoal(value, goal) : false);
