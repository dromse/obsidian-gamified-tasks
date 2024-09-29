import { Task } from "@core/types";
import React from "react";

type CounterEditorProps = {
	newTask: Task;
	setNewTask: (task: Task) => void;
};

const CounterEditor = (props: CounterEditorProps): React.JSX.Element => {
	const { newTask, setNewTask } = props;

	const toggleCounter = (): void => {
		setNewTask({
			...newTask,
			counter: newTask.counter ? undefined : { current: 0, goal: undefined },
		});
	};

	const updateCounterField = (
		field: "current" | "goal",
		value: number,
	): void => {
		if (newTask.counter) {
			setNewTask({
				...newTask,
				counter: {
					...newTask.counter,
					[field]: value,
				},
			});
		}
	};

	return (
		<>
			<div className="todo">
				<input
					type="checkbox"
					id="counter"
					checked={Boolean(newTask.counter)}
					onChange={toggleCounter}
				/>

				<label htmlFor="counter">counter</label>
			</div>

			{newTask.counter && (
				<>
					<input
						type="number"
						placeholder="current"
						value={newTask.counter.current}
						onChange={(e) =>
							updateCounterField("current", Number(e.target.value))
						}
					/>

					<input
						type="number"
						placeholder="goal"
						value={newTask.counter.goal ?? ""}
						onChange={(e) =>
							updateCounterField("goal", Number(e.target.value))
						}
					/>
				</>
			)}
		</>
	);
};

export default CounterEditor;
