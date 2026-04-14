import { Badge } from "@/components/ui/badge";

export function SectionIntro({
  eyebrow,
  title,
  description,
  badge
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {badge ? <Badge variant="info">{badge}</Badge> : null}
    </div>
  );
}
