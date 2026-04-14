import { getVerificationStatus } from "@/lib/services/verification-service";
import { fail, ok } from "@/lib/utils/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const verification = getVerificationStatus(id);
  if (!verification) {
    return fail("Verification not found.", 404);
  }

  return ok({
    verification
  });
}
