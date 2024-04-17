import React from "react";

type Props = {
	limit: number | undefined;
	setLimit: Function;
};

export default function LimitFilter({
	limit,
	setLimit,
}: Props): React.JSX.Element {
	return (
		<div>
			<label htmlFor="limit">Limit:</label>
			<input
				type="number"
				name="limit"
				id="limit"
				style={{ width: "100%" }}
				placeholder="Task to show"
				value={limit ? limit : ""}
				onChange={(e) =>
					setLimit(
						e.currentTarget.value ? Number(e.currentTarget.value) : undefined,
					)
				}
			/>
		</div>
	);
}
