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
        setError(body.error ?? "Não foi possível registrar o consentimento.");
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
        setError(body.error ?? "Não foi possível iniciar a verificação.");
        return;
      }

      const body = await verifyResponse.json();
      router.push(`/user/verification/${body.verification.id}`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-50 text-slate-900">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Compartilhar prova de idade</CardTitle>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {platform.name} quer confirmar se você atende à regra {platform.minAge}+ usando {provider.name}.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-md border bg-slate-50">
            <div className="flex flex-col gap-1 border-t px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Plataforma</span>
              <span className="text-sm font-medium text-slate-950">{platform.name}</span>
            </div>
            <div className="flex flex-col gap-1 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Política</span>
              <span className="text-sm font-medium text-slate-950">{platform.agePolicy}</span>
            </div>
            <div className="flex flex-col gap-1 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Provedor</span>
              <span className="text-sm font-medium text-slate-950">{provider.name}</span>
            </div>
            <div className="flex flex-col gap-1 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Retorno</span>
              <span className="text-sm text-slate-950">Elegibilidade, faixa etária, token, provedor e expiração</span>
            </div>
          </div>
          <Alert variant="info">
            O LGPDetes Proxy converte a resposta do provedor em uma prova mínima. A identidade completa não sai do provedor.
          </Alert>
          <label className="flex items-start gap-3 rounded-md border border-slate-200 p-4">
            <input
              checked={consented}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              onChange={(event) => setConsented(event.target.checked)}
              type="checkbox"
            />
            <span className="text-sm leading-6 text-slate-600">
              Eu autorizo o LGPDetes Proxy a verificar se atinjo o requisito mínimo exigido por {platform.name}.
            </span>
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button disabled={isPending || !consented} onClick={() => submit(true)} type="button">
              Aprovar e continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button disabled={isPending} onClick={() => submit(false)} type="button" variant="outline">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contexto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Conta LGPDetes Proxy</div>
            <div className="mt-1 font-medium text-slate-950">{user.internalRef}</div>
            <div className="mt-1">{user.email}</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Provedor vinculado</div>
            <div className="mt-1 font-medium text-slate-950">{provider.name}</div>
            <div className="mt-1">Compatível com a política solicitada para esta sessão.</div>
          </div>
          {clientSessionId ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Sessão do cliente</div>
              <div className="mt-1 font-mono text-xs text-slate-700">{clientSessionId}</div>
            </div>
          ) : null}
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700">
            A identidade permanece com {provider.name}. O LGPDetes Proxy só entrega um contrato mínimo para a plataforma.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
