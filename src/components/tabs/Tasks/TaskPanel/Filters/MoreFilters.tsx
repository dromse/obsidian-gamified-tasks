import { useSettings } from "@hooks/useSettings";
import React from "react";
import LimitFilter from "./LimitFilter";
import NoteFilter from "./NoteFilter";
import TagFilter from "./NoteFilter";

export default function MoreFilters(): React.JSX.Element {
	const settings = useSettings()!;

	const [isMoreFiltersOpen, setIsMoreFiltersOpen] = React.useState(
		settings.shouldShowAllFilters,
	);

	return (
		<>
			<div className="checkbox">
				<input
					id="more-filters"
					type="checkbox"
					checked={isMoreFiltersOpen}
					onChange={() => setIsMoreFiltersOpen((prev) => !prev)}
				/>

				<label htmlFor="more-filters">Show all filters</label>
			</div>

			{isMoreFiltersOpen && (
				<>
					<hr />

					<LimitFilter />
					<TagFilter />
					<NoteFilter />
				</>
			)}
		</>
	);
}
