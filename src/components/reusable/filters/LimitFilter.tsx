import Input from "@components/reusable/Input";
import React from "react";

type Props = {
	limit: number | undefined;
	setLimit: Function;
};

export default function LimitFilter(props: Props): React.JSX.Element {
	const { limit, setLimit } = props;

	return (
		<div className="flex-items-center">
			<label htmlFor="limit">Limit:</label>

			<Input
				type="number"
				name="limit"
				id="limit"
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
