"use client";

import {
	Bell,
	ChevronRight,
	CreditCard,
	HelpCircle,
	Lock,
	LogOut,
	Settings,
	Shield,
	User,
} from "lucide-react";
import { userData } from "@/server/data";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const menuSections = [
	{
		title: "Sobre mi cuenta",
		items: [
			{ icon: User, label: "MACH Premium" },
			{ icon: CreditCard, label: "Ajustes de mi cuenta" },
			{ icon: Lock, label: "Mis validaciones" },
			{ icon: Lock, label: "Seguridad de mi cuenta" },
			{ icon: Lock, label: "Límites transaccionales" },
			{ icon: Lock, label: "Mis contratos" },
		],
	},
	{
		title: "Autorizaciones",
		items: [
			{ icon: Settings, label: "Autorización TuMACH" },
			{ icon: Shield, label: "Medio de pago alternativo" },
		],
	},
	{
		title: "Dudas y consultas",
		items: [
			{ icon: HelpCircle, label: "Centro de ayuda" },
			{ icon: HelpCircle, label: "Ayuda en línea" },
		],
	},
];

export default function Header() {
	return (
		<div className="flex py-2 px-6 items-center justify-between bg-primary text-background">
			<Sheet>
				<SheetTrigger>
					<Avatar>
						<AvatarImage
							src={userData.profile.image}
							alt={userData.profile.handle}
						/>
						<AvatarFallback>{userData.profile.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col p-0">
					<SheetHeader className="p-6">
						<div className="flex items-center gap-4">
							<Avatar className="size-12 ring-2 ring-primary/25 ring-offset-2 ring-offset-background">
								<AvatarImage
									src={userData.profile.image}
									alt={userData.profile.handle}
								/>
								<AvatarFallback className="text-lg">
									{userData.profile.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5 min-w-0">
								<SheetTitle className="text-lg font-bold truncate">
									{userData.profile.fullName}
								</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground truncate">
									{userData.profile.email}
								</SheetDescription>
							</div>
						</div>
					</SheetHeader>

					<div className="flex-1 overflow-y-auto py-2 flex flex-col gap-6 px-3">
						{menuSections.map((section) => (
							<div key={section.title} className="">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
									{section.title}
								</p>
								<ul className="space-y-0.5">
									{section.items.map((item) => (
										<li key={item.label}>
											<div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent active:bg-accent/80 transition-colors cursor-pointer">
												<item.icon className="size-4 text-primary" />
												<span className="flex-1 text-left">{item.label}</span>
											</div>
										</li>
									))}
								</ul>
							</div>
						))}

						<div className="border-t border-border p-3">
							<p className="text-xs text-muted-foreground text-center w-full">
								Versión 6.42.3
							</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<div className="flex-1 px-4">
				<p className="font-semibold text-xl">¡Hola {userData.profile.name}!</p>
			</div>
			<Button>
				<Bell className="size-6" />
			</Button>
		</div>
	);
}
