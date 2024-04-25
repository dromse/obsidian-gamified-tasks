import { useHistory } from "@/hooks";
import React, { useState } from "react";
import styles from "./styles.module.css";

export default function History(): React.JSX.Element {
	const { historyRows: history, balance, isHistoryParsed } = useHistory();
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [pageInput, setPageInput] = useState(String(page + 1));

	const handleClickPage = (pageIndex: number): void => {
		setPage(pageIndex);
		setPageInput(String(pageIndex + 1));
	};

	const handleChangeInputPage = (pageInput: string): void => {
		if (totalPages) {
			if (
				pageInput === "" ||
				(Number(pageInput) > 0 && Number(pageInput) <= totalPages)
			) {
				setPageInput(pageInput);
			}

			if (Number(pageInput) > 0 && Number(pageInput) <= totalPages) {
				setPage(Number(pageInput) - 1);
			}
		}
	};

	if (isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isHistoryParsed === "parsed") {
		if (typeof totalPages === "number") {
			const historyPages = Array.from({ length: totalPages }, (_, i) => i);

			return (
				<div>
					<div className={styles.pageList}>
						{historyPages
							.slice(page === 0 ? page : page - 1, page + 3)
							.map((index) => (
								<button
									key={index}
									onClick={() => handleClickPage(index)}
									className={index === page ? styles.activePage : ""}
								>
									{index + 1}
								</button>
							))}

						{page !== totalPages - 1 && (
							<>
								<button disabled={true}> ... </button>

								<button
									onClick={() => handleClickPage(totalPages - 1)}
									className={totalPages - 1 === page ? styles.activePage : ""}
								>
									{totalPages}
								</button>
							</>
						)}
					</div>

					<div>
						<label htmlFor="page-input">Page:</label>

						<input
							type="number"
							name="page-input"
							style={{ width: "100%" }}
							id=""
							value={pageInput}
							onChange={(e) => handleChangeInputPage(e.currentTarget.value)}
						/>
					</div>

					<table className={styles.table}>
						<thead>
							<tr>
								<th scope="col">Change</th>
								<th scope="col">Title</th>
								<th scope="col">Date</th>
							</tr>
						</thead>

						<tbody>
							{history.slice(page * 10, (page + 1) * 10).map((row, index) => (
								<tr key={index}>
									<th scope="row">
										{row.change > 0 ? "+" + row.change : row.change}
									</th>
									<td>{row.title}</td>
									<td>{row.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		} else {
			setTotalPages(Math.ceil(history.length / 10));
		}
	}

	if (isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div>Something went wrong...</div>;
}
