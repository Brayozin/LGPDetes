import { SectionIntro } from "@/components/app-shell/section-intro";
import { PlatformsTable } from "@/components/admin/platforms-table";
import { listPlatforms } from "@/lib/services/admin-service";

export default function AdminPlatformsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        badge="Editable mock state"
        description="Review partner callback URLs, declared policies, and operational status. Changes here update the in-memory demo state and feed the audit timeline."
        eyebrow="Platforms"
        title="Client platform registry"
      />
      <PlatformsTable initialPlatforms={listPlatforms()} />
    </div>
  );
}
