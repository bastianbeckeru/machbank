"use client";

import {
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
	BanknoteArrowUpIcon,
	CalendarIcon,
	ChevronRightIcon,
	DownloadIcon,
	HelpCircle,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/numbers";
import { formatDate } from "@/utils/strings";

// --- Generate realistic daily data ---
const ANNUAL_RATE = 0.046;
const DAILY_RATE = (1 + ANNUAL_RATE) ** (1 / 365) - 1;

interface DayEntry {
	date: string; // ISO date
	deposited: number;
	pnl: number;
}

const transactions: { id: number; date: string; amount: number }[] = [
	{ id: 3, date: "2025-03-31", amount: 70000 }, // bono o mes tranquilo
	{ id: 4, date: "2025-04-30", amount: 50000 }, // rutina
	{ id: 5, date: "2025-05-15", amount: 20000 }, // abono chico mid-month
	{ id: 6, date: "2025-05-31", amount: 40000 },
	{ id: 7, date: "2025-06-30", amount: -150000 }, // retiro: vacaciones / emergencia
	{ id: 8, date: "2025-07-31", amount: 60000 }, // recuperando
	{ id: 9, date: "2025-08-29", amount: 80000 },
	{ id: 10, date: "2025-09-30", amount: 50000 },
	{ id: 11, date: "2025-10-31", amount: 90000 }, // aguinaldo fiestas patrias
	{ id: 12, date: "2025-11-28", amount: 50000 },
	{ id: 13, date: "2025-12-31", amount: -80000 }, // gastos navidad/año nuevo
	{ id: 14, date: "2026-01-31", amount: 70000 },
	{ id: 15, date: "2026-02-28", amount: 60000 },
	{ id: 16, date: "2026-03-31", amount: 80000 },
	{ id: 17, date: "2026-04-07", amount: 50000 }, // hoy
];

function generateFullData(): DayEntry[] {
	const start = new Date("2025-01-01");
	const end = new Date();

	// Build a map of date -> amount for quick lookup
	const txMap = new Map<string, number>();
	for (const tx of transactions) {
		txMap.set(tx.date, (txMap.get(tx.date) ?? 0) + tx.amount);
	}

	const data: DayEntry[] = [];
	let deposited = 0;
	let pnl = 0;

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const iso = d.toISOString().slice(0, 10);

		const txAmount = txMap.get(iso);
		if (txAmount) {
			deposited += txAmount;
			if (deposited < 0) deposited = 0;
		}

		if (deposited + pnl > 0) {
			pnl += (deposited + pnl) * DAILY_RATE;
		}

		data.push({
			date: iso,
			deposited: Math.round(deposited),
			pnl: Math.round(pnl),
		});
	}

	return data;
}

const fullData = generateFullData();

function aggregateByWeek(
	data: (DayEntry & { value: number })[],
): (DayEntry & { value: number })[] {
	if (data.length === 0) return data;
	const weeks: (DayEntry & { value: number })[] = [];
	for (let i = 0; i < data.length; i++) {
		const d = new Date(data[i].date);
		// Push last entry of each week (Sunday) or the very last entry
		if (d.getDay() === 0 || i === data.length - 1) {
			weeks.push(data[i]);
		}
	}
	return weeks;
}

type TimeRange = "1M" | "3M" | "6M" | "1A" | "MÁX";
const timeRanges: TimeRange[] = ["1M", "3M", "6M", "1A", "MÁX"];

function getSliceCount(range: TimeRange, total: number): number {
	switch (range) {
		case "1M":
			return 30;
		case "3M":
			return 90;
		case "6M":
			return 180;
		case "1A":
			return 365;
		case "MÁX":
			return total;
	}
}

const chartConfig = {
	value: {
		label: "Saldo",
		color: "var(--color-primary)",
	},
} satisfies ChartConfig;

