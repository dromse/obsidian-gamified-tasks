import { Group } from "@core/types"
import React, { useState } from "react"
import TaskItem from "./TaskItem"

const TaskGroup = ({ group }: { group: Group }): React.JSX.Element => {
    const [isGroupCollapsed, setIsGroupCollapsed] = useState(false)

    return <div className="border">
        <h4 onClick={() => setIsGroupCollapsed(prev => !prev)}>{group.title}</h4>

        <ul className="list flex-column contains-task-list" style={{ display: isGroupCollapsed ? 'none' : 'block' }}>
            {group.tasks.map(task =>
                <TaskItem key={`${task.lineNumber}${task.path}`} task={task} />
            )}
        </ul>
    </div>
}

export default TaskGroup
