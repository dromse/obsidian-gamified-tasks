import React from "react";

import { SortTypeOptions } from "@core/consts";
import { SortType } from "@core/types";
import { useSorting } from "@providers/SortingProvider";
import styles from "../../../../../reusable/styles.module.css";

export default function SortByType(): React.JSX.Element {
	const { sortByType } = useSorting();

	return (
		<div className="flex-items-center">
			<select
				name="type"
				id="type"
				className={styles.taskSelectOption}
				value={sortByType.value}
				onChange={(e) =>
					sortByType.setValue(e.currentTarget.value as SortType)
				}
			>
				{SortTypeOptions.map((type) => (
					<option value={type} key={type}>
						{type}
					</option>
				))}
			</select>

			<label htmlFor="type">Sort by type</label>
		</div>
	);
}
