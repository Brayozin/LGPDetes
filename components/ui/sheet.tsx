"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

function Sheet({ open, onClose, title, description, children, className }: SheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Fechar painel"
        className="absolute inset-0 bg-slate-950/20"
        onClick={onClose}
        type="button"
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 top-auto flex max-h-[88vh] flex-col rounded-t-lg border bg-white shadow-panel sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-md sm:rounded-none sm:border-l sm:border-t-0",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            {title ? <h2 className="text-base font-semibold text-foreground">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export { Sheet };
