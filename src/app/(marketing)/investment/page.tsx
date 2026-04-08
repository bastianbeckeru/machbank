import {
	ChevronRight,
	HelpCircle,
	PiggyBank,
	Plus,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import BottomNavbar from "@/components/bottom-navbar";
import { userData } from "@/server/data";
import { formatCurrency } from "@/utils/numbers";

export default function InvestmentPage() {
	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 bg-primary text-background">
				<h1 className="text-xl font-bold">Mis Inversiones</h1>
				<button
					type="button"
					className="rounded-full p-1.5 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<HelpCircle className="size-6" />
				</button>
			</div>

			{/* Content */}
			<div className="overflow-y-auto no-scrollbar bg-background">
				{/* Total Balance Card */}
				<div className="px-6 pt-6 pb-4">
					<div className="rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-5 text-white shadow-lg shadow-indigo-500/20">
						<p className="text-sm font-medium text-white/80">
							Saldo total en inversiones
						</p>
						<h2 className="mt-1 text-3xl font-bold tracking-tight">
							{formatCurrency(userData.products.savings.currentValue)}
						</h2>
						<div className="mt-3 flex items-center gap-1.5 text-emerald-300">
							<TrendingUp className="size-4" />
							<span className="text-xs font-semibold">+2,53% este mes</span>
						</div>
					</div>
				</div>

				<div className="px-6 mt-4 flex flex-col gap-3">
					<p className="text-lg font-bold text-muted-foreground">
						Mis productos
					</p>

					<Link
						href="/investment/savings"
						className="shadow-md shadow-primary/5 flex items-center gap-2 rounded-xl border border-primary/10 bg-card p-4 transition-colors"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<PiggyBank className="size-6 text-primary" />
						</div>
						<div className="flex-1 flex flex-row justify-between min-w-0 ml-2">
							<p className="font-semibold">Ahorro 24/7</p>
							<p className="font-medium">
								${formatCurrency(userData.products.savings.currentValue)}
							</p>
						</div>
						<ChevronRight className="size-5 text-muted-foreground" />
					</Link>

					<button
						type="button"
						className="flex items-center gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-colors"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Plus className="size-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0 text-left">
							<p className="font-semibold text-foreground">
								Invertir en Fondos Mutuos
							</p>
							<p className="text-sm text-muted-foreground">
								Explora opciones de inversión
							</p>
						</div>
					</button>
				</div>
			</div>

			<BottomNavbar />
		</>
	);
}
