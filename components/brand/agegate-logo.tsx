import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export function AgeGateLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-[0_18px_30px_rgba(6,182,212,0.28)]">
        <ShieldCheck className="h-5 w-5" />
      </div>
      {compact ? null : (
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">AgeGate Proxy</div>
          <div className="text-xs text-slate-500">Identity-separated age verification</div>
        </div>
      )}
    </div>
  );
}
