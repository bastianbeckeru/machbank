"use client";

import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileFrameProps {
	children: ReactNode;
}

function StatusBar() {
	const [time, setTime] = useState("");

	useEffect(() => {
		const update = () => {
			const now = new Date();
			setTime(
				now.toLocaleTimeString([], {
					hour: "numeric",
					minute: "2-digit",
				}),
			);
		};
		update();
		const id = setInterval(update, 10_000);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="relative bg-primary z-50 flex w-full items-center justify-between px-7 pt-3.5 pb-1.5">
			{/* Time */}
			<span className="text-[14px] font-semibold leading-none text-white w-16">
				{time}
			</span>

			{/* Spacer for Dynamic Island */}
			<div className="w-28" />

			{/* Right icons */}
			<div className="flex items-center gap-1.5 w-16 justify-end">
				{/* Signal bars */}
				<svg
					width="17"
					height="12"
					viewBox="0 0 17 12"
					fill="none"
					role="img"
					aria-label="Signal strength"
				>
					<title>Signal strength</title>
					<rect x="0" y="9" width="3" height="3" rx="0.5" fill="white" />
					<rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="white" />
					<rect x="9" y="3" width="3" height="9" rx="0.5" fill="white" />
					<rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white" />
				</svg>

				{/* WiFi */}
				<svg
					width="16"
					height="12"
					viewBox="0 0 16 12"
					fill="white"
					role="img"
					aria-label="WiFi"
				>
					<title>WiFi</title>
					<path d="M8 10.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z" />
					<path
						d="M4.93 8.56a4.33 4.33 0 0 1 6.14 0"
						stroke="white"
						strokeWidth="1.4"
						strokeLinecap="round"
						fill="none"
					/>
					<path
						d="M2.34 5.97a7.99 7.99 0 0 1 11.32 0"
						stroke="white"
						strokeWidth="1.4"
						strokeLinecap="round"
						fill="none"
					/>
					<path
						d="M0 3.4A11.36 11.36 0 0 1 16 3.4"
						stroke="white"
						strokeWidth="1.4"
						strokeLinecap="round"
						fill="none"
					/>
				</svg>

				{/* Battery */}
				<svg
					width="27"
					height="12"
					viewBox="0 0 27 12"
					fill="none"
					role="img"
					aria-label="Battery"
				>
					<title>Battery</title>
					<rect
						x="0.5"
						y="0.5"
						width="22"
						height="11"
						rx="2.5"
						stroke="white"
						strokeOpacity="0.35"
					/>
					<rect x="2" y="2" width="19" height="8" rx="1.5" fill="white" />
					<path d="M24 4v4a2 2 0 0 0 0-4Z" fill="white" fillOpacity="0.4" />
				</svg>
			</div>
		</div>
	);
}

export function MobileFrame({ children }: MobileFrameProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <>{children}</>;
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-[20%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute top-[60%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-purple-500/10 blur-3xl" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="relative z-10 flex h-[852px] w-full max-w-sm flex-col overflow-hidden rounded-[40px] bg-black shadow-2xl shadow-indigo-500/20 ring-1 ring-slate-800 lg:h-[852px] lg:rounded-[55px] lg:border-[14px] lg:border-slate-900 lg:shadow-black/50"
			>
				{/* Dynamic Island */}
				<div className="absolute left-1/2 top-0 z-60 hidden h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-black lg:block" />

				{/* Status Bar */}
				<div className="relative z-50 bg-slate-950">
					<StatusBar />
				</div>

				{/* Content Area */}
				<div className="relative flex-1 bg-slate-950 no-scrollbar overflow-hidden">
					{children}
				</div>

				{/* Home Indicator (iOS style) */}
				<div className="absolute bottom-2 left-1/2 z-50 h-1.5 w-32 -translate-x-1/2 rounded-full bg-slate-400/50" />
			</motion.div>
		</div>
	);
}
