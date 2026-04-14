import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

function getVariant(status: AuditLog["status"]) {
  if (status === "success") {
    return "active";
  }

  if (status === "failure") {
    return "danger";
  }

  if (status === "warning") {
    return "pending";
  }

  return "info";
}

export function ActivityTimeline({ items }: { items: AuditLog[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4" key={item.id}>
            <div className="mt-1 h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-950">{item.action.replaceAll("_", " ")}</p>
                <Badge variant={getVariant(item.status)}>{item.status}</Badge>
              </div>
              <p className="text-sm text-slate-600">{item.detail}</p>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatDateTime(item.timestamp)}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
