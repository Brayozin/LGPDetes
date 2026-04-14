import type { ReactNode } from "react";
import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "LGPDetes Proxy",
  description:
    "Demo de verificação de idade com privacidade, construída com Next.js, TypeScript, Tailwind e rotas simuladas."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
