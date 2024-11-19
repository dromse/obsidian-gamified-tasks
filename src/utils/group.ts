import { Group, GroupMetadata, Task } from "@core/types";

export const groupTasks =
    (customGroups: Array<GroupMetadata>) =>
    (acc: Array<Group>, task: Task): Array<Group> => {
        if (!task.group) {
            return acc;
        }

        const group = acc.find((gr) => gr.metadata.id === task.group);
        const customizedGroupMetadata = customGroups.find(
            (gr) => gr.id === task.group,
        );

        if (!group) {
            let metadata;

            if (customizedGroupMetadata) {
                metadata = customizedGroupMetadata;
            } else {
                metadata = {
                    id: task.group,
                    title: "",
                    color: "",
                    priority: 0,
                };
            }

            acc.push({
                metadata,
                tasks: [task],
            });
        } else {
            group.tasks.push(task);
        }

        return acc;
    };
