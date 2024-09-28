import { GamifiedTasksConstants } from "@consts";
import { middlewares } from "@core/consts";
import { ParseState } from "@hooks/types";
import { useApp } from "@hooks/useApp";
import { useSettings } from "@hooks/useSettings";
import { getRawFiles } from "@utils/file";
import { parseMiddlewares } from "@utils/middleware";
import { parseTasks } from "@utils/task";

export function useFetchTasks(): () => Promise<ParseState> {
	const settings = useSettings()!;
	const app = useApp()!;

	const fetchTasks = async (): Promise<ParseState> => {
		try {
			const files = await getRawFiles(app.vault);

			const parsedTasks = parseTasks(files);
			const parsedTaskswithMiddlewares = parseMiddlewares(
				parsedTasks,
				middlewares,
				{
					settings,
					app,
				},
			);

			// cache tasks
			sessionStorage.setItem(
				GamifiedTasksConstants.sessionTasks,
				JSON.stringify(parsedTaskswithMiddlewares),
			);

			return "parsed";
		} catch (err) {
			return "error";
		}
	};

	return fetchTasks;
}
