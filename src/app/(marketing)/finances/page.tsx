"use client";

import {
	ArrowLeft,
	Car,
	ChevronLeft,
	ChevronRight,
	Gamepad2,
	HelpCircle,
	MoreHorizontal,
	Plane,
	ReceiptText,
	ShoppingBag,
	TrendingDown,
	TrendingUp,
	UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Sector } from "recharts";
import BottomNavbar from "@/components/bottom-navbar";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/numbers";

export interface Transaction {
	id: string;
	date: string;
	amount: number;
}

export interface Merchant {
	id: string;
	name: string;
	amount: number;
	transactions: Transaction[];
}

export interface ExpenseCategory {
	id: string;
	name: string;
	amount: number;
	color: string;
	icon: React.ComponentType<{ className?: string; color?: string }>;
	history: { month: string; amount: number }[];
	merchants: Merchant[];
}

export interface MonthlyData {
	monthKey: string;
	label: string;
	categories: ExpenseCategory[];
}

export const mockMonthlyData: MonthlyData[] = [
	{
		monthKey: "2026-03",
		label: "Marzo 2026",
		categories: [
			{
				id: "food",
				name: "Comida",
				amount: 190000,
				color: "#6366f1",
				icon: UtensilsCrossed,
				history: [
					{ month: "Dic", amount: 150000 },
					{ month: "Ene", amount: 170000 },
					{ month: "Feb", amount: 160000 },
					{ month: "Mar", amount: 190000 },
				],
				merchants: [
					{
						id: "mcdonalds",
						name: "McDonald's",
						amount: 50000,
						transactions: [
							{ id: "t1", date: "24 Mar 2026", amount: 20000 },
							{ id: "t2", date: "10 Mar 2026", amount: 15000 },
							{ id: "t3", date: "03 Mar 2026", amount: 15000 },
						],
					},
					{
						id: "starbucks",
						name: "Starbucks",
						amount: 50000,
						transactions: [
							{ id: "t4", date: "22 Mar 2026", amount: 25000 },
							{ id: "t5", date: "05 Mar 2026", amount: 25000 },
						],
					},
					{
						id: "dunkin",
						name: "Dunkin' Donuts",
						amount: 30000,
						transactions: [
							{ id: "t6", date: "18 Mar 2026", amount: 15000 },
							{ id: "t7", date: "08 Mar 2026", amount: 15000 },
						],
					},
					{
						id: "lamia",
						name: "Restaurant Gusteau's",
						amount: 60000,
						transactions: [{ id: "t8", date: "15 Mar 2026", amount: 60000 }],
					},
				],
			},
			{
				id: "shopping",
				name: "Compras",
				amount: 85000,
				color: "#ec4899",
				icon: ShoppingBag,
				history: [
					{ month: "Dic", amount: 110000 },
					{ month: "Ene", amount: 90000 },
					{ month: "Feb", amount: 130000 },
					{ month: "Mar", amount: 85000 },
				],
				merchants: [
					{
						id: "amazon",
						name: "Amazon",
						amount: 55000,
						transactions: [
							{ id: "t9", date: "14 Mar 2026", amount: 30000 },
							{ id: "t10", date: "08 Mar 2026", amount: 25000 },
						],
					},
					{
						id: "zara",
						name: "Zara",
						amount: 30000,
						transactions: [{ id: "t11", date: "19 Mar 2026", amount: 30000 }],
					},
				],
			},
			{
				id: "bills",
				name: "Cuentas",
				amount: 110000,
				color: "#14b8a6",
				icon: ReceiptText,
				history: [
					{ month: "Dic", amount: 95000 },
					{ month: "Ene", amount: 100000 },
					{ month: "Feb", amount: 95000 },
					{ month: "Mar", amount: 110000 },
				],
				merchants: [
					{
						id: "enel",
						name: "Enel Luz",
						amount: 50000,
						transactions: [{ id: "t12", date: "05 Mar 2026", amount: 50000 }],
					},
					{
						id: "aguas",
						name: "Aguas Andinas",
						amount: 30000,
						transactions: [{ id: "t13", date: "08 Mar 2026", amount: 30000 }],
					},
					{
						id: "vtr",
						name: "VTR Internet",
						amount: 30000,
						transactions: [{ id: "t14", date: "10 Mar 2026", amount: 30000 }],
					},
				],
			},
			{
				id: "entertainment",
				name: "Entretención",
				amount: 48000,
				color: "#3b82f6",
				icon: Gamepad2,
				history: [
					{ month: "Dic", amount: 30000 },
					{ month: "Ene", amount: 35000 },
					{ month: "Feb", amount: 30000 },
					{ month: "Mar", amount: 48000 },
				],
				merchants: [
					{
						id: "netflix",
						name: "Netflix",
						amount: 12000,
						transactions: [{ id: "t15", date: "10 Mar 2026", amount: 12000 }],
					},
					{
						id: "spotify",
						name: "Spotify",
						amount: 8000,
						transactions: [{ id: "t16", date: "05 Mar 2026", amount: 8000 }],
					},
					{
						id: "cinehoyts",
						name: "CineHoyts",
						amount: 28000,
						transactions: [{ id: "t17", date: "18 Mar 2026", amount: 28000 }],
					},
				],
			},
			{
				id: "transport",
				name: "Transporte",
				amount: 42000,
				color: "#f59e0b",
				icon: Car,
				history: [
					{ month: "Dic", amount: 40000 },
					{ month: "Ene", amount: 38000 },
					{ month: "Feb", amount: 42000 },
					{ month: "Mar", amount: 42000 },
				],
				merchants: [
					{
						id: "uber",
						name: "Uber",
						amount: 30000,
						transactions: [
							{ id: "t18", date: "22 Mar 2026", amount: 12000 },
							{ id: "t19", date: "15 Mar 2026", amount: 10000 },
							{ id: "t20", date: "07 Mar 2026", amount: 8000 },
						],
					},
					{
						id: "bip",
						name: "Bip!",
						amount: 12000,
						transactions: [
							{ id: "t21", date: "20 Mar 2026", amount: 6000 },
							{ id: "t22", date: "02 Mar 2026", amount: 6000 },
						],
					},
				],
			},
		],
	},
	{
		monthKey: "2026-04",
		label: "Abril 2026",
		categories: [
			{
				id: "food",
				name: "Comida",
				amount: 165000,
				color: "#6366f1",
				icon: UtensilsCrossed,
				history: [
					{ month: "Dic", amount: 150000 },
					{ month: "Ene", amount: 170000 },
					{ month: "Feb", amount: 160000 },
					{ month: "Mar", amount: 190000 },
					{ month: "Abr", amount: 165000 },
				],
				merchants: [
					{
						id: "mcdonalds",
						name: "McDonald's",
						amount: 45000,
						transactions: [
							{ id: "t23", date: "20 Abr 2026", amount: 15000 },
							{ id: "t24", date: "10 Abr 2026", amount: 15000 },
							{ id: "t25", date: "03 Abr 2026", amount: 15000 },
						],
					},
					{
						id: "starbucks",
						name: "Starbucks",
						amount: 40000,
						transactions: [
							{ id: "t26", date: "24 Abr 2026", amount: 20000 },
							{ id: "t27", date: "02 Abr 2026", amount: 20000 },
						],
					},
					{
						id: "dunkin",
						name: "Dunkin' Donuts",
						amount: 20000,
						transactions: [
							{ id: "t28", date: "18 Abr 2026", amount: 10000 },
							{ id: "t29", date: "05 Abr 2026", amount: 10000 },
						],
					},
					{
						id: "lamia",
						name: "Restaurant Gusteau's",
						amount: 60000,
						transactions: [{ id: "t30", date: "15 Abr 2026", amount: 60000 }],
					},
				],
			},
			{
				id: "travel",
				name: "Viajes",
				amount: 150000,
				color: "#10b981",
				icon: Plane,
				history: [
					{ month: "Dic", amount: 0 },
					{ month: "Ene", amount: 0 },
					{ month: "Feb", amount: 0 },
					{ month: "Mar", amount: 0 },
					{ month: "Abr", amount: 150000 },
				],
				merchants: [
					{
						id: "latam",
						name: "LATAM Airlines",
						amount: 12000,
						transactions: [{ id: "t31", date: "10 Abr 2026", amount: 120000 }],
					},
					{
						id: "booking",
						name: "Booking.com",
						amount: 30000,
						transactions: [{ id: "t32", date: "12 Abr 2026", amount: 30000 }],
					},
				],
			},
			{
				id: "shopping",
				name: "Compras",
				amount: 140000,
				color: "#ec4899",
				icon: ShoppingBag,
				history: [
					{ month: "Dic", amount: 110000 },
					{ month: "Ene", amount: 90000 },
					{ month: "Feb", amount: 130000 },
					{ month: "Mar", amount: 85000 },
					{ month: "Abr", amount: 140000 },
				],
				merchants: [
					{
						id: "amazon",
						name: "Amazon",
						amount: 80000,
						transactions: [
							{ id: "t33", date: "14 Abr 2026", amount: 50000 },
							{ id: "t34", date: "08 Abr 2026", amount: 30000 },
						],
					},
					{
						id: "zara",
						name: "Zara",
						amount: 60000,
						transactions: [{ id: "t35", date: "19 Abr 2026", amount: 60000 }],
					},
				],
			},
			{
				id: "bills",
				name: "Cuentas",
				amount: 95000,
				color: "#14b8a6",
				icon: ReceiptText,
				history: [
					{ month: "Dic", amount: 95000 },
					{ month: "Ene", amount: 100000 },
					{ month: "Feb", amount: 95000 },
					{ month: "Mar", amount: 110000 },
					{ month: "Abr", amount: 95000 },
				],
				merchants: [
					{
						id: "enel",
						name: "Enel Luz",
						amount: 45000,
						transactions: [{ id: "t36", date: "05 Abr 2026", amount: 45000 }],
					},
					{
						id: "aguas",
						name: "Aguas Andinas",
						amount: 25000,
						transactions: [{ id: "t37", date: "08 Abr 2026", amount: 25000 }],
					},
					{
						id: "vtr",
						name: "VTR Internet",
						amount: 25000,
						transactions: [{ id: "t38", date: "10 Abr 2026", amount: 25000 }],
					},
				],
			},
			{
				id: "transport",
				name: "Transporte",
				amount: 55000,
				color: "#f59e0b",
				icon: Car,
				history: [
					{ month: "Dic", amount: 40000 },
					{ month: "Ene", amount: 38000 },
					{ month: "Feb", amount: 42000 },
					{ month: "Mar", amount: 42000 },
					{ month: "Abr", amount: 55000 },
				],
				merchants: [
					{
						id: "uber",
						name: "Uber",
						amount: 40000,
						transactions: [
							{ id: "t39", date: "22 Abr 2026", amount: 20000 },
							{ id: "t40", date: "15 Abr 2026", amount: 20000 },
						],
					},
					{
						id: "bip",
						name: "Bip!",
						amount: 15000,
						transactions: [
							{ id: "t41", date: "20 Abr 2026", amount: 7500 },
							{ id: "t42", date: "02 Abr 2026", amount: 7500 },
						],
					},
				],
			},
			{
				id: "others",
				name: "Otros",
				amount: 15000,
				color: "#8b5cf6",
				icon: MoreHorizontal,
				history: [
					{ month: "Dic", amount: 15000 },
					{ month: "Ene", amount: 20000 },
					{ month: "Feb", amount: 15000 },
					{ month: "Mar", amount: 20000 },
					{ month: "Abr", amount: 15000 },
				],
				merchants: [
					{
						id: "anthropic",
						name: "Anthropic",
						amount: 15000,
						transactions: [{ id: "t43", date: "12 Abr 2026", amount: 15000 }],
					},
				],
			},
		],
	},
	{
		monthKey: "2026-05",
		label: "Mayo 2026",
		categories: [
			{
				id: "food",
				name: "Comida",
				amount: 185000,
				color: "#6366f1",
				icon: UtensilsCrossed,
				history: [
					{ month: "Dic", amount: 150000 },
					{ month: "Ene", amount: 170000 },
					{ month: "Feb", amount: 160000 },
					{ month: "Mar", amount: 190000 },
					{ month: "Abr", amount: 165000 },
					{ month: "May", amount: 185000 },
				],
				merchants: [
					{
						id: "mcdonalds",
						name: "McDonald's",
						amount: 48000,
						transactions: [
							{ id: "t44", date: "20 May", amount: 18000 },
							{ id: "t45", date: "10 May", amount: 15000 },
							{ id: "t46", date: "03 May", amount: 15000 },
						],
					},
					{
						id: "dunkin",
						name: "Dunkin' Donuts",
						amount: 15000,
						transactions: [
							{ id: "t47", date: "18 May", amount: 8000 },
							{ id: "t48", date: "05 May", amount: 7000 },
						],
					},
					{
						id: "starbucks",
						name: "Starbucks",
						amount: 62000,
						transactions: [
							{ id: "t49", date: "24 May", amount: 22000 },
							{ id: "t50", date: "12 May", amount: 20000 },
							{ id: "t51", date: "02 May", amount: 20000 },
						],
					},
					{
						id: "lamia",
						name: "Restaurant Gusteau's",
						amount: 60000,
						transactions: [{ id: "t52", date: "15 May", amount: 60000 }],
					},
				],
			},
			{
				id: "shopping",
				name: "Compras",
				amount: 120000,
				color: "#ec4899",
				icon: ShoppingBag,
				history: [
					{ month: "Dic", amount: 110000 },
					{ month: "Ene", amount: 90000 },
					{ month: "Feb", amount: 130000 },
					{ month: "Mar", amount: 85000 },
					{ month: "Abr", amount: 140000 },
					{ month: "May", amount: 120000 },
				],
				merchants: [
					{
						id: "amazon",
						name: "Amazon",
						amount: 70000,
						transactions: [
							{ id: "t53", date: "14 May", amount: 45000 },
							{ id: "t54", date: "08 May", amount: 25000 },
						],
					},
					{
						id: "zara",
						name: "Zara",
						amount: 50000,
						transactions: [{ id: "t55", date: "19 May", amount: 50000 }],
					},
				],
			},
			{
				id: "bills",
				name: "Cuentas",
				amount: 95000,
				color: "#14b8a6",
				icon: ReceiptText,
				history: [
					{ month: "Dic", amount: 95000 },
					{ month: "Ene", amount: 100000 },
					{ month: "Feb", amount: 95000 },
					{ month: "Mar", amount: 110000 },
					{ month: "Abr", amount: 95000 },
					{ month: "May", amount: 95000 },
				],
				merchants: [
					{
						id: "enel",
						name: "Enel Luz",
						amount: 45000,
						transactions: [{ id: "t56", date: "05 May", amount: 45000 }],
					},
					{
						id: "aguas",
						name: "Aguas Andinas",
						amount: 25000,
						transactions: [{ id: "t57", date: "08 May", amount: 25000 }],
					},
					{
						id: "vtr",
						name: "VTR Internet",
						amount: 25000,
						transactions: [{ id: "t58", date: "10 May", amount: 25000 }],
					},
				],
			},
			{
				id: "transport",
				name: "Transporte",
				amount: 45000,
				color: "#f59e0b",
				icon: Car,
				history: [
					{ month: "Dic", amount: 40000 },
					{ month: "Ene", amount: 38000 },
					{ month: "Feb", amount: 42000 },
					{ month: "Mar", amount: 42000 },
					{ month: "Abr", amount: 55000 },
					{ month: "May", amount: 45000 },
				],
				merchants: [
					{
						id: "uber",
						name: "Uber",
						amount: 30000,
						transactions: [
							{ id: "t59", date: "22 May", amount: 12000 },
							{ id: "t60", date: "15 May", amount: 10000 },
							{ id: "t61", date: "07 May", amount: 8000 },
						],
					},
					{
						id: "bip",
						name: "Bip!",
						amount: 15000,
						transactions: [
							{ id: "t62", date: "20 May", amount: 7500 },
							{ id: "t63", date: "02 May", amount: 7500 },
						],
					},
				],
			},
			{
				id: "entertainment",
				name: "Entretención",
				amount: 35000,
				color: "#3b82f6",
				icon: Gamepad2,
				history: [
					{ month: "Dic", amount: 30000 },
					{ month: "Ene", amount: 35000 },
					{ month: "Feb", amount: 30000 },
					{ month: "Mar", amount: 48000 },
					{ month: "Abr", amount: 40000 },
					{ month: "May", amount: 35000 },
				],
				merchants: [
					{
						id: "netflix",
						name: "Netflix",
						amount: 12000,
						transactions: [{ id: "t64", date: "10 May", amount: 12000 }],
					},
					{
						id: "spotify",
						name: "Spotify",
						amount: 8000,
						transactions: [{ id: "t65", date: "05 May", amount: 8000 }],
					},
					{
						id: "cinehoyts",
						name: "CineHoyts",
						amount: 15000,
						transactions: [{ id: "t66", date: "18 May", amount: 15000 }],
					},
				],
			},
			{
				id: "others",
				name: "Otros",
				amount: 20000,
				color: "#8b5cf6",
				icon: MoreHorizontal,
				history: [
					{ month: "Dic", amount: 15000 },
					{ month: "Ene", amount: 20000 },
					{ month: "Feb", amount: 15000 },
					{ month: "Mar", amount: 20000 },
					{ month: "Abr", amount: 15000 },
					{ month: "May", amount: 20000 },
				],
				merchants: [
					{
						id: "anthropic",
						name: "Anthropic",
						amount: 20000,
						transactions: [{ id: "t67", date: "12 May", amount: 20000 }],
					},
				],
			},
		],
	},
];

