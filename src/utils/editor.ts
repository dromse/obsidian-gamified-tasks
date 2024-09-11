import {
	MarkdownView,
	Notice,
	Vault,
	Workspace,
	WorkspaceLeaf
} from "obsidian";

type RevealLineProps = {
	location: { path: string; lineNumber: number };
	workspace: Workspace;
	vault: Vault;
};

/**
 * Reveal task in editor leaf
 */
export const revealLine = (props: RevealLineProps): void => {
	const { location, workspace, vault } = props;
	const tFile = vault.getFileByPath(location.path);

	if (!tFile) {
		new Notice("Error: file associated with a line is not found.");
		return;
	}

	const leaves = workspace.getLeavesOfType("markdown") as Array<WorkspaceLeaf>;

	/**
	 * Determines if a MarkdownView instance corresponds to an already opened file by explicitly setting `MarkdownView` for `leaf.view`.
	 * This is necessary because the `getLeavesOfType` method returns instances of type `View`, lacking the `file` field.
	 */
	const isFileOpened = (view: MarkdownView): boolean =>
		view.file ? view.file.path === location.path : false;

	/**
	 * Checks if the file is already open among the given leaves.
	 */
	const isFileAlreadyOpen = leaves.some((leaf) =>
		isFileOpened(leaf.view as MarkdownView),
	);

	if (isFileAlreadyOpen) {
		const leaf = leaves.find((leaf) =>
			isFileOpened(leaf.view as MarkdownView),
		);

		/*
		 * Displays the already opened file and highlights the line containing the task.
		 */
		if (leaf) {
			leaf.openFile(tFile, { eState: { line: location.lineNumber } });
		}
	} else {
		workspace.getLeaf("tab").openFile(tFile, {
			eState: { line: location.lineNumber },
		});
	}
};
