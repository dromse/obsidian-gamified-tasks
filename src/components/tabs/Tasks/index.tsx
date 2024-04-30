import { useTasks } from "@hooks";
import React from "react";
import TaskList from "./TaskList";

export default function TasksTab(): React.JSX.Element {
	const { tasks, isTasksParsed, updateTask, filters } = useTasks();

	if (isTasksParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isTasksParsed === "parsed") {
		return (
			<TaskList
				tasks={tasks}
				updateTask={updateTask}
				filters={filters}
			/>
		);
	}

	if (isTasksParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <></>;
}
