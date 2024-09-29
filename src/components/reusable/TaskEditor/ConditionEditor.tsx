import { Task } from "@core/types";
import React from "react";

const ConditionEditor = ({
	newTask,
	setNewTask,
}: {
	newTask: Task;
	setNewTask: Function;
}): React.JSX.Element => {
	return (
		<>
			<div className="todo">
				<input
					type="checkbox"
					name="condition"
					id="condition"
					checked={Boolean(newTask.condition)}
					onChange={() => {
						setNewTask({
							...newTask,
							condition: !Boolean(newTask.condition)
								? { name: "", arg: "" }
								: undefined,
						});
					}}
				/>

				<label htmlFor="condition">condition</label>
			</div>
			{newTask.condition ? (
				<>
					<input
						type="text"
						placeholder="condition script name"
						value={newTask.condition?.name}
						onChange={(e) =>
							setNewTask({
								...newTask,
								condition: {
									...newTask?.condition,
									name: e.currentTarget.value,
								},
							})
						}
					/>

					<input
						type="text"
						placeholder="condition script argument"
						value={newTask.condition?.arg}
						onChange={(e) =>
							setNewTask({
								...newTask,
								condition: {
									...newTask?.condition,
									arg: e.currentTarget.value,
								},
							})
						}
					/>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default ConditionEditor;
