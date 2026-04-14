import adminsSeed from "@/lib/mock-db/json/admins.json";
import auditLogsSeed from "@/lib/mock-db/json/audit-logs.json";
import clientSessionsSeed from "@/lib/mock-db/json/client-sessions.json";
import connectionsSeed from "@/lib/mock-db/json/connections.json";
import consentsSeed from "@/lib/mock-db/json/consents.json";
import platformsSeed from "@/lib/mock-db/json/platforms.json";
import providersSeed from "@/lib/mock-db/json/providers.json";
import usersSeed from "@/lib/mock-db/json/users.json";
import verificationsSeed from "@/lib/mock-db/json/verifications.json";
import type { AuditLog, DatabaseState } from "@/lib/types";

declare global {
  // eslint-disable-next-line no-var
  var __ageGateProxyDb: DatabaseState | undefined;
}

function createInitialState(): DatabaseState {
  return structuredClone({
    admins: adminsSeed,
    auditLogs: auditLogsSeed,
    clientSessions: clientSessionsSeed,
    connections: connectionsSeed,
    consents: consentsSeed,
    platforms: platformsSeed,
    providers: providersSeed,
    users: usersSeed,
    verifications: verificationsSeed,
    userSessions: {},
    adminSessions: {}
  }) as DatabaseState;
}

export function getDb() {
  if (!globalThis.__ageGateProxyDb) {
    globalThis.__ageGateProxyDb = createInitialState();
  }

  return globalThis.__ageGateProxyDb;
}

export function appendAuditLog(entry: AuditLog) {
  const db = getDb();
  db.auditLogs.unshift(entry);
}
