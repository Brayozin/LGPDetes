import { NextRequest } from "next/server";

import { listUserPlatforms } from "@/lib/services/user-service";
import { fail, ok } from "@/lib/utils/http";
import { getUserFromRequest } from "@/lib/utils/request-auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return fail("Unauthorized.", 401);
  }

  return ok({
    platforms: listUserPlatforms(user.id)
  });
}
