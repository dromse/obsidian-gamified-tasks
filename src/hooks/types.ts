export type ParseState = "parsing" | "parsed" | "error";

export type RawFile = {
	path: string;
	content: string[];
};
