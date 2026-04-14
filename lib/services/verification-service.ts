import { appendAuditLog, getDb } from "@/lib/mock-db/store";
import type { Platform, Provider, User, VerificationRecord, VerificationReason } from "@/lib/types";
import { getAgeBand, meetsMinimumAge } from "@/lib/utils/age";
import { createId, createProofToken } from "@/lib/utils/ids";
import { upsertConnection } from "@/lib/services/user-service";

function getPlatform(platformId: string) {
  return getDb().platforms.find((entry) => entry.id === platformId) ?? null;
}

function getProvider(providerId: string) {
  return getDb().providers.find((entry) => entry.id === providerId) ?? null;
}

function getUser(userId: string) {
  return getDb().users.find((entry) => entry.id === userId) ?? null;
}

function buildProviderSubject(user: User, provider: Provider) {
  if (provider.key === "gov") {
    return `gov:${user.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${user.internalRef.toLowerCase()}`;
  }

  const local = user.email.split("@")[0]?.replace(/[^a-z0-9.]+/g, ".") ?? "user";
  return `gmail:${local}.proxy@gmail.com`;
}

function getOrCreateProviderProfile(user: User, provider: Provider) {
  const db = getDb();
  const existing = user.providerProfiles.find((entry) => entry.providerId === provider.id && entry.status === "active");
  if (existing) {
    return {
      profile: existing
    };
  }

  const subject = buildProviderSubject(user, provider);
  const conflict = db.users.find(
    (candidate) =>
      candidate.id !== user.id &&
      candidate.providerProfiles.some(
        (entry) => entry.providerId === provider.id && entry.providerSubject === subject && entry.status === "active"
      )
  );

  if (conflict) {
    return {
      error: "provider_identity_already_linked" as const
    };
  }

  const profile = {
    id: createId("prof"),
    providerId: provider.id,
    providerSubject: subject,
    displayName: provider.key === "gov" ? user.fullName : `${subject.replace("gmail:", "")}`,
    status: "active" as const,
    linkedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString()
  };

  user.providerProfiles.push(profile);
  if (!user.primaryProviderId) {
    user.primaryProviderId = provider.id;
  }

  return {
    profile
  };
}

function createFailureRecord(input: {
  userId: string;
  platform: Platform;
  provider: Provider;
  clientSessionId?: string | null;
  reason: VerificationReason;
}) {
  const db = getDb();
  const record: VerificationRecord = {
    id: createId("ver"),
    userId: input.userId,
    platformId: input.platform.id,
    providerId: input.provider.id,
    clientSessionId: input.clientSessionId ?? null,
    status: "failed",
    requestedMinAge: input.platform.minAge,
    ageBand: null,
    verified: false,
    proofToken: null,
    reason: input.reason,
    providerPayload: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: null
  };

  db.verifications.unshift(record);
  return record;
}

function updateClientSessionFailure(verification: VerificationRecord, reason: VerificationReason) {
  if (!verification.clientSessionId) {
    return;
  }

  const session = getDb().clientSessions.find((entry) => entry.id === verification.clientSessionId);
  if (!session) {
    return;
  }

  session.status = "denied";
  session.verificationId = verification.id;
  session.responseSnapshot = {
    verified: false,
    reason
  };
}

export function startVerification(input: {
  userId: string;
  platformId: string;
  providerId: string;
  clientSessionId?: string | null;
}) {
  const db = getDb();
  const user = getUser(input.userId);
  const platform = getPlatform(input.platformId);
  const provider = getProvider(input.providerId);

  if (!user || !platform || !provider) {
    return null;
  }

  if (platform.status === "inactive") {
    const failure = createFailureRecord({
      userId: user.id,
      platform,
      provider,
      clientSessionId: input.clientSessionId,
      reason: "platform_inactive"
    });
    updateClientSessionFailure(failure, "platform_inactive");
    return failure;
  }

  if (provider.status === "inactive") {
    const failure = createFailureRecord({
      userId: user.id,
      platform,
      provider,
      clientSessionId: input.clientSessionId,
      reason: "provider_unavailable"
    });
    updateClientSessionFailure(failure, "provider_unavailable");
    return failure;
  }

  const linkResult = getOrCreateProviderProfile(user, provider);
  if ("error" in linkResult) {
    const failure = createFailureRecord({
      userId: user.id,
      platform,
      provider,
      clientSessionId: input.clientSessionId,
      reason: "provider_identity_already_linked"
    });
    updateClientSessionFailure(failure, "provider_identity_already_linked");
    return failure;
  }

  const verification: VerificationRecord = {
    id: createId("ver"),
    userId: user.id,
    platformId: platform.id,
    providerId: provider.id,
    clientSessionId: input.clientSessionId ?? null,
    status: "provider_pending",
    requestedMinAge: platform.minAge,
    ageBand: null,
    verified: false,
    proofToken: null,
    reason: null,
    providerPayload: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  };

  db.verifications.unshift(verification);

  if (input.clientSessionId) {
    const session = db.clientSessions.find((entry) => entry.id === input.clientSessionId);
    if (session) {
      session.verificationId = verification.id;
    }
  }

  appendAuditLog({
    id: createId("log"),
    eventType: "verification",
    action: "verification_started",
    status: "info",
    actor: "LGPDetes Proxy",
    userId: user.id,
    providerId: provider.id,
    platformId: platform.id,
    verificationId: verification.id,
    timestamp: verification.createdAt,
    reason: null,
    detail: `Verification started for ${platform.name} using ${provider.name}.`
  });

  return verification;
}

