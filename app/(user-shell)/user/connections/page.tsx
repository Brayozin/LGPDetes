import { SectionIntro } from "@/components/app-shell/section-intro";
import { ConnectionsDashboard } from "@/components/user/connections-dashboard";
import { listConnections } from "@/lib/services/user-service";
import { getCurrentUser } from "@/lib/utils/auth";

export default async function UserConnectionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const { connections, verificationHistory } = listConnections(user.id);

  return (
    <div className="space-y-6">
      <SectionIntro
        badge="Acessos e vínculos"
        description="Revise as plataformas com prova ativa, acompanhe tentativas anteriores e revogue acessos quando quiser."
        eyebrow="My Connections"
        title="Plataformas autorizadas"
      />
      <ConnectionsDashboard
        history={verificationHistory}
        initialConnections={connections}
        providerProfiles={user.providerProfiles}
        user={user}
      />
    </div>
  );
}
