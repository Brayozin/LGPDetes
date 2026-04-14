"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
              active
                ? "bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(8,145,178,0.22)]"
                : "text-slate-600 hover:bg-white hover:text-slate-950"
            )}
            href={item.href}
            key={item.href}
          >
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", active ? "bg-white/14" : "bg-slate-100")}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