export function getVerificationStatus(verificationId: string) {
  const db = getDb();
  const verification = db.verifications.find((entry) => entry.id === verificationId);
  if (!verification) {
    return null;
  }

  return {
    ...verification,
    platform: db.platforms.find((entry) => entry.id === verification.platformId) ?? null,
    provider: db.providers.find((entry) => entry.id === verification.providerId) ?? null
  };
}

export function providerCallback(verificationId: string) {
  const verification = getDb().verifications.find((entry) => entry.id === verificationId);
  if (!verification) {
    return null;
  }

  if (verification.status === "completed" || verification.status === "failed") {
    return verification;
  }

  const user = getUser(verification.userId);
  const provider = getProvider(verification.providerId);
  if (!user || !provider) {
    verification.status = "failed";
    verification.reason = "not_found";
    verification.updatedAt = new Date().toISOString();
    return verification;
  }

  verification.status = "validating";
  verification.ageBand = getAgeBand(user.age);
  verification.providerPayload = {
    iss: provider.key === "gov" ? "gov_identity" : "gmail_account",
    provider: provider.key,
    age_over_18: user.age >= 18,
    age_over_21: user.age >= 21,
    subject_hash: user.providerProfiles.find((entry) => entry.providerId === provider.id)?.providerSubject ?? null
  };
  verification.updatedAt = new Date().toISOString();

  appendAuditLog({
    id: createId("log"),
    eventType: "verification",
    action: "provider_callback_received",
    status: "success",
    actor: provider.name,
    userId: user.id,
    providerId: provider.id,
    platformId: verification.platformId,
    verificationId: verification.id,
    timestamp: verification.updatedAt,
    reason: null,
    detail: "Provider callback received and payload moved into validation."
  });

  return verification;
}

export function finalizeVerification(verificationId: string) {
  const db = getDb();
  const verification = db.verifications.find((entry) => entry.id === verificationId);
  if (!verification) {
    return null;
  }

  if (verification.status === "completed" || verification.status === "failed") {
    return verification;
  }

  const user = getUser(verification.userId);
  const platform = getPlatform(verification.platformId);
  const provider = getProvider(verification.providerId);
  if (!user || !platform || !provider) {
    verification.status = "failed";
    verification.reason = "not_found";
    verification.updatedAt = new Date().toISOString();
    return verification;
  }

  if (!verification.providerPayload) {
    verification.status = "failed";
    verification.reason = "provider_error";
    verification.updatedAt = new Date().toISOString();
    updateClientSessionFailure(verification, "provider_error");
    return verification;
  }

  if (!meetsMinimumAge(user.age, verification.requestedMinAge)) {
    verification.status = "failed";
    verification.verified = false;
    verification.reason = "minimum_age_not_met";
    verification.updatedAt = new Date().toISOString();
    updateClientSessionFailure(verification, "minimum_age_not_met");

    appendAuditLog({
      id: createId("log"),
      eventType: "verification",
      action: "verification_denied",
      status: "failure",
      actor: "LGPDetes Proxy",
      userId: user.id,
      providerId: provider.id,
      platformId: platform.id,
      verificationId: verification.id,
      timestamp: verification.updatedAt,
      reason: "minimum_age_not_met",
      detail: `${user.fullName} did not meet ${platform.name}'s ${verification.requestedMinAge}+ rule.`
    });

    return verification;
  }

  verification.status = "completed";
  verification.verified = true;
  verification.reason = "approved";
  verification.ageBand = getAgeBand(user.age);
  verification.proofToken = createProofToken();
  verification.expiresAt = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
  verification.updatedAt = new Date().toISOString();

  user.ageVerified = true;
  user.ageBand = getAgeBand(user.age);
  user.lastVerificationAt = verification.updatedAt;
  if (!user.linkedPlatformIds.includes(platform.id)) {
    user.linkedPlatformIds.push(platform.id);
  }

  const profile = user.providerProfiles.find((entry) => entry.providerId === provider.id);
  if (profile) {
    profile.lastVerifiedAt = verification.updatedAt;
  }

  upsertConnection({
    userId: user.id,
    platformId: platform.id,
    providerId: provider.id,
    status: "active",
    ageBand: verification.ageBand,
    proofToken: verification.proofToken,
    lastVerifiedAt: verification.updatedAt
  });

  if (verification.clientSessionId) {
    const session = db.clientSessions.find((entry) => entry.id === verification.clientSessionId);
    if (session) {
      session.status = "proof_issued";
      session.verificationId = verification.id;
      session.proofToken = verification.proofToken;
      session.responseSnapshot = {
        verified: true,
        age_band: verification.ageBand,
        proof_token: verification.proofToken,
        provider: provider.key,
        expires_at: verification.expiresAt
      };
    }
  }

  appendAuditLog({
    id: createId("log"),
    eventType: "verification",
    action: "verification_finalized",
    status: "success",
    actor: "LGPDetes Proxy",
    userId: user.id,
    providerId: provider.id,
    platformId: platform.id,
    verificationId: verification.id,
    timestamp: verification.updatedAt,
    reason: "approved",
    detail: `Issued ${verification.ageBand} proof token for ${platform.name}.`
  });

  return verification;
}
