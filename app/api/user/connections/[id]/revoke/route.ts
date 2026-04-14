import { NextRequest } from "next/server";

import { revokeConnection } from "@/lib/services/user-service";
import { fail, ok } from "@/lib/utils/http";
import { getUserFromRequest } from "@/lib/utils/request-auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return fail("Unauthorized.", 401);
  }

  const { id } = await params;
  const connection = revokeConnection(user.id, id);
  if (!connection) {
    return fail("Connection not found.", 404);
  }

  return ok({
    connection
  });
}
