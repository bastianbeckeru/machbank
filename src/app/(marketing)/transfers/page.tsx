import {
	ChevronRight,
	GlobeIcon,
	HandshakeIcon,
	HelpCircle,
	LandmarkIcon,
	LinkIcon,
	QrCodeIcon,
} from "lucide-react";
import Link from "next/link";
import BottomNavbar from "@/components/bottom-navbar";
import { Button } from "@/components/ui/button";
import { userData } from "@/server/data";
import { formatCurrency } from "@/utils/numbers";

export default function TransfersPage() {
	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 bg-primary text-background">
				<h1 className="text-xl font-bold">Transferencias</h1>
				<button
					type="button"
					className="rounded-full p-1.5 transition-colors hover:bg-white/10 active:bg-white/20"
				>
					<HelpCircle className="size-6" />
				</button>
			</div>

			<div className="overflow-y-auto no-scrollbar bg-background">
				<div className="px-6 pt-6 pb-4">
					<div className="flex-row flex items-center justify-between rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg shadow-indigo-500/20">
						<p className="text-base font-medium text-white/80">
							Saldo disponible
						</p>
						<h2 className="mt-1 text-xl font-bold tracking-tight">
							{formatCurrency(29000)}
						</h2>
					</div>
				</div>

				<div className="px-6 mt-4 flex flex-col gap-3">
					<h2 className="text-lg font-bold text-muted-foreground">
						Transferir
					</h2>

					<Link
						href="/home"
						className="shadow-md shadow-primary/5 flex items-center gap-2 rounded-xl border border-primary/10 bg-card p-4 transition-colors"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<HandshakeIcon className="size-6 text-primary" />
						</div>
						<div className="flex-1 flex flex-row justify-between min-w-0 ml-2">
							<p className="font-semibold">A Machers</p>
						</div>
						<ChevronRight className="size-5 text-muted-foreground" />
					</Link>
					<Link
						href="/home"
						className="shadow-md shadow-primary/5 flex items-center gap-2 rounded-xl border border-primary/10 bg-card p-4 transition-colors"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<LandmarkIcon className="size-6 text-primary" />
						</div>
						<div className="flex-1 flex flex-row justify-between min-w-0 ml-2">
							<p className="font-semibold">A otros bancos</p>
						</div>
						<ChevronRight className="size-5 text-muted-foreground" />
					</Link>
					<Link
						href="/home"
						className="shadow-md shadow-primary/5 flex items-center gap-2 rounded-xl border border-primary/10 bg-card p-4 transition-colors"
					>
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<GlobeIcon className="size-6 text-primary" />
						</div>
						<div className="flex-1 flex flex-row justify-between min-w-0 ml-2">
							<p className="font-semibold">Al extranjero</p>
						</div>
						<ChevronRight className="size-5 text-muted-foreground" />
					</Link>
				</div>

				<div className="px-6 mt-8 flex flex-col gap-3">
					<h2 className="text-lg font-bold text-muted-foreground">Cobrar</h2>

					<div className="grid grid-cols-3 grid-rows-1 gap-4">
						<Button
							variant="outline"
							className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
						>
							<HandshakeIcon className="size-6 text-primary" />
							<p className="font-semibold text-balance text-left">A Machers</p>
						</Button>
						<Button
							variant="outline"
							className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
						>
							<LinkIcon className="size-6 text-primary" />
							<p className="font-semibold text-balance text-left">
								Generar enlace
							</p>
						</Button>
						<Button
							variant="outline"
							className="flex-col justify-start border-primary/10 items-start text-foreground shadow-md shadow-primary/5 py-3 rounded-lg font-semibold h-full"
						>
							<QrCodeIcon className="size-6 text-primary" />
							<p className="font-semibold text-balance text-left">Generar QR</p>
						</Button>
					</div>
				</div>
			</div>

			<BottomNavbar />
		</>
	);
}
