import { Task } from "@hooks/useWatchTasks/types";
import React from "react";

const EveryEditor = ({
	newTask,
	setNewTask,
}: {
	newTask: Task;
	setNewTask: Function;
}): React.JSX.Element => {
	return (
		<input
			type="text"
			placeholder="every"
			value={newTask.every}
			onChange={(e) => {
				const newEvery = e.currentTarget.value.trim();

				setNewTask({ ...newTask, every: newEvery });
			}}
		/>
	);
};

export default EveryEditor;
