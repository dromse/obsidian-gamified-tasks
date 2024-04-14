import React from "react";

import { StatusKeys } from "@hooks/useTasks/consts";
import { StatusFilterOption } from "@hooks/useTasks/types";
import styles from "../styles.module.css";

type Props = {
	currentStatusFilter: StatusFilterOption;
	setCurrentStatusFilter: Function;
};

export default function StatusFilter({
	currentStatusFilter,
	setCurrentStatusFilter,
}: Props) {
	return (
		<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
			<select
				name="status"
				id="status"
				className={styles.taskStatus}
				value={currentStatusFilter}
				onChange={(e) =>
					setCurrentStatusFilter(e.currentTarget.value as StatusFilterOption)
				}
			>
				<option value="all">all</option>

				{StatusKeys.map((status) => (
					<option
						value={status}
						key={status}
					>
						{status}
					</option>
				))}
			</select>

			<label htmlFor="status">Filter by status</label>
		</div>
	);
}
