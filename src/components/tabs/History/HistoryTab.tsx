import { HistoryRow } from "@hooks/useHistory";
import React from "react";
import { HistoryList } from "./HistoryList";
import HistoryPanel from "./HistoryPanel";

export default function HistoryTab({
	historyRows,
}: {
	historyRows: Array<HistoryRow>;
}): React.JSX.Element {
	const [totalPages, setTotalPages] = React.useState<number | undefined>(
		undefined,
	);
	const [page, setPage] = React.useState(0);
	const [search, setSearch] = React.useState("");

	if (typeof totalPages === "number") {
		return (
			<div>
				<HistoryPanel
					totalPages={totalPages}
					page={page}
					setPage={setPage}
					search={search}
					setSearch={setSearch}
				/>

				<HistoryList
					page={page}
					historyRows={historyRows.filter((row) =>
						row.title.toLowerCase().includes(search.toLowerCase()),
					)}
				/>
			</div>
		);
	} else {
		setTotalPages(Math.ceil(historyRows.length / 10));
	}

	return <></>;
}
