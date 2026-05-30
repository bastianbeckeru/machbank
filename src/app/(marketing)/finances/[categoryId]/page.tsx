"use client";

import {
	ArrowLeft,
	ArrowUpRight,
	ChevronRight,
	HelpCircle,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/numbers";
import { formatDate } from "@/utils/strings";
import { type Merchant, mockMonthlyData, type Transaction } from "../page";

const getMerchantLogo = (merchantId: string) => {
	const logos: Record<string, string> = {
		mcdonalds: "/logos/mcdonalds.webp",
		starbucks: "/logos/starbucks.webp",
		dunkin: "/logos/dunkin.webp",
		lamia: "/logos/gusteaus.webp",
	};
	return logos[merchantId] || null;
};

interface SubcategoryTransaction extends Transaction {
	merchantId: string;
	merchantName: string;
}

interface Subcategory {
	id: string;
	name: string;
	amount: number;
	transactions: SubcategoryTransaction[];
}

const merchantSubcategoryMap: Record<string, { id: string; name: string }> = {
	// Food
	mcdonalds: { id: "fast-food", name: "Fast Food" },
	starbucks: { id: "cafe", name: "Café" },
	dunkin: { id: "cafe", name: "Café" },
	lamia: { id: "restaurant", name: "Restaurant" },

	// Bills
	enel: { id: "electricity", name: "Electricity" },
	aguas: { id: "water", name: "Water" },
	vtr: { id: "internet", name: "Internet" },

	// Transport
	bip: { id: "bip", name: "Bip!" },
	uber: { id: "rides", name: "Rides" },

	// Entertainment
	netflix: { id: "streaming", name: "Streaming" },
	spotify: { id: "streaming", name: "Streaming" },
	cinehoyts: { id: "gaming", name: "Gaming" },

	// Shopping
	amazon: { id: "online-shopping", name: "Compras Online" },
	zara: { id: "clothing", name: "Vestuario" },

	// Travel
	latam: { id: "flights", name: "Vuelos" },
	booking: { id: "hotels", name: "Alojamiento" },

	// Others
	anthropic: { id: "tech", name: "Tecnología" },
};

const parseDateStringToTime = (dateStr: string): number => {
	const parts = dateStr.trim().split(/\s+/);
	let day = 1;
	let month = 1;
	let year = 2026;

	if (parts.length >= 2) {
		day = Number.parseInt(parts[0], 10) || 1;
		const monthStr = parts[1].toLowerCase().slice(0, 3);
		const monthMap: Record<string, number> = {
			ene: 0,
			jan: 0,
			feb: 1,
			mar: 2,
			abr: 3,
			apr: 3,
			may: 4,
			jun: 5,
			jul: 6,
			ago: 7,
			aug: 7,
			sep: 8,
			oct: 9,
			nov: 10,
			dic: 11,
			dec: 11,
		};
		month = monthMap[monthStr] ?? 0;
		if (parts[2]) {
			year = Number.parseInt(parts[2], 10) || 2026;
		}
	} else if (dateStr.includes("-") || dateStr.includes("/")) {
		const delimiter = dateStr.includes("-") ? "-" : "/";
		const p = dateStr.split(delimiter);
		if (p.length === 3) {
			const p0 = Number.parseInt(p[0], 10) || 1;
			const p1 = Number.parseInt(p[1], 10) || 1;
			const p2 = Number.parseInt(p[2], 10) || 2026;
			if (p0 > 1000) {
				year = p0;
				month = p1 - 1;
				day = p2;
			} else {
				day = p0;
				month = p1 - 1;
				year = p2;
			}
		}
	}
	return new Date(year, month, day).getTime();
};

interface PageProps {
	params: Promise<{ categoryId: string }>;
	searchParams: Promise<{ year?: string; month?: string }>;
}

export default function CategoryDetailPage({
	params,
	searchParams,
}: PageProps) {
	const { categoryId } = React.use(params);
	const resolvedSearchParams = React.use(searchParams);

	// Load selected month from query parameter, defaulting to the latest month
	const monthIndex = useMemo(() => {
		const yearParam = resolvedSearchParams.year;
		const monthParam = resolvedSearchParams.month;

		// Dynamic fallback defaults to current month (e.g. May 2026) based on system date
		const now = new Date();
		const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		const currentIdx = mockMonthlyData.findIndex(
			(m) => m.monthKey === currentYearMonth,
		);
		const fallbackIndex =
			currentIdx !== -1 ? currentIdx : mockMonthlyData.length - 1;

		if (!yearParam || !monthParam) return fallbackIndex;

		const year = Number(yearParam);
		const month = Number(monthParam);

		if (Number.isNaN(year) || Number.isNaN(month)) return fallbackIndex;

		// Match construct key with mockMonthlyData keys
		const key = `${year}-${String(month).padStart(2, "0")}`;
		const foundIndex = mockMonthlyData.findIndex((m) => m.monthKey === key);
		if (foundIndex !== -1) {
			return foundIndex;
		}

		return fallbackIndex; // Fallback to current month if future, invalid or out of range
	}, [resolvedSearchParams]);

	// Load active monthly records
	const activeMonthlyData = useMemo(() => {
		return mockMonthlyData[monthIndex];
	}, [monthIndex]);

	// Fetch requested category detailed information
	const activeCategoryDetail = useMemo(() => {
		return (
			activeMonthlyData.categories.find((c) => c.id === categoryId) || null
		);
	}, [categoryId, activeMonthlyData]);

	// Determine the short label of the active month (to highlight its bar in the history chart)
	const activeMonthShortLabel = useMemo(() => {
		const [_, monthStr] = activeMonthlyData.monthKey.split("-");
		const monthNum = Number(monthStr);
		const shortLabels: Record<number, string> = {
			1: "Ene",
			2: "Feb",
			3: "Mar",
			4: "Abr",
			5: "May",
			6: "Jun",
			7: "Jul",
			8: "Ago",
			9: "Sep",
			10: "Oct",
			11: "Nov",
			12: "Dic",
		};
		return shortLabels[monthNum] || "";
	}, [activeMonthlyData]);

	// Construct dynamic query params string for back link
	const queryParamsString = useMemo(() => {
		const activeMonth = mockMonthlyData[monthIndex];
		const [year, month] = activeMonth.monthKey.split("-");
		return `year=${year}&month=${Number(month)}`;
	}, [monthIndex]);

	// Bar Chart config matching category details
	const barChartConfig = useMemo(() => {
		const color = activeCategoryDetail?.color || "var(--color-primary)";
		return {
			amount: {
				label: "Monto",
				color: color,
			},
		} satisfies ChartConfig;
	}, [activeCategoryDetail]);

	// Group active category merchants into subcategories
	const activeSubcategories = useMemo(() => {
		if (!activeCategoryDetail) return [];

		const subcategoriesMap: Record<string, Subcategory> = {};

		for (const merchant of activeCategoryDetail.merchants) {
			const subMap = merchantSubcategoryMap[merchant.id] || {
				id: "other",
				name: "Otros",
			};
			if (!subcategoriesMap[subMap.id]) {
				subcategoriesMap[subMap.id] = {
					id: subMap.id,
					name: subMap.name,
					amount: 0,
					transactions: [],
				};
			}
			const sub = subcategoriesMap[subMap.id];
			sub.amount += merchant.amount;
			for (const tx of merchant.transactions) {
				sub.transactions.push({
					...tx,
					merchantId: merchant.id,
					merchantName: merchant.name,
				});
			}
		}

		const result = Object.values(subcategoriesMap);
		for (const sub of result) {
			sub.transactions.sort(
				(a, b) => parseDateStringToTime(b.date) - parseDateStringToTime(a.date),
			);
		}

		return result;
	}, [activeCategoryDetail]);

	const [selectedSubcategory, setSelectedSubcategory] =
		useState<Subcategory | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// Calculate dynamic subcategory summary header details compared to previous month
	const drawerSummary = useMemo(() => {
		if (!selectedSubcategory) return { text: "", status: "none" as const };
		if (monthIndex === 0) {
			return {
				text: "Primer mes de registro para esta subcategoría.",
				status: "none" as const,
			};
		}

		const prevMonthlyData = mockMonthlyData[monthIndex - 1];
		let prevSubcategoryAmount = 0;
		let prevSubcategoryTxCount = 0;

		const prevCategory = prevMonthlyData.categories.find(
			(c) => c.id === categoryId,
		);
		if (prevCategory) {
			for (const merchant of prevCategory.merchants) {
				const subMap = merchantSubcategoryMap[merchant.id] || {
					id: "other",
					name: "Otros",
				};
				if (subMap.id === selectedSubcategory.id) {
					prevSubcategoryAmount += merchant.amount;
					prevSubcategoryTxCount += merchant.transactions.length;
				}
			}
		}

		const currTxCount = selectedSubcategory.transactions.length;
		const txDelta = currTxCount - prevSubcategoryTxCount;

		let txText = "";
		if (txDelta > 0) {
			txText = `Realizaste ${txDelta} transacciones más`;
		} else if (txDelta < 0) {
			txText = `Realizaste ${Math.abs(txDelta)} transacciones menos`;
		} else {
			txText = "Realizaste la misma cantidad de transacciones";
		}

		const currAmount = selectedSubcategory.amount;

		let spendingText = "";
		let status: "greater" | "less" | "equal" = "equal";

		if (prevSubcategoryAmount > 0) {
			const pctDiff =
				((currAmount - prevSubcategoryAmount) / prevSubcategoryAmount) * 100;
			const pctString = Math.abs(pctDiff).toFixed(1);
			if (pctDiff > 0) {
				spendingText = `gastaste un ${pctString}% más`;
				status = "greater";
			} else if (pctDiff < 0) {
				spendingText = `gastaste un ${pctString}% menos`;
				status = "less";
			} else {
				spendingText = "gastaste lo mismo";
				status = "equal";
			}
		} else {
			spendingText = "gastaste un 100% más";
			status = "greater";
		}

		return {
			text: `${txText} y ${spendingText} que el mes pasado.`,
			status,
		};
	}, [selectedSubcategory, monthIndex, categoryId]);

	const handleOpenSubcategoryDrawer = (subcategory: Subcategory) => {
		setSelectedSubcategory(subcategory);
		setIsDrawerOpen(true);
	};

	if (!activeCategoryDetail) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
				<p className="text-sm text-muted-foreground font-semibold">
					Categoría no encontrada.
				</p>
				<Link
					href="/finances"
					className="mt-4 text-xs font-bold text-primary hover:underline"
				>
					Volver a Finanzas
				</Link>
			</div>
		);
	}

	return (
		<>
			{/* Dedicated Category Detail Screen Overlay */}
			<div className="flex flex-col h-dvh w-dvw overflow-hidden bg-background">
				{/* Detail Header */}
				<div className="flex items-center justify-between px-2 py-3 bg-primary text-background shrink-0">
					<Link
						href={`/finances?${queryParamsString}`}
						className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
					>
						<ArrowLeft className="size-5" />
					</Link>
					<div className="flex items-center gap-2">
						<div
							className="size-7 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
						>
							{(() => {
								const Icon = activeCategoryDetail.icon;
								return <Icon className="size-4" color="#fff" />;
							})()}
						</div>
						<h1 className="text-base font-extrabold">
							{activeCategoryDetail.name}
						</h1>
					</div>
					<button
						type="button"
						className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
					>
						<HelpCircle className="size-5" />
					</button>
				</div>

				{/* Detail Content (Scrollable) */}
				<div className="overflow-y-auto no-scrollbar flex-1 pb-8 flex flex-col">
					{/* Large total display */}
					<div className="px-6 py-4 text-left shrink-0">
						<span className="text-xxs font-bold text-muted-foreground uppercase tracking-widest">
							Gasto Total este mes
						</span>
						<h2 className="text-4xl font-extrabold tracking-tight text-foreground mt-0.5 tabular-nums">
							{formatCurrency(activeCategoryDetail.amount)}
						</h2>
					</div>

					{/* Recharts Bar Chart (6-month category spending history) */}
					<div className="bg-card border-border/40 px-4 mb-6 shrink-0">
						<ChartContainer config={barChartConfig} className="w-full h-44">
							<BarChart
								data={activeCategoryDetail.history}
								margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="var(--border)"
									opacity={0.25}
								/>
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
									tick={{
										fill: "var(--muted-foreground)",
										fontSize: 10,
										fontWeight: "bold",
									}}
								/>
								<YAxis hide />
								<Bar
									dataKey="amount"
									fill={activeCategoryDetail.color}
									radius={[6, 6, 0, 0]}
									maxBarSize={32}
								>
									{activeCategoryDetail.history.map((entry, index) => {
										const isSelected = entry.month === activeMonthShortLabel;
										return (
											<Cell
												key={`cell-${index}`}
												fill={activeCategoryDetail.color}
												opacity={isSelected ? 1.0 : 0.3}
											/>
										);
									})}
								</Bar>
							</BarChart>
						</ChartContainer>
					</div>

					{/* Collapsed Expense List (Subcategories) */}
					<div className="flex flex-col gap-2.5 px-6">
						<h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 mb-0.5 sr-only">
							Distribución por Subcategoría
						</h3>

						{activeSubcategories.length === 0 ? (
							<div className="p-8 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border/50">
								Sin transacciones registradas.
							</div>
						) : (
							[...activeSubcategories]
								.sort((a, b) => b.amount - a.amount)
								.map((subcategory) => (
									<button
										key={subcategory.id}
										type="button"
										onClick={() => handleOpenSubcategoryDrawer(subcategory)}
										className="w-full text-left p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-muted/10 shadow-xs flex items-center justify-between transition-all cursor-pointer"
									>
										<div className="flex items-center gap-3.5">
											<div
												className="size-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all shrink-0"
												style={{
													backgroundColor: `${activeCategoryDetail.color}15`,
													color: activeCategoryDetail.color,
												}}
											>
												{subcategory.name.charAt(0)}
											</div>
											<div>
												<p className="font-bold text-sm text-foreground">
													{subcategory.name}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5 font-medium">
													{subcategory.transactions.length} transacciones
												</p>
											</div>
										</div>

										<div className="flex items-center gap-1 shrink-0">
											<span className="text-sm font-bold text-foreground tabular-nums">
												{formatCurrency(subcategory.amount)}
											</span>
											<ChevronRight className="size-4 text-muted-foreground" />
										</div>
									</button>
								))
						)}
					</div>
				</div>
			</div>

			{/* Subcategory bottom drawer */}
			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent className="max-w-sm mx-auto">
					{selectedSubcategory && activeCategoryDetail && (
						<div className="p-5 flex flex-col">
							<DrawerHeader className="p-0 text-left">
								<div className="flex items-center gap-3.5 mb-1.5">
									<div
										className="size-10 rounded-xl flex items-center justify-center font-extrabold text-sm"
										style={{
											backgroundColor: `${activeCategoryDetail.color}15`,
											color: activeCategoryDetail.color,
										}}
									>
										{selectedSubcategory.name.charAt(0)}
									</div>
									<DrawerTitle className="text-lg font-bold text-foreground">
										{selectedSubcategory.name}
									</DrawerTitle>
								</div>
							</DrawerHeader>

							{drawerSummary.text && (
								<div
									className={cn(
										"py-2 px-3 mt-0.5 rounded-lg mb-4 text-xs font-bold leading-normal transition-all w-full text-left inline-block",
										drawerSummary.status === "less" &&
											"bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
										drawerSummary.status === "greater" &&
											"bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400",
										drawerSummary.status === "equal" &&
											"bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
										drawerSummary.status === "none" &&
											"bg-muted/10 text-muted-foreground",
									)}
								>
									{drawerSummary.text}
								</div>
							)}

							{/* Individual Transaction list */}
							<div className="flex flex-col max-h-75 overflow-y-auto no-scrollbar pb-2">
								{selectedSubcategory.transactions.map((tx) => (
									<div key={tx.id} className="flex items-center gap-3.5 py-3">
										{(() => {
											const logoUrl = getMerchantLogo(tx.merchantId);
											if (logoUrl) {
												return (
													<img
														src={logoUrl}
														alt={tx.merchantName}
														className="size-9 rounded-lg object-contain bg-white p-1 shrink-0 border border-border/10"
													/>
												);
											}
											return (
												<div
													className="size-9 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0"
													style={{
														backgroundColor: `${activeCategoryDetail.color}15`,
														color: activeCategoryDetail.color,
													}}
												>
													{tx.merchantName.charAt(0)}
												</div>
											);
										})()}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-bold text-foreground truncate">
												{tx.merchantName}
											</p>
											<p className="text-xs text-muted-foreground mt-0.5 font-medium">
												{formatDate(tx.date, "compact")}
											</p>
										</div>
										<p className="text-sm font-bold tabular-nums text-foreground shrink-0">
											{formatCurrency(tx.amount * -1, true)}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
