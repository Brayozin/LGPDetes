import { notFound } from "next/navigation";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { VerificationRunner } from "@/components/user/verification-runner";
import { getVerificationStatus } from "@/lib/services/verification-service";

export default async function VerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verification = getVerificationStatus(id);
  if (!verification) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        badge={verification.id}
        description="As rotas simulam o callback do provedor e a geração final da prova mínima com preservação de identidade."
        eyebrow="Step 4"
        title="Status da verificação"
      />
      <VerificationRunner initialVerification={verification} />
    </div>
  );
}
