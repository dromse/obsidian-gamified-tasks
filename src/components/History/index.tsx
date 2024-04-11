import { useHistory } from "@/hooks";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function History() {
	const { history, balance, isHistoryParsed } = useHistory();
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [pageInput, setPageInput] = useState(String(page + 1));

	useEffect(() => {
		if (isHistoryParsed === "parsed") {
			setTotalPages(Math.ceil(history.length / 10));
		}
	}, [isHistoryParsed]);

	useEffect(() => {
		setPageInput(String(page + 1));
	}, [page]);

	useEffect(() => {
		Number(pageInput) > 0 &&
			(Number(pageInput) <= totalPages ? setPage(Number(pageInput) - 1) : "");
	}, [pageInput]);

	if (isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isHistoryParsed === "parsed") {
		const historyPages = Array.from({ length: totalPages }, (_, i) => i);

		return (
			<div>
				<h2>History</h2>
				<h3>Balance: {balance} coins</h3>

				<div className={styles.pageList}>
					{historyPages
						.slice(page === 0 ? page : page - 1, page + 3)
						.map((i) => (
							<button
								key={i}
								onClick={() => setPage(i)}
								className={i === page ? styles.activePage : ""}
							>
								{i + 1}
							</button>
						))}

					{page !== totalPages - 1 && (
						<>
							<button disabled={true}> ... </button>
							<button
								onClick={() => setPage(totalPages - 1)}
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
						style={{width: '100%'}}
						id=""
						value={pageInput}
						onChange={(e) => {
							const value = e.currentTarget.value;
							if (
								value === "" ||
								(Number(value) > 0 && Number(value) <= totalPages)
							) {
								setPageInput(value);
							}
						}}
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
	}

	if (isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div>Something went wrong...</div>;
}
