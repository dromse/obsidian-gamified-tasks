import useWatchTasks from "@hooks/useWatchTasks";
import React from "react";
import TaskTab from "./TaskTab";

export default function Tasks(): React.JSX.Element {
	const { tasks, isTasksParsed, watchTasks } = useWatchTasks();

	watchTasks();

	if (isTasksParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isTasksParsed === "parsed") {
		return <TaskTab tasks={tasks} />;
	}

	if (isTasksParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <></>;
}
