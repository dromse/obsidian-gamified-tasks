import { HistoryRow, UseHistoryReturn } from "@hooks/useHistory";
import { useEffect, useState } from "react";

export const DEPOSITORY_TRANSACTION_STATE = Object.freeze({
	SUCCESS: "success",
	ZERO_PARAM: "zero",
	NEGATIVE_PARAM: "negative",
	OVER_BALANCE_PARAM: "over",
	ERROR: "error",
} as const);

type DepositoryTransactionStateType = typeof DEPOSITORY_TRANSACTION_STATE;

/**
 * 'stored' -> successfully stored to history
 * 'restored' -> successfully restored from history
 * 'zero' -> occur when you pass zero (e.g. re/store(0))
 * 'negative' -> occur when you pass negative amount of coins (e.g. re/store(-1))
 * 'over' -> occur when you pass amount of coins which is bigger then your current balance (e.g. history balance: 5, re/store(6))
 * 'error' -> something went wrong...
 */
export type DepositoryTransactionState = DepositoryTransactionStateType[keyof DepositoryTransactionStateType];


export type Depository = {
	balance: number;
	store: (amount: number) => Promise<DepositoryTransactionState>;
	restore: (amount: number) => Promise<DepositoryTransactionState>;
};

const DEPOSITORY_TITLE = "$depository$" as const;

const calcDepositoryBalance = (history: ReadonlyArray<HistoryRow>): number =>
	history
		.filter((row) => row.title === DEPOSITORY_TITLE)
		.reduce((acc, row) => acc + -row.change, 0);

export function useDepository(useHistoryReturn: UseHistoryReturn): Depository {
	const [balance, setBalance] = useState(
		calcDepositoryBalance(useHistoryReturn.historyRows),
	);
	const [shouldRerender, setShouldRerender] = useState(false);

	const store = async (
		amount: number,
	): Promise<DepositoryTransactionState> => {
		if (amount === 0) {
			return DEPOSITORY_TRANSACTION_STATE.ZERO_PARAM;
		}

		if (amount < 0) {
			return DEPOSITORY_TRANSACTION_STATE.NEGATIVE_PARAM;
		}

		if (amount > useHistoryReturn.balance) {
			return DEPOSITORY_TRANSACTION_STATE.OVER_BALANCE_PARAM;
		}

		if (amount <= useHistoryReturn.balance) {
			await useHistoryReturn.addHistoryRow({
				title: DEPOSITORY_TITLE,
				change: -amount,
			});

			setShouldRerender((prev) => !prev);

			return DEPOSITORY_TRANSACTION_STATE.SUCCESS;
		}

		return DEPOSITORY_TRANSACTION_STATE.ERROR;
	};

	const restore = async (
		amount: number,
	): Promise<DepositoryTransactionState> => {
		if (amount === 0) {
			return DEPOSITORY_TRANSACTION_STATE.ZERO_PARAM;
		}

		if (amount < 0) {
			return DEPOSITORY_TRANSACTION_STATE.NEGATIVE_PARAM;
		}

		if (amount > balance) {
			return DEPOSITORY_TRANSACTION_STATE.OVER_BALANCE_PARAM;
		}

		if (amount <= balance) {
			await useHistoryReturn.addHistoryRow({
				title: DEPOSITORY_TITLE,
				change: amount,
			});

			setShouldRerender((prev) => !prev);

			return DEPOSITORY_TRANSACTION_STATE.SUCCESS;
		}

		return DEPOSITORY_TRANSACTION_STATE.ERROR;
	};

	useEffect(() => {
		setBalance(calcDepositoryBalance(useHistoryReturn.historyRows));
	}, [useHistoryReturn.historyRows, shouldRerender]);

	return { store, restore, balance };
}
