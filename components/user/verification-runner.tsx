"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldAlert } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { VerificationRecord } from "@/lib/types";
import { formatVerificationReason, formatVerificationStatus, maskToken } from "@/lib/utils/format";

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
        label: "Conectando ao provedor",
        active: verification.status === "provider_pending" || verification.status === "validating" || verification.status === "completed"
      },
      {
        label: "Validando a resposta assinada",
        active: verification.status === "validating" || verification.status === "completed"
      },
      {
        label: "Gerando o token de prova mínima",
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
  const statusLabel = formatVerificationStatus(verification.status);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-900">
            {verification.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : verification.status === "failed" ? (
              <ShieldAlert className="h-5 w-5" />
            ) : (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}
          </div>
          <CardTitle className="text-xl">
            {verification.status === "completed"
              ? `Validado como ${verification.ageBand}`
              : verification.status === "failed"
                ? "Não foi possível concluir a verificação"
                : "Verificação em andamento"}
          </CardTitle>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {verification.status === "completed"
              ? "Só a sua elegibilidade etária foi compartilhada com a plataforma solicitante. A identidade completa continua com o provedor."
              : verification.status === "failed"
                ? "A troca da prova não gerou um resultado válido de faixa etária para esta solicitação."
                : "O LGPDetes Proxy está validando a resposta do provedor e gerando o token mínimo para a plataforma."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} />
          <div className="overflow-hidden rounded-md border">
            {steps.map((step) => (
              <div
                className={`border-t px-4 py-3 text-sm first:border-t-0 ${step.active ? "bg-slate-50 text-slate-950" : "text-slate-500"}`}
                key={step.label}
              >
                {step.label}
              </div>
            ))}
          </div>
          {verification.status === "failed" ? (
            <Alert variant="danger">
              <div className="font-semibold">Motivo</div>
              <div className="mt-2">{formatVerificationReason(verification.reason)}</div>
            </Alert>
          ) : null}
          {verification.status === "completed" && verification.proofToken ? (
            <Alert variant="success">
              <div className="font-semibold">Token de prova emitido</div>
              <div className="mt-2 font-mono text-sm">{maskToken(verification.proofToken)}</div>
            </Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {verification.status === "completed" ? (
              <Link href={continueHref}>
                <Button>
                  {verification.clientSessionId ? "Voltar para NightWave" : "Ver acessos"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
            {verification.status === "failed" ? (
              <Link href={`/user/providers?platformId=${verification.platformId}${verification.clientSessionId ? `&clientSessionId=${verification.clientSessionId}` : ""}`}>
                <Button variant="outline">
                  Escolher outro provedor
                </Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Plataforma</div>
            <div className="mt-1 font-medium text-slate-950">{verification.platform?.name ?? verification.platformId}</div>
            <div className="mt-1">Idade exigida: {verification.requestedMinAge}+</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Provedor</div>
            <div className="mt-1 font-medium text-slate-950">{verification.provider?.name ?? verification.providerId}</div>
            <div className="mt-1">Modo: troca intermediada de prova</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <span>Status</span>
              <span className="font-medium text-slate-950">{statusLabel}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span>Resultado</span>
              <span className="font-medium text-slate-950">{verification.ageBand ?? formatVerificationReason(verification.reason)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span>ID</span>
              <code className="font-mono text-xs text-slate-700">{verification.id}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
