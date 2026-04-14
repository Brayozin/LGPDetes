import { appendAuditLog, getDb } from "@/lib/mock-db/store";
import { createId } from "@/lib/utils/ids";

export function requestAgeCheck(input: { platformId: string }) {
  const db = getDb();
  const platform = db.platforms.find((entry) => entry.id === input.platformId);
  if (!platform) {
    return null;
  }

  const clientSession = {
    id: createId("cls"),
    platformId: platform.id,
    platformName: platform.name,
    status: "pending" as const,
    requiredAge: platform.minAge,
    verificationId: null,
    proofToken: null,
    responseSnapshot: null,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  };

  db.clientSessions.unshift(clientSession);

  const nextPath = encodeURIComponent(
    `/user/providers?platformId=${platform.id}&clientSessionId=${clientSession.id}`
  );

  appendAuditLog({
    id: createId("log"),
    eventType: "client",
    action: "age_check_requested",
    status: "success",
    actor: `${platform.name} API`,
    userId: null,
    providerId: null,
    platformId: platform.id,
    verificationId: null,
    timestamp: clientSession.createdAt,
    reason: null,
    detail: `${platform.name} requested a new age proof session.`
  });

  return {
    session: clientSession,
    startUrl: `/user/login?platformId=${platform.id}&clientSessionId=${clientSession.id}&next=${nextPath}`
  };
}

export function getClientSessionStatus(sessionId: string) {
  return getDb().clientSessions.find((entry) => entry.id === sessionId) ?? null;
}

export function exchangeProof(input: { sessionId: string; proofToken: string }) {
  const db = getDb();
  const session = db.clientSessions.find((entry) => entry.id === input.sessionId);
  if (!session) {
    return {
      verified: false,
      reason: "session_not_found"
    };
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    session.status = "expired";
    return {
      verified: false,
      reason: "session_expired"
    };
  }

  if (session.status === "denied" && session.responseSnapshot) {
    return session.responseSnapshot;
  }

  const verification = db.verifications.find(
    (entry) => entry.id === session.verificationId && entry.proofToken === input.proofToken
  );

  if (!verification || verification.status !== "completed") {
    return {
      verified: false,
      reason: "invalid_proof_token"
    };
  }

  const provider = db.providers.find((entry) => entry.id === verification.providerId);
  const payload = {
    verified: true,
    age_band: verification.ageBand,
    proof_token: verification.proofToken,
    provider: provider?.key ?? "unknown",
    expires_at: verification.expiresAt
  };

  session.status = "verified";
  session.responseSnapshot = payload;

  appendAuditLog({
    id: createId("log"),
    eventType: "client",
    action: "proof_exchanged",
    status: "success",
    actor: `${session.platformName} API`,
    userId: verification.userId,
    providerId: verification.providerId,
    platformId: verification.platformId,
    verificationId: verification.id,
    timestamp: new Date().toISOString(),
    reason: null,
    detail: `${session.platformName} exchanged a proof token for an age-band result.`
  });

  return payload;
}
