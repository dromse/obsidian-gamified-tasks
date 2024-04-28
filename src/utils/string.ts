type SingularOrPlural = {
	amount: number;
	singular: string;
	plural?: string;
};

/**
 * Return amount and string representations of enumeration
 *
 * @example
 *
 * - Without plural
 * ```javascript
 * ({amount: 0, singular: 'coin'}) => "0 coins"
 * ({amount: 1, singular: 'coin'}) => "1 coin"
 * ({amount: 2, singular: 'coin'}) => "2 coins"
 * ```
 *
 * - With plural
 * ```javascript
 * ({amount: 0, singular: 'leaf', plural: 'leavies'}) => "0 leavies"
 * ({amount: 1, singular: 'leaf', plural: 'leavies'}) => "1 leaf"
 * ({amount: 2, singular: 'leaf', plural: 'leavies'}) => "2 leavies"
 * ```
 */
export function singularOrPlural({
	amount,
	singular,
	plural,
}: SingularOrPlural): string {
	if (plural) {
		return `${amount} ${amount > 1 ? plural : singular}`;
	}

	return `${amount} ${amount > 1 || amount === 0 ? singular + "s" : singular}`;
}

/**
 * Takes text containing markdown or wiki links and extracts only the title of the links,
 * returning a clean string.
 */
export function extractTitlesFromLinks(text: string): string {
	// Remove Markdown links
	text = text.replace(/\[([^\]]+)\]\((.*?)\)/g, "$1");

	// Remove Wiki links
	text = text.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, function (_, p1, p2) {
		return p2 ? p2 : p1;
	});

	return text;
}
