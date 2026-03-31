"use client";

import { DeleteIcon, FingerprintIcon, ScanFaceIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { MobileFrame } from "@/components/MobileFrame";
import { useSystemInfo } from "@/hooks/use-system-info";

const CORRECT_PIN = "1234";
const PIN_LENGTH = 4;
const MACH_LETTERS = ["M", "A", "C", "H"] as const;
const DIAL_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const TRANSITION = { duration: 0.1, ease: "easeInOut" } as const;

export default function AuthPage() {
	const [pin, setPin] = useState("");
	const router = useRouter();
	const { trigger } = useWebHaptics();
	const { isAndroid } = useSystemInfo();

	const handleKeyPress = (val: number | string) => {
		trigger("light");

		if (pin.length >= PIN_LENGTH) return;

		const newPin = pin + val.toString();
		setPin(newPin);

		if (newPin.length === PIN_LENGTH) {
			setTimeout(() => {
				if (newPin === CORRECT_PIN) {
					trigger("success");
					router.push("/home");
				} else {
					trigger("error");
					setPin("");
				}
			}, 100);
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
					<PinDisplay pin={pin} />
				</div>

				<div className="flex flex-col gap-4">
					<h2 className="sr-only">Keyboard</h2>
					<div className="grid grid-cols-3 grid-rows-4 px-8 gap-4 justify-center">
						{DIAL_KEYS.map((n) => (
							<KeyboardKey
								key={n}
								value={n}
								onClick={() => handleKeyPress(n)}
							/>
						))}
						<KeyboardKey
							value="Biometric"
							icon={isAndroid ? <FingerprintIcon /> : <ScanFaceIcon />}
							onClick={() => {}}
						/>
						<KeyboardKey value="0" onClick={() => handleKeyPress("0")} />
						<KeyboardKey
							value="Delete"
							icon={<DeleteIcon />}
							onClick={handleDelete}
							disabled={pin.length === 0}
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

function PinDisplay({ pin }: { pin: string }) {
	return (
		<div className="flex gap-4">
			{MACH_LETTERS.map((letter, i) => {
				const isFilled = i < pin.length;
				const slideDirection = i % 2 === 0 ? -30 : 30;

				return (
					<div
						key={letter}
						className="relative flex size-10 items-center justify-center font-bold text-5xl overflow-hidden"
					>
						<AnimatePresence mode="popLayout">
							{isFilled ? (
								<motion.span
									key={`letter-${letter}`}
									initial={{ y: slideDirection }}
									animate={{ y: 0 }}
									exit={{ y: slideDirection }}
									transition={TRANSITION}
									className="absolute"
								>
									{letter}
								</motion.span>
							) : (
								<motion.div
									key={`dot-${letter}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={TRANSITION}
									className="absolute size-4 rounded-full border-2 border-white bg-transparent"
								/>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
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
			{icon ?? value}
		</button>
	);
}
