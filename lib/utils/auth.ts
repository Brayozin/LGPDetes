import { cookies } from "next/headers";

import { getAdminById, getUserById } from "@/lib/services/auth-service";
import { getAdminIdFromSession, getUserIdFromSession } from "@/lib/services/session-service";
import { ADMIN_SESSION_COOKIE, USER_SESSION_COOKIE } from "@/lib/utils/constants";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  return getUserById(getUserIdFromSession(token));
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return getAdminById(getAdminIdFromSession(token));
}
