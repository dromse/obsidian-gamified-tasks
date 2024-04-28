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

