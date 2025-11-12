import { middlewares } from "@core/consts";
import { Status, Task } from "@core/types";
import { useApp } from "@hooks/useApp";
import { useSettings } from "@hooks/useSettings";
import { stringifyMiddlewares } from "@utils/middleware";
import { operateYAMLBinding } from "@utils/task";

export type UpdateTaskFunctionType = (
	task: Task,
	newTask: Task,
	opts?: UpdateTaskOpts,
) => Promise<string | undefined>;

export type UpdateTaskOpts = {
	ignore: {
		bind: boolean;
	};
};

type UseEditTasksProps = {
	updateTask: UpdateTaskFunctionType;
	addTask: (task: Task) => void;
	resetRecurringTask: (task: Task) => void;
	deactivateTask: (task: Task) => Promise<string | undefined>
};

export default function useEditTasks(): UseEditTasksProps {
	const settings = useSettings();
	const app = useApp();

	if (!app) {
		return { updateTask, addTask, resetRecurringTask, deactivateTask };
	}
	const { vault } = app;

	async function addTask(taskToAdd: Task): Promise<string | undefined> {
		const newLineContent = stringifyMiddlewares(
			taskToAdd,
			middlewares,
			settings,
		);

		const tFile = vault.getFileByPath(taskToAdd.path);

		if (!tFile) {
			return;
		}

		return await vault.process(tFile, (fileContent) =>
			fileContent.concat("\n", newLineContent),
		);
	}

	/**
	 * Update task props and save to vault
	 * @returns new string on success, undefined on failure.
	 * */
	async function updateTask(
		task: Task,
		newTask: Task,
		opts?: UpdateTaskOpts,
	): Promise<string | undefined> {
		const newLineContent = stringifyMiddlewares(
			newTask,
			middlewares,
			settings,
		);

		const tFile = vault.getFileByPath(task.path);

		if (!tFile) {
			return;
		}

		if (!opts?.ignore.bind) {
			if (task.bind && app && settings) {
				await operateYAMLBinding({
					task: newTask,
					previousTaskState: task,
					app,
					vault,
					settings,
				});
			}
		}

		return await vault.process(tFile, (data) =>
			data.replace(task.lineContent, newLineContent),
		);
	}
	
	async function deactivateTask(task: Task): Promise<string | undefined> {
		const tFile = vault.getFileByPath(task.path);
		const newTask = {...task, status: 'archive' as Status }

		const newLineContent = stringifyMiddlewares(
			newTask,
			middlewares,
			settings,
		);

		
		if (!tFile) {
			return;
		}

		return await vault.process(tFile, (data) =>
			data.replace(task.lineContent, newLineContent),
		);
	}

	function resetRecurringTask(task: Task): void {
		const newTask = { ...task };

		const isNotDone = task.status !== "done";

		if (isNotDone) {
			return;
		}

		newTask.status = "todo";

		if (task.counter) {
			const isGoalNotSet = !task.counter.goal;
			const isReachedGoal = task.counter.current === task.counter.goal;

			if (isGoalNotSet || isReachedGoal) {
				const { goal } = task.counter;

				newTask.counter = { current: 0, goal };
			}
		}

		updateTask(task, newTask, { ignore: { bind: true } });
	}

	return { addTask, updateTask, resetRecurringTask, deactivateTask };
}
