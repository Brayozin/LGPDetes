import adminsSeed from "@/lib/mock-db/json/admins.json";
import auditLogsSeed from "@/lib/mock-db/json/audit-logs.json";
import clientSessionsSeed from "@/lib/mock-db/json/client-sessions.json";
import connectionsSeed from "@/lib/mock-db/json/connections.json";
import consentsSeed from "@/lib/mock-db/json/consents.json";
import platformsSeed from "@/lib/mock-db/json/platforms.json";
import providersSeed from "@/lib/mock-db/json/providers.json";
import usersSeed from "@/lib/mock-db/json/users.json";
import verificationsSeed from "@/lib/mock-db/json/verifications.json";
import type { AdminAccount, AuditLog, DatabaseState, ProviderProfile, User } from "@/lib/types";

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

function syncSeededUserIdentity(db: DatabaseState) {
  for (const seedUser of usersSeed as User[]) {
    const currentUser = db.users.find((entry) => entry.id === seedUser.id);
    if (!currentUser) {
      continue;
    }

    currentUser.internalRef = seedUser.internalRef;
    currentUser.fullName = seedUser.fullName;
    currentUser.email = seedUser.email;
    currentUser.password = seedUser.password;

    const syncedProfiles: ProviderProfile[] = currentUser.providerProfiles.map((profile) => {
      const seedProfile = seedUser.providerProfiles.find((entry) => entry.id === profile.id);
      if (!seedProfile) {
        return profile;
      }

      return {
        ...profile,
        providerId: seedProfile.providerId,
        providerSubject: seedProfile.providerSubject,
        displayName: seedProfile.displayName
      };
    });

    currentUser.providerProfiles = syncedProfiles;
  }
}

function syncSeededAdminIdentity(db: DatabaseState) {
  for (const seedAdmin of adminsSeed as AdminAccount[]) {
    const currentAdmin = db.admins.find((entry) => entry.id === seedAdmin.id);
    if (!currentAdmin) {
      continue;
    }

    currentAdmin.name = seedAdmin.name;
    currentAdmin.email = seedAdmin.email;
    currentAdmin.password = seedAdmin.password;
    currentAdmin.role = seedAdmin.role;
  }
}

export function getDb() {
  if (!globalThis.__ageGateProxyDb) {
    globalThis.__ageGateProxyDb = createInitialState();
  }

  syncSeededAdminIdentity(globalThis.__ageGateProxyDb);
  syncSeededUserIdentity(globalThis.__ageGateProxyDb);

  return globalThis.__ageGateProxyDb;
}

export function appendAuditLog(entry: AuditLog) {
  const db = getDb();
  db.auditLogs.unshift(entry);
}
