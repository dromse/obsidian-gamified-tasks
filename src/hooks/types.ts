/** Represents parse state in parsing tasks */
export type ParseState = "parsing" | "parsed" | "error";

/** Represents file object */
export type RawFile = {
	path: string;
	content: Array<string>;
};
