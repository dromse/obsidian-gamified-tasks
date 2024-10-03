import { Task } from "@core/types";
import React from "react";
import styles from "../styles.module.css";
import Bottom from "./Bottom";
import Filters from "./Filters";
import Sorting from "./Sorting";

export default function TaskPanel({
	tasksLength,
}: {
	tasksLength: number
}): React.JSX.Element {
	return (
		<div className={`${styles.filters} flex-column border`}>
			<Filters />
			<Sorting />
			<Bottom tasksLength={tasksLength} />
		</div>
	);
}
