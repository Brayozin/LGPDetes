import { notFound } from "next/navigation";

import { SectionIntro } from "@/components/app-shell/section-intro";
import { VerificationRunner } from "@/components/user/verification-runner";
import { getVerificationStatus } from "@/lib/services/verification-service";

export default function VerificationPage({ params }: { params: { id: string } }) {
  const verification = getVerificationStatus(params.id);
  if (!verification) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        badge={verification.id}
        description="Mock route handlers are simulating the provider callback and the final privacy-safe proof generation."
        eyebrow="Step 4"
        title="Verification status"
      />
      <VerificationRunner initialVerification={verification} />
    </div>
  );
}
