type SingularOrPlural = {
	amount: number;
	singular: string;
	plural?: string;
};

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
