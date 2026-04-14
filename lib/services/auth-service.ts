import { appendAuditLog, getDb } from "@/lib/mock-db/store";
import type { AdminAccount, User } from "@/lib/types";
import { getAgeBand } from "@/lib/utils/age";
import { createId } from "@/lib/utils/ids";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function loginAdmin(email: string, password: string) {
  const db = getDb();
  const admin = db.admins.find(
    (entry) => normalizeEmail(entry.email) === normalizeEmail(email) && entry.password === password
  );

  if (!admin) {
    return null;
  }

  admin.lastLoginAt = new Date().toISOString();
  appendAuditLog({
    id: createId("log"),
    eventType: "admin",
    action: "admin_login",
    status: "success",
    actor: admin.name,
    userId: null,
    providerId: null,
    platformId: null,
    verificationId: null,
    timestamp: new Date().toISOString(),
    reason: null,
    detail: "Admin authenticated via the dashboard login screen."
  });

  return admin;
}

export function loginUser(email: string, password: string) {
  const db = getDb();
  const user = db.users.find(
    (entry) => normalizeEmail(entry.email) === normalizeEmail(email) && entry.password === password
  );

  return user ?? null;
}

export function registerUser(input: { fullName: string; email: string; password: string; age: number }) {
  const db = getDb();
  const email = normalizeEmail(input.email);

  const existing = db.users.find((entry) => normalizeEmail(entry.email) === email);
  if (existing) {
    return {
      error: "An account already exists for that email."
    };
  }

  const ageBand = getAgeBand(input.age);
  const user: User = {
    id: createId("usr"),
    internalRef: `AGP-${Math.floor(1000 + Math.random() * 8000)}`,
    fullName: input.fullName.trim(),
    email,
    password: input.password,
    status: "active",
    age: input.age,
    ageBand,
    ageVerified: false,
    primaryProviderId: null,
    linkedPlatformIds: [],
    lastVerificationAt: null,
    createdAt: new Date().toISOString(),
    providerProfiles: []
  };

  db.users.unshift(user);

  appendAuditLog({
    id: createId("log"),
    eventType: "access",
    action: "user_registered",
    status: "success",
    actor: user.fullName,
    userId: user.id,
    providerId: null,
    platformId: null,
    verificationId: null,
    timestamp: new Date().toISOString(),
    reason: null,
    detail: `Created AgeGate Proxy user ${user.internalRef}.`
  });

  return {
    user
  };
}

export function getAdminById(adminId: string | null | undefined): AdminAccount | null {
  if (!adminId) {
    return null;
  }

  return getDb().admins.find((entry) => entry.id === adminId) ?? null;
}

export function getUserById(userId: string | null | undefined): User | null {
  if (!userId) {
    return null;
  }

  return getDb().users.find((entry) => entry.id === userId) ?? null;
}
