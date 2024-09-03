import Input from "@components/reusable/Input";
import { FilterState } from "@hooks/useWatchTasks/types";
import React from "react";

type Props = {
	limit: FilterState<number | undefined>;
};

export default function LimitFilter(props: Props): React.JSX.Element {
	const { limit } = props;

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
