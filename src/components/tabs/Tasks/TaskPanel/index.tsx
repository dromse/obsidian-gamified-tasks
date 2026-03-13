import { Task } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import React, { useState } from "react";
import styles from "../styles.module.css";
import Bottom from "./Bottom";
import Filters from "./Filters";
import SearchFilter from "./Filters/SearchFilter";
import Sorting from "./Sorting";

export default function TaskPanel({
    tasksLength,
}: {
    tasksLength: number;
}): React.JSX.Element {
    const settings = useSettings()!;
    const [isToggleFilters, setIsToggleFilters] = useState(
        settings.isShowAllTaskSearchOptions,
    );

    const buttonText = (): string => (isToggleFilters ? "Hide" : "Show");

    return (
        <div className={`${styles.filters} flex-column border`}>
            <SearchFilter />

            {isToggleFilters && (
                <>
                    <Filters />
                    <Sorting />
                </>
            )}

            <button onClick={() => setIsToggleFilters((p) => !p)}>
                {buttonText()} options
            </button>
            <Bottom tasksLength={tasksLength} />
        </div>
    );
}
