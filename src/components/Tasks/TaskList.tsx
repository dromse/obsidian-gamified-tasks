import { useSettings } from "@hooks";
import { Task, TaskFilters } from "@hooks/useTasks/types";
import { singularOrPlural } from "@utils/string";
import React, { useState } from "react";
import {
	LimitFilter,
	NoteFilter,
	SearchFilter,
	StatusFilter,
	TagFilter
} from "./Filters";
import RecurFilter from "./Filters/RecurFilter";
import styles from "./styles.module.css";
import TaskItem from "./TaskItem";

type Props = {
	tasks: Array<Task>;
	updateTask: (task: Task, newTask: Task) => void;
	filters: TaskFilters;
};

export default function TaskList(props: Props): React.JSX.Element {
	const { tasks, updateTask, filters } = props;
	const settings = useSettings()

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
	} = filters;

	const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(settings?.shouldShowAllFilters);

	return (
		<div>
			<div className={`${styles.filters} border`}>
				<SearchFilter
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
				/>
				<StatusFilter
					currentStatusFilter={statusFilter}
					setCurrentStatusFilter={setStatusFilter}
				/>
				<RecurFilter
					isRecur={isRecur}
					setIsRecur={setIsRecur}
				/>

				<div>
					<div className={styles.checkbox}>
						<input
							id="more-filters"
							type="checkbox"
							checked={isMoreFiltersOpen}
							onChange={() => setIsMoreFiltersOpen((prev) => !prev)}
						/>

						<label htmlFor="more-filters">Show more filters?</label>
					</div>

					{isMoreFiltersOpen && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "10px",
								paddingTop: "5px",
							}}
						>
							<LimitFilter
								limit={limit}
								setLimit={setLimit}
							/>
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
						</div>
					)}
				</div>

				<div>
					{singularOrPlural({ amount: tasks.length, singular: "task" })}
				</div>
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
