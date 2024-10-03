import { singularOrPlural } from "@utils/string";
import React from "react";
import AddTask from "./AddTask";

export default function Bottom({
	tasksLength,
}: {
	tasksLength: number;
}): React.JSX.Element {
	return (
		<div className="flex-between flex-items-center">
			{singularOrPlural({
				amount: tasksLength,
				singular: "task",
			})}

			<AddTask />
		</div>
	);
}
