"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Code2, Lock, PlayCircle, ShieldCheck } from "lucide-react";

import { ResponsePanel } from "@/components/client-demo/response-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientDemoExperienceProps {
  initialSessionId?: string;
  initialProofToken?: string;
}

export function ClientDemoExperience({ initialSessionId, initialProofToken }: ClientDemoExperienceProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId ?? "");
  const [responsePayload, setResponsePayload] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "verified" | "denied">("idle");
  const [panelOpen, setPanelOpen] = useState(Boolean(initialProofToken));
  const [isPending, startTransition] = useTransition();

  const contentItems = useMemo(
    () => [
      "Velvet Hours: Director's Cut",
      "After Midnight Sessions",
      "Studio Noir archive access",
      "Restricted creator lounges"
    ],
    []
  );

  useEffect(() => {
    if (!initialProofToken || !initialSessionId) {
      return;
    }

    let cancelled = false;

    async function runExchange() {
      const response = await fetch("/api/client/exchange-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: initialSessionId,
          proofToken: initialProofToken
        })
      });

      const body = await response.json();
      if (cancelled) {
        return;
      }

      setSessionId(initialSessionId ?? "");
      setResponsePayload(body);
      setStatus(body.verified ? "verified" : "denied");
      setPanelOpen(true);
    }

    void runExchange();

    return () => {
      cancelled = true;
    };
  }, [initialProofToken, initialSessionId]);

  useEffect(() => {
    if (!sessionId || initialProofToken) {
      return;
    }

    let cancelled = false;

    async function loadSession() {
      const response = await fetch(`/api/client/session-status?sessionId=${sessionId}`);
      const body = await response.json();
      if (cancelled) {
        return;
      }

      if (body.session?.status === "denied") {
        setStatus("denied");
        setResponsePayload(body.session.responseSnapshot ?? { verified: false, reason: "minimum_age_not_met" });
      } else if (body.session?.status === "verified") {
        setStatus("verified");
        setResponsePayload(body.session.responseSnapshot);
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [initialProofToken, sessionId]);

  function startAgeCheck() {
    startTransition(async () => {
      const response = await fetch("/api/client/request-age-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId: "plt_nightwave"
        })
      });

      const body = await response.json();
      router.push(body.startUrl);
    });
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <Card className="overflow-hidden border-slate-800 bg-slate-950 text-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.28),transparent_26%)]" />
            <CardHeader className="relative space-y-4">
              <Badge className="w-fit border-cyan-400/30 bg-cyan-500/10 text-cyan-200" variant="info">
                NightWave client app
              </Badge>
              <CardTitle className="max-w-xl text-4xl text-white">
                Restricted lounges and mature content remain locked until AgeGate returns a valid proof.
              </CardTitle>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                This simulates a third-party client integrating the AgeGate Proxy API. NightWave requests `18+` proof, the
                user verifies through AgeGate, and the app receives only a minimal age result payload.
              </p>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">API request</div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">
                    <code>POST /api/client/request-age-check</code> with NightWave&apos;s minimum age policy and callback
                    session.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">Returned proof</div>
                  <div className="mt-3 text-sm leading-6 text-slate-300">
                    <code>verified</code>, <code>age_band</code>, <code>proof_token</code>, provider key, and expiry. No raw
                    identity leaves the provider.
                  </div>
                </div>
              </div>
              <div className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">NightWave After Dark</div>
                    <div className="mt-1 text-sm text-slate-400">Live rooms, mature archives, and creator-only unlocks.</div>
                  </div>
                  <Badge className="border-rose-400/30 bg-rose-500/10 text-rose-100" variant="danger">
                    18+ restricted
                  </Badge>
                </div>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 p-6">
                  <div className={status === "verified" ? "opacity-100" : "pointer-events-none opacity-40 blur-[2px]"}>
                    <div className="grid gap-4 md:grid-cols-2">
                      {contentItems.map((item) => (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5" key={item}>
                          <PlayCircle className="h-5 w-5 text-cyan-300" />
                          <div className="mt-4 text-base font-semibold text-white">{item}</div>
                          <div className="mt-2 text-sm text-slate-300">Unlocked after a privacy-safe 18+ proof exchange.</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {status !== "verified" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/55 p-6 text-center backdrop-blur-sm">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                        <Lock className="h-7 w-7" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-xl font-semibold text-white">Restricted content</div>
                        <div className="max-w-sm text-sm leading-6 text-slate-300">
                          Verify that you meet the 18+ policy through AgeGate Proxy before NightWave unlocks this section.
                        </div>
                      </div>
                      <Button disabled={isPending} onClick={startAgeCheck} size="lg" type="button">
                        {isPending ? "Creating session…" : "Verify age with AgeGate Proxy"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Developer view</CardTitle>
                <p className="mt-2 text-sm text-slate-500">
                  Inspect the mock API payload NightWave would receive after proof exchange.
                </p>
              </div>
              <Button onClick={() => setPanelOpen(true)} type="button" variant="outline">
                <Code2 className="h-4 w-4" />
                Open payload
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Session state</div>
                <div className="mt-3 flex items-center gap-3">
                  <Badge
                    variant={
                      status === "verified" ? "active" : status === "denied" ? "danger" : sessionId ? "pending" : "info"
                    }
                  >
                    {status === "idle" ? "Awaiting request" : status}
                  </Badge>
                  {sessionId ? <span className="font-mono text-xs text-slate-500">{sessionId}</span> : null}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Integration notes</div>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>1. NightWave creates a client session and redirects the user to AgeGate Proxy.</p>
                  <p>2. The user completes provider selection and consent inside AgeGate.</p>
                  <p>3. NightWave exchanges the returned proof token and unlocks the restricted area.</p>
                </div>
              </div>
              <div className="rounded-3xl bg-cyan-50 p-5 text-sm leading-6 text-cyan-900">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Privacy guardrail
                </div>
                Full identity data never appears in this client surface. The side panel only shows the narrow proof contract.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <ResponsePanel onClose={() => setPanelOpen(false)} open={panelOpen} payload={responsePayload} />
    </>
  );
}
