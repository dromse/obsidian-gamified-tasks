import useHistory from "@hooks/useHistory";
import React from "react";
import HistoryTab from "./HistoryTab";

export default function History(): React.JSX.Element {
	const { historyRows, isHistoryParsed } = useHistory();

	if (isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isHistoryParsed === "parsed") {
		return <HistoryTab historyRows={historyRows} />;
	}

	if (isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div>Something went wrong...</div>;
}
