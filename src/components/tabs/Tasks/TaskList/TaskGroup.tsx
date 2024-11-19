import { Group } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { formatTasks } from "@utils/string";
import { Folder, FolderOpen } from "lucide-react";
import React, { useState } from "react";
import TaskItem from "./TaskItem";

const TaskGroup = ({ group }: { group: Group }): React.JSX.Element => {
    const settings = useSettings()!;

    const [isGroupCollapsed, setIsGroupCollapsed] = useState(
        settings.isGroupCollapsed,
    );

    const groupColor = group.metadata.color ? group.metadata.color : "var(--tag-color)";
    const groupTitle = group.metadata.title ? group.metadata.title : group.metadata.id;

    function FolderIcon(): React.JSX.Element {
        return (
            <>
                {isGroupCollapsed ? (
                    <Folder className='p-1' style={{ color: groupColor }} />
                ) : (
                    <FolderOpen
                        className='p-1'
                        style={{ color: groupColor }}
                    />
                )}
            </>
        );
    }

    const GroupAccordion = (): React.JSX.Element => (
        <div
            className='flex justify-between items-center'
            onClick={() => setIsGroupCollapsed((prev) => !prev)}
        >
            <div className='flex items-center px-2'>
                <FolderIcon />

                <p style={{ color: groupColor }}>{groupTitle}</p>
            </div>

            <p className='pr-2 text-[0.65rem]' style={{color: groupColor}}>
                {formatTasks(group.tasks.length)}
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
        <li className='border p-0' style={{ borderColor: groupColor }}>
            <GroupAccordion />
            <GroupTasks />
        </li>
    );
};

export default TaskGroup;
