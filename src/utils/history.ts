import { HistoryRow } from "@hooks/useHistory";
import { getCurrentDate } from "./date";

/**
 * Returns the today history rows from the provided history array.
 * Stops filtering as soon as a row from a previous day is encountered.
 */
export function getTodayRowsASAP(
    historyRows: Array<HistoryRow>,
): Array<HistoryRow> {
    let todayRows = [];

    for (const row of historyRows) {
        const todayDate = getCurrentDate();

        if (todayDate === row.date.split(" ")[0]) {
            todayRows.push(row);
        } else {
            break;
        }
    }
    return todayRows;
}
