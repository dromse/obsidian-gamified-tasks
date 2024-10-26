import { Group } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { Folder, FolderOpen } from "lucide-react";
import React, { useState } from "react";
import TaskItem from "./TaskItem";

const TaskGroup = ({ group }: { group: Group }): React.JSX.Element => {
    const settings = useSettings()!;
    const [isGroupCollapsed, setIsGroupCollapsed] = useState(
        settings.isGroupCollapsed,
    );

    function FolderIcon(): React.JSX.Element {
        return (
            <>
                {isGroupCollapsed ? (
                    <Folder className='text-accent p-1' />
                ) : (
                    <FolderOpen className='text-accent p-1' />
                )}
            </>
        );
    }

    return (
        <li className='border border-accent p-0'>
            <div
                className='flex items-center px-2'
                onClick={() => setIsGroupCollapsed((prev) => !prev)}
            >
                <FolderIcon />
                <p className='text-accent pl-0.5'>{group.title}</p>
            </div>

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
