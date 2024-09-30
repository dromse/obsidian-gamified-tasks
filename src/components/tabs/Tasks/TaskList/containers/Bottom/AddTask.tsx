import { TaskEditor } from "@components/tabs/Tasks/TaskList/TaskEditor";
import { Task } from "@core/types";
import { useApp } from "@hooks/useApp";
import useEditTasks from "@hooks/useEditTasks";
import { useSettings } from "@hooks/useSettings";
import React from "react";

const generateNewTask = (): Task => ({
	path: "",
	lineContent: "",
	body: "",
	lineNumber: 0,
	// the only necessary thing below
	status: "todo",
});

const TaskSaveLocationOptions = ["default-file", "current-file"] as const;
type TaskSaveLocation = (typeof TaskSaveLocationOptions)[number];

const saveToFileRadios: Array<{ option: TaskSaveLocation; label: string }> = [
	{ option: "default-file", label: "save to default file" },
	{ option: "current-file", label: "save to current file" },
];

export default function AddTask(): React.JSX.Element {
	const { addTask } = useEditTasks();
	const [isTaskBuilderOpen, setIsTaskBuilderOpen] = React.useState(false);
	const [taskSaveLocation, setTaskSaveLocation] =
		React.useState<TaskSaveLocation>("default-file");
	const [newTaskTemplate, setNewTaskTemplate] = React.useState(generateNewTask())

	const app = useApp()!;

	const settings = useSettings()!;

	const { workspace } = app;

	const addNewTask = (task: Task, setTask?: Function): void => {
		if (taskSaveLocation === "default-file") {
			if (settings) {
				task.path = settings.pathToSaveNewTask;
			}
		} else if (taskSaveLocation === "current-file") {
			const activeFile = workspace.getActiveFile();

			if (activeFile) {
				task.path = activeFile.path;
			}
		}

		setIsTaskBuilderOpen(false);

		addTask(task);

		if (setTask) {
			setTask(generateNewTask);
		}
	};

	const handleTaskSaveLocationRadioChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = e.currentTarget.value;

		setTaskSaveLocation(value as TaskSaveLocation);
	};

	return (
		<>
			<button onClick={() => setIsTaskBuilderOpen(true)}>+</button>

			<TaskEditor
				isOpen={isTaskBuilderOpen}
				setIsOpen={setIsTaskBuilderOpen}
				task={newTaskTemplate}
				saveTask={addNewTask}
			>
				{saveToFileRadios.map((radio) => (
					<div className="todo" key={radio.option}>
						<input
							type="checkbox"
							onChange={handleTaskSaveLocationRadioChange}
							checked={radio.option === taskSaveLocation}
							name="path"
							value={radio.option}
							id={radio.option}
						/>
						<label htmlFor={radio.option}>{radio.label}</label>
					</div>
				))}
			</TaskEditor>
		</>
	);
}
