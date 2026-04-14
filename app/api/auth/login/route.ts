import { z } from "zod";

import { loginUser } from "@/lib/services/auth-service";
import { createUserSession } from "@/lib/services/session-service";
import { USER_SESSION_COOKIE } from "@/lib/utils/constants";
import { fail, ok } from "@/lib/utils/http";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid login payload.", 400);
  }

  const user = loginUser(payload.data.email, payload.data.password);
  if (!user) {
    return fail("Incorrect email or password.", 401);
  }

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
