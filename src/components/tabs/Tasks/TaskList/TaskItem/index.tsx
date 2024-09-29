import { StatusKeys, StatusMarkdown } from "@core/consts";
import { Status, Task } from "@core/types";
import { revealLine } from "@utils/editor";
import { extractTitlesFromLinks } from "@utils/string";
import {
	getStatusOptionsWithHandlers,
	handleResetCounter,
	handleUpdateCheckbox,
	UpdateTaskPayloadProps
} from "@utils/task";
import React from "react";
import Counter from "./Counter";
import { Menu, MenuOption } from "../../../../reusable/Menu";
import { TaskEditor } from "../TaskEditor";

import useEditTasks from "@hooks/useEditTasks";
import styles from "../../styles.module.css";
import useHistory from "@hooks/useHistory";
import { useSettings } from "@hooks/useSettings";
import { useApp } from "@hooks/useApp";

type Props = {
	task: Task;
};

export default function TaskItem(props: Props): React.JSX.Element {
	const { task } = props;
	const { updateTask } = useEditTasks();
	const app = useApp();
	const { addHistoryRow } = useHistory();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
	const [isTaskEditorOpen, setIsTaskEditorOpen] = React.useState(false);
	const settings = useSettings();

	if (!app) {
		return <div>Error: App is not defined.</div>;
	}

	if (!settings) {
		return <div>Error: Settings is not defined.</div>;
	}

	const { workspace, vault } = app;

	const buildUpdateStatusProps = (
		status: Status,
	): UpdateTaskPayloadProps<{ status: Status }> => ({
		task,
		payload: { status },
		updateTask,
		addHistoryRow,
		settings,
	});

	const options: Array<MenuOption> = [
		{
			title: "Reveal Task",
			handler: () =>
				revealLine({
					location: { path: task.path, lineNumber: task.lineNumber },
					workspace,
					vault,
				}),
		},
		{
			title: "Change Status",
			handler: () => setIsStatusMenuOpen(true),
		},
		{
			title: "Edit Task",
			handler: () => setIsTaskEditorOpen(true),
		},
	];

	const statusOptions = getStatusOptionsWithHandlers(
		StatusKeys,
		buildUpdateStatusProps,
	);

	if (task.counter) {
		options.push({
			title: "Reset Counter",
			handler: () => handleResetCounter(task, updateTask),
		});
	}

	const saveNewTask = (newTask: Task): void => {
		updateTask(task, { ...newTask });
		setIsTaskEditorOpen(false);
	};

	return (
		<li
			className={`task-list-item ${styles.task} flex-items-center border`}
			data-task={StatusMarkdown[task.status ? task.status : "todo"]}
		>
			<input
				type="checkbox"
				onChange={() => handleUpdateCheckbox(task, buildUpdateStatusProps)}
				checked={task.status !== "todo"}
			/>

			<div
				onClick={() => setIsMenuOpen((p) => !p)}
				className={`${styles.title}`}
			>
				{extractTitlesFromLinks(task.body)}
			</div>

			{task.counter && <Counter task={task} addHistoryRow={addHistoryRow} />}

			<div className={styles.difficulty}>{task.difficulty}</div>

			<Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} options={options} />
			<Menu
				isOpen={isStatusMenuOpen}
				setIsOpen={setIsStatusMenuOpen}
				options={statusOptions}
			/>
			<TaskEditor
				isOpen={isTaskEditorOpen}
				setIsOpen={setIsTaskEditorOpen}
				task={task}
				saveTask={saveNewTask}
			/>
		</li>
	);
}