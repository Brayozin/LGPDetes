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
          description="Este passo depende de uma plataforma e de um provedor selecionados na mesma solicitação."
          eyebrow="Step 3"
          title="Revisar consentimento"
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 text-sm text-slate-600">
            Faltam dados para montar este consentimento.
            <Link href="/user/platforms">
              <Button>Voltar para plataformas</Button>
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
        description="Confirme que o LGPDetes Proxy pode solicitar a resposta do provedor e convertê-la em uma prova mínima para o cliente."
        eyebrow="Step 3"
        title="Revisar consentimento"
      />
      <ConsentPanel clientSessionId={clientSessionId} platform={platform} provider={provider} user={user} />
    </div>
  );
}
