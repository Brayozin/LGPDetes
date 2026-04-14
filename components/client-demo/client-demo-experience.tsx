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
      "Acervo Director's Cut",
      "Sessões pós-meia-noite",
      "Arquivo Studio Noir",
      "Salas privadas de criadores"
    ],
    []
  );

  async function exchangeProofForSession(currentSessionId: string, proofToken: string) {
    const response = await fetch("/api/client/exchange-proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionId: currentSessionId,
        proofToken
      })
    });

    const body = await response.json();
    setSessionId(currentSessionId);
    setResponsePayload(body);
    setStatus(body.verified ? "verified" : "denied");
    setPanelOpen(true);
  }

  useEffect(() => {
    if (!initialProofToken || !initialSessionId) {
      return;
    }

    const currentProofToken = initialProofToken;
    const currentSessionId = initialSessionId;
    let cancelled = false;

    async function runExchange() {
      if (cancelled) {
        return;
      }

      await exchangeProofForSession(currentSessionId, currentProofToken);
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
    let timer: number | undefined;

    async function loadSession() {
      const response = await fetch(`/api/client/session-status?sessionId=${sessionId}`);
      const body = await response.json();
      if (cancelled) {
        return;
      }

      if (body.session?.status === "denied") {
        setStatus("denied");
        setResponsePayload(body.session.responseSnapshot ?? { verified: false, reason: "minimum_age_not_met" });
        setPanelOpen(true);
      } else if (body.session?.status === "proof_issued" && body.session?.proofToken) {
        await exchangeProofForSession(sessionId, body.session.proofToken);
      } else if (body.session?.status === "verified") {
        setStatus("verified");
        setResponsePayload(body.session.responseSnapshot);
        setPanelOpen(true);
      } else if (body.session) {
        setStatus("pending");
        setResponsePayload(body.session.responseSnapshot ?? null);
        timer = window.setTimeout(() => {
          void loadSession();
        }, 1400);
      }
    }

    setStatus("pending");
    void loadSession();

    return () => {
      cancelled = true;
      if (timer) {
        window.clearTimeout(timer);
      }
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

  const statusLabel = {
    idle: "Aguardando",
    pending: "Em andamento",
    verified: "Liberado",
    denied: "Negado"
  }[status];

  const statusVariant =
    status === "verified" ? "active" : status === "denied" ? "danger" : status === "pending" ? "pending" : "outline";
  const statusClass = {
    idle: "border-[#40322c] bg-[#171311] text-stone-200",
    pending: "border-[#5a4a41] bg-[#241d19] text-stone-100",
    verified: "border-[#355447] bg-[#15221c] text-[#b9d3c7]",
    denied: "border-[#5f352e] bg-[#241614] text-[#e0b2a7]"
  }[status];

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden border-[#332924] bg-[#1d1715] text-stone-100">
          <div className="flex items-center justify-between gap-4 border-b border-[#332924] px-4 py-3 text-sm text-stone-400">
            <span className="font-mono text-xs text-stone-500">nightwave.app/after-hours</span>
            <span>Aplicativo externo</span>
          </div>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl text-stone-100">NightWave After Hours</CardTitle>
                <p className="text-sm leading-6 text-stone-400">
                  Esta área do cliente só é liberada depois que a prova mínima volta do LGPDetes Proxy.
                </p>
              </div>
              <Badge className={statusClass} variant={statusVariant}>
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-[#40322c] bg-[#171311] p-4">
                <div className="text-sm font-medium text-stone-100">Requisição</div>
                <div className="mt-1 text-sm leading-6 text-stone-400">
                  <code>POST /api/client/request-age-check</code> com política 18+ e callback da sessão.
                </div>
              </div>
              <div className="rounded-md border border-[#40322c] bg-[#171311] p-4">
                <div className="text-sm font-medium text-stone-100">Retorno</div>
                <div className="mt-1 text-sm leading-6 text-stone-400">
                  <code>verified</code>, <code>age_band</code>, <code>proof_token</code>, provedor e expiração.
                </div>
              </div>
            </div>
            {status === "verified" ? (
              <div className="overflow-hidden rounded-md border border-[#40322c] bg-[#14110f]">
                <div className="divide-y">
                  {contentItems.map((item) => (
                    <div className="flex items-center justify-between gap-4 border-[#2a221f] px-4 py-4" key={item}>
                      <div className="flex min-w-0 items-center gap-3">
                        <PlayCircle className="h-4 w-4 shrink-0 text-[#d39a72]" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-stone-100">{item}</div>
                          <div className="text-sm text-stone-500">Disponível após a prova 18+ com identidade preservada.</div>
                        </div>
                      </div>
                      <div className="text-xs text-stone-500">18+</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-md border border-[#40322c] bg-[#14110f] px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[#40322c] bg-[#1d1715] text-[#d39a72]">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="mt-6 max-w-2xl space-y-3">
                  <div className="text-3xl font-semibold tracking-tight text-stone-100 lg:text-4xl">
                    {status === "pending" ? "Estamos aguardando sua verificação" : "Você precisa verificar sua idade"}
                  </div>
                  <div className="text-base leading-7 text-stone-400">
                    {status === "pending"
                      ? "A NightWave fica bloqueada até o LGPDetes Proxy concluir a validação e devolver a prova mínima desta sessão."
                      : "A NightWave exige uma prova 18+ antes de liberar qualquer área restrita deste aplicativo."}
                  </div>
                </div>
                <div className="mt-6 rounded-md border border-[#40322c] bg-[#171311] px-4 py-3 text-sm text-stone-400">
                  O cliente só recebe a confirmação da faixa etária, o token e a validade da prova.
                </div>
                <Button
                  className="mt-6 border-[#b47a52] bg-[#b47a52] px-6 text-[#17110e] hover:bg-[#a76f49] hover:text-[#17110e]"
                  disabled={isPending || status === "pending"}
                  onClick={startAgeCheck}
                  size="lg"
                  type="button"
                >
                  {isPending ? "Criando sessão..." : status === "pending" ? "Aguardando retorno" : "Verificar idade agora"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-[#332924] bg-[#201917] text-stone-100">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-stone-100">Retorno técnico</CardTitle>
              <p className="mt-1 text-sm text-stone-400">Payload mínimo que a NightWave recebe após a troca da prova.</p>
            </div>
            <Button
              className="border-[#40322c] bg-transparent text-stone-100 hover:bg-[#171311] hover:text-stone-100"
              onClick={() => setPanelOpen(true)}
              type="button"
              variant="outline"
            >
              <Code2 className="h-4 w-4" />
              Abrir JSON
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-md border border-[#40322c] bg-[#171311] p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-stone-500">Estado</span>
                <Badge className={statusClass} variant={statusVariant}>
                  {statusLabel}
                </Badge>
              </div>
              {sessionId ? (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone-500">Sessão</span>
                  <code className="font-mono text-xs text-stone-300">{sessionId}</code>
                </div>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-md border border-[#40322c]">
              {[
                "1. Cria a sessão e redireciona para o LGPDetes Proxy.",
                "2. Recebe o proof token depois da verificação.",
                "3. Troca o token e libera a área restrita."
              ].map((item, index) => (
                <div className="border-t border-[#40322c] px-4 py-3 text-sm text-stone-400 first:border-t-0" key={index}>
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-md border border-[#40322c] bg-[#171311] p-4 text-sm leading-6 text-stone-400">
              <div className="mb-2 flex items-center gap-2 font-medium text-stone-100">
                <ShieldCheck className="h-4 w-4 text-[#d39a72]" />
                Privacidade
              </div>
              A identidade completa nunca aparece na superfície do cliente. O painel lateral expõe apenas o contrato mínimo.
            </div>
          </CardContent>
        </Card>
      </div>
      <ResponsePanel onClose={() => setPanelOpen(false)} open={panelOpen} payload={responsePayload} />
    </>
  );
}
