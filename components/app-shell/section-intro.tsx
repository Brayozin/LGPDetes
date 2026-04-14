import { Badge } from "@/components/ui/badge";

export function SectionIntro({
  eyebrow: _eyebrow,
  title,
  description,
  badge
}: {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {badge ? <Badge variant="outline">{badge}</Badge> : null}
    </div>
  );
}
