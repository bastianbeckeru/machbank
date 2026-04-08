"use client";

import { CreditCard, PiggyBankIcon } from "lucide-react";
import BottomNavbar from "./bottom-navbar";
import Header from "./header";
import QuickActions from "./quick-actions";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { ScrollArea } from "./ui/scroll-area";

export function BankingDashboard() {
	return (
		<div className="h-dvh w-dvw grid grid-rows-[auto_1fr_auto]">
			<Header />

			<ScrollArea className="overflow-y-auto no-scrollbar">
				<div className="pb-2 flex flex-col">
					<Carousel opts={{ align: "start" }}>
						<CarouselContent className="-ml-6 pl-6 py-2 text-background">
							<CarouselItem className="pl-6 basis-auto">
								<div className="shadow-lg shadow-indigo-500/20 h-32 w-72 flex flex-col px-4 py-3 gap-1 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600">
									<div className="flex flex-row items-center gap-2">
										<CreditCard className="size-5" />
										<p className="font-medium">Cuenta Corriente</p>
									</div>
									<p className="text-sm font-medium">Saldo disponible</p>
									<h1 className="text-4xl font-bold tracking-tight">$17.350</h1>
								</div>
							</CarouselItem>

							<CarouselItem className="pl-6 basis-auto">
								<div className="shadow-lg shadow-indigo-500/20 h-32 w-72 flex flex-col px-4 py-3 gap-1 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600">
									<div className="flex flex-row items-center gap-2">
										<CreditCard className="size-5" />
										<p className="font-medium">Tarjeta de Crédito</p>
									</div>
									<p className="text-sm font-medium">Cupo</p>
									<h1 className="text-4xl font-bold tracking-tight">
										$500.000
									</h1>
								</div>
							</CarouselItem>

							<CarouselItem className="pl-6 basis-auto">
								<div className="shadow-lg shadow-indigo-500/20 h-32 w-72 flex flex-col px-4 py-3 gap-1 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600">
									<div className="flex flex-row items-center gap-2">
										<PiggyBankIcon className="size-5" />
										<p className="font-medium">Inversiones</p>
									</div>
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

function OffersBanner({ className }: { className?: string }) {
	return (
		<Carousel opts={{ align: "start" }}>
			<CarouselContent className="px-6 text-background">
				<CarouselItem className="basis-auto">
					<div className="overflow-hidden grid grid-cols-[2fr_1fr] grid-rows-1 rounded-xl h-32 w-72">
						<div className="bg-secondary text-foreground p-4 flex flex-col justify-between">
							<p className="text-pretty text-sm">
								100% de cashback en tu primera compra con Tarjeta de Crédito
							</p>
							<div className="h-8 w-fit px-2 py-1.5 text-xs text-background rounded-md bg-primary font-semibold items-center text-center justify-center flex">
								Conócela aquí
							</div>
						</div>
						<div className="bg-gray-200"></div>
					</div>
				</CarouselItem>
				<CarouselItem className="basis-auto">
					<div className=" overflow-hidden grid grid-cols-[3fr_2fr] grid-rows-1 rounded-xl h-32 w-72">
						<div className="bg-primary text-background p-4 flex flex-col justify-between">
							<p className="text-balance text-sm">
								¡Recuerda pagar tus cuentas con MACHBANK!
							</p>
							<div className="h-8 w-fit px-2 py-1.5 text-xs text-foreground rounded-md bg-secondary font-semibold items-center text-center justify-center flex">
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
