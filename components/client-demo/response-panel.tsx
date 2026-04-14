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
    <Sheet open={open} onClose={onClose} title="API response">
      <div className="rounded-3xl bg-slate-950 p-4 text-sm text-cyan-100">
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-6">
          {payload ? JSON.stringify(payload, null, 2) : '{\n  "verified": false,\n  "reason": "pending"\n}'}
        </pre>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        The client only receives the minimum proof result. Full identity remains with the chosen external provider.
      </p>
    </Sheet>
  );
}
