import React from "react";
import Modes from "./Modes";
import MoreFilters from "./MoreFilters";
import SearchFilter from "./SearchFilter";
import StatusFilter from "./StatusFilter";

export default function Filters(): React.JSX.Element {
	return (
		<>
			<SearchFilter />
			<StatusFilter />
			<Modes />
			<MoreFilters />

			<hr />
		</>
	);
}
