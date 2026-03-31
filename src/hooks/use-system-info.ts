import { useMemo } from "react";

type OS = "ios" | "android" | "windows" | "macos" | "linux" | "unknown";

interface SystemInfo {
	os: OS;
	isMobile: boolean;
	isIOS: boolean;
	isAndroid: boolean;
}

export function useSystemInfo(): SystemInfo {
	return useMemo(() => {
		const ua = navigator.userAgent;

		const isIOS = /iphone|ipad|ipod/i.test(ua);
		const isAndroid = /android/i.test(ua);
		const isWindows = /windows/i.test(ua);
		const isMacOS = /macintosh|mac os x/i.test(ua) && !isIOS;
		const isLinux = /linux/i.test(ua) && !isAndroid;

		const os: OS = isIOS
			? "ios"
			: isAndroid
				? "android"
				: isWindows
					? "windows"
					: isMacOS
						? "macos"
						: isLinux
							? "linux"
							: "unknown";

		return {
			os,
			isMobile: isIOS || isAndroid,
			isIOS,
			isAndroid,
		};
	}, []);
}
