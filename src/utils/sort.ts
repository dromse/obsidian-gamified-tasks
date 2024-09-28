import { SortOrder, SortType, Task } from "@core/types";
import { getFirstNumber } from "./number";
import { getFirstChar } from "./string";

export const sortBy =
	(type: SortType, order: SortOrder) =>
		(firstTask: Task, secondTask: Task): number => {
			let firstTaskCompareValue;
			let secondTaskFirstCompareValue;

			if (type === "alphabetical") {
				firstTaskCompareValue = getFirstChar(firstTask.body);
				secondTaskFirstCompareValue = getFirstChar(secondTask.body);

				if (order === "ascending") {
					return firstTaskCompareValue.localeCompare(
						secondTaskFirstCompareValue,
					);
				} else if (order === "descending") {
					return secondTaskFirstCompareValue.localeCompare(
						firstTaskCompareValue,
					);
				}
			} else if (type === "numerical") {
				firstTaskCompareValue = getFirstNumber(firstTask.body);
				secondTaskFirstCompareValue = getFirstNumber(secondTask.body);

				// Check for non-numerical values and push them to the end
				const isFirstIsNonNumerical = firstTaskCompareValue === -1;
				const isSecondIsNonNumerical = secondTaskFirstCompareValue === -1;

				if (isFirstIsNonNumerical && isSecondIsNonNumerical) return 0; // Both non-numerical
				if (isFirstIsNonNumerical) return 1; // First task is non-numerical, push it to the end
				if (isSecondIsNonNumerical) return -1; // Second task is non-numerical, push it to the end

				if (order === "ascending") {
					return firstTaskCompareValue - secondTaskFirstCompareValue;
				} else if (order === "descending") {
					return secondTaskFirstCompareValue - firstTaskCompareValue;
				}
			}

			return 0;
		};
