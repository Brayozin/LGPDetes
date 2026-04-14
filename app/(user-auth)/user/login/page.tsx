import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserAuthPanel } from "@/components/user/user-auth-panel";
import { listPlatforms } from "@/lib/services/admin-service";
import { getCurrentUser } from "@/lib/utils/auth";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export default async function UserLoginPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = (await searchParams) ?? {};
  const nextPath = typeof params.next === "string" ? params.next : "/user/platforms";
  const platformId = typeof params.platformId === "string" ? params.platformId : undefined;
  const platform = platformId ? listPlatforms().find((entry) => entry.id === platformId) : undefined;

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="app-shell flex min-h-screen items-center px-6 py-10 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_minmax(0,560px)]">
        <section className="rounded-[36px] border border-white/70 bg-white/75 p-8 shadow-panel backdrop-blur-md lg:p-10">
          <div className="space-y-8">
            <AgeGateLogo />
            <Badge variant="info" className="w-fit">
              Privacy-preserving verification flow
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950">
                Share only age eligibility, not your full identity.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Sign in to your internal AgeGate Proxy account, choose a trusted provider, and let the platform receive only a
                narrow age proof such as `18+` instead of raw personal data.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-3xl border border-slate-100 bg-slate-50/90 p-5 shadow-none">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold text-slate-950">Separate trust boundary</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Identity proof stays with `.gov` or Gmail. The client only sees a yes/no age result and short-lived token.
                </div>
              </Card>
              <Card className="rounded-3xl border border-slate-100 bg-slate-50/90 p-5 shadow-none">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-lg font-semibold text-slate-950">Editable demo backend</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  All providers, platforms, users, and logs come from local JSON seeds and an in-memory mock service layer.
                </div>
              </Card>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/">
                <Button variant="outline">Back to overview</Button>
              </Link>
              <Link href="/client-demo">
                <Button variant="ghost">Open NightWave demo</Button>
              </Link>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <UserAuthPanel nextPath={nextPath} platformName={platform?.name} />
        </div>
      </div>
    </main>
  );
}
