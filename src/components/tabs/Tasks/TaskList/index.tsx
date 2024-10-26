import { Task } from "@core/types";
import { grouppingFn } from "@utils/group";
import React from "react";
import TaskGroup from "./TaskGroup";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Array<Task>;
};

export default function TaskList(props: Props): React.JSX.Element {
    const { tasks } = props;

    const groupedTasks = tasks.reduce(grouppingFn, []);
    const ungroupedTasks = tasks.filter((task) => !task.group);

    return (
        <ul className='list flex-column contains-task-list'>
            {groupedTasks.map((group) => (
                <TaskGroup key={group.title} group={group} />
            ))}

            {ungroupedTasks.map((task) => (
                <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
            ))}
        </ul>
    );
}
