import { Mail, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ProviderKey } from "@/lib/types";

export function ProviderMark({
  providerKey,
  className,
  variant = "icon"
}: {
  providerKey: ProviderKey;
  className?: string;
  variant?: "icon" | "wordmark";
}) {
  if (variant === "wordmark" && providerKey === "gov") {
    return (
      <div className={cn("inline-flex h-11 items-center rounded-md border border-slate-200 bg-white px-3", className)}>
        <div className="text-[1.35rem] font-black leading-none tracking-[-0.06em]">
          <span style={{ color: "#2866ae" }}>g</span>
          <span style={{ color: "#f2bb1d" }}>o</span>
          <span style={{ color: "#48ac3f" }}>v</span>
          <span style={{ color: "#2866ae" }}>.</span>
          <span style={{ color: "#2866ae" }}>b</span>
          <span style={{ color: "#f2bb1d" }}>r</span>
        </div>
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={cn("inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3", className)}>
        <Mail className="h-4 w-4 text-[#ea4335]" />
        <span className="text-sm font-semibold text-[#ea4335]">Gmail</span>
      </div>
    );
  }

  if (providerKey === "gov") {
    return (
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md border border-[#2866ae]/20 bg-white text-[#2866ae]",
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
        "flex h-10 w-10 items-center justify-center rounded-md border border-[#ea4335]/20 bg-white text-[#ea4335]",
        className
      )}
    >
      <Mail className="h-5 w-5" />
    </div>
  );
}
