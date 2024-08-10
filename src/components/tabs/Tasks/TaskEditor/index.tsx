import { Task } from "@hooks/useTasks/types";
import React from "react";
import { Dialog, DialogProps } from "../Dialog";
import BindEditor from "./BindEditor";
import BodyEditor from "./BodyEditor";
import CounterEditor from "./CounterEditor";
import DifficultyEditor from "./DifficultyEditor";
import EveryEditor from "./EveryEditor";

type TaskEditorProps = DialogProps & {
	task: Task;
	updateTask: Function;
};
export const TaskEditor = (props: TaskEditorProps): React.JSX.Element => {
	const { isOpen, setIsOpen, task, updateTask } = props;
	const [newTask, setNewTask] = React.useState(task);

	const saveNewTask = (): void => {
		updateTask(task, { ...newTask });
		setIsOpen(false);
	};

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
			<BodyEditor newTask={newTask} setNewTask={setNewTask} />
			<DifficultyEditor newTask={newTask} setNewTask={setNewTask} />
			<CounterEditor newTask={newTask} setNewTask={setNewTask} />
			<BindEditor newTask={newTask} setNewTask={setNewTask} />
			<EveryEditor newTask={newTask} setNewTask={setNewTask} />

			<button onClick={saveNewTask}>Save</button>
		</Dialog>
	);
};
