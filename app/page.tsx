import Link from "next/link";
import { ArrowRight, DatabaseZap, LockKeyhole, ShieldCheck, Workflow } from "lucide-react";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="app-shell min-h-screen px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="overflow-hidden rounded-[40px] border border-white/70 bg-white/75 px-6 py-8 shadow-panel backdrop-blur-md lg:px-10 lg:py-12">
          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <AgeGateLogo />
              <Badge variant="info" className="w-fit">
                Privacy-preserving age verification intermediary
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 lg:text-6xl">
                  AgeGate Proxy separates identity from age proof for regulated digital experiences.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-600">
                  A company asks for an age check. The user chooses a trusted provider like `.gov` or Gmail. AgeGate validates
                  the provider response, strips unnecessary identity details, and returns only the narrow result the client
                  needs, such as <code>verified: true</code> and <code>age_band: &quot;18+&quot;</code>.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/client-demo">
                  <Button size="lg">
                    Launch client demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/user/login">
                  <Button size="lg" variant="outline">
                    Walk the user flow
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button size="lg" variant="ghost">
                    Open admin console
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="overflow-hidden border-slate-100 bg-slate-950 text-slate-50">
              <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl text-white">How the intermediary model works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Client platform requests a minimum age proof.",
                  "User authenticates with an internal AgeGate account.",
                  "User chooses `.gov` or Gmail as the trusted source.",
                  "AgeGate receives and validates the provider callback.",
                  "Client gets only verified status, age band, proof token, and expiry."
                ].map((item, index) => (
                  <div className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4" key={item}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-cyan-200">
                      0{index + 1}
                    </div>
                    <div className="flex-1 text-sm leading-6 text-slate-300">{item}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Privacy-first proof contract",
              copy: "The client sees only the result needed to enforce policy. Full identity stays upstream.",
              icon: <LockKeyhole className="h-5 w-5" />
            },
            {
              title: "Editable JSON-backed seeds",
              copy: "Platforms, providers, users, logs, and verification history live in local JSON for fast edits.",
              icon: <DatabaseZap className="h-5 w-5" />
            },
            {
              title: "Mock full-stack MVP",
              copy: "Route Handlers provide all required backend endpoints without a separate server.",
              icon: <Workflow className="h-5 w-5" />
            },
            {
              title: "Cloudflare-ready structure",
              copy: "The app is organized for OpenNext deployment to Workers while avoiding Node-specific runtime dependencies.",
              icon: <ShieldCheck className="h-5 w-5" />
            }
          ].map((item) => (
            <Card className="border-slate-100 bg-white/80" key={item.title}>
              <CardContent className="space-y-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">{item.icon}</div>
                <div>
                  <div className="font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
