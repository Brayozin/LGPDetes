import type { ReactNode } from "react";
import Link from "next/link";
import { Link2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/utils/auth";

export const dynamic = "force-dynamic";

export default async function UserShellLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/user/login");
  }

  return (
    <div className="app-shell min-h-screen px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-6">
        <header className="rounded-lg border bg-white px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <AgeGateLogo />
              <div className="hidden h-8 w-px bg-slate-200 lg:block" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                <Link href="/user/platforms">
                  <Button variant="ghost">
                    <ShieldCheck className="h-4 w-4" />
                    Verificação
                  </Button>
                </Link>
                <Link href="/user/connections">
                  <Button variant="ghost">
                    <Link2 className="h-4 w-4" />
                    Acessos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />
                  {user.internalRef}
                </div>
              </div>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
