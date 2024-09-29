import { Task } from "@core/types";
import React from "react";
import Bottom from "./containers/Bottom";
import Filters from "./containers/Filters";
import Sorting from "./containers/Sorting";
import styles from "../styles.module.css";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Array<Task>;
};

export default function TaskList(props: Props): React.JSX.Element {
	const { tasks } = props;

	return (
		<div>
			<div className={`${styles.filters} flex-column border`}>
				<Filters />
				<Sorting />
				<Bottom amountOfTasks={tasks.length} />
			</div>

			<ul className="list flex-column contains-task-list">
				{tasks.length > 0 ? (
					tasks.map((task) => (
						<TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
					))
				) : (
					<p>Empty list.</p>
				)}
			</ul>
		</div>
	);
}
