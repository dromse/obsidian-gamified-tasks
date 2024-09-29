import ShouldSortAfterLimit from "@components/tabs/Tasks/TaskList/containers/Sorting/ShouldSortAfterLimit";
import SortByOrder from "@components/tabs/Tasks/TaskList/containers/Sorting/SortByOrder";
import SortByType from "@components/tabs/Tasks/TaskList/containers/Sorting/SortByType";
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
