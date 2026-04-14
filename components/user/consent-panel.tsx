"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, X } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Platform, Provider, User } from "@/lib/types";

export function ConsentPanel({
  user,
  platform,
  provider,
  clientSessionId
}: {
  user: User;
  platform: Platform;
  provider: Provider;
  clientSessionId: string | null;
}) {
  const router = useRouter();
  const [consented, setConsented] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(approved: boolean) {
    setError("");

    startTransition(async () => {
      const consentResponse = await fetch("/api/user/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId: platform.id,
          providerId: provider.id,
          clientSessionId,
          approved
        })
      });

      if (!consentResponse.ok) {
        const body = await consentResponse.json();
        setError(body.error ?? "Unable to record consent.");
        return;
      }

      if (!approved) {
        router.push("/user/platforms");
        router.refresh();
        return;
      }

      const verifyResponse = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId: platform.id,
          providerId: provider.id,
          clientSessionId
        })
      });

      if (!verifyResponse.ok) {
        const body = await verifyResponse.json();
        setError(body.error ?? "Unable to start verification.");
        return;
      }

      const body = await verifyResponse.json();
      router.push(`/user/verification/${body.verification.id}`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-4xl">Consent to an age-band proof</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {platform.name} is asking AgeGate Proxy to confirm whether you meet the {platform.minAge}+ rule by checking a
            previously verified identity source. The client will only receive the minimum age eligibility result.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Requested by</div>
              <div className="mt-3 text-lg font-semibold text-slate-950">{platform.name}</div>
              <div className="mt-2 text-sm text-slate-500">{platform.agePolicy}</div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Trusted provider</div>
              <div className="mt-3 text-lg font-semibold text-slate-950">{provider.name}</div>
              <div className="mt-2 text-sm text-slate-500">{provider.trustLevel}</div>
            </div>
          </div>
          <Alert variant="info">
            <div className="text-sm font-semibold">What will be shared</div>
            <div className="mt-2 text-sm leading-6">
              `verified`, `age_band`, `proof_token`, provider key, and expiry only. Your full name, raw ID document details,
              and account identifiers stay inside the AgeGate/provider trust boundary.
            </div>
          </Alert>
          <label className="flex items-start gap-3 rounded-3xl border border-slate-100 p-4">
            <input
              checked={consented}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              onChange={(event) => setConsented(event.target.checked)}
              type="checkbox"
            />
            <span className="text-sm leading-6 text-slate-600">
              I authorize AgeGate Proxy to verify whether I meet the required age threshold for {platform.name}, and I
              understand that only an age-proof result will be shared.
            </span>
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending || !consented} onClick={() => submit(true)} size="lg" type="button">
              Approve and continue
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button disabled={isPending} onClick={() => submit(false)} size="lg" type="button" variant="outline">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Session context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">AgeGate account</div>
            <div className="mt-2 font-semibold text-slate-950">{user.internalRef}</div>
            <div className="mt-1">{user.email}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Linked proof source</div>
            <div className="mt-2 font-semibold text-slate-950">{provider.name}</div>
            <div className="mt-1">{provider.scopes.join(", ")}</div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-4 text-cyan-100">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">Privacy model</div>
            <div className="mt-2 leading-6">
              Identity stays with {provider.name}. AgeGate transforms the provider response into a narrow proof response.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
