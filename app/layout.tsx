import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "17th Street Labs | AI Engineering, Evals & Security",
  description: "Founder-led AI product engineering, evaluation systems, and offensive and defensive AI security for consequential systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
