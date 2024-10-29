import { Task } from "@core/types";
import React from "react";

const GroupEditor = ({
	newTask,
	setNewTask,
}: {
	setNewTask: Function;
	newTask: Task;
}): React.JSX.Element => (
	<input
		type="text"
		placeholder="group"
		value={newTask.group}
		onChange={(e) => {
			const newGroup = e.currentTarget.value.trim();

			setNewTask({ ...newTask, group: newGroup });
		}}
	/>
);

export default GroupEditor;
