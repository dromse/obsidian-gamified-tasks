import {
	LimitFilter,
	NoteFilter,
	SearchFilter,
	StatusFilter,
	TagFilter
} from "@components/reusable/filters";
import { useApp, useSettings } from "@hooks";
import { UpdateTaskFunctionType } from "@hooks/useTasks";
import { Task, TaskFilters } from "@hooks/useTasks/types";
import { TaskFilterOptionsType } from "@types";
import { singularOrPlural } from "@utils/string";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { TaskEditor } from "./TaskEditor";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Array<Task>;
	updateTask: UpdateTaskFunctionType;
	filters: TaskFilters;
	addTask: (task: Task) => void;
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
	const { tasks, updateTask, filters, addTask } = props;
	const settings = useSettings();
	const [isTaskBuilderOpen, setIsTaskBuilderOpen] = useState(false);
	const [taskSaveLocation, setTaskSaveLocation] =
		useState<TaskSaveLocation>("default-file");
	const newTaskTemplate = generateNewTask();

	if (!settings) {
		return <>Settings is not defined.</>;
	}

	const [taskFilterChoice, setTaskFilterChoice] =
		React.useState<TaskFilterOptionsType>(settings.filterTasksOnOpen);

	const app = useApp();

	if (!app) {
		return <div>App is not defined.</div>;
	}

	const { workspace } = app;

	const {
		limit,
		setLimit,
		searchFilter,
		setSearchFilter,
		statusFilter,
		setStatusFilter,
		isRecur,
		setIsRecur,
		tagFilter,
		setTagFilter,
		hasOnlyThisTags,
		setHasOnlyThisTags,
		noteFilter,
		setNoteFilter,
		isFromCurrentNote,
		setIsFromCurrentNote,
		shouldShowByCondition,
		setShouldShowByCondition,
	} = filters;

	const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(
		settings?.shouldShowAllFilters,
	);

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

	const radioFilter: Array<{
		setIsValue: Function;
		isValue: boolean;
		label: string;
		option: TaskFilterOptionsType;
	}> = [
			{
				label: "Filter by recurring",
				setIsValue: setIsRecur,
				isValue: isRecur,
				option: "recurring",
			},
			{
				label: "Filter by condition",
				setIsValue: setShouldShowByCondition,
				isValue: shouldShowByCondition,
				option: "condition",
			},
		];

	useEffect(() => {
		radioFilter.map((radio) =>
			radio.option === taskFilterChoice
				? radio.setIsValue(true)
				: radio.setIsValue(false),
		);
	}, [taskFilterChoice]);

	return (
		<div>
			<div className={`${styles.filters} flex-column border`}>
				<SearchFilter
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
				/>
				<StatusFilter
					currentStatusFilter={statusFilter}
					setCurrentStatusFilter={setStatusFilter}
				/>

				{radioFilter.map((radio) => (
					<div className="checkbox" key={radio.label}>
						<input
							type="checkbox"
							name={radio.label}
							id={radio.label}
							checked={radio.option === taskFilterChoice}
							onChange={() => {
								setTaskFilterChoice(radio.option);

								if (radio.isValue) {
									setTaskFilterChoice("all");
								}
							}}
						/>

						<label htmlFor={radio.label}>{radio.label}</label>
					</div>
				))}

				<div className="checkbox">
					<input
						id="more-filters"
						type="checkbox"
						checked={isMoreFiltersOpen}
						onChange={() => setIsMoreFiltersOpen((prev) => !prev)}
					/>

					<label htmlFor="more-filters">Show all filters</label>
				</div>

				{isMoreFiltersOpen && (
					<>
						<hr />

						<LimitFilter limit={limit} setLimit={setLimit} />

						<TagFilter
							tagFilter={tagFilter}
							setTagFilter={setTagFilter}
							hasOnlyThisTags={hasOnlyThisTags}
							setHasOnlyThisTags={setHasOnlyThisTags}
						/>

						<NoteFilter
							noteFilter={noteFilter}
							setNoteFilter={setNoteFilter}
							isFromCurrentNote={isFromCurrentNote}
							setIsFromCurrentNote={setIsFromCurrentNote}
						/>
					</>
				)}

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
						<TaskItem
							key={`${task.lineNumber}${task.path}`}
							task={task}
							updateTask={updateTask}
						/>
					))
				) : (
					<p>Empty list.</p>
				)}
			</ul>
		</div>
	);
}
