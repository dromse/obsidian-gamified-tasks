import Input from "@components/reusable/Input";
import React from "react";

type Props = {
	tagFilter: string | undefined;
	setTagFilter: Function;
	hasOnlyThisTags: boolean;
	setHasOnlyThisTags: Function;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const { tagFilter, setTagFilter, hasOnlyThisTags, setHasOnlyThisTags } =
		props;

	return (
		<div className="flex-column">
			<div className="flex-items-center">
				<label htmlFor="tags">Tags:</label>

				<Input
					type="search"
					name="tags"
					id="tags"
					placeholder="sport, code..."
					value={tagFilter ? tagFilter : ""}
					onChange={(e) => setTagFilter(e.currentTarget.value)}
				/>
			</div>

			<div className="checkbox">
				<input
					type="checkbox"
					name="onlyTags"
					id="onlyTags"
					checked={hasOnlyThisTags}
					onChange={() => setHasOnlyThisTags(!hasOnlyThisTags)}
				/>

				<label htmlFor="onlyTags">Show only with these tags</label>
			</div>
		</div>
	);
}
