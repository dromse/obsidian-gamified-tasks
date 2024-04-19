import React from "react";

type Props = {
	searchFilter: string;
	setSearchFilter: Function;
};

export default function SearchFilter(props: Props): React.JSX.Element {
	const { searchFilter, setSearchFilter } = props;

	return (
		<input
			type="text"
			name=""
			id=""
			placeholder="Search tasks"
			value={searchFilter}
			onChange={(e) => setSearchFilter(e.currentTarget.value)}
		/>
	);
}
