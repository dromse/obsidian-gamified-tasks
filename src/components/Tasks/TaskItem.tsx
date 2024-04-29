import { coins } from "@components/Rewards/RewardList";
import { useApp, useHistory } from "@hooks";
import { DifficultyPrice, StatusKeys } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
import { revealTask } from "@utils/editor";
import { logger, loggerMsg } from "@utils/logger";
import { extractTitlesFromLinks } from "@utils/string";
import {
	MarkdownView,
	Notice,
	Vault,
	Workspace,
	WorkspaceLeaf
} from "obsidian";
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

	const handleUpdateStatus = (value: string): void => {
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

	const handleUpdateCounter = async (change: number): Promise<void> => {
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
		<li className={`${styles.task} border`}>
			<select
				onChange={(e) => handleUpdateStatus(e.currentTarget.value)}
				value={task.status}
				className={styles.taskStatus}
			>
				{StatusKeys.map((status) => (
					<option key={status}>{status}</option>
				))}
			</select>

			<a onClick={handleRevealTask}>{extractTitlesFromLinks(task.body)}</a>

			{task.counter && (
				<div className={styles.counter}>
					<p>
						{task.counter.current} / {task.counter.goal}
					</p>

					<button
						onClick={() => handleUpdateCounter(1)}
						disabled={isButtonBlocked}
					>
						+
					</button>

					<button
						onClick={() => handleUpdateCounter(-1)}
						disabled={isButtonBlocked}
					>
						-
					</button>
				</div>
			)}
		</li>
	);
}

type UpdateTaskProps<TPayload> = {
	task: Task;
	payload: TPayload;
	updateTask: Function;
	addHistoryRow: Function;
};
const updateCounter = async (
	props: UpdateTaskProps<{ change: number }>,
): Promise<void> => {
	const { task, payload, updateTask, addHistoryRow } = props;
	const { change } = payload;

	const current = Number(task.counter?.current);
	const goal = Number(task.counter?.goal);

	if (!current && !goal) {
		return;
	}

	const newCurrent = current + change;
	const isOutOfScope = (value: number): boolean => value < 0 || value > goal;

	if (isOutOfScope(newCurrent)) {
		return;
	}

	const result = await updateTask(task, {
		...task,
		status: newCurrent === goal ? "done" : "doing",
		counter: { current: newCurrent, goal },
	});

	if (result === "error") {
		new Notice("Error during counter update.");
	}

	const getEarningString = (): string =>
		task.difficulty
			? `You ${change > 0 ? "earned" : "returned"}: ${coins(DifficultyPrice[task.difficulty])}`
			: "";

	new Notice(getEarningString());

	if (newCurrent === goal) {
		new Notice(`You completed task: '${task.body}'`);
	}

	if (task.difficulty) {
		await addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty] * change,
		});
	}
};

async function updateStatus(
	props: UpdateTaskProps<{ status: Status }>,
): Promise<void> {
	const { task, payload, updateTask, addHistoryRow } = props;
	const { status } = payload;

	await updateTask(task, { ...task, status });

	if (task.counter) {
		return;
	}

	if (!task.difficulty) {
		return;
	}

	if (status === "done") {
		await addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty],
		});

		new Notice(`You earned: ${coins(DifficultyPrice[task.difficulty])}`);
	}

	if (task.status === "done" && status !== "done") {
		await addHistoryRow({
			title: task.body,
			change: -DifficultyPrice[task.difficulty],
		});

		new Notice(`You returned: ${coins(DifficultyPrice[task.difficulty])}`);
	}
}

