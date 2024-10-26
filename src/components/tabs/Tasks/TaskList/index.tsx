import { Task } from "@core/types";
import React from "react";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Array<Task>;
};

export default function TaskList(props: Props): React.JSX.Element {
    const { tasks } = props;

    // if task has group, add this to existing group or create new group
    const TaskGroup = ({ group }: { group: Group }): React.JSX.Element => {
        return <div>
            <h3>{group.title}</h3>

            {group.tasks.map(task =>
                <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
            )}
        </div>
    }

    type Group = {
        title: string
        tasks: Array<Task>
    }

    const grouppingFn = (acc: Array<Group>, task: Task): Array<Group> => {
        if (!task.group) {
            return acc
        }

        const group = acc.find(gr => gr.title === task.group)

        // create new group
        if (!group) {

        }

        // add task to exist group

        return acc
    }

    const groupedTasks = tasks.reduce(grouppingFn, []);
    const ungroupedTasks = tasks.filter((task) => !task.group)

    return (
        <ul className="list flex-column contains-task-list">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
                ))
            ) : (
                <p>Empty list.</p>
            )}
        </ul>
    );
}
