import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <main className="app-shell flex min-h-screen items-center px-6 py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="flex flex-col justify-between rounded-[28px] border bg-white p-8 shadow-soft lg:p-10">
          <div className="space-y-6">
            <AgeGateLogo />
            <Badge variant="info" className="w-fit">
              Operations console
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
                Administrative access for platforms, providers, and audit events.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                A quieter operational view for the LGPDetes Proxy MVP. Review integration status and provider activity from one place.
              </p>
            </div>
            <div className="grid gap-3 sm:max-w-lg">
              {[
                {
                  title: "Minimal proof exchange",
                  copy: "Only age-band assertions leave the trust boundary.",
                  icon: <ShieldCheck className="h-5 w-5" />
                },
                {
                  title: "Auditable events",
                  copy: "Requests, callbacks, exchanges, and revocations remain visible.",
                  icon: <CheckCircle2 className="h-5 w-5" />
                }
              ].map((item) => (
                <Card className="bg-slate-50" key={item.title}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-8">
            <Link href="/">
              <Button variant="outline">Back to overview</Button>
            </Link>
            <Link href="/client-demo">
              <Button variant="ghost">NightWave demo</Button>
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
