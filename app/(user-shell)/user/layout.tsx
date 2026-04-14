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
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-white/70 bg-white/80 px-6 py-5 shadow-soft backdrop-blur-md">
          <div className="flex items-center gap-4">
            <AgeGateLogo />
            <div className="hidden h-10 w-px bg-slate-200 lg:block" />
            <div className="flex flex-wrap gap-2">
              <Link href="/user/platforms">
                <Button variant="ghost">
                  <ShieldCheck className="h-4 w-4" />
                  Verification flow
                </Button>
              </Link>
              <Link href="/user/connections">
                <Button variant="ghost">
                  <Link2 className="h-4 w-4" />
                  My connections
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-cyan-600" />
                {user.internalRef}
              </div>
            </div>
            <form action="/api/auth/logout" method="post">
              <Button variant="outline">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
