import { useApp, useHistory } from "@hooks";
import { StatusKeys, StatusMarkdown } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
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
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
	const [isTaskEditorOpen, setIsTaskEditorOpen] = React.useState(false);

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

	const toggleMenu = (): void => {
		setIsMenuOpen((prev) => !prev);
	};

	const options: Array<MenuOption> = [
		{
			title: "Reveal Task",
			handler: handleRevealTask,
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

	const getMenuStatusOptionsWithHandlers = (
		StatusKeys: Array<Status>,
	): Array<MenuOption> =>
		StatusKeys.reduce<Array<MenuOption>>((acc, key) => {
			acc.push({
				title: key,
				handler: () =>
					updateStatus({
						task,
						payload: { status: key },
						updateTask,
						addHistoryRow,
					}),
			});

			return acc;
		}, []);

	const statusOptions = getMenuStatusOptionsWithHandlers(StatusKeys);

	if (task.counter) {
		const handleResetCounter = async (): Promise<void> => {
			await updateTask(task, {
				...task,
				counter: { ...task.counter, current: 0 },
			});
		};

		options.push({ title: "Reset Counter", handler: handleResetCounter });
	}

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

			<div onClick={toggleMenu} className={`${styles.title}`}>
				{extractTitlesFromLinks(task.body)}
			</div>

			{task.counter && (
				<Counter
					task={task}
					counter={task.counter}
					updateTask={updateTask}
					addHistoryRow={addHistoryRow}
				/>
			)}

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
				updateTask={updateTask}
			/>
		</li>
	);
}

type TaskEditorProps = DialogProps & {
	task: Task;
	updateTask: Function;
};
const TaskEditor = (props: TaskEditorProps): React.JSX.Element => {
	const { isOpen, setIsOpen, task, updateTask } = props;
	const [newBodyValue, setNewBodyValue] = React.useState(task.body);

	const onEditBody = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newBody = e.currentTarget.value;
		setNewBodyValue(newBody);
	};

	const saveNewTask = (): void => {
		if (newBodyValue.trim()) {
			updateTask(task, { ...task, body: newBodyValue });
			setIsOpen(false);
		}
	};

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
			<input value={newBodyValue} onChange={onEditBody} />
			<button onClick={saveNewTask}>Save</button>
		</Dialog>
	);
};

type MenuOption = { title: string; handler: Function };
type MenuProps = DialogProps & {
	options: Array<MenuOption>;
};
const Menu = (props: MenuProps): React.JSX.Element => {
	const { isOpen, setIsOpen, options } = props;

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
			{options.map((option) => (
				<button
					onClick={() => {
						option.handler();
						setIsOpen(false);
					}}
					key={option.title}
				>
					{option.title}
				</button>
			))}
		</Dialog>
	);
};

type DialogProps = {
	isOpen: boolean;
	setIsOpen: (arg: boolean) => void;
	children?: string | React.JSX.Element | Array<React.JSX.Element>;
};
const Dialog = (props: DialogProps): React.JSX.Element => {
	const { isOpen, setIsOpen, children } = props;
	const ref = React.useRef<HTMLDialogElement>(null);

	React.useEffect(() => {
		function onClick(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			setTimeout(() => document.addEventListener("click", onClick), 0);
		}

		return () => {
			document.removeEventListener("click", onClick);
		};
	}, [isOpen]);

	return isOpen ? (
		<dialog open={isOpen} ref={ref} className={`${styles.menu} border`}>
			{children}
		</dialog>
	) : (
		<></>
	);
};