export default function SavingsPage() {
	const [selectedRange, setSelectedRange] = useState<TimeRange>("MÁX");
	const [activeEntry, setActiveEntry] = useState<{
		deposited: number;
		pnl: number;
	}>(fullData[fullData.length - 1]);
	const [isPressing, setIsPressing] = useState(false);

	const chartData = useMemo(() => {
		const count = getSliceCount(selectedRange, fullData.length);
		const sliced = fullData.slice(-count).map((d) => ({
			...d,
			value: d.deposited + d.pnl,
		}));
		return selectedRange === "MÁX" ? aggregateByWeek(sliced) : sliced;
	}, [selectedRange]);

	const handlePressStart = ({ activeIndex }: { activeIndex: number }) => {
		const entry = chartData[Number(activeIndex)];
		if (!entry) return;
		setIsPressing(true);
		setActiveEntry({ deposited: entry.deposited, pnl: entry.pnl });
	};

	const handlePressEnd = () => {
		const lastEntry = chartData[chartData.length - 1];
		if (!lastEntry) return;
		setIsPressing(false);
		setActiveEntry({ deposited: lastEntry.deposited, pnl: lastEntry.pnl });
	};

	const handlePressMove = ({ activeIndex }: { activeIndex: number }) => {
		if (!isPressing) return;
		const entry = chartData[Number(activeIndex)];
		if (!entry) return;
		setActiveEntry({ deposited: entry.deposited, pnl: entry.pnl });
	};

	return (
		<>
			<div className="flex items-center justify-between px-2 py-3 bg-primary text-background">
				<Link
					href="/investment"
					className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<h1 className="text-lg font-bold">Ahorro 24/7</h1>
				<button
					type="button"
					className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<HelpCircle className="size-5" />
				</button>
			</div>

			<div className="overflow-y-auto no-scrollbar flex flex-col">
				<div className="px-6 pt-6 flex flex-col items-start text-left">
					<p className="sr-only text-sm text-muted-foreground font-medium">
						Total ahorrado
					</p>
					<h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
						{formatCurrency(activeEntry.deposited + activeEntry.pnl)}
					</h2>

					<div
						className={cn(
							"mt-2 h-12 inline-flex gap-2 justify-start items-start",
							isPressing && "flex-col gap-0",
						)}
					>
						<div
							className={cn(
								"inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-2",
								activeEntry.pnl < 0 && "text-rose-600 bg-rose-500/10",
								isPressing && "bg-transparent",
							)}
						>
							<TrendingUp
								className={cn(
									"size-3.5 text-emerald-600",
									activeEntry.pnl < 0 &&
										"rotate-180 -scale-x-100 text-rose-600",
								)}
							/>
							<span
								className={cn(
									"text-xs font-semibold",
									isPressing && "text-foreground",
								)}
							>
								{formatCurrency(activeEntry.pnl)}
							</span>
							<span
								className={cn(
									"text-xs font-semibold text-muted-foreground sr-only -ml-0.5",
									isPressing && "not-sr-only",
								)}
							>
								ganancia
							</span>
						</div>
						<div
							className={cn(
								"hidden",
								isPressing && "px-3 inline-flex items-center gap-1.5",
							)}
						>
							<BanknoteArrowUpIcon
								className={cn(
									"size-3.5 text-primary",
									activeEntry.pnl < 0 && "rotate-180 -scale-x-100",
								)}
							/>
							<span
								className={cn(
									"text-xs font-semibold",
									isPressing && "text-foreground",
								)}
							>
								{formatCurrency(activeEntry.deposited)}
							</span>
							<span
								className={cn(
									"text-xs font-semibold text-muted-foreground sr-only -ml-0.5",
									isPressing && "not-sr-only",
								)}
							>
								depositado
							</span>
						</div>
						<div
							className={cn(
								"inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-2",
								isPressing && "sr-only",
							)}
						>
							<span className="text-xs font-semibold text-emerald-600">
								4,6% anual
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-4 mb-7">
					<ChartContainer config={chartConfig} className="h-40 mt-8 w-full">
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{ top: 2, right: 0, bottom: 4, left: 0 }}
							onTouchStart={({ activeIndex }) =>
								handlePressStart({ activeIndex: Number(activeIndex) })
							}
							onTouchMove={({ activeIndex }) =>
								handlePressMove({ activeIndex: Number(activeIndex) })
							}
							onTouchEnd={handlePressEnd}
						>
							<defs>
								<linearGradient
									id="savingsGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="var(--color-primary)"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="var(--color-primary)"
										stopOpacity={0.2}
									/>
								</linearGradient>
							</defs>

							<Area
								dataKey="value"
								type="monotone"
								fill="url(#savingsGradient)"
								fillOpacity={0.25}
								stroke="var(--color-primary)"
								strokeWidth={2.5}
								animationDuration={500}
								activeDot={
									isPressing
										? {
												r: 5,
												fill: "var(--color-primary)",
												stroke: "var(--color-background)",
												strokeWidth: 2,
											}
										: false
								}
							/>

							<ChartTooltip
								active={isPressing}
								isAnimationActive={false}
								cursor={{
									strokeDasharray: "5",
								}}
								content={({ activeIndex }) => {
									if (activeIndex == null) return null;

									const entry = chartData[Number(activeIndex)];
									if (!entry) return null;
									return (
										<div className="select-none rounded-md border border-muted-foreground/50 bg-background px-3 py-1.5 shadow-sm">
											<time className="text-xs font-medium text-foreground">
												{formatDate(entry.date)}
											</time>
										</div>
									);
								}}
							/>
						</AreaChart>
					</ChartContainer>

					<div className="grid grid-cols-5 px-6 items-center justify-center gap-2">
						{timeRanges.map((range) => (
							<Button
								key={range}
								size="sm"
								onClick={() => setSelectedRange(range)}
								className={cn(
									"px-3 py-1.5 text-xs font-semibold rounded-full transition-all bg-muted text-muted-foreground hover:bg-accent",
									selectedRange === range && "bg-primary/15 text-primary",
								)}
							>
								{range}
							</Button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-3 px-6 gap-3">
					<Button
						variant="outline"
						className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
					>
						<DownloadIcon className="size-6 text-primary" />
						Retirar
					</Button>
					<Button
						variant="outline"
						className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
					>
						<DownloadIcon className="size-6 text-primary rotate-180" />
						Ahorrar
					</Button>
					<Button
						variant="outline"
						className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
					>
						<CalendarIcon className="size-6 text-primary" />
						Programar
					</Button>
				</div>

				<div className="px-6 my-4 space-y-1">
					<h3 className="text-lg font-bold text-muted-foreground">Actividad</h3>

					<Drawer>
						<DrawerTrigger asChild>
							<Button
								variant="outline"
								className="w-full h-14 justify-between border-primary/10 text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold"
							>
								Movimientos
								<ChevronRightIcon className="size-5 text-muted-foreground" />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<div className="mx-auto w-full max-w-sm">
								<DrawerHeader>
									<DrawerTitle>Movimientos</DrawerTitle>
									<DrawerDescription className="sr-only">
										Visualiza los movimientos de tu cuenta de ahorro.
									</DrawerDescription>
								</DrawerHeader>

								<ScrollArea className="h-96">
									<div className="px-4 pb-0">
										{transactions.map((m) => (
											<div
												key={m.id}
												className="flex items-center gap-3.5 py-3"
											>
												<div
													className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
														m.amount > 0
															? "bg-emerald-500/10"
															: "bg-orange-500/10"
													}`}
												>
													{m.amount > 0 ? (
														<ArrowDownLeft className="size-4 text-emerald-600" />
													) : (
														<ArrowUpRight className="size-4 text-orange-500" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-semibold text-foreground">
														{m.amount > 0 ? "Depósito" : "Retiro"}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatDate(m.date, "compact")}
													</p>
												</div>
												<p
													className={`text-sm font-bold tabular-nums ${
														m.amount > 0
															? "text-emerald-600"
															: "text-foreground"
													}`}
												>
													{formatCurrency(m.amount, true)}
												</p>
											</div>
										))}
									</div>
								</ScrollArea>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</>
	);
}
