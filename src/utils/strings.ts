export function formatDate(
	date: string,
	format: "compact" | "long" = "compact",
) {
	let day = 1;
	let month = 1;
	let year = 2026;

	const trimmed = date.trim();

	if (trimmed.includes("-") || trimmed.includes("/")) {
		const delimiter = trimmed.includes("-") ? "-" : "/";
		const parts = trimmed.split(delimiter);
		if (parts.length === 3) {
			const p0 = Number.parseInt(parts[0], 10) || 1;
			const p1 = Number.parseInt(parts[1], 10) || 1;
			const p2 = Number.parseInt(parts[2], 10) || 2026;

			if (p0 > 1000) {
				// YYYY-MM-DD or YYYY/MM/DD
				year = p0;
				month = p1;
				day = p2;
			} else {
				// DD-MM-YYYY or DD/MM/YYYY
				day = p0;
				month = p1;
				year = p2;
			}
		} else {
			const parsed = new Date(trimmed);
			if (!Number.isNaN(parsed.getTime())) {
				day = parsed.getDate();
				month = parsed.getMonth() + 1;
				year = parsed.getFullYear();
			}
		}
	} else {
		// Handles "24 Mar 2026", "20 May", etc.
		const parts = trimmed.split(/\s+/);
		if (parts.length >= 2) {
			day = Number.parseInt(parts[0], 10) || 1;
			const monthStr = parts[1].toLowerCase().slice(0, 3);
			const monthMap: Record<string, number> = {
				ene: 1,
				jan: 1,
				feb: 2,
				mar: 3,
				abr: 4,
				apr: 4,
				may: 5,
				jun: 6,
				jul: 7,
				ago: 8,
				aug: 8,
				sep: 9,
				oct: 10,
				nov: 11,
				dic: 12,
				dec: 12,
			};
			month = monthMap[monthStr] || 1;
			if (parts[2]) {
				year = Number.parseInt(parts[2], 10) || 2026;
			} else {
				year = 2026; // Default to 2026 for the mock dataset context
			}
		} else {
			const parsed = new Date(trimmed);
			if (!Number.isNaN(parsed.getTime())) {
				day = parsed.getDate();
				month = parsed.getMonth() + 1;
				year = parsed.getFullYear();
			}
		}
	}

	if (format === "compact") {
		const pad = (n: number) => String(n).padStart(2, "0");
		return `${pad(day)}/${pad(month)}/${year}`;
	}

	const d = new Date(year, month - 1, day);
	return d.toLocaleDateString("es-CL", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
