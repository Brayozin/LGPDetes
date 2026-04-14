import { z } from "zod";

import { requestAgeCheck } from "@/lib/services/client-service";
import { fail, ok } from "@/lib/utils/http";

const schema = z.object({
  platformId: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid client request payload.", 400);
  }

  const result = requestAgeCheck(payload.data);
  if (!result) {
    return fail("Platform not found.", 404);
  }

  return ok(result);
}
