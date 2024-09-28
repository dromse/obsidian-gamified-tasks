import React from "react";

import { SortOrderOptions } from "@core/consts";
import { SortOrder } from "@core/types";
import { useSorting } from "@providers/SortingProvider";
import styles from "../styles.module.css";

export default function SortByOrder(): React.JSX.Element {
	const { sortByOrder } = useSorting();

	return (
		<div className="flex-items-center">
			<select
				name="order"
				id="order"
				className={styles.taskSelectOption}
				value={sortByOrder.value}
				onChange={(e) =>
					sortByOrder.setValue(e.currentTarget.value as SortOrder)
				}
			>
				{SortOrderOptions.map((order) => (
					<option value={order} key={order}>
						{order}
					</option>
				))}
			</select>

			<label htmlFor="order">Sort by order</label>
		</div>
	);
}
