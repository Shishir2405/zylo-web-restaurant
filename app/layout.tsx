import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zylo Restaurant",
  description: "Restaurant operations console",
  generator: "v0.dev",
};

import ReduxProvider from "@/providers/redux";
import { TokenProvider } from "./providers/TokenProvider";
import NetworkStatusPopup from "@/components/networkStatusPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        {/* Google Maps + Places. The previous key here had API
            restrictions that excluded the Maps JS / Places JS targets
            (ApiTargetBlockedMapError). Using the same key as ZyloHop /
            ZyloServe (project 447662433993). loading=async silences the
            "loaded directly without loading=async" perf warning. */}
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB-T2GimiJHK0Ndb9RV02CUgIoR4dMU7q0&libraries=places&loading=async"
          async
        ></script>
      </head>
      <body>
        <ReduxProvider>
          <TokenProvider>
            <NetworkStatusPopup />
            {children}
          </TokenProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
