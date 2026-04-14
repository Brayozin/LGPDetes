import Link from "next/link";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConsentPanel } from "@/components/user/consent-panel";
import { listPlatforms, listProviders } from "@/lib/services/admin-service";
import { getCurrentUser } from "@/lib/utils/auth";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export default async function ConsentPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const params = (await searchParams) ?? {};
  const platformId = typeof params.platformId === "string" ? params.platformId : undefined;
  const providerId = typeof params.providerId === "string" ? params.providerId : undefined;
  const clientSessionId = typeof params.clientSessionId === "string" ? params.clientSessionId : null;
  const platform = platformId ? listPlatforms().find((entry) => entry.id === platformId) : null;
  const provider = providerId ? listProviders().find((entry) => entry.id === providerId) : null;

  if (!platform || !provider) {
    return (
      <div className="space-y-6">
        <SectionIntro
          description="Consent depends on both a selected platform and a selected provider. Start from the platform chooser to rebuild the request context."
          eyebrow="Step 3"
          title="Review and grant consent"
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 text-sm text-slate-600">
            This consent screen is missing the required verification context.
            <Link href="/user/platforms">
              <Button>Return to platform selection</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        badge={`${platform.name} · ${provider.name}`}
        description="Confirm that AgeGate Proxy may request a provider assertion and convert it into a minimal age-proof response for the client."
        eyebrow="Step 3"
        title="Review and grant consent"
      />
      <ConsentPanel clientSessionId={clientSessionId} platform={platform} provider={provider} user={user} />
    </div>
  );
}
