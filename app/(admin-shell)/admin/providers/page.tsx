import { SectionIntro } from "@/components/app-shell/section-intro";
import { ProvidersConsole } from "@/components/admin/providers-console";
import { listProviders } from "@/lib/services/admin-service";

export default function AdminProvidersPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        badge="Current provider scope"
        description="This MVP intentionally keeps the provider catalog narrow: one .gov identity source and one Gmail-based account provider. The records remain JSON-backed and editable."
        eyebrow="Providers"
        title="Trusted provider configuration"
      />
      <ProvidersConsole initialProviders={listProviders()} />
    </div>
  );
}
