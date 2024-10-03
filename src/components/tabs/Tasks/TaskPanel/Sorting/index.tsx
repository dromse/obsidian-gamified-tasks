import ShouldSortAfterLimit from "@components/tabs/Tasks/TaskPanel/Sorting/ShouldSortAfterLimit";
import SortByOrder from "@components/tabs/Tasks/TaskPanel/Sorting/SortByOrder";
import SortByType from "@components/tabs/Tasks/TaskPanel/Sorting/SortByType";
import React from "react";

export default function Sorting(): React.JSX.Element {
	return (
		<>
			<SortByType />
			<SortByOrder />
			<ShouldSortAfterLimit />

			<hr />
		</>
	);
}
