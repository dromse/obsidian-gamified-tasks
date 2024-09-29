import { Task } from "@core/types";
import React from "react";

const BodyEditor = ({
	newTask,
	setNewTask,
}: {
	setNewTask: Function;
	newTask: Task;
}): React.JSX.Element => (
	<input
		type="text"
		placeholder="task.."
		value={newTask.body}
		onChange={(e) => {
			const newBody = e.currentTarget.value;

			setNewTask({ ...newTask, body: newBody });
		}}
	/>
);

export default BodyEditor;
