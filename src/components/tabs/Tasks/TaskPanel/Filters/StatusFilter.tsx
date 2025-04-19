import React from "react";

import { StatusKeys } from "@core/consts";
import { Status } from "@core/types";
import { useFilters } from "@providers/FiltersProvider";
import styles from "../../../../reusable/styles.module.css";

export default function StatusFilter(): React.JSX.Element {
	const statusOptions: Array<Status> = StatusKeys;
	const { status } = useFilters();

	const statusValue = status.value;
	const setStatus = status.setValue;

	return (
		<div className="flex-items-center">
			<label htmlFor="status">Filter by status</label>
			{/* Exclude Statuses Checkbox */}
			<div className={styles.statusCheckboxRow}>
				{statusOptions.map((s) => (
					<div key={s} className={styles.statusCheckboxItem}>
						<input
							type="checkbox"
							id={s}
							name={s}
							checked={statusValue.includes(s)}
							onChange={(e) => {
								const newStatuses = e.target.checked
									? [...statusValue, s]
									: statusValue.filter((v) => v !== s);
								setStatus(newStatuses);
							}}
							value={s}
						/>
						<label htmlFor={s}>{s}</label>
					</div>
				))}
			</div>
		</div>
	);
}
