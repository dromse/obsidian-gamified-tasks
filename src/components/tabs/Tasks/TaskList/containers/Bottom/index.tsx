import { singularOrPlural } from "@utils/string";
import React from "react";
import AddTask from "./AddTask";

export default function Bottom({
	amountOfTasks,
}: {
	amountOfTasks: number;
}): React.JSX.Element {
	return (
		<div className="flex-between flex-items-center">
			{singularOrPlural({
				amount: amountOfTasks,
				singular: "task",
			})}

			<AddTask />
		</div>
	);
}
