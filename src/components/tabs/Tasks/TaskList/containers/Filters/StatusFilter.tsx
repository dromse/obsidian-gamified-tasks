import React from "react";

import { StatusKeys } from "@core/consts";
import { StatusFilterOption } from "@core/types";
import { useFilters } from "@providers/FiltersProvider";
import styles from "../../../../../reusable/styles.module.css";

export default function StatusFilter(): React.JSX.Element {
	const { status } = useFilters();

	return (
		<div className="flex-items-center">
			<select
				name="status"
				id="status"
				className={styles.taskSelectOption}
				value={status.value}
				onChange={(e) =>
					status.setValue(e.currentTarget.value as StatusFilterOption)
				}
			>
				<option value="all">all</option>

				{StatusKeys.map((status) => (
					<option value={status} key={status}>
						{status}
					</option>
				))}
			</select>

			<label htmlFor="status">Filter by status</label>
		</div>
	);
}
