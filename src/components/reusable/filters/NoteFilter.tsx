import Input from "@components/reusable/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";

type Props = {
	noteFilter: string | undefined;
	setNoteFilter: Function;
	isFromCurrentNote: boolean;
	setIsFromCurrentNote: Function;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const {
		noteFilter,
		setNoteFilter,
		isFromCurrentNote,
		setIsFromCurrentNote,
	} = props;

	const [inputValue, setInputValue] = useState(noteFilter);

	const handleClick = (): void => {
		setNoteFilter(inputValue);
	};

	return (
		<div className={styles.note}>
			<label htmlFor="noteFilter">Tasks from note:</label>

			<div className={styles.noteInputAndButton}>
				<Input
					className={styles.noteInput}
					type="text"
					name="noteFilter"
					id="noteFilter"
					placeholder="path/to/note"
					value={inputValue ? inputValue : ""}
					onChange={(e) => setInputValue(e.currentTarget.value.trim())}
					disabled={isFromCurrentNote}
				/>

				<button onClick={handleClick}>Apply</button>
			</div>

			<div className="checkbox">
				<input
					type="checkbox"
					name="currentNote"
					id="currentNote"
					checked={isFromCurrentNote}
					onChange={() => setIsFromCurrentNote(!isFromCurrentNote)}
				/>

				<label htmlFor="currentNote">Show tasks from current note</label>
			</div>
		</div>
	);
}
