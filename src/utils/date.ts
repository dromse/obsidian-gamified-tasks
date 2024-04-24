import { DATE_FORMAT } from "@consts";
import { moment } from "obsidian";

/** Stringigy date for locale time */
export function currentDate(): string {
	const dateStr = moment().format(DATE_FORMAT);

	return dateStr;
}

/** Generate an array of past dates starting from the current date. */
export function generatePastDaysArray(numDays: number): Array<String> {
	// Get current date
	const currentDate = moment();

	// Initialize an empty array to store the dates
	const datesList = [];

	// Loop through each day from numDays ago to today
	for (let i = 0; i < numDays; i++) {
		const date = currentDate.clone().subtract(i, "days");
		datesList.push(date.format("YYYY-MM-DD"));
	}

	// Reverse the array to get dates in chronological order
	return datesList.reverse();
}

/**
 * Extracts the numeric value from a string representing days or weeks.
 * If the string ends with "day", returns the numeric part as is.
 * If the string ends with "week", returns the numeric part multiplied by 7.
 * If the string does not match the pattern, returns null.
 *
 * @param {string} str - The input string containing a numeric value followed by "day" or "week".
 * @returns The extracted numeric value, or null if no match is found.
 */
export function getAmountOfPastDays(str: string): number | null {
	const regex = /^(\d+)?(day|week)$/;

	const match = str.match(regex);
	if (match) {
		const numericPart = match[1] ? parseInt(match[1]) : 1;
		const isWeek = match[2] === "week";
		return isWeek ? numericPart * 7 : numericPart;
	} else {
		return null;
	}
}
