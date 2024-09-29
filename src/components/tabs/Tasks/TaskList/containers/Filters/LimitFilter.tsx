import Input from "@components/reusable/Input";
import { useFilters } from "@providers/FiltersProvider";
import React from "react";

export default function LimitFilter(): React.JSX.Element {
	const { limit } = useFilters();

	return (
		<div className="flex-items-center">
			<label htmlFor="limit">Limit:</label>

			<Input
				type="number"
				name="limit"
				id="limit"
				placeholder="number tasks to show"
				value={limit.value ? limit.value : ""}
				onChange={(e) =>
					limit.setValue(
						e.currentTarget.value ? Number(e.currentTarget.value) : undefined,
					)
				}
			/>
		</div>
	);
}
