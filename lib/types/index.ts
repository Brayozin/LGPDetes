export type PlatformStatus = "active" | "inactive" | "pilot";
export type ProviderKey = "gov" | "gmail";
export type ProviderType = "government_id" | "email_identity";
export type ProviderStatus = "active" | "degraded" | "inactive";
export type UserStatus = "active" | "review" | "disabled";
export type VerificationStatus =
  | "created"
  | "provider_pending"
  | "validating"
  | "completed"
  | "failed"
  | "revoked"
  | "expired";
export type VerificationReason =
  | "approved"
  | "minimum_age_not_met"
  | "provider_error"
  | "provider_unavailable"
  | "consent_denied"
  | "platform_inactive"
  | "provider_identity_already_linked"
  | "not_found";
export type ConnectionStatus = "active" | "revoked";
export type ConsentStatus = "approved" | "cancelled";
export type ClientSessionStatus = "pending" | "proof_issued" | "verified" | "denied" | "expired";
export type AuditStatus = "success" | "failure" | "info" | "warning";

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "operations";
  lastLoginAt: string;
}

export interface Platform {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: PlatformStatus;
  agePolicy: string;
  minAge: number;
  callbackUrl: string;
  providerIds: string[];
  category: string;
  createdAt: string;
  accent: string;
  logoLabel: string;
  monthlyChecks: number;
}

export interface Provider {
  id: string;
  key: ProviderKey;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  scopes: string[];
  lastSync: string;
  trustLevel: string;
  latencyMs: number;
  domainHint: string;
}

export interface ProviderProfile {
  id: string;
  providerId: string;
  providerSubject: string;
  displayName: string;
  status: "active" | "revoked";
  linkedAt: string;
  lastVerifiedAt: string;
}

export interface User {
  id: string;
  internalRef: string;
  fullName: string;
  email: string;
  password: string;
  status: UserStatus;
  age: number;
  ageBand: "16+" | "18+" | "21+" | "underage" | "unverified";
  ageVerified: boolean;
  primaryProviderId: string | null;
  linkedPlatformIds: string[];
  lastVerificationAt: string | null;
  createdAt: string;
  providerProfiles: ProviderProfile[];
}

export interface Connection {
  id: string;
  userId: string;
  platformId: string;
  providerId: string;
  status: ConnectionStatus;
  ageBand: string;
  proofToken: string;
  lastVerifiedAt: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  platformId: string;
  providerId: string;
  clientSessionId: string | null;
  status: ConsentStatus;
  scope: string;
  createdAt: string;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  platformId: string;
  providerId: string;
  clientSessionId: string | null;
  status: VerificationStatus;
  requestedMinAge: number;
  ageBand: string | null;
  verified: boolean;
  proofToken: string | null;
  reason: VerificationReason | null;
  providerPayload: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export interface ClientSession {
  id: string;
  platformId: string;
  platformName: string;
  status: ClientSessionStatus;
  requiredAge: number;
  verificationId: string | null;
  proofToken: string | null;
  responseSnapshot: Record<string, unknown> | null;
  createdAt: string;
  expiresAt: string;
}

export interface AuditLog {
  id: string;
  eventType: "verification" | "consent" | "platform" | "access" | "client" | "admin" | "provider";
  action: string;
  status: AuditStatus;
  actor: string;
  userId: string | null;
  providerId: string | null;
  platformId: string | null;
  verificationId: string | null;
  timestamp: string;
  reason: string | null;
  detail: string;
}

export interface DatabaseState {
  admins: AdminAccount[];
  platforms: Platform[];
  providers: Provider[];
  users: User[];
  connections: Connection[];
  consents: ConsentRecord[];
  verifications: VerificationRecord[];
  clientSessions: ClientSession[];
  auditLogs: AuditLog[];
  userSessions: Record<string, string>;
  adminSessions: Record<string, string>;
}

export interface DashboardSummary {
  totalPlatforms: number;
  activePlatforms: number;
  totalUsers: number;
  totalVerifications: number;
  successRate: number;
  recentActivity: AuditLog[];
}
