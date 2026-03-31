"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileFrameProps {
	children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
	const isMobile = useIsMobile();

	if (isMobile) return children;

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 selection:bg-indigo-500/30">
			{/* Background decoration */}
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
				{/* Dynamic Island / Notch Simulation (visible only on desktop framing) */}
				<div className="absolute left-1/2 top-0 z-50 hidden h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-black lg:block" />

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
