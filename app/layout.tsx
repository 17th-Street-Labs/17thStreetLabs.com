import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "17th Street Labs | Agentic AI & Security", description: "Senior-led engineering, security research, and assurance for consequential agentic AI systems." };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
