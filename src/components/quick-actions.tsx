import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const quickActionsItems = [
	{ label: "Créditos de Consumo", icon: CreditCard },
	{ label: "Paga tus cuentas", icon: CreditCard },
	{ label: "Mis Beneficios", icon: CreditCard },
	{ label: "Abona tu sueldo", icon: CreditCard },
	{ label: "bip!QR", icon: CreditCard },
	{ label: "Transferir a Terceros", icon: CreditCard },
];

export default function QuickActions({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex flex-row items-center justify-between">
				<h2 className="text-muted-foreground font-semibold">
					Accesos directos
				</h2>
				<Button className="text-xs text-primary rounded-md bg-primary/10 font-semibold">
					Ver más
				</Button>
			</div>

			<div className="grid grid-cols-3 grid-rows-2 h-52 gap-2">
				{quickActionsItems.map((item) => (
					<Button
						key={item.label}
						className="size-full p-2 rounded-lg bg-background shadow-sm flex-col items-start justify-start"
					>
						<item.icon className="size-6 text-primary" />
						<p className="text-left font-bold text-balance text-foreground">
							{item.label}
						</p>
					</Button>
				))}
			</div>
		</div>
	);
}
