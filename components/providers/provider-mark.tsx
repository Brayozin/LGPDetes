import { Mail, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ProviderKey } from "@/lib/types";

export function ProviderMark({ providerKey, className }: { providerKey: ProviderKey; className?: string }) {
  if (providerKey === "gov") {
    return (
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-[0_16px_26px_rgba(37,99,235,0.28)]",
          className
        )}
      >
        <ShieldCheck className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-amber-400 to-yellow-300 text-white shadow-[0_16px_26px_rgba(244,114,182,0.28)]",
        className
      )}
    >
      <Mail className="h-5 w-5" />
    </div>
  );
}
