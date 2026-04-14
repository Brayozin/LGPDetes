import { NextResponse } from "next/server";

import { destroyAdminSession } from "@/lib/services/session-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/utils/constants";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(/agegate_admin_session=([^;]+)/)?.[1];
  destroyAdminSession(token);

  const response = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303
  });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
