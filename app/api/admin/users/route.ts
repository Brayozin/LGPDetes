import { NextRequest } from "next/server";

import { listUsers } from "@/lib/services/admin-service";
import { fail, ok } from "@/lib/utils/http";
import { getAdminFromRequest } from "@/lib/utils/request-auth";

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return fail("Unauthorized.", 401);
  }

  return ok({
    users: listUsers()
  });
}
