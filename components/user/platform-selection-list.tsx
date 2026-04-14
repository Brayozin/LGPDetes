"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PlatformCard } from "@/components/user/platform-card";
import type { Platform } from "@/lib/types";

type PlatformView = Platform & { connected: boolean };

export function PlatformSelectionList({
  platforms,
  clientSessionId,
  requestedPlatformId
}: {
  platforms: PlatformView[];
  clientSessionId?: string;
  requestedPlatformId?: string;
}) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = platforms.filter((platform) => {
    if (!normalizedQuery) {
      return true;
    }

    return [platform.name, platform.description, platform.category, platform.agePolicy]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-950">
            {filtered.length} plataforma{filtered.length === 1 ? "" : "s"} disponível{filtered.length === 1 ? "" : "eis"}
          </div>
          <div className="text-sm text-slate-600">Busque por nome, categoria ou política de idade.</div>
        </div>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar plataforma"
            value={query}
          />
        </div>
      </div>
      {filtered.length ? (
        <div>
          {filtered.map((platform, index) => (
            <PlatformCard
              connected={platform.connected}
              highlighted={platform.id === requestedPlatformId}
              href={`/user/providers?platformId=${platform.id}${clientSessionId ? `&clientSessionId=${clientSessionId}` : ""}`}
              key={platform.id}
              platform={platform}
              withBorder={index > 0}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-sm text-slate-600">Nenhuma plataforma encontrada para essa busca.</div>
      )}
    </div>
  );
}
