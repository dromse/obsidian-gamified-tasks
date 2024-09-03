import { Task } from "@hooks/useWatchTasks/types";
import { Notice } from "obsidian";
import React from "react";
import { Dialog, DialogProps } from "../Dialog";
import BindEditor from "./BindEditor";
import BodyEditor from "./BodyEditor";
import ConditionEditor from "./ConditionEditor";
import CounterEditor from "./CounterEditor";
import DifficultyEditor from "./DifficultyEditor";
import EveryEditor from "./EveryEditor";

type TaskEditorProps = DialogProps & {
	task: Task;
	saveTask: (task: Task, saveNewTask?: Function) => void;
	children?: string | React.JSX.Element | Array<React.JSX.Element>;
};
export const TaskEditor = (props: TaskEditorProps): React.JSX.Element => {
	const { isOpen, setIsOpen, task, saveTask, children } = props;
	const [newTask, setNewTask] = React.useState(task);

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
			<BodyEditor newTask={newTask} setNewTask={setNewTask} />
			<DifficultyEditor newTask={newTask} setNewTask={setNewTask} />
			<CounterEditor newTask={newTask} setNewTask={setNewTask} />
			<BindEditor newTask={newTask} setNewTask={setNewTask} />
			<EveryEditor newTask={newTask} setNewTask={setNewTask} />
			<ConditionEditor newTask={newTask} setNewTask={setNewTask} />

			<>{children}</>

			<button
				onClick={() => {
					if (!newTask.body) {
						new Notice("Task body is empty!");
						return;
					}

					saveTask(newTask, setNewTask);
				}}
			>
				Save
			</button>
		</Dialog>
	);
};
