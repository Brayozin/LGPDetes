import { getDb } from "@/lib/mock-db/store";
import { createId } from "@/lib/utils/ids";

export function createUserSession(userId: string) {
  const db = getDb();
  const token = createId("usess");
  db.userSessions[token] = userId;
  return token;
}

export function createAdminSession(adminId: string) {
  const db = getDb();
  const token = createId("asess");
  db.adminSessions[token] = adminId;
  return token;
}

export function getUserIdFromSession(token?: string | null) {
  if (!token) {
    return null;
  }

  return getDb().userSessions[token] ?? null;
}

export function getAdminIdFromSession(token?: string | null) {
  if (!token) {
    return null;
  }

  return getDb().adminSessions[token] ?? null;
}

export function destroyUserSession(token?: string | null) {
  if (!token) {
    return;
  }

  delete getDb().userSessions[token];
}

export function destroyAdminSession(token?: string | null) {
  if (!token) {
    return;
  }

  delete getDb().adminSessions[token];
}