function Odometer({ value }: { value: number }) {
	const [displayValue, setDisplayValue] = useState(0);
	const count = useMotionValue(0);

	useEffect(() => {
		const controls = animate(count, value, {
			duration: 0.6,
			ease: "easeOut",
			onUpdate: (latest) => {
				setDisplayValue(Math.round(latest));
			},
		});
		return () => controls.stop();
	}, [value, count]);

	return <span>{formatCurrency(displayValue)}</span>;
}

function FinancesDashboard() {
	const searchParams = useSearchParams();

	// Initialize month index from query param if available
	const initialMonthIndex = useMemo(() => {
		const yearParam = searchParams?.get("year");
		const monthParam = searchParams?.get("month");

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
	}, [searchParams]);

	const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);

	// Get current active monthly data
	const activeMonthlyData = useMemo(() => {
		return mockMonthlyData[monthIndex];
	}, [monthIndex]);

	// Calculate totals and percentages
	const totalExpenses = useMemo(() => {
		return activeMonthlyData.categories.reduce(
			(acc, cat) => acc + cat.amount,
			0,
		);
	}, [activeMonthlyData]);

	const categoriesWithShares = useMemo(() => {
		return [...activeMonthlyData.categories]
			.map((cat) => ({
				...cat,
				share: cat.amount / totalExpenses,
			}))
			.sort((a, b) => b.amount - a.amount);
	}, [activeMonthlyData, totalExpenses]);

	// Dynamic Chart Data mapping active categories
	const chartData = useMemo(() => {
		return categoriesWithShares.map((cat) => ({
			category: cat.id,
			name: cat.name,
			amount: cat.amount,
			fill: cat.color,
		}));
	}, [categoriesWithShares]);

	// Dynamic Chart Config matching category labels and theme colors
	const chartConfig = useMemo(() => {
		const config: ChartConfig = {
			amount: {
				label: "Monto",
			},
		};
		for (const cat of activeMonthlyData.categories) {
			config[cat.id] = {
				label: cat.name,
				color: cat.color,
			};
		}
		return config;
	}, [activeMonthlyData]);

	// Get active category object if one is selected
	const activeCategory = useMemo(() => {
		if (!selectedCategoryId) return null;
		return (
			activeMonthlyData.categories.find((c) => c.id === selectedCategoryId) ||
			null
		);
	}, [selectedCategoryId, activeMonthlyData]);

	// Calculate active category index inside sorted shares
	const activeIndex = useMemo(() => {
		if (!selectedCategoryId) return -1;
		return categoriesWithShares.findIndex((c) => c.id === selectedCategoryId);
	}, [selectedCategoryId, categoriesWithShares]);

	// Calculate dynamic comparison text compared to previous month
	const comparisonText = useMemo(() => {
		if (selectedCategoryId) {
			const currentAmount = activeCategory ? activeCategory.amount : 0;

			if (monthIndex === 0) {
				const baseline = 100000; // default baseline per category
				const diff = currentAmount - baseline;
				const pct = Math.abs((diff / baseline) * 100).toFixed(1);
				const direction = diff >= 0 ? "más" : "menos";
				const isLower = diff < 0;
				return {
					text: `Gastaste ${pct}% ${direction} que tu promedio`,
					isLower,
				};
			}

			const prevMonthlyData = mockMonthlyData[monthIndex - 1];
			const prevCat = prevMonthlyData.categories.find(
				(c) => c.id === selectedCategoryId,
			);
			const prevAmount = prevCat ? prevCat.amount : 0;

			if (prevAmount === 0) {
				return {
					text: `Gastaste ${formatCurrency(currentAmount)} más que el mes pasado`,
					isLower: false,
				};
			}

			const diff = currentAmount - prevAmount;
			const pct = Math.abs((diff / prevAmount) * 100).toFixed(1);
			const direction = diff >= 0 ? "más" : "menos";
			const isLower = diff < 0;
			return {
				text: `Gastaste ${pct}% ${direction} que el mes pasado`,
				isLower,
			};
		}

		if (monthIndex === 0) {
			// Compare against standard baseline $500.000 for the first month in history
			const baseline = 500000;
			const diff = totalExpenses - baseline;
			const pct = Math.abs((diff / baseline) * 100).toFixed(1);
			const direction = diff >= 0 ? "más" : "menos";
			const isLower = diff < 0;
			return {
				text: `Gastaste ${pct}% ${direction} que tu promedio`,
				isLower,
			};
		}

		const prevMonthlyData = mockMonthlyData[monthIndex - 1];
		const prevTotal = prevMonthlyData.categories.reduce(
			(acc, cat) => acc + cat.amount,
			0,
		);
		const diff = totalExpenses - prevTotal;
		const pct = Math.abs((diff / prevTotal) * 100).toFixed(1);
		const direction = diff >= 0 ? "más" : "menos";
		const isLower = diff < 0;
		return {
			text: `Gastaste ${pct}% ${direction} que el mes pasado`,
			isLower,
		};
	}, [totalExpenses, monthIndex, selectedCategoryId, activeCategory]);

	// Navigate month
	const handlePrevMonth = () => {
		if (monthIndex > 0) {
			setMonthIndex(monthIndex - 1);
			setSelectedCategoryId(null); // Reset selection
		}
	};

	const handleNextMonth = () => {
		if (monthIndex < mockMonthlyData.length - 1) {
			setMonthIndex(monthIndex + 1);
			setSelectedCategoryId(null); // Reset selection
		}
	};

	const handleToggleCategory = (categoryId: string) => {
		setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
	};

	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between px-2 py-3 bg-primary text-background">
				<Link
					href="/home"
					className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<h1 className="text-lg font-bold">Finanzas</h1>
				<button
					type="button"
					className="rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<HelpCircle className="size-5" />
				</button>
			</div>

			{/* Main Scroll Area */}
			<div className="overflow-y-auto no-scrollbar bg-background flex flex-col items-center">
				{/* Donut Chart Ring */}
				<div className="relative w-full h-72 flex items-center justify-center shrink-0">
					{/* Interactive Recharts Ring using shadcn/ui container */}
					<ChartContainer config={chartConfig} className="w-full h-full">
						<PieChart>
							<Pie
								data={chartData}
								dataKey="amount"
								nameKey="category"
								innerRadius={70}
								outerRadius={105}
								strokeWidth={4}
								animationBegin={0}
								animationDuration={1000}
								shape={({ index, outerRadius = 0, fill, ...props }: any) => {
									const isSelected = index === activeIndex;
									const hasSelection = activeIndex !== -1;
									const targetOuterRadius = isSelected
										? Number(outerRadius) + 8
										: Number(outerRadius);
									const targetOpacity = isSelected
										? 1
										: hasSelection
											? 0.35
											: 1;

									return (
										<Sector
											{...props}
											fill={fill}
											outerRadius={targetOuterRadius}
											opacity={targetOpacity}
											className="cursor-pointer transition-all duration-300 outline-hidden"
										/>
									);
								}}
								onClick={(_, index) => {
									if (index !== undefined && chartData[index]) {
										handleToggleCategory(chartData[index].category);
									}
								}}
							/>
						</PieChart>
					</ChartContainer>

					{/* Center Value Display */}
					<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4 w-full">
						<span className="text-2xl font-extrabold tracking-tight text-foreground mt-0.5 tabular-nums">
							<Odometer
								value={activeCategory ? activeCategory.amount : totalExpenses}
							/>
						</span>
						<AnimatePresence mode="wait">
							<motion.span
								key={activeCategory ? activeCategory.id : "total"}
								initial={{ opacity: 0, y: 2 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -2 }}
								transition={{ duration: 0.15 }}
								className="text-xxs h-4 text-center font-bold justify-center items-center flex text-muted-foreground uppercase tracking-widest truncate max-w-36 mt-0.5"
							>
								{activeCategory ? activeCategory.name : "Total"}
							</motion.span>
						</AnimatePresence>
					</div>
				</div>

				{/* Monthly Comparison */}
				<div
					className={cn(
						"flex items-center gap-1.5 justify-center py-1.5 px-3 rounded-full text-xs font-bold transition-all mb-4",
						comparisonText.isLower
							? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
							: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
					)}
				>
					<span>{comparisonText.text}</span>
					{comparisonText.isLower ? (
						<TrendingDown className="size-3.5" />
					) : (
						<TrendingUp className="size-3.5" />
					)}
				</div>

				{/* Month Selector Component */}
				<div className="w-56 px-6 flex items-center justify-center mb-4">
					<div className="flex items-center justify-between p-1.5 w-full max-w-xs">
						<button
							type="button"
							onClick={handlePrevMonth}
							disabled={monthIndex === 0}
							className="size-9 rounded-xl flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
							aria-label="Mes anterior"
						>
							<ChevronLeft className="size-5" />
						</button>

						<AnimatePresence mode="wait">
							<motion.div
								key={activeMonthlyData.monthKey}
								initial={{ opacity: 0, y: 3 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -3 }}
								transition={{ duration: 0.15 }}
								className="flex flex-col items-center text-center select-none"
							>
								<span className="text-base font-bold text-foreground">
									{activeMonthlyData.label.split(" ")[0]}
								</span>
								<span className="text-xs font-bold text-muted-foreground">
									{activeMonthlyData.label.split(" ")[1]}
								</span>
							</motion.div>
						</AnimatePresence>

						<button
							type="button"
							onClick={handleNextMonth}
							disabled={monthIndex === mockMonthlyData.length - 1}
							className="size-9 rounded-xl flex items-center justify-center text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
							aria-label="Mes siguiente"
						>
							<ChevronRight className="size-5" />
						</button>
					</div>
				</div>

				{/* Category List */}
				<div className="w-full px-6 mb-8 flex-1 flex flex-col gap-2">
					<h3 className="text-sm font-bold text-muted-foreground sr-only">
						Categorías de Gasto
					</h3>

					<div className="flex flex-col gap-2.5">
						{categoriesWithShares.map((cat) => {
							const isSelected = selectedCategoryId === cat.id;
							const hasSelection = selectedCategoryId !== null;
							const Icon = cat.icon;

							const activeMonth = mockMonthlyData[monthIndex];
							const [year, month] = activeMonth.monthKey.split("-");
							const queryParams = `year=${year}&month=${Number(month)}`;

							return (
								<Link
									href={`/finances/${cat.id}?${queryParams}`}
									key={cat.id}
									className="w-full"
								>
									<motion.div
										className={cn(
											"w-full text-left p-2.5 rounded-2xl border bg-card shadow-xs flex items-center gap-3.5 transition-all duration-300 cursor-pointer",
											isSelected
												? "border-primary/40 ring-1 ring-primary/20 scale-[1.01]"
												: "border-border/50 hover:bg-muted/10",
											hasSelection &&
												!isSelected &&
												"opacity-60 grayscale-[10%]",
										)}
									>
										{/* Category Icon with Custom Background */}
										<div
											className="size-11 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300"
											style={{
												backgroundColor: isSelected
													? cat.color
													: `${cat.color}15`,
											}}
										>
											<Icon
												className="size-5 transition-colors duration-300"
												color={isSelected ? "#fff" : cat.color}
											/>
										</div>

										{/* Label & Amount */}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-bold text-foreground truncate">
												{cat.name}
											</p>
											<p className="text-xs text-muted-foreground mt-0.5 font-medium">
												{formatCurrency(cat.amount)}
											</p>
										</div>

										{/* Share Percentage */}
										<div className="flex flex-row items-center gap-1.5 shrink-0">
											<span className="text-sm font-bold text-foreground tabular-nums">
												{Math.round(cat.share * 100)}%
											</span>
											<span>
												<ChevronRight className="size-5 text-muted-foreground" />
											</span>
										</div>
									</motion.div>
								</Link>
							);
						})}
					</div>
				</div>
			</div>

			{/* Bottom Navigation */}
			<BottomNavbar />
		</>
	);
}

export default function FinancesPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-dvh w-dvw items-center justify-center bg-background text-muted-foreground text-sm font-semibold">
					Cargando finanzas...
				</div>
			}
		>
			<FinancesDashboard />
		</Suspense>
	);
}
