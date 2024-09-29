import { useSorting } from "@providers/SortingProvider";
import React from "react";


export default function ShouldSortAfterLimit(
): React.JSX.Element {

	const { shouldSortAfterLimit } = useSorting();

	return (
		<div className="checkbox">
			<input
				type="checkbox"
				name="should-sort-after-limit"
				id="should-sort-after-limit"
				checked={shouldSortAfterLimit.value}
				onChange={() => {
					shouldSortAfterLimit.setValue((prev) => !prev);
				}}
			/>

			<label htmlFor="should-sort-after-limit">Sort after limit?</label>
		</div>
	);
}
