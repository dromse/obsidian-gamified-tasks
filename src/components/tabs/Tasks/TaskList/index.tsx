import { Task } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { groupTasks } from "@utils/group";
import React from "react";
import TaskGroup from "./TaskGroup";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Array<Task>;
};

export default function TaskList(props: Props): React.JSX.Element {
    const { tasks } = props;

    const settings = useSettings()!;
    const groupedTasks = tasks.reduce(groupTasks(settings.customGroups), []);
    const ungroupedTasks = tasks.filter((task) => !task.group);

    return (
        <ul className='list flex-column contains-task-list'>
            {groupedTasks
                .sort((a, b) => b.metadata.priority - a.metadata.priority)
                .map((group) => (
                    <TaskGroup key={group.metadata.id} group={group} />
                ))}

            {ungroupedTasks.map((task) => (
                <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
            ))}
        </ul>
    );
}
