import { cn } from "@/lib/utils/cn";

function Progress({ className, value = 0 }: { className?: string; value?: number }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-sm bg-muted", className)}>
      <div
        className="h-full rounded-sm bg-primary transition-[width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ width: `${normalized}%` }}
      />
    </div>
  );
}

export { Progress };
