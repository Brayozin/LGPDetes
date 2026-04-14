import { NextRequest } from "next/server";
import { z } from "zod";

import { createConsent } from "@/lib/services/user-service";
import { fail, ok } from "@/lib/utils/http";
import { getUserFromRequest } from "@/lib/utils/request-auth";

const schema = z.object({
  platformId: z.string().min(1),
  providerId: z.string().min(1),
  clientSessionId: z.string().optional().nullable(),
  approved: z.boolean()
});

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return fail("Unauthorized.", 401);
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid consent payload.", 400);
  }

  return ok({
    consent: createConsent({
      ...payload.data,
      userId: user.id
    })
  });
}
