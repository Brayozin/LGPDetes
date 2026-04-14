import { ShieldCheck } from "lucide-react";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { Alert } from "@/components/ui/alert";
import { PlatformSelectionList } from "@/components/user/platform-selection-list";
import { listUserPlatforms } from "@/lib/services/user-service";
import { getCurrentUser } from "@/lib/utils/auth";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UserPlatformsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = (await searchParams) ?? {};
  const platformId = typeof params.platformId === "string" ? params.platformId : undefined;
  const clientSessionId = typeof params.clientSessionId === "string" ? params.clientSessionId : undefined;

  if (!user) {
    return null;
  }

  const platforms = listUserPlatforms(user.id);
  const ordered = platformId
    ? [...platforms].sort((left, right) => (left.id === platformId ? -1 : right.id === platformId ? 1 : 0))
    : platforms;

  return (
    <div className="space-y-6">
      <SectionIntro
        description="Selecione quem vai receber apenas o resultado mínimo da prova de idade."
        eyebrow="Step 1"
        title="Escolha a plataforma"
      />
      {clientSessionId ? (
        <Alert variant="info">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <div>Esta sessão começou na NightWave. O resultado volta para lá depois da verificação.</div>
          </div>
        </Alert>
      ) : null}
      <div className="flex flex-col gap-2 rounded-lg border bg-white px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-medium text-slate-950">{user.fullName}</span>
          <span className="text-slate-500"> · {user.internalRef}</span>
        </div>
        <div className="text-slate-500">As identidades dos provedores ficam vinculadas a esta conta interna.</div>
      </div>
      <PlatformSelectionList clientSessionId={clientSessionId ?? undefined} platforms={ordered} requestedPlatformId={platformId} />
    </div>
  );
}
