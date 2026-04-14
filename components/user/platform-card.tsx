import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Platform } from "@/lib/types";

export function PlatformCard({
  platform,
  href,
  connected
}: {
  platform: Platform;
  href: string;
  connected: boolean;
}) {
  const variant =
    platform.status === "active" ? "active" : platform.status === "pilot" ? "pending" : "inactive";

  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-r ${platform.accent}`} />
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
              {platform.logoLabel}
            </div>
            <CardTitle>{platform.name}</CardTitle>
          </div>
          <Badge variant={variant}>{platform.status}</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-600">{platform.description}</p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Age policy</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{platform.agePolicy}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Privacy posture</div>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-cyan-600" />
            Only age band is shared
          </div>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between">
        <div className="text-sm text-slate-500">{connected ? "Previously authorized" : "New authorization"}</div>
        <Link href={href}>
          <Button disabled={platform.status === "inactive"}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
