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
    <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={cn(
              "flex min-w-fit items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-[background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] lg:min-w-0",
              active
                ? "border-blue-100 bg-blue-50 text-blue-700"
                : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950"
            )}
            href={item.href}
            key={item.href}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                active ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"
              )}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
