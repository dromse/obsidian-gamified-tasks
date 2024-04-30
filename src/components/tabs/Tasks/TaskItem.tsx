import { useApp, useHistory } from "@hooks";
import { StatusKeys } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
import { revealTask } from "@utils/editor";
import { logger, loggerMsg } from "@utils/logger";
import { extractTitlesFromLinks } from "@utils/string";
import { updateCounter, updateStatus } from "@utils/task";
import { Notice } from "obsidian";
import React from "react";

import styles from "./styles.module.css";

type Props = {
	task: Task;
	updateTask: (task: Task, newTask: Task) => unknown;
};

export default function TaskItem(props: Props): React.JSX.Element {
	const { task, updateTask } = props;
	const [isButtonBlocked, setIsButtonBlocked] = React.useState(false);
	const app = useApp();
	const { addHistoryRow } = useHistory();

	if (!app) {
		return <div>Error: App is not defined.</div>;
	}

	const { workspace, vault } = app;

	const handleUpdateStatus = (
		e: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const value = e.currentTarget.value;

		if (StatusKeys.some((status) => status === value)) {
			updateStatus({
				task,
				payload: { status: value as Status },
				updateTask,
				addHistoryRow,
			});
		} else {
			new Notice(loggerMsg(`Invalid status '${value}'`));
		}
	};

	const handleUpdateCounter = (change: number) => async (): Promise<void> => {
		try {
			setIsButtonBlocked(true);

			await updateCounter({
				task,
				payload: { change },
				updateTask,
				addHistoryRow,
			});
		} catch (err) {
			logger(err);
			new Notice(loggerMsg(err));
		} finally {
			setIsButtonBlocked(false);
		}
	};

	const handleRevealTask = (): void => {
		revealTask({ task, workspace, vault });
	};

	return (
		<li className={`${styles.task} flex-items-center border`}>
			<select
				onChange={handleUpdateStatus}
				value={task.status}
				className={styles.taskStatus}
			>
				{StatusKeys.map((status) => (
					<option key={status}>{status}</option>
				))}
			</select>

			<a onClick={handleRevealTask}>{extractTitlesFromLinks(task.body)}</a>

			{task.counter && (
				<div className={`flex-items-center ${styles.counter}`}>
					<p>
						{task.counter.current} / {task.counter.goal}
					</p>

					<button
						onClick={handleUpdateCounter(1)}
						disabled={isButtonBlocked}
					>
						+
					</button>

					<button
						onClick={handleUpdateCounter(-1)}
						disabled={isButtonBlocked}
					>
						-
					</button>
				</div>
			)}
		</li>
	);
}
