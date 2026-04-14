import { NextResponse } from "next/server";

import { destroyUserSession } from "@/lib/services/session-service";
import { USER_SESSION_COOKIE } from "@/lib/utils/constants";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(/agegate_user_session=([^;]+)/)?.[1];
  destroyUserSession(token);

  const response = NextResponse.redirect(new URL("/user/login", request.url), {
    status: 303
  });
  response.cookies.delete(USER_SESSION_COOKIE);
  return response;
}
