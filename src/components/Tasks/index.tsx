import React from "react";
import { useTasks } from "../../hooks";
import TaskList from "./TaskList";

export default function Tasks() {
	const { tasks, isTasksParsed, updateTask, filters } = useTasks();

	if (isTasksParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isTasksParsed === "parsed") {
		return (
			<div>
				<h2>Tasks</h2>

				<TaskList
					tasks={tasks}
					updateTask={updateTask}
					filters={filters}
				/>
			</div>
		);
	}

	if (isTasksParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div>Something went wrong...</div>;
}
