import { z } from "zod";

import { registerUser } from "@/lib/services/auth-service";
import { createUserSession } from "@/lib/services/session-service";
import { USER_SESSION_COOKIE } from "@/lib/utils/constants";
import { fail, ok } from "@/lib/utils/http";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().min(13).max(120)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid registration payload.", 400);
  }

  const result = registerUser(payload.data);
  if ("error" in result) {
    return fail(result.error ?? "Unable to register user.", 409);
  }

  const user = result.user;
  const session = createUserSession(user.id);
  const response = ok({
    user
  });

  response.cookies.set(USER_SESSION_COOKIE, session, {
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  });

  return response;
}
