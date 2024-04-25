import { DATE_FORMAT } from "@consts";
import {
	DepositoryTransactionState,
	DEPOSITORY_TRANSACTION_STATE,
	useDepository,
} from "@hooks/useDepository";
import {
	AddHistoryRowType,
	HistoryRow,
	UseHistoryReturn,
} from "@hooks/useHistory";
import { act, renderHook } from "@testing-library/react-hooks";
import moment from "moment";
import assert from "node:assert";
import test, { describe } from "node:test";

const recalculateBalance = (history: Array<HistoryRow>): number => {
	return history.reduce((acc, row) => acc + row.change, 0);
};

describe("Depository", () => {
	describe("Store to depository", async () => {
		const mockHistoryForStoreTest: ReadonlyArray<HistoryRow> = [
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
		];

		function mockUseHistoryForStoreTest(): UseHistoryReturn {
			const history = mockHistoryForStoreTest.slice();
			const balance = history.reduce((acc, row) => acc + row.change, 0);
			const isHistoryParsed = "parsed";
			const addHistoryRow = async ({
				title,
				change,
			}: AddHistoryRowType): Promise<void> => {
				history.push({ title, change, date: moment().format(DATE_FORMAT) });
			};

			return { historyRows: history, balance, isHistoryParsed, addHistoryRow };
		}

		test("store to depository middle correct value", async (t) => {
			const mockHistory = mockUseHistoryForStoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(2);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return success state of store transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.SUCCESS.STORED,
				);
			});

			await t.test("depository balance must increase", () => {
				assert.strictEqual(result.current.balance, 2);
			});

			await t.test("history balance must decrease", () => {
				assert.strictEqual(mockHistory.balance, 3);
			});
		});

		test("store to depository boundary correct value", async (t) => {
			const mockHistory = mockUseHistoryForStoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(mockHistory.balance);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return success state of store transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.SUCCESS.STORED,
				);
			});

			await t.test("depository balance must increase", () => {
				assert.strictEqual(result.current.balance, 5);
			});

			await t.test("history balance must decrease", () => {
				assert.strictEqual(mockHistory.balance, 0);
			});
		});

		test("store to depository zero value", async (t) => {
			const mockHistory = mockUseHistoryForStoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(0);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return zero param error state of transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.ERROR.ZERO_PARAM,
				);
			});

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 0);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 5);
			});
		});

		test("store to depository negative value", async (t) => {
			const mockHistory = mockUseHistoryForStoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(-1);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test(
				"must return negative param error state of transaction",
				() => {
					assert.strictEqual(
						transactionState,
						DEPOSITORY_TRANSACTION_STATE.ERROR.NEGATIVE_PARAM,
					);
				},
			);

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 0);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 5);
			});
		});

		test("store to depository over balance value", async (t) => {
			const mockHistory = mockUseHistoryForStoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(mockHistory.balance + 1);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test(
				"must return over balance param error state of transaction",
				() => {
					assert.strictEqual(
						transactionState,
						DEPOSITORY_TRANSACTION_STATE.ERROR.OVER_BALANCE_PARAM,
					);
				},
			);

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 0);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 5);
			});
		});
	});

	describe("Restore from depository", async () => {
		const mockHistoryForRestoreTest: ReadonlyArray<HistoryRow> = [
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "do push up", change: 1, date: "2024-04-23 14:15" },
			{ title: "$depository$", change: -5, date: "2024-04-23 14:15" },
		];

		function mockUseHistoryForRestoreTest(): UseHistoryReturn {
			const history = mockHistoryForRestoreTest.slice();
			const balance = history.reduce((acc, row) => acc + row.change, 0);
			const isHistoryParsed = "parsed";
			const addHistoryRow = async ({
				title,
				change,
			}: AddHistoryRowType): Promise<void> => {
				history.push({ title, change, date: moment().format(DATE_FORMAT) });
			};

			return { historyRows: history, balance, isHistoryParsed, addHistoryRow };
		}

		test("restore from depository middle correct value", async (t) => {
			const mockHistory = mockUseHistoryForRestoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.restore(2);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return success state of restore transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.SUCCESS.RESTORED,
				);
			});

			await t.test("depository balance must decrease", () => {
				assert.strictEqual(result.current.balance, 3);
			});

			await t.test("history balance must increase", () => {
				assert.strictEqual(mockHistory.balance, 2);
			});
		});

		test("restore from depository boundary correct value", async (t) => {
			const mockHistory = mockUseHistoryForRestoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.restore(5);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return success state of restore transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.SUCCESS.RESTORED,
				);
			});

			await t.test("depository balance must decrease", () => {
				assert.strictEqual(result.current.balance, 0);
			});

			await t.test("history balance must increase", () => {
				assert.strictEqual(mockHistory.balance, 5);
			});
		});

		test("restore to depository zero value", async (t) => {
			const mockHistory = mockUseHistoryForRestoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.restore(0);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test("must return zero param error state of transaction", () => {
				assert.strictEqual(
					transactionState,
					DEPOSITORY_TRANSACTION_STATE.ERROR.ZERO_PARAM,
				);
			});

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 5);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 0);
			});
		});

		test("store to depository negative value", async (t) => {
			const mockHistory = mockUseHistoryForRestoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.restore(-1);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test(
				"must return negative param error state of transaction",
				() => {
					assert.strictEqual(
						transactionState,
						DEPOSITORY_TRANSACTION_STATE.ERROR.NEGATIVE_PARAM,
					);
				},
			);

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 5);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 0);
			});
		});

		test("store to depository over balance value", async (t) => {
			const mockHistory = mockUseHistoryForRestoreTest();
			const { result } = renderHook(() => useDepository(mockHistory));
			let transactionState: DepositoryTransactionState;

			await act(async () => {
				transactionState = await result.current.store(mockHistory.balance + 1);
			});

			mockHistory.balance = recalculateBalance(mockHistory.historyRows);

			await t.test(
				"must return over balance param error state of transaction",
				() => {
					assert.strictEqual(
						transactionState,
						DEPOSITORY_TRANSACTION_STATE.ERROR.OVER_BALANCE_PARAM,
					);
				},
			);

			await t.test("depository balance shouldn't change", () => {
				assert.strictEqual(result.current.balance, 5);
			});

			await t.test("history balance shouldn't change", () => {
				assert.strictEqual(mockHistory.balance, 0);
			});
		});
	});
});
