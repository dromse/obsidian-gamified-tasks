import React from "react";

type Props = { isRecur: boolean; setIsRecur: Function };

export default function RecurFilter(props: Props): React.JSX.Element {
	const { isRecur, setIsRecur } = props;

	return (
		<div className="checkbox">
			<input
				type="checkbox"
				name="is-recur"
				id="is-recur"
				checked={isRecur}
				onChange={() => setIsRecur(!isRecur)}
			/>

			<label htmlFor="is-recur">Show recurring tasks</label>
		</div>
	);
}
