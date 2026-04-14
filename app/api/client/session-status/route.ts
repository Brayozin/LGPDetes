import { getClientSessionStatus } from "@/lib/services/client-service";
import { fail, ok } from "@/lib/utils/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) {
    return fail("Missing sessionId.", 400);
  }

  const session = getClientSessionStatus(sessionId);
  if (!session) {
    return fail("Client session not found.", 404);
  }

  return ok({
    session
  });
}
