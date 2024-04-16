import { useApp, useHistory } from "@hooks";
import { DifficultyPrice, StatusKeys } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
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

export default function TaskItem({ task, updateTask }: Props) {
	const { addHistoryRow } = useHistory();
	const app = useApp();

	if (!app) {
		return <div>Error: App is not defined.</div>;
	}

	const { workspace, vault } = app;

	const handleUpdateCounter = (value: number) => {
		updateCounter(task, value, updateTask, addHistoryRow);
	};

	const handleRevealTask = () => {
		revealTask(task, workspace, vault);
	};

	const handleUpdateStatus = (value: string) => {
		if (StatusKeys.some((status) => status === value)) {
			updateStatus(task, value as Status, updateTask, addHistoryRow);
		}
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

			<a onClick={handleRevealTask}>{task.body}</a>

			{task.counter && (
				<div className={styles.counter}>
					<p>
						{task.counter.current} / {task.counter.goal}
					</p>

					<button onClick={() => handleUpdateCounter(1)}>+</button>

					<button onClick={() => handleUpdateCounter(-1)}>-</button>
				</div>
			)}
		</li>
	);
}

const updateCounter = async (
	task: Task,
	value: number,
	updateTask: Function,
	addHistoryRow: Function,
) => {
	const current = Number(task.counter?.current);
	const goal = Number(task.counter?.goal);

	if (!current && !goal) {
		return;
	}

	const newCurrent = current + value;
	const isOutOfScope = (value: number) => value < 0 || value > goal;

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

	new Notice(
		`${task.body} ${value > 0 ? "increased" : "decreased"} by ${Math.abs(value)}`,
	);

	if (newCurrent === goal) {
		new Notice(`You completed task: '${task.body}'`);
	}

	if (task.difficulty) {
		addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty] * value,
		});
	}
};

const revealTask = (task: Task, workspace: Workspace, vault: Vault) => {
	const tFile = vault.getFileByPath(task.path);

	if (!tFile) {
		new Notice("Error: file associated with task is not found.");
		return;
	}

	const leaves = workspace.getLeavesOfType("markdown") as WorkspaceLeaf[];

	/**
	 * Determines if a MarkdownView instance corresponds to an already opened file by explicitly setting `MarkdownView` for `leaf.view`.
	 * This is necessary because the `getLeavesOfType` method returns instances of type `View`, lacking the `file` field.
	 */
	const isFileOpened = (view: MarkdownView) =>
		view.file && view.file.path === task.path;

	/**
	 * Checks if the file is already open among the given leaves.
	 */
	const fileIsAlreadyOpen = leaves.some((leaf) =>
		isFileOpened(leaf.view as MarkdownView),
	);

	if (fileIsAlreadyOpen) {
		const leaf = leaves.find((leaf) =>
			isFileOpened(leaf.view as MarkdownView),
		);

		/*
		 * Displays the already opened file and highlights the line containing the task.
		 */
		if (leaf) {
			leaf.openFile(tFile, { eState: { line: task.lineNumber } });
		}
	} else {
		workspace.getLeaf("tab").openFile(tFile, {
			eState: { line: task.lineNumber },
		});
	}
};

async function updateStatus(
	task: Task,
	status: Status,
	updateTask: Function,
	addHistoryRow: Function,
) {
	await updateTask(task, { ...task, status });

	if (task.counter) {
		return;
	}

	if (!task.difficulty) {
		return;
	}

	if (status === "done") {
		addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty],
		});

		new Notice(`You completed task: '${task.body}'`);
	}

	if (task.status === "done" && status !== "done") {
		addHistoryRow({
			title: task.body,
			change: -DifficultyPrice[task.difficulty],
		});
	}
}
