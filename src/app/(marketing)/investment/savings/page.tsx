"use client";

import {
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
	ChevronRightIcon,
	HelpCircle,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

const fullData = [
	// Febrero
	{ date: "2026-W07", label: "9 Feb", value: 0 },
	{ date: "2026-W08", label: "16 Feb", value: 0 },
	{ date: "2026-W09", label: "23 Feb", value: 500000 },
	// Marzo
	{ date: "2026-W10", label: "2 Mar", value: 475000 },
	{ date: "2026-W11", label: "9 Mar", value: 475000 },
	{ date: "2026-W12", label: "16 Mar", value: 725000 },
	{ date: "2026-W13", label: "23 Mar", value: 725000 },
	{ date: "2026-W14", label: "30 Mar", value: 975000 },
	// Abril
	{ date: "2026-W15", label: "6 Abr", value: 950000 },
];

const movements = [
	{
		id: 5,
		type: "withdrawal" as const,
		date: "2026-04-06T10:30:00Z",
		amount: 25000,
	},
	{
		id: 4,
		type: "deposit" as const,
		date: "2026-03-28T15:20:00Z",
		amount: 250000,
	},
	{
		id: 3,
		type: "deposit" as const,
		date: "2026-03-15T09:45:00Z",
		amount: 250000,
	},
	{
		id: 2,
		type: "withdrawal" as const,
		date: "2026-03-01T00:00:00Z",
		amount: 25000,
	},
	{
		id: 1,
		type: "deposit" as const,
		date: "2026-02-20T11:00:00Z",
		amount: 500000,
	},
];

type TimeRange = "1M" | "3M" | "6M" | "1A" | "MAX";
const timeRanges: TimeRange[] = ["1M", "3M", "6M", "1A", "MAX"];

function getSliceCount(range: TimeRange, total: number): number {
	switch (range) {
		case "1M":
			return 1;
		case "3M":
			return 3;
		case "6M":
			return 6;
		case "1A":
			return 12;
		case "MAX":
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
	const [selectedRange, setSelectedRange] = useState<TimeRange>("MAX");

	const chartData = useMemo(() => {
		const count = getSliceCount(selectedRange, fullData.length);
		return fullData.slice(-count);
	}, [selectedRange]);

	const currentValue = 950000;
	const gainAmount = 25000;
	const gainPercent = "2,53";

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

			{/* Scrollable Content */}
			<div className="overflow-y-auto no-scrollbar flex flex-col">
				{/* Balance Section */}
				<div className="px-6 pt-6 pb-2 flex flex-col items-center text-center">
					<p className="sr-only text-sm text-muted-foreground font-medium">
						Total ahorrado
					</p>
					<h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
						${(currentValue + gainAmount).toLocaleString("es-CL")}
					</h2>
					<div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
						<TrendingUp className="size-3.5 text-emerald-600" />
						<span className="text-xs font-semibold text-emerald-600">
							${gainAmount.toLocaleString("es-CL")} ({gainPercent}%)
						</span>
					</div>
				</div>

				{/* Chart */}
				<div className="pt-2">
					<ChartContainer
						config={chartConfig}
						className="h-48 w-full aspect-auto border-b border-px border-primary/10"
					>
						<AreaChart
							data={chartData}
							margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
										offset="0%"
										stopColor="var(--color-primary)"
										stopOpacity={0.3}
									/>
									<stop
										offset="100%"
										stopColor="var(--color-primary)"
										stopOpacity={0.02}
									/>
								</linearGradient>
							</defs>

							<YAxis hide domain={["dataMin - 20000", "dataMax + 20000"]} />
							<ChartTooltip
								content={
									<ChartTooltipContent
										hideIndicator
										formatter={(value) =>
											`$${Number(value).toLocaleString("es-CL")}`
										}
									/>
								}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke="var(--color-primary)"
								strokeWidth={2.5}
								fill="url(#savingsGradient)"
								dot={false}
								activeDot={{
									r: 5,
									fill: "var(--color-primary)",
									stroke: "var(--color-background)",
									strokeWidth: 2,
								}}
							/>
						</AreaChart>
					</ChartContainer>

					{/* Time Range Selector */}
					<div className="flex items-center justify-center gap-2 my-4">
						{timeRanges.map((range) => (
							<button
								key={range}
								type="button"
								onClick={() => setSelectedRange(range)}
								className={`w-14 px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
									selectedRange === range
										? "bg-primary text-background shadow-sm"
										: "bg-muted text-muted-foreground hover:bg-accent active:bg-accent/80"
								}`}
							>
								{range}
							</button>
						))}
					</div>
				</div>

				{/* Activity Section */}
				<div className="px-6 my-4">
					<h3 className="text-lg font-bold text-muted-foreground mb-2">
						Actividad
					</h3>

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
									{movements.map((m) => (
										<div key={m.id} className="flex items-center gap-3.5 py-3">
											<div
												className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
													m.type === "deposit"
														? "bg-emerald-500/10"
														: "bg-orange-500/10"
												}`}
											>
												{m.type === "deposit" ? (
													<ArrowDownLeft className="size-4 text-emerald-600" />
												) : (
													<ArrowUpRight className="size-4 text-orange-500" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-foreground">
													{m.type === "deposit" ? "Depósito" : "Retiro"}
												</p>
												<p className="text-xs text-muted-foreground">
													{new Date(m.date).toLocaleDateString("es-CL")}
												</p>
											</div>
											<p
												className={`text-sm font-bold tabular-nums ${
													m.type === "deposit"
														? "text-emerald-600"
														: "text-foreground"
												}`}
											>
												{m.type === "deposit" ? "+" : "-"}
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

				{/* Action Buttons */}
				<div className="px-6 my-2 flex gap-3">
					<Button
						variant="outline"
						className="text-primary border-primary flex-1 py-3 rounded-xl font-bold h-full"
					>
						Retirar
					</Button>
					<Button className="flex-1 py-3 rounded-xl font-bold h-full">
						Ahorrar
					</Button>
				</div>
			</div>
		</>
	);
}
