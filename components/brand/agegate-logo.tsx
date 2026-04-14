import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export function AgeGateLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-900 text-white">
        <ShieldCheck className="h-5 w-5" />
      </div>
      {compact ? null : (
        <div>
          <div className="text-sm font-semibold tracking-tight text-slate-950">LGPDetes Proxy</div>
          <div className="text-xs text-slate-500">Verificação de idade com privacidade</div>
        </div>
      )}
    </div>
  );
}
