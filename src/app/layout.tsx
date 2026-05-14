import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { EmergencyProvider } from "@/context/emergency-context";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "VITALIS AI — Futuristic Healthcare Intelligence",
  description:
    "A cinematic, premium dark healthcare intelligence experience powered by Next.js and Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${syne.variable} ${jetbrains.variable} min-h-screen bg-vitalis-void font-sans text-foreground antialiased`}
      >
        <TooltipProvider delayDuration={120}>
          <EmergencyProvider>{children}</EmergencyProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
