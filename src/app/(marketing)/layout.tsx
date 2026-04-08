import { MobileFrame } from "@/components/MobileFrame";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MobileFrame>
			<div className="h-dvh w-dvw grid grid-rows-[auto_1fr_auto]">
				{children}
			</div>
		</MobileFrame>
	);
}
