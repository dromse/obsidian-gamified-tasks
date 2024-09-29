import useWatchTasks from "@hooks/useWatchTasks";
import React from "react";
import TaskList from "./TaskList";

export default function TasksTab(): React.JSX.Element {
	const { tasks, isTasksParsed, watchTasks } = useWatchTasks();

	watchTasks();

	if (isTasksParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isTasksParsed === "parsed") {
		return <TaskList tasks={tasks} />;
	}

	if (isTasksParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <></>;
}
