"use client";

import {
	ArrowRightLeftIcon,
	Bell,
	CreditCard,
	Home,
	PiggyBankIcon,
	QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { ScrollArea } from "./ui/scroll-area";

const quickActionsItems = [
	{ label: "Créditos de Consumo", icon: CreditCard },
	{ label: "Tarjeta de Crédito", icon: CreditCard },
	{ label: "MACH Premium", icon: CreditCard },
	{ label: "Mis Beneficios", icon: CreditCard },
	{ label: "bip!QR", icon: CreditCard },
	{ label: "Transferir a Terceros", icon: CreditCard },
];

const bottomNavItems = [
	{ label: "Inicio", icon: Home },
	{ label: "Transferir", icon: ArrowRightLeftIcon },
	//{ label: "Pago QR", icon: QrCode },
	{ label: "Tarjetas", icon: CreditCard },
	{ label: "Inversiones", icon: PiggyBankIcon },
];

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
		<div className="h-dvh w-dvw grid grid-rows-[auto_1fr_auto]">
			<Header />

			<ScrollArea className="overflow-y-auto no-scrollbar">
				<div className="pb-2 flex flex-col">
					<Carousel opts={{ align: "start" }}>
						<CarouselContent className="px-6 h-40 py-2 text-background">
							<CarouselItem className="basis-auto">
								<div className="shadow-lg shadow-indigo-500/20 h-32 w-72 flex flex-col px-4 py-3 gap-1 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600">
									<p className="font-medium">Cuenta Corriente</p>
									<p className="text-sm font-medium">Saldo disponible</p>
									<h1 className="text-4xl font-bold tracking-tight">$17.350</h1>
								</div>
							</CarouselItem>

							<CarouselItem className="basis-auto">
								<div className="shadow-lg shadow-indigo-500/20 h-32 w-72 flex flex-col px-4 py-3 gap-1 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600">
									<p className="font-medium">Inversiones</p>
									<p className="text-sm font-medium">Total inversiones</p>
									<h1 className="text-4xl font-bold tracking-tight">
										$950.000
									</h1>
								</div>
							</CarouselItem>
						</CarouselContent>
					</Carousel>

					<div className="px-6 flex flex-col gap-2 text-background">
						<div className="bg-primary rounded-xl h-16 flex flex-row items-center justify-between px-4 py-2">
							<div className="flex flex-col gap-0.5">
								<p className="text-sm">Tarjeta de Crédito</p>
								<p className="font-bold text-xl">Pídela aquí</p>
							</div>
							<div>
								<CreditCard className="size-9" />
							</div>
						</div>

						<div className="hidden bg-primary rounded-lg h-16 flex-row items-center justify-between px-4 py-2">
							<div className="flex flex-col gap-0.5">
								<p className="text-sm">MACH Premium</p>
								<p className="font-bold text-xl">Conócela aquí</p>
							</div>
							<div>
								<CreditCard className="size-9" />
							</div>
						</div>
					</div>

					<QuickActions className="px-6 my-6" />

					<OffersBanner />
				</div>
			</ScrollArea>

			<BottomNavbar />
		</div>
	);
}

function Header() {
	return (
		<div className="flex py-2 px-6 items-center justify-between bg-primary text-background">
			<Avatar>
				<AvatarImage
					src="https://github.com/bastianbeckeru.png"
					alt="@bastianbeckeru"
				/>
				<AvatarFallback>B</AvatarFallback>
			</Avatar>
			<div className="flex-1 px-4">
				<p className="font-semibold text-xl">¡Hola Bastián!</p>
			</div>
			<Button>
				<Bell className="size-6" />
			</Button>
		</div>
	);
}

function BottomNavbar({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex flex-row items-center justify-around rounded-t-3xl px-2 py-2 bg-background",
				className,
			)}
		>
			{bottomNavItems.map((item) => (
				<Button
					key={item.label}
					variant="ghost"
					className={cn("text-muted-foreground p-4 rounded-full")}
				>
					<item.icon className="size-6" />
					<span className="sr-only">{item.label}</span>
				</Button>
			))}
		</div>
	);
}

function QuickActions({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex flex-row items-center justify-between">
				<h2 className="text-foreground">¿Qué quieres hacer hoy?</h2>
				<Button className="text-xs text-primary rounded-md bg-primary/15 font-semibold">
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

function OffersBanner({ className }: { className?: string }) {
	return (
		<Carousel opts={{ align: "start" }}>
			<CarouselContent className="px-6 text-background">
				<CarouselItem className="basis-auto">
					<div className="overflow-hidden grid grid-cols-[2fr_1fr] grid-rows-1 rounded-xl h-32 w-72">
						<div className="bg-green-500 p-4 flex flex-col justify-between">
							<p className="text-pretty text-background text-sm">
								100% de cashback en tu primera compra con Tarjeta de Crédito
							</p>
							<div className="h-8 w-fit px-2 py-1.5 text-xs text-background rounded-md bg-primary font-semibold">
								Conócela aquí
							</div>
						</div>
						<div className="bg-gray-200"></div>
					</div>
				</CarouselItem>
				<CarouselItem className="basis-auto">
					<div className=" overflow-hidden grid grid-cols-[3fr_2fr] grid-rows-1 rounded-xl h-32 w-72">
						<div className="bg-primary p-4 flex flex-col justify-between">
							<p className="text-balance text-background text-sm">
								¡Recuerda pagar tus cuentas con MACHBANK!
							</p>
							<div className="h-8 w-fit px-2 py-1.5 text-xs text-foreground rounded-md bg-green-500 font-semibold">
								Descubre aquí
							</div>
						</div>
						<div className="bg-gray-200"></div>
					</div>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	);
}
