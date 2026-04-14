import type { ReactNode } from "react";
import type { Metadata } from "next";

import "@/app/globals.css";
import { Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "AgeGate Proxy",
  description:
    "Privacy-preserving age verification demo built with Next.js, TypeScript, Tailwind, and mock API routes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", notoSans.variable)}>
      <body>{children}</body>
    </html>
  );
}
