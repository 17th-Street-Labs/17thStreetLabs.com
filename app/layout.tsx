import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "17th Street Labs Website Concepts", description: "Five website directions for 17th Street Labs, an agentic AI and security consultancy." };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
