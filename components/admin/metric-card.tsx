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
    <Card className="bg-white/90">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{label}</span>
          <span className="rounded-full bg-emerald-50 p-2 text-emerald-600">
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
