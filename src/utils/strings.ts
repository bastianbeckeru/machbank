export function formatDate(
	date: string,
	format: "compact" | "long" = "compact",
) {
	if (format === "compact") {
		return new Date(date)
			.toISOString()
			.slice(0, 10)
			.split("-")
			.reverse()
			.join("/");
	}
	return new Date(date).toLocaleDateString("es-CL", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
