import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "@/style/globals.css";
import { cn } from "@/lib/utils";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

const nunito = Nunito({
	variable: "--font-nunito",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MACHBANK",
	description: "Demo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				nunito.variable,
				"font-sans",
				nunitoSans.variable,
			)}
		>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
