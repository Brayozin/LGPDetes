import { z } from "zod";

import { exchangeProof } from "@/lib/services/client-service";
import { fail, ok } from "@/lib/utils/http";

const schema = z.object({
  sessionId: z.string().min(1),
  proofToken: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid proof exchange payload.", 400);
  }

  return ok(exchangeProof(payload.data));
}
