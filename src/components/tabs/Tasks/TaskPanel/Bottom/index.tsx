import { formatTasks } from "@utils/string";
import React from "react";
import AddTask from "./AddTask";

export default function Bottom({
    tasksLength,
}: {
    tasksLength: number;
}): React.JSX.Element {
    return (
        <div className='flex-between flex-items-center'>
            {formatTasks(tasksLength)}

            <AddTask />
        </div>
    );
}
