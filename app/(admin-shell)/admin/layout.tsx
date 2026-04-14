import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, Building2, KeyRound, LayoutDashboard, LogOut, ScrollText, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentAdmin } from "@/lib/utils/auth";

const items = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    href: "/admin/platforms",
    label: "Platforms",
    icon: <Building2 className="h-4 w-4" />
  },
  {
    href: "/admin/providers",
    label: "Providers",
    icon: <KeyRound className="h-4 w-4" />
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users className="h-4 w-4" />
  },
  {
    href: "/admin/logs",
    label: "Audit Logs",
    icon: <ScrollText className="h-4 w-4" />
  }
];

export const dynamic = "force-dynamic";

export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="app-shell min-h-screen p-4 lg:p-6">
      <div className="panel-grid mx-auto max-w-[1600px]">
        <aside>
          <Card className="overflow-hidden p-4 lg:sticky lg:top-6 lg:p-5">
            <div className="space-y-6">
              <AgeGateLogo compact />
              <SidebarNav items={items} />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in</div>
                <div className="mt-2 text-sm font-semibold text-slate-950">{admin.name}</div>
                <div className="mt-1 text-sm text-slate-500">{admin.email}</div>
              </div>
              <form action="/api/admin/logout" method="post">
                <Button className="w-full" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </Card>
        </aside>
        <div className="space-y-6">
          <header className="flex flex-col gap-3 rounded-[24px] border bg-white px-5 py-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Operations console</div>
              <div className="mt-1 text-sm text-slate-500">Monitor platforms, providers, and audit activity.</div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <BarChart3 className="h-4 w-4 text-primary" />
              Demo environment · mock backend state
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
