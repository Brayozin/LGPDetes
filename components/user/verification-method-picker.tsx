"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProviderMark } from "@/components/providers/provider-mark";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils/cn";
import { formatVerificationReason } from "@/lib/utils/format";
import type { ProviderKey } from "@/lib/types";

type ProviderOption = {
  id: string;
  key: ProviderKey;
  name: string;
  status: "active" | "degraded" | "inactive";
  linkedDisplayName?: string | null;
};

type Phase = "confirm" | "consent" | "provider" | "finalizing" | "success" | "failure";

const phaseOrder: Record<Exclude<Phase, "confirm" | "failure">, number> = {
  consent: 1,
  provider: 2,
  finalizing: 3,
  success: 4
};

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function VerificationMethodPicker({
  platformId,
  platformName,
  agePolicy,
  clientSessionId,
  providers
}: {
  platformId: string;
  platformName: string;
  agePolicy: string;
  clientSessionId?: string;
  providers: ProviderOption[];
}) {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("confirm");
  const [consented, setConsented] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [proofToken, setProofToken] = useState<string | null>(null);

  const providerLabel =
    selectedProvider?.key === "gov" ? "gov.br" : selectedProvider?.key === "gmail" ? "Gmail" : "provedor";

  function openProvider(provider: ProviderOption) {
    setSelectedProvider(provider);
    setOpen(true);
    setPhase("confirm");
    setConsented(true);
    setBusy(false);
    setError("");
    setProofToken(null);
  }

  function closeModal() {
    if (busy) {
      return;
    }

    setOpen(false);
    setSelectedProvider(null);
    setPhase("confirm");
    setError("");
    setProofToken(null);
  }

  async function returnFromModal(success: boolean, nextProofToken?: string | null) {
    const href = clientSessionId
      ? `/client-demo?sessionId=${clientSessionId}${success && nextProofToken ? `&proofToken=${nextProofToken}` : ""}`
      : "/user/connections";

    router.push(href);
    router.refresh();
  }

  async function denyConsent() {
    if (!selectedProvider || busy) {
      return;
    }

    try {
      await fetch("/api/user/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId,
          providerId: selectedProvider.id,
          clientSessionId,
          approved: false
        })
      });
    } finally {
      closeModal();
    }
  }

  async function startVerification() {
    if (!selectedProvider || busy || !consented) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      setPhase("consent");
      const consentResponse = await fetch("/api/user/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId,
          providerId: selectedProvider.id,
          clientSessionId,
          approved: true
        })
      });

      if (!consentResponse.ok) {
        const body = await consentResponse.json();
        throw new Error(body.error ?? "Não foi possível registrar o consentimento.");
      }

      await wait(350);
      setPhase("provider");

      const verifyResponse = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platformId,
          providerId: selectedProvider.id,
          clientSessionId
        })
      });

      const verifyBody = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyBody.error ?? "Não foi possível iniciar a verificação.");
      }

      if (verifyBody.verification.status === "failed") {
        setPhase("failure");
        setError(formatVerificationReason(verifyBody.verification.reason));
        return;
      }

      await wait(600);
      const callbackResponse = await fetch(`/api/verification/${verifyBody.verification.id}/callback/provider`, {
        method: "POST"
      });
      const callbackBody = await callbackResponse.json();

      if (!callbackResponse.ok) {
        throw new Error(callbackBody.error ?? "Não foi possível consultar o provedor.");
      }

      await wait(600);
      setPhase("finalizing");

      const finalizeResponse = await fetch(`/api/verification/${verifyBody.verification.id}/finalize`, {
        method: "POST"
      });
      const finalizeBody = await finalizeResponse.json();

      if (!finalizeResponse.ok) {
        throw new Error(finalizeBody.error ?? "Não foi possível concluir a verificação.");
      }

      if (finalizeBody.verification.status !== "completed") {
        setPhase("failure");
        setError(formatVerificationReason(finalizeBody.verification.reason));
        return;
      }

      setProofToken(finalizeBody.verification.proofToken ?? null);
      setPhase("success");
      setBusy(false);
      await wait(900);
      await returnFromModal(true, finalizeBody.verification.proofToken ?? null);
      return;
    } catch (caughtError) {
      setPhase("failure");
      setError(caughtError instanceof Error ? caughtError.message : "Não foi possível concluir a verificação.");
    } finally {
      setBusy(false);
    }
  }

  const steps = [
    { label: "Consentimento", order: 1 },
    { label: `Conferindo ${providerLabel}`, order: 2 },
    { label: "Emitindo prova", order: 3 }
  ];

  return (
    <>
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="border-b px-5 py-5">
            <div className="text-sm text-slate-500">Plataforma solicitante</div>
            <div className="mt-1 text-xl font-semibold text-slate-950">{platformName}</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              {agePolicy}. Escolha como você quer verificar sua idade.
            </div>
          </div>
          <div>
            {providers.map((provider) => (
              <button
                className="flex w-full items-center justify-between gap-4 border-t px-5 py-4 text-left transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                disabled={provider.status === "inactive"}
                key={provider.id}
                onClick={() => openProvider(provider)}
                type="button"
              >
                <div className="flex items-center gap-4">
                  <ProviderMark providerKey={provider.key} variant="wordmark" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-950">
                      {provider.key === "gov" ? "Verificar com gov.br" : "Verificar com Gmail"}
                    </div>
                    <div className="text-sm text-slate-500">
                      {provider.linkedDisplayName
                        ? `Já vinculado como ${provider.linkedDisplayName}`
                        : "O vínculo com este método será criado no primeiro uso."}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
          <div className="border-t px-5 py-4 text-sm text-slate-500">
            O cliente recebe apenas a faixa etária, o token da prova e a validade.
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-slate-500">
          {clientSessionId ? `Ao concluir, você volta para ${platformName}.` : "Ao concluir, o acesso fica disponível na sua conta."}
        </p>
      </div>

      <Modal
        className="max-w-md"
        description={selectedProvider ? `${platformName} exige ${agePolicy}.` : undefined}
        hideClose={busy}
        onClose={closeModal}
        open={open}
        title={selectedProvider ? `Verificar com ${providerLabel}` : "Verificação"}
      >
        {selectedProvider ? (
          <div className="space-y-4">
            {(phase === "confirm" || phase === "failure") && (
              <>
                <div className="flex justify-center">
                  <ProviderMark className="h-12" providerKey={selectedProvider.key} variant="wordmark" />
                </div>
                <div className="rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  O LGPDetes Proxy vai consultar {providerLabel} e converter a resposta em uma prova mínima para {platformName}.
                </div>
              </>
            )}

            {phase === "confirm" && (
              <>
                <label className="flex items-start gap-3 rounded-md border p-4">
                  <input
                    checked={consented}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                    onChange={(event) => setConsented(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="text-sm leading-6 text-slate-600">
                    Eu autorizo o compartilhamento apenas da elegibilidade etária, do token e da validade desta prova.
                  </span>
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    onClick={denyConsent}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    className="inline-flex h-9 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!consented}
                    onClick={startVerification}
                    type="button"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {(phase === "consent" || phase === "provider" || phase === "finalizing" || phase === "success") && (
              <>
                <div className="flex justify-center">
                  {phase === "success" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-50 text-slate-900">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-950">
                    {phase === "success" ? "Verificação concluída" : "Verificando sua idade"}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">
                    {phase === "success"
                      ? clientSessionId
                        ? `Voltando para ${platformName}...`
                        : "Atualizando seus acessos..."
                      : `Aguarde enquanto o LGPDetes Proxy consulta ${providerLabel} e emite a prova.`}
                  </div>
                </div>
                <div className="overflow-hidden rounded-md border">
                  {steps.map((step) => {
                    const currentOrder = phase === "success" ? 4 : phaseOrder[phase as keyof typeof phaseOrder] ?? 0;
                    const active = currentOrder >= step.order;

                    return (
                      <div
                        className={cn(
                          "border-t px-4 py-3 text-sm first:border-t-0",
                          active ? "bg-slate-50 text-slate-950" : "text-slate-400"
                        )}
                        key={step.label}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>
                {proofToken ? (
                  <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-600">
                    Token emitido: <code className="font-mono text-xs">{proofToken}</code>
                  </div>
                ) : null}
              </>
            )}

            {phase === "failure" && (
              <>
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-950">Não foi possível concluir</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{error}</div>
                </div>
                <div className="flex justify-end gap-2">
                  {clientSessionId ? (
                    <button
                      className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                      onClick={() => void returnFromModal(false)}
                      type="button"
                    >
                      Voltar para {platformName}
                    </button>
                  ) : null}
                  <button
                    className="inline-flex h-9 items-center justify-center rounded-md border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    onClick={closeModal}
                    type="button"
                  >
                    Escolher outro método
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
