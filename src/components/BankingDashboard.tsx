"use client";

import {
	ArrowDownToLine,
	ArrowRightLeftIcon,
	ArrowUpFromLine,
	Bell,
	CreditCard,
	Home,
	PiggyBankIcon,
	QrCode,
	Search,
	Settings,
} from "lucide-react";
import { motion } from "motion/react";

const TRANSACTIONS = [
	{
		id: 1,
		title: "Spotify Subscription",
		date: "Today, 10:42 AM",
		amount: "-$9.99",
		type: "expense",
		icon: "music",
	},
	{
		id: 2,
		title: "Salary Transfer",
		date: "Yesterday, 09:00 AM",
		amount: "+$4,250.00",
		type: "income",
		icon: "briefcase",
	},
	{
		id: 3,
		title: "Uber Rides",
		date: "Mar 29, 08:15 PM",
		amount: "-$24.50",
		type: "expense",
		icon: "car",
	},
	{
		id: 4,
		title: "Starbucks",
		date: "Mar 29, 08:30 AM",
		amount: "-$5.40",
		type: "expense",
		icon: "coffee",
	},
	{
		id: 5,
		title: "Amazon AWS",
		date: "Mar 28, 11:00 PM",
		amount: "-$12.00",
		type: "expense",
		icon: "server",
	},
];

export function BankingDashboard() {
	return (
		<div className="flex h-full w-full flex-col bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
			{/* Header */}
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex items-center justify-between px-6 pt-12 pb-6"
			>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/30">
						<span className="font-semibold text-lg">B</span>
					</div>
					<div>
						<p className="text-sm text-slate-400">Good morning,</p>
						<p className="font-medium text-slate-100">Bastian</p>
					</div>
				</div>
				<button
					type="button"
					className="relative rounded-full bg-slate-900 p-2 shadow-sm ring-1 ring-slate-800 transition-colors hover:bg-slate-800"
				>
					<Bell className="h-5 w-5 text-slate-300" />
					<span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500" />
				</button>
			</motion.header>

			{/* Main Scrollable Area */}
			<div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
				{/* Balance Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
					className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl shadow-indigo-500/20"
				>
					<div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
					<div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

					<div className="relative z-10">
						<p className="text-sm font-medium text-indigo-100 mb-1">
							Total Balance
						</p>
						<h1 className="text-4xl font-bold tracking-tight text-white mb-6">
							$12,450.00
						</h1>

						<div className="flex items-center justify-between text-sm text-indigo-100">
							<p>**** 4231</p>
							<div className="flex gap-1">
								<span className="block h-4 w-4 rounded-full bg-red-400 opacity-80" />
								<span className="block h-4 w-4 -ml-2 rounded-full bg-yellow-400 opacity-80" />
							</div>
						</div>
					</div>
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
					className="mt-8 grid grid-cols-4 gap-4"
				>
					{[
						{ label: "Send", icon: ArrowUpFromLine },
						{ label: "Receive", icon: ArrowDownToLine },
						{ label: "Scan", icon: QrCode },
						{ label: "Top Up", icon: CreditCard },
					].map((action) => (
						<div
							key={action.label}
							className="flex flex-col items-center gap-2"
						>
							<button
								type="button"
								className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-inner ring-1 ring-slate-800 transition-transform active:scale-95 hover:bg-slate-800"
							>
								<action.icon className="h-6 w-6 text-indigo-400" />
							</button>
							<span className="text-xs font-medium text-slate-400">
								{action.label}
							</span>
						</div>
					))}
				</motion.div>

				{/* Transactions */}
				<div className="mt-8">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mb-4 flex items-center justify-between"
					>
						<h2 className="text-lg font-semibold text-slate-100">
							Recent Transactions
						</h2>
						<button
							type="button"
							className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
						>
							See All
						</button>
					</motion.div>

					<div className="flex flex-col gap-4">
						{TRANSACTIONS.map((tx, i) => (
							<motion.div
								key={tx.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
								className="flex items-center justify-between rounded-2xl bg-slate-900/50 p-4 ring-1 ring-slate-800/50"
							>
								<div className="flex items-center gap-4">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ${tx.type === "income" ? "text-emerald-400" : "text-slate-400"}`}
									>
										{tx.type === "income" ? (
											<ArrowDownToLine className="h-5 w-5" />
										) : (
											<ArrowUpFromLine className="h-5 w-5" />
										)}
									</div>
									<div>
										<h3 className="font-medium text-slate-200">{tx.title}</h3>
										<p className="text-xs text-slate-500">{tx.date}</p>
									</div>
								</div>
								<div
									className={`font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-slate-200"}`}
								>
									{tx.amount}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom Navigation */}
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
				className="absolute bottom-0 left-0 right-0 flex items-center justify-around rounded-t-3xl bg-slate-950/80 p-6 backdrop-blur-xl ring-1 ring-slate-800"
			>
				<button
					type="button"
					className="flex flex-col items-center gap-1 text-indigo-400"
				>
					<Home className="h-6 w-6" />
				</button>
				<button
					type="button"
					className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-slate-300"
				>
					<ArrowRightLeftIcon className="h-6 w-6" />
				</button>
				<button
					type="button"
					className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95"
				>
					<QrCode className="h-6 w-6" />
				</button>
				<button
					type="button"
					className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-slate-300"
				>
					<CreditCard className="h-6 w-6" />
				</button>
				<button
					type="button"
					className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-slate-300"
				>
					<PiggyBankIcon className="h-6 w-6" />
				</button>
			</motion.div>
		</div>
	);
}
