import { appendAuditLog, getDb } from "@/lib/mock-db/store";
import type { Connection, ConsentRecord } from "@/lib/types";
import { createId } from "@/lib/utils/ids";

export function listUserPlatforms(userId: string) {
  const db = getDb();
  const activeConnectionIds = new Set(
    db.connections.filter((entry) => entry.userId === userId && entry.status === "active").map((entry) => entry.platformId)
  );

  return db.platforms.map((platform) => ({
    ...platform,
    connected: activeConnectionIds.has(platform.id)
  }));
}

export function listUserProviders() {
  return getDb().providers.filter((entry) => entry.status !== "inactive");
}

export function createConsent(input: {
  userId: string;
  platformId: string;
  providerId: string;
  clientSessionId?: string | null;
  approved: boolean;
}) {
  const db = getDb();
  const consent: ConsentRecord = {
    id: createId("consent"),
    userId: input.userId,
    platformId: input.platformId,
    providerId: input.providerId,
    clientSessionId: input.clientSessionId ?? null,
    status: input.approved ? "approved" : "cancelled",
    scope: "age_band_only",
    createdAt: new Date().toISOString()
  };

  db.consents.unshift(consent);

  appendAuditLog({
    id: createId("log"),
    eventType: "consent",
    action: input.approved ? "consent_approved" : "consent_cancelled",
    status: input.approved ? "success" : "warning",
    actor: "End User",
    userId: input.userId,
    providerId: input.providerId,
    platformId: input.platformId,
    verificationId: null,
    timestamp: consent.createdAt,
    reason: input.approved ? null : "consent_denied",
    detail: input.approved
      ? "User approved the age-band-only disclosure step."
      : "User cancelled the age-band-only disclosure step."
  });

  return consent;
}

export function listConnections(userId: string) {
  const db = getDb();
  const platformMap = new Map(db.platforms.map((entry) => [entry.id, entry]));
  const providerMap = new Map(db.providers.map((entry) => [entry.id, entry]));

  const connections = db.connections
    .filter((entry) => entry.userId === userId)
    .map((entry) => ({
      ...entry,
      platform: platformMap.get(entry.platformId) ?? null,
      provider: providerMap.get(entry.providerId) ?? null
    }));

  const verificationHistory = db.verifications
    .filter((entry) => entry.userId === userId)
    .map((entry) => ({
      ...entry,
      platform: platformMap.get(entry.platformId) ?? null,
      provider: providerMap.get(entry.providerId) ?? null
    }))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return {
    connections,
    verificationHistory
  };
}

export function revokeConnection(userId: string, connectionId: string) {
  const db = getDb();
  const connection = db.connections.find((entry) => entry.id === connectionId && entry.userId === userId);

  if (!connection) {
    return null;
  }

  connection.status = "revoked";
  connection.revokedAt = new Date().toISOString();

  appendAuditLog({
    id: createId("log"),
    eventType: "access",
    action: "connection_revoked",
    status: "info",
    actor: "End User",
    userId,
    providerId: connection.providerId,
    platformId: connection.platformId,
    verificationId: null,
    timestamp: connection.revokedAt,
    reason: null,
    detail: "The end user revoked a previously issued access grant."
  });

  return connection;
}

export function upsertConnection(input: Omit<Connection, "id" | "createdAt" | "revokedAt">) {
  const db = getDb();
  const existing = db.connections.find(
    (entry) => entry.userId === input.userId && entry.platformId === input.platformId
  );

  if (existing) {
    existing.providerId = input.providerId;
    existing.status = input.status;
    existing.ageBand = input.ageBand;
    existing.proofToken = input.proofToken;
    existing.lastVerifiedAt = input.lastVerifiedAt;
    existing.revokedAt = null;
    return existing;
  }

  const connection: Connection = {
    id: createId("conn"),
    userId: input.userId,
    platformId: input.platformId,
    providerId: input.providerId,
    status: input.status,
    ageBand: input.ageBand,
    proofToken: input.proofToken,
    lastVerifiedAt: input.lastVerifiedAt,
    createdAt: new Date().toISOString(),
    revokedAt: null
  };

  db.connections.unshift(connection);
  return connection;
}
