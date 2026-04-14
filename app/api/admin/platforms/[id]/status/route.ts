import { NextRequest } from "next/server";
import { z } from "zod";

import { updatePlatformStatus } from "@/lib/services/admin-service";
import { fail, ok } from "@/lib/utils/http";
import { getAdminFromRequest } from "@/lib/utils/request-auth";

const schema = z.object({
  status: z.enum(["active", "pilot", "inactive"])
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return fail("Unauthorized.", 401);
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid platform status.", 400);
  }

  const { id } = await params;
  const platform = updatePlatformStatus(id, payload.data.status, admin.name);
  if (!platform) {
    return fail("Platform not found.", 404);
  }

  return ok({
    platform
  });
}
