import { HistoryRow, UseHistoryReturn } from "@hooks/useHistory";
import { useEffect, useState } from "react";

export const DEPOSITORY_TRANSACTION_STATE = Object.freeze({
	SUCCESS: {
		STORED: "stored",
		RESTORED: "restored",
	},
	ERROR: {
		ZERO_PARAM: "zero",
		NEGATIVE_PARAM: "negative",
		OVER_BALANCE_PARAM: "over",
		SOMETHING: "error",
	},
} as const);

type ValuesOf<T> = T[keyof T][keyof T[keyof T]];
type DepositoryTransactionStateType = typeof DEPOSITORY_TRANSACTION_STATE;
type SuccessTransactionState = ValuesOf<
	DepositoryTransactionStateType["SUCCESS"]
>;
type ErrorTransactionState = ValuesOf<DepositoryTransactionStateType["ERROR"]>;

/**
 * 'stored' -> successfully stored to history
 * 'restored' -> successfully restored from history
 * 'zero' -> occur when you pass zero (e.g. re/store(0))
 * 'negative' -> occur when you pass negative amount of coins (e.g. re/store(-1))
 * 'over' -> occur when you pass amount of coins which is bigger then your current balance (e.g. history balance: 5, re/store(6))
 * 'error' -> something went wrong...
 */
export type DepositoryTransactionState =
	| SuccessTransactionState
	| ErrorTransactionState;

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
			return DEPOSITORY_TRANSACTION_STATE.ERROR.ZERO_PARAM;
		}

		if (amount < 0) {
			return DEPOSITORY_TRANSACTION_STATE.ERROR.NEGATIVE_PARAM;
		}

		if (amount > useHistoryReturn.balance) {
			return DEPOSITORY_TRANSACTION_STATE.ERROR.OVER_BALANCE_PARAM;
		}

		if (amount <= useHistoryReturn.balance) {
			await useHistoryReturn.addHistoryRow({
				title: DEPOSITORY_TITLE,
				change: -amount,
			});

			setShouldRerender((prev) => !prev);

			return DEPOSITORY_TRANSACTION_STATE.SUCCESS.STORED;
		}

		return DEPOSITORY_TRANSACTION_STATE.ERROR.SOMETHING;
	};

	const restore = async (
		amount: number,
	): Promise<DepositoryTransactionState> => {
		if (amount === 0) {
			return DEPOSITORY_TRANSACTION_STATE.ERROR.ZERO_PARAM;
		}

		if (amount < 0) {
			return DEPOSITORY_TRANSACTION_STATE.ERROR.NEGATIVE_PARAM;
		}

		if (amount > balance) {
			return DEPOSITORY_TRANSACTION_STATE.ERROR.OVER_BALANCE_PARAM;
		}

		if (amount <= balance) {
			await useHistoryReturn.addHistoryRow({
				title: DEPOSITORY_TITLE,
				change: amount,
			});

			setShouldRerender((prev) => !prev);

			return DEPOSITORY_TRANSACTION_STATE.SUCCESS.RESTORED;
		}

		return DEPOSITORY_TRANSACTION_STATE.ERROR.SOMETHING;
	};

	useEffect(() => {
		setBalance(calcDepositoryBalance(useHistoryReturn.historyRows));
	}, [useHistoryReturn.historyRows, shouldRerender]);

	return { store, restore, balance };
}
