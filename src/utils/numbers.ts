export function formatCurrency(amount: number, showSign: boolean = false) {
	const formatted = new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(Math.abs(amount));

	if (!showSign) return formatted;
	return `${amount >= 0 ? "+ " : "- "}${formatted}`;
}
