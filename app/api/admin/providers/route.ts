import { NextRequest } from "next/server";
import { z } from "zod";

import { createProvider, listProviders } from "@/lib/services/admin-service";
import { fail, ok } from "@/lib/utils/http";
import { getAdminFromRequest } from "@/lib/utils/request-auth";

const schema = z.object({
  name: z.string().min(2),
  key: z.enum(["gov", "gmail"]),
  type: z.enum(["government_id", "email_identity"]),
  status: z.enum(["active", "degraded", "inactive"]),
  domainHint: z.string().min(1),
  scopes: z.array(z.string().min(1)).min(1)
});

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return fail("Unauthorized.", 401);
  }

  return ok({
    providers: listProviders()
  });
}

export async function POST(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return fail("Unauthorized.", 401);
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid provider payload.", 400, {
      issues: payload.error.flatten()
    });
  }

  return ok({
    provider: createProvider(payload.data)
  });
}
