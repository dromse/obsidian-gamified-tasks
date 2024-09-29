import {
	LimitFilter,
	NoteFilter,
	TagFilter
} from "@components/reusable/filters";
import { useSettings } from "@hooks/useSettings";
import React from "react";

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

			<hr />
		</>
	);
}
