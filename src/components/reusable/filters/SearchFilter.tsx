import Input from "@components/reusable/Input";
import { FilterState } from "@hooks/useWatchTasks/types";
import React from "react";

type Props = {
	search: FilterState<string>;
};

export default function SearchFilter(props: Props): React.JSX.Element {
	const { search } = props;

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
