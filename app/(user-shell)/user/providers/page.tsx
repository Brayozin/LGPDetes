import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { ProviderMark } from "@/components/providers/provider-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { listPlatforms } from "@/lib/services/admin-service";
import { listUserProviders } from "@/lib/services/user-service";
import { getCurrentUser } from "@/lib/utils/auth";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export default async function UserProvidersPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const params = (await searchParams) ?? {};
  const platformId = typeof params.platformId === "string" ? params.platformId : undefined;
  const clientSessionId = typeof params.clientSessionId === "string" ? params.clientSessionId : undefined;
  const platform = platformId ? listPlatforms().find((entry) => entry.id === platformId) : null;

  if (!platform) {
    return (
      <div className="space-y-6">
        <SectionIntro
          description="Choose a client platform first so AgeGate Proxy can filter the provider options and carry the correct request policy into the consent screen."
          eyebrow="Step 2"
          title="Choose a trusted provider"
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 text-sm text-slate-600">
            No platform was selected for this verification request.
            <Link href="/user/platforms">
              <Button>Return to platform selection</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const providers = listUserProviders().filter((provider) => platform.providerIds.includes(provider.id));

  return (
    <div className="space-y-6">
      <SectionIntro
        badge={platform.agePolicy}
        description={`Select the external trusted provider that will confirm whether you meet ${platform.name}'s minimum age threshold. Only the age result comes back.`}
        eyebrow="Step 2"
        title="Choose a trusted provider"
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {providers.map((provider) => {
          const linkedProfile = user.providerProfiles.find((entry) => entry.providerId === provider.id);

          return (
            <Card key={provider.id}>
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <ProviderMark providerKey={provider.key} />
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">{provider.trustLevel}</p>
                    </div>
                  </div>
                  <Badge variant={provider.status === "active" ? "active" : provider.status === "degraded" ? "pending" : "inactive"}>
                    {provider.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Shared output</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">Age band only</div>
                  <div className="mt-1 text-sm text-slate-500">`verified`, `age_band`, `proof_token`, and expiry.</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Available scopes</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{provider.scopes.join(", ")}</div>
                </div>
                {linkedProfile ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                    Already linked to this internal account as {linkedProfile.displayName}.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    No prior link detected. The mock will create a provider profile for this internal account on first use.
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Link href={`/user/consent?platformId=${platform.id}&providerId=${provider.id}${clientSessionId ? `&clientSessionId=${clientSessionId}` : ""}`}>
                  <Button disabled={provider.status === "inactive"} size="lg">
                    Continue with {provider.key === "gov" ? ".gov" : "Gmail"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
