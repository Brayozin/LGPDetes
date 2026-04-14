"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldAlert } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { VerificationRecord } from "@/lib/types";
import { maskToken } from "@/lib/utils/format";

type VerificationStatusPayload = VerificationRecord & {
  platform?: { name: string; minAge: number } | null;
  provider?: { name: string; key: string } | null;
};

const statusToProgress = {
  created: 10,
  provider_pending: 35,
  validating: 72,
  completed: 100,
  failed: 100,
  revoked: 100,
  expired: 100
} as const;

export function VerificationRunner({ initialVerification }: { initialVerification: VerificationStatusPayload }) {
  const [verification, setVerification] = useState(initialVerification);
  const [busy, setBusy] = useState(false);

  const progress = statusToProgress[verification.status] ?? 0;

  const steps = useMemo(
    () => [
      {
        label: "Connecting to provider",
        active: verification.status === "provider_pending" || verification.status === "validating" || verification.status === "completed"
      },
      {
        label: "Validating signed response",
        active: verification.status === "validating" || verification.status === "completed"
      },
      {
        label: "Generating privacy-safe age token",
        active: verification.status === "completed"
      }
    ],
    [verification.status]
  );

  useEffect(() => {
    if (busy) {
      return;
    }

    if (verification.status === "provider_pending") {
      setBusy(true);
      const timer = window.setTimeout(async () => {
        const response = await fetch(`/api/verification/${verification.id}/callback/provider`, {
          method: "POST"
        });
        const body = await response.json();
        setVerification(body.verification);
        setBusy(false);
      }, 1200);

      return () => window.clearTimeout(timer);
    }

    if (verification.status === "validating") {
      setBusy(true);
      const timer = window.setTimeout(async () => {
        const response = await fetch(`/api/verification/${verification.id}/finalize`, {
          method: "POST"
        });
        const body = await response.json();
        setVerification(body.verification);
        setBusy(false);
      }, 1400);

      return () => window.clearTimeout(timer);
    }
  }, [busy, verification.id, verification.status]);

  const continueHref =
    verification.clientSessionId && verification.proofToken
      ? `/client-demo?sessionId=${verification.clientSessionId}&proofToken=${verification.proofToken}`
      : "/user/connections";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500" />
        <CardHeader className="space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[28px] bg-cyan-50 text-cyan-700">
            {verification.status === "completed" ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : verification.status === "failed" ? (
              <ShieldAlert className="h-8 w-8" />
            ) : (
              <LoaderCircle className="h-8 w-8 animate-spin" />
            )}
          </div>
          <CardTitle className="text-4xl">
            {verification.status === "completed"
              ? `You have been verified as ${verification.ageBand}`
              : verification.status === "failed"
                ? "Verification could not be completed"
                : "Verification in progress"}
          </CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {verification.status === "completed"
              ? "Only your age eligibility was shared with the requesting platform. Your full identity remains with the external provider."
              : verification.status === "failed"
                ? "The proof exchange did not produce a valid age-band result for this request."
                : "AgeGate Proxy is simulating the provider callback, validating the proof, and reducing the result to a privacy-safe token."}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} />
          <div className="grid gap-3">
            {steps.map((step) => (
              <div
                className={`rounded-2xl border p-4 text-sm ${step.active ? "border-cyan-100 bg-cyan-50 text-cyan-900" : "border-slate-100 bg-slate-50 text-slate-500"}`}
                key={step.label}
              >
                {step.label}
              </div>
            ))}
          </div>
          {verification.status === "failed" ? (
            <Alert variant="danger">
              <div className="font-semibold">Reason</div>
              <div className="mt-2 capitalize">{verification.reason?.replaceAll("_", " ")}</div>
            </Alert>
          ) : null}
          {verification.status === "completed" && verification.proofToken ? (
            <Alert variant="success">
              <div className="font-semibold">Proof token issued</div>
              <div className="mt-2 font-mono text-sm">{maskToken(verification.proofToken)}</div>
            </Alert>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {verification.status === "completed" ? (
              <Link href={continueHref}>
                <Button size="lg">
                  {verification.clientSessionId ? "Return to NightWave" : "View my connections"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
            {verification.status === "failed" ? (
              <Link href={`/user/providers?platformId=${verification.platformId}&clientSessionId=${verification.clientSessionId ?? ""}`}>
                <Button size="lg" variant="outline">
                  Choose another provider
                </Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Verification session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Platform</div>
            <div className="mt-2 font-semibold text-slate-950">{verification.platform?.name ?? verification.platformId}</div>
            <div className="mt-1">Required age: {verification.requestedMinAge}+</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Provider</div>
            <div className="mt-2 font-semibold text-slate-950">{verification.provider?.name ?? verification.providerId}</div>
            <div className="mt-1">Mode: intermediary proof exchange</div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-6 text-cyan-100">
            {JSON.stringify(
              {
                id: verification.id,
                status: verification.status,
                verified: verification.verified,
                age_band: verification.ageBand,
                reason: verification.reason
              },
              null,
              2
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
