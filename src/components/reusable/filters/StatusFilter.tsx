import React from "react";

import { StatusKeys } from "@hooks/useWatchTasks/consts";
import { FilterState, StatusFilterOption } from "@hooks/useWatchTasks/types";
import styles from "./styles.module.css";

type Props = {
	status: FilterState<StatusFilterOption>;
};

export default function StatusFilter(props: Props): React.JSX.Element {
	const { status } = props;

	return (
		<div className="flex-items-center">
			<select
				name="status"
				id="status"
				className={styles.taskStatus}
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
