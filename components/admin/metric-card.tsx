import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  delta
}: {
  label: string;
  value: string | number;
  delta: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{label}</span>
          <span className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-primary">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">{delta}</p>
      </CardContent>
    </Card>
  );
}
