import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <main className="app-shell flex min-h-screen items-center px-6 py-10 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_minmax(0,560px)]">
        <section className="flex flex-col justify-between rounded-[36px] border border-white/70 bg-white/75 p-8 shadow-panel backdrop-blur-md lg:p-10">
          <div className="space-y-8">
            <AgeGateLogo />
            <Badge variant="info" className="w-fit">
              Admin and partner operations
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950">
                Operate privacy-safe age proofing without exposing full identity.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Review provider health, activate client platforms, inspect audit trails, and monitor age-proof exchange
                sessions in one mock operations console.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Identity separation",
                  copy: "Only age-band assertions leave the trust boundary.",
                  icon: <ShieldCheck className="h-5 w-5" />
                },
                {
                  title: "Auditable flows",
                  copy: "Every request, callback, exchange, and revocation is logged.",
                  icon: <Sparkles className="h-5 w-5" />
                },
                {
                  title: "Cloudflare-ready",
                  copy: "Structured for OpenNext deployment on Workers.",
                  icon: <ArrowRight className="h-5 w-5" />
                }
              ].map((item) => (
                <Card className="rounded-3xl border border-slate-100 bg-slate-50/90 p-5 shadow-none" key={item.title}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</div>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-8">
            <Link href="/">
              <Button variant="outline">Back to overview</Button>
            </Link>
            <Link href="/client-demo">
              <Button variant="ghost">See NightWave demo</Button>
            </Link>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
