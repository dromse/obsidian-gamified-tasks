import { Group } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { singularOrPlural } from "@utils/string";
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

    const tasksFormattedAmount = singularOrPlural({
        amount: group.tasks.length,
        singular: "task",
    });

    const GroupAccordion = (): React.JSX.Element => (
        <div
            className='flex justify-between items-center'
            onClick={() => setIsGroupCollapsed((prev) => !prev)}
        >
            <div className='flex items-center px-2'>
                <FolderIcon />
                <p className='text-accent pl-0.5'>{group.title}</p>
            </div>

            <p className='pr-2 text-accent text-[0.65rem]'>
                {tasksFormattedAmount}
            </p>
        </div>
    );

    const GroupTasks = (): React.JSX.Element => (
        <ul
            className='list flex-column contains-task-list'
            style={{ display: isGroupCollapsed ? "none" : "block" }}
        >
            {group.tasks.map((task) => (
                <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
            ))}
        </ul>
    );

    return (
        <li className='border border-accent p-0'>
            <GroupAccordion />
            <GroupTasks />
        </li>
    );
};

export default TaskGroup;
