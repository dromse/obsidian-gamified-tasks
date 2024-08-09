import { HistoryRow } from "@hooks/useHistory";
import React from "react";
import styles from "./styles.module.css";

type TableProps = {
	historyRows: Array<HistoryRow>;
	page: number;
};

export const Table = ({
	historyRows,
	page,
}: TableProps): React.JSX.Element => (
	<table className={styles.table}>
		<thead>
			<tr>
				<th scope="col">Change</th>
				<th scope="col">Title</th>
				<th scope="col">Date</th>
			</tr>
		</thead>

		<tbody>
			{historyRows.slice(page * 10, (page + 1) * 10).map((row, index) => (
				<tr key={index}>
					<th scope="row">{row.change > 0 ? "+" + row.change : row.change}</th>
					<td>{row.title}</td>
					<td>{row.date}</td>
				</tr>
			))}
		</tbody>
	</table>
);
