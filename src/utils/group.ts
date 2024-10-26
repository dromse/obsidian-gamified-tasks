import { Group, Task } from "@core/types"

export const grouppingFn = (acc: Array<Group>, task: Task): Array<Group> => {
    if (!task.group) {
        return acc
    }

    const group = acc.find(gr => gr.title === task.group)

    if (!group) {
        acc.push({ title: task.group, tasks: [task] })
    } else {
        group.tasks.push(task)
    }

    return acc
}
