"use client";

import { DeleteIcon, ScanFaceIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { MobileFrame } from "@/components/MobileFrame";

export default function AuthPage() {
	const dialKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
	const pinDots = [1, 2, 3, 4] as const;
	const [pin, setPin] = useState("");
	const router = useRouter();
	const { trigger } = useWebHaptics();

	const handleKeyPress = (val: number | string) => {
		trigger("light");
		if (pin.length < 4) {
			const newPin = pin + val.toString();
			setPin(newPin);

			if (newPin.length === 4) {
				// We can handle success/error asynchronously to let the UI update the last dot first
				setTimeout(() => {
					if (newPin === "3214") {
						trigger("success");
						router.push("/home");
					} else {
						trigger("error");
						//alert("PIN Incorrecto");
						setPin("");
					}
				}, 100);
			}
		}
	};

	const handleDelete = () => {
		trigger("soft");
		setPin((prev) => prev.slice(0, -1));
	};

	return (
		<MobileFrame>
			<div className="h-dvh bg-[#6200EE] flex flex-col">
				<div className="flex-1 flex flex-col gap-16 items-center justify-center text-center">
					<span>Ingresa tu PIN</span>
					<div className="flex gap-4">
						{pinDots.map((dot, i) => {
							const isFilled = i < pin.length;
							const machLetters = ["M", "A", "C", "H"];

							return (
								<div
									key={dot}
									className="relative flex size-10 items-center justify-center font-bold text-5xl overflow-hidden"
								>
									<AnimatePresence mode="popLayout">
										{isFilled ? (
											<motion.span
												key={`letter-${dot}`}
												initial={{ y: i % 2 === 0 ? -30 : 30 }}
												animate={{ y: 0 }}
												exit={{ y: i % 2 === 0 ? -30 : 30 }}
												transition={{ duration: 0.1, ease: "easeInOut" }}
												className="absolute"
											>
												{machLetters[i]}
											</motion.span>
										) : (
											<motion.div
												key={`dot-${dot}`}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.1, ease: "easeInOut" }}
												className="absolute size-4 rounded-full border-2 border-white bg-transparent"
											/>
										)}
									</AnimatePresence>
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<h2 className="sr-only">Keyboard</h2>
					<div className="grid grid-cols-3 grid-rows-4 px-8 gap-4 justify-center">
						{dialKeys.map((n) => (
							<KeyboardKey
								key={n}
								value={n}
								onClick={() => handleKeyPress(n)}
							/>
						))}
						<KeyboardKey
							value={"Delete"}
							icon={<DeleteIcon />}
							onClick={handleDelete}
							disabled={pin.length === 0}
						/>
						<KeyboardKey value={"0"} onClick={() => handleKeyPress("0")} />
						<KeyboardKey
							value={"Face ID"}
							icon={<ScanFaceIcon />}
							onClick={() => {}}
						/>
					</div>
				</div>

				<div className="text-center py-4">
					<span>Olvidé mi PIN</span>
				</div>
			</div>
		</MobileFrame>
	);
}

function KeyboardKey({
	value,
	icon,
	onClick,
	disabled,
}: {
	value: number | string;
	icon?: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="min-w-16 min-h-16 text-center flex items-center justify-center text-3xl [&>svg]:size-8 disabled:opacity-50 transition-opacity"
		>
			{!icon && value}
			{icon}
		</button>
	);
}
