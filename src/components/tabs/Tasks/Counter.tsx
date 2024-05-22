import { CounterT, Task } from "@hooks/useTasks/types";
import { logger, loggerMsg } from "@utils/logger";
import { updateCounter } from "@utils/task";
import { Notice } from "obsidian";
import React from "react";

import styles from './styles.module.css';

type CounterProps = {
	task: Task;
	counter: CounterT;
	updateTask: (task: Task, newTask: Task) => unknown;
	addHistoryRow: Function;
};

export default function Counter(props: CounterProps): React.JSX.Element {
	const { counter, task, updateTask, addHistoryRow } = props;

	const [isButtonBlocked, setIsButtonBlocked] = React.useState(false);

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

	return (
		<div className={`flex-items-center ${styles.counter}`}>
			<p>
				{counter.current} {counter.goal ? " / " + counter.goal : ""}
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
