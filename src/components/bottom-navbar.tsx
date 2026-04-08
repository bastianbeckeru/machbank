"use client";

import {
	ArrowRightLeftIcon,
	CreditCardIcon,
	HomeIcon,
	PiggyBankIcon,
	QrCodeIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const bottomNavItems = [
	{ label: "Inicio", icon: HomeIcon, href: "/home" },
	{ label: "Transferencias", icon: ArrowRightLeftIcon, href: "/transfers" },
	{ label: "Pago QR", icon: QrCodeIcon, href: "/qr" },
	{ label: "Tarjetas", icon: CreditCardIcon, href: "/cards" },
	{ label: "Inversiones", icon: PiggyBankIcon, href: "/investment" },
];

export default function BottomNavbar({
	className,
	hideLabels = false,
}: {
	className?: string;
	hideLabels?: boolean;
}) {
	const pathname = usePathname();

	return (
		<div
			className={cn(
				"flex flex-row items-center justify-around px-2 pt-1 pb-2 bg-background/80 backdrop-blur-sm",
				hideLabels && "pb-4 pt-2.5",
				className,
			)}
		>
			{bottomNavItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.label}
						href={item.href}
						className={cn(
							"flex flex-col items-center gap-1 rounded-full transition-colors text-muted-foreground",
							isActive && "text-primary",
						)}
					>
						<item.icon className="size-6" />
						<span
							className={cn(
								"text-xxs font-medium leading-none",
								hideLabels && "sr-only",
							)}
						>
							{item.label}
						</span>
					</Link>
				);
			})}
		</div>
	);
}
