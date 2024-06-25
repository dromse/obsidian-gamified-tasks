import { useApp, useHistory } from "@hooks";
import { StatusMarkdown } from "@hooks/useTasks/consts";
import { Task } from "@hooks/useTasks/types";
import { revealTask } from "@utils/editor";
import { extractTitlesFromLinks } from "@utils/string";
import { updateStatus } from "@utils/task";
import React from "react";
import Counter from "./Counter";

import styles from "./styles.module.css";

type Props = {
	task: Task;
	updateTask: (task: Task, newTask: Task) => unknown;
};

export default function TaskItem(props: Props): React.JSX.Element {
	const { task, updateTask } = props;
	const app = useApp();
	const { addHistoryRow } = useHistory();

	if (!app) {
		return <div>Error: App is not defined.</div>;
	}

	const { workspace, vault } = app;

	const handleUpdateCheckbox = (): void => {
		const isDone = task.status === "done";
		const isDenied = task.status === "denied";

		if (isDone || isDenied) {
			updateStatus({
				task,
				payload: { status: "todo" },
				updateTask,
				addHistoryRow,
			});
		} else {
			updateStatus({
				task,
				payload: { status: "done" },
				updateTask,
				addHistoryRow,
			});
		}
	};

	const handleRevealTask = (): void => {
		revealTask({ task, workspace, vault });
	};

	return (
		<li
			className={`task-list-item ${styles.task} flex-items-center border`}
			data-task={StatusMarkdown[task.status ? task.status : "todo"]}
		>
			<input
				type="checkbox"
				onChange={handleUpdateCheckbox}
				name=""
				id=""
				checked={task.status !== "todo"}
			/>

			<div onClick={handleRevealTask}>{extractTitlesFromLinks(task.body)}</div>

			{task.counter && (
				<Counter
					task={task}
					counter={task.counter}
					updateTask={updateTask}
					addHistoryRow={addHistoryRow}
				/>
			)}
		</li>
	);
}
