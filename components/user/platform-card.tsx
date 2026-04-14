import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Platform } from "@/lib/types";
import { formatPlatformStatus } from "@/lib/utils/format";

export function PlatformCard({
  platform,
  href,
  connected,
  highlighted = false,
  withBorder = false
}: {
  platform: Platform;
  href: string;
  connected: boolean;
  highlighted?: boolean;
  withBorder?: boolean;
}) {
  const variant =
    platform.status === "active" ? "active" : platform.status === "pilot" ? "pending" : "inactive";
  const action = (
    <Button disabled={platform.status === "inactive"} size="sm" type="button" variant="outline">
      Selecionar
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between",
        withBorder && "border-t",
        highlighted && "bg-slate-50"
      )}
    >
      <div className="min-w-0 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-900">
            {platform.logoLabel}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-sm font-medium text-slate-950">{platform.name}</div>
              <Badge variant={variant}>{formatPlatformStatus(platform.status)}</Badge>
            </div>
            <p className="text-sm leading-6 text-slate-600">{platform.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>{platform.agePolicy}</span>
          <span>{platform.category}</span>
          <span>{connected ? "Já autorizada" : "Nova autorização"}</span>
        </div>
        {highlighted ? (
          <div className="text-sm text-slate-500">Solicitada nesta sessão do cliente.</div>
        ) : null}
      </div>
      <div className="shrink-0">{platform.status === "inactive" ? action : <Link href={href}>{action}</Link>}</div>
    </div>
  );
}
