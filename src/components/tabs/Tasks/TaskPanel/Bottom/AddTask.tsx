import { TaskEditor } from "@components/tabs/Tasks/TaskEditor";
import { Task } from "@core/types";
import { useApp } from "@hooks/useApp";
import useEditTasks from "@hooks/useEditTasks";
import { useSettings } from "@hooks/useSettings";
import { getDailyNotePath } from "@utils/file";
import { Notice } from "obsidian";
import React from "react";

const TaskSaveLocationOptions = [
	"default-note",
	"current-note",
	"daily-note",
] as const;
type TaskSaveLocation = (typeof TaskSaveLocationOptions)[number];

const saveToFileRadios: Array<{ option: TaskSaveLocation; label: string }> = [
	{ option: "default-note", label: "save to default note" },
	{ option: "current-note", label: "save to current note" },
	{ option: "daily-note", label: "save to daily note" },
];

export default function AddTask(): React.JSX.Element {
		const { addTask } = useEditTasks();
		const [isTaskBuilderOpen, setIsTaskBuilderOpen] = React.useState(false);
		const [taskSaveLocation, setTaskSaveLocation] =
			React.useState<TaskSaveLocation>("default-note");

		const app = useApp()!;

		const settings = useSettings()!;

		const { workspace } = app;

		// Helper to create a new task template based on current settings
		const generateNewTask = (): Task => ({
			path: "",
			lineContent: "",
			body: "",
			lineNumber: 0,
			status: "todo",
			difficulty: settings.defaultDifficulty || "none",
		});

		const [newTaskTemplate, setNewTaskTemplate] =
			React.useState<Task>(() => generateNewTask());

	const addNewTask = (task: Task, setTask?: Function): void => {
		if (taskSaveLocation === "default-note") {
			if (settings) {
				task.path = settings.pathToSaveNewTask;
			}
		} else if (taskSaveLocation === "daily-note") {
			const dailyNotePath = getDailyNotePath(settings);

			const todayTFile = app.vault.getFileByPath(dailyNotePath);
			if (todayTFile) {
				task.path = dailyNotePath;
				new Notice(`Task successfully added to the note!`);
			} else {
				new Notice(
					`'${dailyNotePath}' was not found. \nPlease create a daily note before save a task!`,
					5000,
				);
			}
		} else if (taskSaveLocation === "current-note") {
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
