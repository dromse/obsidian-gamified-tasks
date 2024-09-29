import Input from "@components/reusable/Input";
import { useFilters } from "@providers/FiltersProvider";
import React from "react";

export default function SearchFilter(): React.JSX.Element {
	const { search } = useFilters();

	return (
		<Input
			type="text"
			name="search"
			id="search"
			placeholder="Search tasks"
			value={search.value}
			onChange={(e) => search.setValue(e.currentTarget.value)}
		/>
	);
}
