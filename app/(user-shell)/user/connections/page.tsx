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
        badge="Access and provider links"
        description="Review which client platforms currently hold an age proof, inspect previous verification attempts, and revoke access grants at any time."
        eyebrow="My Connections"
        title="Authorized platforms and linked providers"
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
