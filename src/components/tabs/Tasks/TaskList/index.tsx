import { Task } from "@core/types";
import React from "react";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Array<Task>;
};

export default function TaskList(props: Props): React.JSX.Element {
	const { tasks } = props;

	return (
		<ul className="list flex-column contains-task-list">
			{tasks.length > 0 ? (
				tasks.map((task) => (
					<TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
				))
			) : (
				<p>Empty list.</p>
			)}
		</ul>
	);
}
