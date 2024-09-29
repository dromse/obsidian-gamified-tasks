import { SearchFilter, StatusFilter } from "@components/reusable/filters";
import ShouldSortAfterLimit from "@components/reusable/sorting/ShouldSortAfterLimit";
import SortByOrder from "@components/reusable/sorting/SortByOrder";
import SortByType from "@components/reusable/sorting/SortByType";
import { Task } from "@core/types";
import { useApp } from "@hooks/useApp";
import useEditTasks from "@hooks/useEditTasks";
import { useSettings } from "@hooks/useSettings";
import { singularOrPlural } from "@utils/string";
import React, { useState } from "react";
import { TaskEditor } from "../../reusable/TaskEditor";
import Modes from "./Modes";
import MoreFilters from "./MoreFilters";
import styles from "./styles.module.css";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Array<Task>;
};

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

export default function TaskList(props: Props): React.JSX.Element {
	const { addTask } = useEditTasks();
	const { tasks } = props;
	const [isTaskBuilderOpen, setIsTaskBuilderOpen] = useState(false);
	const [taskSaveLocation, setTaskSaveLocation] =
		useState<TaskSaveLocation>("default-file");
	const newTaskTemplate = generateNewTask();

	const settings = useSettings()!;
	const app = useApp()!;

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
		<div>
			<div className={`${styles.filters} flex-column border`}>
				<SearchFilter />
				<StatusFilter />
				<Modes />

				<MoreFilters />

				<SortByType />
				<SortByOrder />
				<ShouldSortAfterLimit />
				<hr />

				<div className="flex-between flex-items-center">
					{singularOrPlural({
						amount: tasks.length,
						singular: "task",
					})}
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
				</div>
			</div>

			<ul className="list flex-column contains-task-list">
				{tasks.length > 0 ? (
					tasks.map((task) => (
						<TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
					))
				) : (
					<p>Empty list.</p>
				)}
			</ul>
		</div>
	);
}
