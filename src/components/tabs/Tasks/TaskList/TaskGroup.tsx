import { Group } from "@core/types";
import React, { useState } from "react";
import TaskItem from "./TaskItem";

const TaskGroup = ({ group }: { group: Group }): React.JSX.Element => {
    const [isGroupCollapsed, setIsGroupCollapsed] = useState(false);

    return (
        <li className='border'>
            <p onClick={() => setIsGroupCollapsed((prev) => !prev)}>
                {group.title}
            </p>

            <ul
                className='list flex-column contains-task-list'
                style={{ display: isGroupCollapsed ? "none" : "block" }}
            >
                {group.tasks.map((task) => (
                    <TaskItem
                        key={`${task.lineNumber}${task.path}`}
                        task={task}
                    />
                ))}
            </ul>
        </li>
    );
};

export default TaskGroup;
