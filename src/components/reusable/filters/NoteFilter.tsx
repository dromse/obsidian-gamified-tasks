import Input from "@components/reusable/Input";
import { FilterState } from "@hooks/useWatchTasks/types";
import React, { useState } from "react";
import styles from "./styles.module.css";

type Props = {
	note: FilterState<string | undefined>;
	currentNote: FilterState<boolean>;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const { note, currentNote } = props;

	const [inputValue, setInputValue] = useState(note.value);

	const handleClick = (): void => {
		note.setValue(inputValue);
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
					disabled={currentNote.value}
				/>

				<button onClick={handleClick}>Apply</button>
			</div>

			<div className="checkbox">
				<input
					type="checkbox"
					name="currentNote"
					id="currentNote"
					checked={currentNote.value}
					onChange={() => currentNote.setValue(!currentNote)}
				/>

				<label htmlFor="currentNote">Show tasks from current note</label>
			</div>
		</div>
	);
}
