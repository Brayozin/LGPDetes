import { ShieldCheck } from "lucide-react";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformCard } from "@/components/user/platform-card";
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
        badge={user.internalRef}
        description="Choose which client platform you want to access. AgeGate Proxy will only send the minimum age eligibility result requested by that platform."
        eyebrow="Step 1"
        title="Choose a platform"
      />
      {clientSessionId ? (
        <Alert variant="info">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <div>
              You arrived from a live client demo session. Selecting NightWave will carry the proof back to the requesting
              app after verification.
            </div>
          </div>
        </Alert>
      ) : null}
      <Card className="bg-slate-950 text-slate-50">
        <CardContent className="flex flex-col gap-2 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-300">Internal boundary</div>
            <div className="mt-2 text-lg font-semibold">{user.fullName}</div>
            <div className="mt-1 text-sm text-slate-300">
              Internal AgeGate identifier {user.internalRef} keeps provider identities linked to one account.
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-cyan-100">No raw identity leaves the provider</div>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        {ordered.map((platform) => (
          <PlatformCard
            connected={platform.connected}
            href={`/user/providers?platformId=${platform.id}${clientSessionId ? `&clientSessionId=${clientSessionId}` : ""}`}
            key={platform.id}
            platform={platform}
          />
        ))}
      </div>
    </div>
  );
}
