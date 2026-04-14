import { SectionIntro } from "@/components/app-shell/section-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationMethodPicker } from "@/components/user/verification-method-picker";
import { listPlatforms } from "@/lib/services/admin-service";
import { listUserProviders } from "@/lib/services/user-service";
import { getCurrentUser } from "@/lib/utils/auth";
import Link from "next/link";

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
          description="Escolha uma plataforma antes para que o LGPDetes Proxy carregue a política correta nesta solicitação."
          eyebrow="Step 2"
          title="Escolha o provedor"
        />
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 text-sm text-slate-600">
            Nenhuma plataforma foi selecionada para esta verificação.
            <Link href="/user/platforms">
              <Button>Voltar para plataformas</Button>
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
        description={`Escolha como você quer verificar sua idade para concluir a solicitação da ${platform.name}.`}
        eyebrow="Step 2"
        title="Como você quer verificar?"
      />
      <VerificationMethodPicker
        clientSessionId={clientSessionId}
        platformId={platform.id}
        platformName={platform.name}
        agePolicy={platform.agePolicy}
        providers={providers.map((provider) => ({
          id: provider.id,
          key: provider.key,
          name: provider.name,
          status: provider.status,
          linkedDisplayName: user.providerProfiles.find((entry) => entry.providerId === provider.id)?.displayName ?? null
        }))}
      />
    </div>
  );
}
