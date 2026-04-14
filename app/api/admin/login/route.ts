import { z } from "zod";

import { loginAdmin } from "@/lib/services/auth-service";
import { createAdminSession } from "@/lib/services/session-service";
import { fail, ok } from "@/lib/utils/http";
import { ADMIN_SESSION_COOKIE } from "@/lib/utils/constants";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return fail("Invalid login payload.", 400);
  }

  const admin = loginAdmin(payload.data.email, payload.data.password);
  if (!admin) {
    return fail("Incorrect admin email or password.", 401);
  }

  const session = createAdminSession(admin.id);
  const response = ok({
    admin
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  });

  return response;
}
