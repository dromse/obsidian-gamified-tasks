import { Task } from "@hooks/useTasks/types";
import React from "react";

const BindEditor = ({
	newTask,
	setNewTask,
}: {
	setNewTask: Function;
	newTask: Task;
}): React.JSX.Element => (
	<input
		type="text"
		placeholder="bind"
		value={newTask.bind}
		onChange={(e) => {
			const newBind = e.currentTarget.value.trim();

			setNewTask({ ...newTask, bind: newBind });
		}}
	/>
);

export default BindEditor;
