import type { NextRequest } from "next/server";

import { getAdminById, getUserById } from "@/lib/services/auth-service";
import { getAdminIdFromSession, getUserIdFromSession } from "@/lib/services/session-service";
import { ADMIN_SESSION_COOKIE, USER_SESSION_COOKIE } from "@/lib/utils/constants";

export function getAdminFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return getAdminById(getAdminIdFromSession(token));
}

export function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
  return getUserById(getUserIdFromSession(token));
}
