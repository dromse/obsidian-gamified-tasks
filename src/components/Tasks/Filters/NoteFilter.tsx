import React, { useState } from "react";
import styles from "../styles.module.css";

type Props = {
	noteFilter: string | undefined;
	setNoteFilter: Function;
	fromCurrentNote: boolean;
	setFromCurrentNote: Function;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const { noteFilter, setNoteFilter, fromCurrentNote, setFromCurrentNote } =
		props;

	const [inputValue, setInputValue] = useState(noteFilter);

	const handleClick = (): void => {
		setNoteFilter(inputValue);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
			<label htmlFor="noteFilter">Tasks from note:</label>

			<div style={{ display: "flex", gap: "10px" }}>
				<input
					type="text"
					name="noteFilter"
					id="noteFilter"
					style={{ width: "100%" }}
					placeholder="Input note path without '.md'"
					value={inputValue ? inputValue : ""}
					onChange={(e) => setInputValue(e.currentTarget.value.trim())}
					disabled={fromCurrentNote}
				/>

				<button onClick={handleClick}>Apply</button>
			</div>

			<div className={styles.checkbox}>
				<input
					type="checkbox"
					name="currentNote"
					id="currentNote"
					checked={fromCurrentNote}
					onChange={() => setFromCurrentNote(!fromCurrentNote)}
				/>

				<label htmlFor="currentNote">Show tasks from current note</label>
			</div>
		</div>
	);
}
