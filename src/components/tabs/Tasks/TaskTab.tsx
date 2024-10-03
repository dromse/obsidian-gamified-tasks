import { Task } from "@core/types";
import React from "react";
import TaskList from "./TaskList";
import TaskPanel from "./TaskPanel";

export default function TaskTab({
	tasks,
}: {
	tasks: Array<Task>;
}): React.JSX.Element {
	return (
		<div>
			<TaskPanel tasksLength={tasks.length} />
			<TaskList tasks={tasks} />
		</div>
	);
}
