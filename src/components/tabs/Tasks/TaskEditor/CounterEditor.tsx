import { Task } from "@hooks/useTasks/types";
import React from "react";

const CounterEditor = ({
	newTask,
	setNewTask,
}: {
	newTask: Task;
	setNewTask: Function;
}): React.JSX.Element => {
	return (
		<>
			<div className="todo">
				<input
					type="checkbox"
					name="counter"
					id="counter"
					checked={Boolean(newTask.counter)}
					onChange={() => {
						setNewTask({
							...newTask,
							counter: !Boolean(newTask.counter)
								? { current: 0, goal: undefined }
								: undefined,
						});
					}}
				/>

				<label htmlFor="counter">counter</label>
			</div>
			{newTask.counter ? (
				<>
					<input
						type="number"
						placeholder="current"
						value={newTask.counter?.current}
						onChange={(e) =>
							setNewTask({
								...newTask,
								counter: { current: Number(e.currentTarget.value) },
							})
						}
					/>

					<input
						type="number"
						placeholder="goal"
						value={newTask.counter?.goal}
						onChange={(e) =>
							setNewTask({
								...newTask,
								counter: {
									current:
										newTask.counter && newTask.counter.current
											? newTask.counter.current
											: 0,
									goal: Number(e.currentTarget.value),
								},
							})
						}
					/>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default CounterEditor;
