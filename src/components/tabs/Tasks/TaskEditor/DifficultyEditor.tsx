import { useSettings } from "@hooks";
import { Task } from "@hooks/useWatchTasks/types";
import React from "react";

const DifficultyEditor = ({
	newTask,
	setNewTask,
}: {
	newTask: Task;
	setNewTask: Function;
}): React.JSX.Element => {
	const settings = useSettings();

	if (!settings) {
		return <div>Settings is not defined.</div>;
	}

	const onSelectDifficulty = (
		e: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const newDifficulty = e.currentTarget.value;

		if (newDifficulty === "none") {
			setNewTask({ ...newTask, difficulty: undefined });
			return;
		}

		setNewTask({ ...newTask, difficulty: newDifficulty });
	};

	return (
		<select
			onChange={onSelectDifficulty}
			defaultValue={newTask.difficulty ? newTask.difficulty : "none"}
		>
			<option>none</option>

			{settings.difficulties.map((diff) => (
				<option key={diff.name}>{diff.name}</option>
			))}
		</select>
	);
};

export default DifficultyEditor;
