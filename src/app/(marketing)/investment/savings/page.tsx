"use client";

import {
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
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
import { cn } from "@/lib/utils";

// --- Generate realistic daily data ---
const ANNUAL_RATE = 0.046;
const DAILY_RATE = ANNUAL_RATE / 365;

interface DayEntry {
	date: string; // ISO date
	deposited: number;
	pnl: number;
}

const transactions: { id: number; date: string; amount: number }[] = [
	{ id: 1, date: "2025-06-06", amount: 50000 },
	{ id: 2, date: "2025-07-15", amount: 100000 },
	{ id: 3, date: "2025-08-30", amount: 100000 },
	{ id: 4, date: "2025-10-05", amount: 150000 },
	{ id: 5, date: "2025-12-14", amount: -150000 },
	{ id: 6, date: "2026-02-20", amount: 200000 },
	{ id: 7, date: "2026-03-02", amount: 200000 },
	{ id: 8, date: "2026-04-03", amount: 100000 },
];

function generateFullData(): DayEntry[] {
	const start = new Date("2025-06-01");
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

		// Apply any transaction for this day
		const txAmount = txMap.get(iso);
		if (txAmount) {
			deposited += txAmount;
			if (deposited < 0) deposited = 0;
		}

		// Accrue daily interest on (deposited + pnl) if there's a balance
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
	}>({
		deposited: 0,
		pnl: 0,
	});
	const [isPressing, setIsPressing] = useState(false);

	const chartData = useMemo(() => {
		const count = getSliceCount(selectedRange, fullData.length);
		return fullData.slice(-count).map((d) => ({
			...d,
			value: d.deposited + d.pnl,
		}));
	}, [selectedRange]);

	const handlePressStart = ({ activeIndex }: { activeIndex: number }) => {
		const entry = chartData[activeIndex];
		setIsPressing(true);
		setActiveEntry({ deposited: entry.deposited, pnl: entry.pnl });
	};

	const handlePressEnd = () => {
		const lastEntry = chartData[chartData.length - 1];
		setIsPressing(false);
		setActiveEntry({ deposited: lastEntry.deposited, pnl: lastEntry.pnl });
	};

	const handlePressMove = ({ activeIndex }: { activeIndex: number }) => {
		if (!isPressing) return;
		const entry = chartData[activeIndex];
		setActiveEntry({ deposited: entry.deposited, pnl: entry.pnl });
	};

	return (
		<>
			{/* Header */}
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
				{/* Balance Section */}
				<div className="px-6 pt-6 pb-2 flex flex-col items-center text-center">
					<p className="sr-only text-sm text-muted-foreground font-medium">
						Total ahorrado
					</p>
					<h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
						{formatCurrency(activeEntry.deposited + activeEntry.pnl)}
					</h2>

					<div className="mt-2 inline-flex gap-2 items-center">
						<div
							className={cn(
								"inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1",
								activeEntry.pnl < 0 && "text-rose-600 bg-rose-500/10",
							)}
						>
							<TrendingUp
								className={cn(
									"size-3.5",
									activeEntry.pnl < 0 && "rotate-180 -scale-x-100",
								)}
							/>
							<span className="text-xs font-semibold">
								{formatCurrency(activeEntry.pnl)}
							</span>
						</div>
						<div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
							<span className="text-xs font-semibold text-emerald-600">
								4,6% anual
							</span>
						</div>
					</div>
				</div>

				<div className="space-y-4 mb-7">
					<ChartContainer config={chartConfig} className="h-48 w-full">
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
									return (
										<div className="rounded-md border border-muted-foreground/50 bg-background px-3 py-1.5 shadow-sm">
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
									selectedRange === range && "bg-primary text-background",
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
						className="flex-col justify-start items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
					>
						<DownloadIcon className="size-6 text-primary" />
						Retirar
					</Button>
					<Button
						variant="outline"
						className="flex-col justify-start items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
					>
						<DownloadIcon className="size-6 text-primary rotate-180" />
						Ahorrar
					</Button>
					<Button
						variant="outline"
						className="flex-col justify-start items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
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
								className="w-full h-14 rounded-xl justify-between"
							>
								Movimientos
								<ChevronRightIcon className="size-5" />
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

								<div className="px-4 pb-0">
									{transactions.map((m) => (
										<div key={m.id} className="flex items-center gap-3.5 py-3">
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
													{new Date(m.date).toLocaleDateString("es-CL")}
												</p>
											</div>
											<p
												className={`text-sm font-bold tabular-nums ${
													m.amount > 0 ? "text-emerald-600" : "text-foreground"
												}`}
											>
												{m.amount > 0 ? "+" : "-"}
												{" $"}
												{m.amount.toLocaleString("es-CL")}
											</p>
										</div>
									))}
								</div>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</>
	);
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatDate(date: string): string {
	return new Date(date).toLocaleDateString("es-CL", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
