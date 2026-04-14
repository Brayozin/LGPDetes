import { appendAuditLog, getDb } from "@/lib/mock-db/store";
import type { DashboardSummary, PlatformStatus, Provider, ProviderKey, ProviderType, ProviderStatus } from "@/lib/types";
import { createId } from "@/lib/utils/ids";

export function getDashboardSummary(): DashboardSummary {
  const db = getDb();
  const finalized = db.verifications.filter((entry) => entry.status === "completed" || entry.status === "failed");
  const successful = finalized.filter((entry) => entry.status === "completed").length;

  return {
    totalPlatforms: db.platforms.length,
    activePlatforms: db.platforms.filter((entry) => entry.status === "active").length,
    totalUsers: db.users.length,
    totalVerifications: db.verifications.length,
    successRate: finalized.length ? successful / finalized.length : 0,
    recentActivity: db.auditLogs.slice(0, 8)
  };
}

export function listPlatforms() {
  return getDb().platforms;
}

export function updatePlatformStatus(platformId: string, status: PlatformStatus, actor = "Admin") {
  const db = getDb();
  const platform = db.platforms.find((entry) => entry.id === platformId);

  if (!platform) {
    return null;
  }

  platform.status = status;

  appendAuditLog({
    id: createId("log"),
    eventType: "platform",
    action: "platform_status_changed",
    status: "success",
    actor,
    userId: null,
    providerId: null,
    platformId,
    verificationId: null,
    timestamp: new Date().toISOString(),
    reason: null,
    detail: `${platform.name} status changed to ${status}.`
  });

  return platform;
}

export function listProviders() {
  return getDb().providers;
}

export function createProvider(input: {
  name: string;
  key: ProviderKey;
  type: ProviderType;
  status: ProviderStatus;
  scopes: string[];
  domainHint: string;
}) {
  const db = getDb();
  const provider: Provider = {
    id: createId("prv"),
    name: input.name,
    key: input.key,
    type: input.type,
    status: input.status,
    scopes: input.scopes,
    lastSync: new Date().toISOString(),
    trustLevel: input.key === "gov" ? "Public-sector identity source" : "Consumer account with prior verification signal",
    latencyMs: input.key === "gov" ? 480 : 650,
    domainHint: input.domainHint
  };

  db.providers.unshift(provider);

  appendAuditLog({
    id: createId("log"),
    eventType: "provider",
    action: "provider_registered",
    status: "success",
    actor: "Admin",
    userId: null,
    providerId: provider.id,
    platformId: null,
    verificationId: null,
    timestamp: new Date().toISOString(),
    reason: null,
    detail: `Provider configuration ${provider.name} was added.`
  });

  return provider;
}

export function listUsers() {
  return getDb().users;
}

export function listAuditLogs() {
  return getDb().auditLogs;
}
