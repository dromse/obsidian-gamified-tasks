import Input from "@components/reusable/Input";
import { State } from "@core/types";
import React, { useState } from "react";
import styles from "../styles.module.css";

type Props = {
	note: State<string | undefined>;
	shouldShowCurrentNoteTasks: State<boolean>;
};

export default function TagFilter(props: Props): React.JSX.Element {
	const { note, shouldShowCurrentNoteTasks: shouldShowCurrentNoteTasks } =
		props;

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
					disabled={shouldShowCurrentNoteTasks.value}
				/>

				<button onClick={handleClick}>Apply</button>
			</div>

			<div className="checkbox">
				<input
					type="checkbox"
					name="currentNote"
					id="currentNote"
					checked={shouldShowCurrentNoteTasks.value}
					onChange={() => shouldShowCurrentNoteTasks.setValue((prev) => !prev)}
				/>

				<label htmlFor="currentNote">Show tasks from current note</label>
			</div>
		</div>
	);
}
