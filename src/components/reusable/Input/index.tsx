import { X } from "lucide-react";
import React from "react";
import styles from "./styles.module.css";

type InputWithClearProps = {
	afterclearvalue?: string;
} & React.ComponentPropsWithoutRef<"input">;

export default function Input(props: InputWithClearProps): React.JSX.Element {
	const { value, onChange, afterclearvalue } = props;

	return (
		<div className={styles.container}>
			<input {...props} />

			{value && (
				<button
					className={`${styles.close} clickable-icon`}
					onClick={() =>
						onChange &&
						onChange({
							currentTarget: {
								value: afterclearvalue ? afterclearvalue : "",
							},
						} as React.ChangeEvent<HTMLInputElement>)
					}
				>
					<X />
				</button>
			)}
		</div>
	);
}
