import { Task, TaskFilters } from "@hooks/useTasks/types";
import React from "react";
import { LimitFilter, NoteFilter, SearchFilter, StatusFilter, TagFilter } from "./Filters";
import RecurFilter from "./Filters/RecurFilter";
import styles from "./styles.module.css";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Task[];
	updateTask: (task: Task, newTask: Task) => void;
	filters: TaskFilters;
};

export default function TaskList({ tasks, updateTask, filters }: Props) {
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
		onlyThisTags,
		setOnlyThisTags,
		noteFilter,
		setNoteFilter,
		fromCurrentNote,
		setFromCurrentNote
	} = filters;

	return (
		<div>
			<div className={`${styles.filters} border`}>
				<SearchFilter
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
				/>
				<LimitFilter
					limit={limit}
					setLimit={setLimit}
				/>
				<StatusFilter
					currentStatusFilter={statusFilter}
					setCurrentStatusFilter={setStatusFilter}
				/>
				<RecurFilter
					isRecur={isRecur}
					setIsRecur={setIsRecur}
				/>
				<TagFilter
					tagFilter={tagFilter}
					setTagFilter={setTagFilter}
					onlyThisTags={onlyThisTags}
					setOnlyThisTags={setOnlyThisTags}
				/>
				<NoteFilter
					noteFilter={noteFilter}
					setNoteFilter={setNoteFilter}
					fromCurrentNote={fromCurrentNote}
					setFromCurrentNote={setFromCurrentNote}
				/>
			</div>

			<ul className={`list ${styles.list}`}>
				{tasks.length > 0 ? (
					tasks.map((task) => (
						<TaskItem
							key={task.body}
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
