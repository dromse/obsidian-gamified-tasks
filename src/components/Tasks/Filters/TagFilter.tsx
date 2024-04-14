import React from "react";
import styles from "../styles.module.css";

type Props = {
	tagFilter: string | undefined;
	setTagFilter: Function;
	onlyThisTags: boolean;
	setOnlyThisTags: Function;
};

export default function TagFilter({
	tagFilter,
	setTagFilter,
	onlyThisTags,
	setOnlyThisTags,
}: Props) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
			<label htmlFor="tags">Tags:</label>
			<input
				type="text"
				name="tags"
				id="tags"
				style={{ width: "100%" }}
				placeholder="Input tags without # (use comma to separate)"
				value={tagFilter ? tagFilter : ""}
				onChange={(e) => setTagFilter(e.currentTarget.value)}
			/>

			<div className={styles.checkbox}>
				<input
					type="checkbox"
					name="onlyTags"
					id="onlyTags"
					checked={onlyThisTags}
					onChange={() => setOnlyThisTags(!onlyThisTags)}
				/>

				<label htmlFor="onlyTags">Show only with these tags</label>
			</div>
		</div>
	);
}
