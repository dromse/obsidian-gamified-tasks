import { useSettings } from "@hooks";
import useEditTasks from "@hooks/useEditTasks";
import { Task } from "@hooks/useWatchTasks/types";
import { logger, loggerMsg } from "@utils/logger";
import { updateCounter } from "@utils/task";
import { Notice } from "obsidian";
import React from "react";

import styles from "./styles.module.css";

type CounterProps = {
	task: Task;
	addHistoryRow: Function;
};

export default function Counter(props: CounterProps): React.JSX.Element {
	const { task, addHistoryRow } = props;
	const { updateTask } = useEditTasks();
	const settings = useSettings();

	if (!settings) {
		return <div>Settings is not defined!</div>;
	}

	if (!task.counter) {
		return <div>Counter is not defined!</div>;
	}

	const [isButtonBlocked, setIsButtonBlocked] = React.useState(false);

	const handleUpdateCounter = (change: number) => async (): Promise<void> => {
		try {
			setIsButtonBlocked(true);

			await updateCounter({
				task,
				payload: { change },
				updateTask,
				addHistoryRow,
				settings,
			});
		} catch (err) {
			logger(err);
			new Notice(loggerMsg(err));
		} finally {
			setIsButtonBlocked(false);
		}
	};

	return (
		<div className={`flex-items-center ${styles.counter}`}>
			<p>
				{task.counter.current}
				{task.counter.goal ? " / " + task.counter.goal : ""}
			</p>

			<button onClick={handleUpdateCounter(1)} disabled={isButtonBlocked}>
				+
			</button>

			<button onClick={handleUpdateCounter(-1)} disabled={isButtonBlocked}>
				-
			</button>
		</div>
	);
}
