import useEditTasks from "@hooks/useEditTasks";
import { Task } from "@core/types";
import { logger, loggerMsg } from "@utils/logger";
import { updateCounter } from "@utils/task";
import { Notice } from "obsidian";
import React from "react";

import styles from "../../styles.module.css";
import { useSettings } from "@hooks/useSettings";
import { Minus, Plus } from "lucide-react";

type CounterProps = {
    task: Task;
    addHistoryRow: Function;
    changeValue?: number;
};

export default function Counter(props: CounterProps): React.JSX.Element {
    const { task, addHistoryRow } = props;
    let { changeValue } = props;
    const { updateTask } = useEditTasks();
    const settings = useSettings();

    if (!changeValue) {
        changeValue = 1;
    }

    if (!settings) {
        return <div>Settings is not defined!</div>;
    }

    if (!task.counter) {
        return <div>Counter is not defined!</div>;
    }

    const [isButtonBlocked, setIsButtonBlocked] = React.useState(false);

    const handleUpdateCounter =
        (change: number) => async (): Promise<void> => {
            try {
                setIsButtonBlocked(true);

                await updateCounter({
                    task,
                    payload: { change },
                    updateTask,
                    addHistoryRow,
                    settings,
                });
            } catch (err) {
                logger(err);
                new Notice(loggerMsg(err));
            } finally {
                setIsButtonBlocked(false);
            }
        };

    return (
        <div className={`flex-items-center ${styles.counter}`}>
            <p>
                {task.counter.current}
                {task.counter.goal ? " / " + task.counter.goal : ""}
            </p>

            <button
                onClick={handleUpdateCounter(changeValue)}
                disabled={isButtonBlocked}
            >
                <Plus className='p-1.5' />
            </button>

            <button
                onClick={handleUpdateCounter(-changeValue)}
                disabled={isButtonBlocked}
            >
                <Minus className='p-1.5' />
            </button>
        </div>
    );
}
