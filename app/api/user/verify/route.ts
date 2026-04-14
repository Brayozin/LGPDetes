import { NextRequest } from "next/server";
import { z } from "zod";

import { startVerification } from "@/lib/services/verification-service";
import { fail, ok } from "@/lib/utils/http";
import { getUserFromRequest } from "@/lib/utils/request-auth";

const schema = z.object({
  platformId: z.string().min(1),
  providerId: z.string().min(1),
  clientSessionId: z.string().optional().nullable()
});

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return fail("Unauthorized.", 401);
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid verification payload.", 400);
  }

  const verification = startVerification({
    ...payload.data,
    userId: user.id
  });

  if (!verification) {
    return fail("Unable to create verification.", 404);
  }

  return ok({
    verification
  });
}
