import Input from "@components/reusable/Input";
import { useFilters } from "@providers/FiltersProvider";
import React from "react";

export default function TagFilter(): React.JSX.Element {
	const { tags, onlyThisTags } = useFilters();

	return (
		<div className="flex-column">
			<div className="flex-items-center">
				<label htmlFor="tags">Tags:</label>

				<Input
					type="search"
					name="tags"
					id="tags"
					placeholder="sport, code..."
					value={tags.value ? tags.value : ""}
					onChange={(e) => tags.setValue(e.currentTarget.value)}
				/>
			</div>

			<div className="checkbox">
				<input
					type="checkbox"
					name="onlyTags"
					id="onlyTags"
					checked={onlyThisTags.value}
					onChange={() => onlyThisTags.setValue((prev) => !prev)}
				/>

				<label htmlFor="onlyTags">Show only with these tags</label>
			</div>
		</div>
	);
}
