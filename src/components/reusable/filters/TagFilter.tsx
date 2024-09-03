import Input from "@components/reusable/Input";
import { FilterState } from "@hooks/useWatchTasks/types";
import React from "react";

type Props = {
	tags: FilterState<string | undefined>;
	onlyThisTags: FilterState<boolean>;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const { tags, onlyThisTags } = props;

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
					onChange={() => onlyThisTags.setValue(!onlyThisTags)}
				/>

				<label htmlFor="onlyTags">Show only with these tags</label>
			</div>
		</div>
	);
}
