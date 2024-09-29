import { State, TaskFilterOptionsType } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { useFilters } from "@providers/FiltersProvider";
import React from "react";

export default function Modes(): React.JSX.Element {
	const settings = useSettings()!;
	const [taskFilterChoice, setTaskFilterChoice] =
		React.useState<TaskFilterOptionsType>(settings.filterTasksOnOpen);
	const filters = useFilters()!;
	const radioFilter: Array<{
		filter: State<boolean>;
		label: string;
		option: TaskFilterOptionsType;
	}> = [
			{
				label: "Recurring mode",
				filter: filters.recur,
				option: "recurring",
			},
			{
				label: "Condition mode",
				filter: filters.showByCondition,
				option: "condition",
			},
		];

	React.useEffect(() => {
		radioFilter.map((radio) =>
			radio.option === taskFilterChoice
				? radio.filter.setValue(true)
				: radio.filter.setValue(false),
		);
	}, [taskFilterChoice]);

	return (
		<>
			{radioFilter.map((radio) => (
				<div className="checkbox" key={radio.label}>
					<input
						type="checkbox"
						name={radio.label}
						id={radio.label}
						checked={radio.option === taskFilterChoice}
						onChange={() => {
							setTaskFilterChoice(radio.option);

							if (radio.filter.value) {
								setTaskFilterChoice("all");
							}
						}}
					/>
					<label htmlFor={radio.label}>{radio.label}</label>
				</div>
			))}
		</>
	);
}
