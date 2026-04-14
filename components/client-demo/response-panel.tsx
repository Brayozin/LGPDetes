"use client";

import { Sheet } from "@/components/ui/sheet";

export function ResponsePanel({
  open,
  onClose,
  payload
}: {
  open: boolean;
  onClose: () => void;
  payload: Record<string, unknown> | null;
}) {
  return (
    <Sheet
      description="Contrato mínimo trocado entre a NightWave e o LGPDetes Proxy"
      open={open}
      onClose={onClose}
      title="Resposta recebida pela NightWave"
    >
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-6">
          {payload ? JSON.stringify(payload, null, 2) : '{\n  "verified": false,\n  "reason": "pending"\n}'}
        </pre>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        O cliente recebe apenas o resultado mínimo da prova. A identidade completa permanece com o provedor escolhido.
      </p>
    </Sheet>
  );
}
