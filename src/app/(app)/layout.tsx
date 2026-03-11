import { Inter } from "next/font/google";
import "./globals.css";
import { getExposedRuntimeEnv } from "../../runtimeEnv";
import { ClientLayout } from "./ClientLayout";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ClientLayout env={getExposedRuntimeEnv()}>{children}</ClientLayout>
			</body>
		</html>
	);
}
