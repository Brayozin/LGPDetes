import { Code2, ShieldCheck, Wand2 } from "lucide-react";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { ClientDemoExperience } from "@/components/client-demo/client-demo-experience";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ClientDemoPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : undefined;
  const proofToken = typeof params.proofToken === "string" ? params.proofToken : undefined;

  return (
    <main className="app-shell min-h-screen px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <SectionIntro
          badge="External client platform"
          description="NightWave represents a third-party product integrating the AgeGate Proxy API to unlock restricted content only after receiving a privacy-safe age proof."
          eyebrow="NightWave"
          title="External client demo"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Client session",
              copy: "NightWave starts a mock age-check session before redirecting to AgeGate.",
              icon: <Wand2 className="h-5 w-5" />
            },
            {
              title: "Proof exchange",
              copy: "The client later trades the proof token for a small JSON result contract.",
              icon: <Code2 className="h-5 w-5" />
            },
            {
              title: "Separation of identity",
              copy: "NightWave never sees the user's raw provider identity or document data.",
              icon: <ShieldCheck className="h-5 w-5" />
            }
          ].map((item) => (
            <Card className="border-slate-100 bg-white/80" key={item.title}>
              <CardContent className="space-y-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">{item.icon}</div>
                <div className="space-y-2">
                  <div className="font-semibold text-slate-950">{item.title}</div>
                  <div className="text-sm leading-6 text-slate-600">{item.copy}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {(sessionId || proofToken) && (
          <Badge variant="info" className="w-fit">
            Returned session {sessionId ?? "pending"}
          </Badge>
        )}
        <ClientDemoExperience initialProofToken={proofToken} initialSessionId={sessionId} />
      </div>
    </main>
  );
}
