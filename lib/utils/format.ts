const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short"
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium"
});

export function formatDateTime(value: string | number | Date) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | number | Date) {
  return dateFormatter.format(new Date(value));
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function maskToken(token: string) {
  if (token.length <= 12) {
    return token;
  }

  return `${token.slice(0, 10)}…${token.slice(-4)}`;
}

export function formatPlatformStatus(value: string) {
  return {
    active: "Ativa",
    pilot: "Piloto",
    inactive: "Inativa"
  }[value] ?? value;
}

export function formatProviderStatus(value: string) {
  return {
    active: "Ativo",
    degraded: "Instável",
    inactive: "Inativo"
  }[value] ?? value;
}

export function formatConnectionStatus(value: string) {
  return {
    active: "Ativo",
    revoked: "Revogado"
  }[value] ?? value;
}

export function formatVerificationStatus(value: string) {
  return {
    created: "Criada",
    provider_pending: "Aguardando provedor",
    validating: "Validando",
    completed: "Concluída",
    failed: "Falhou",
    revoked: "Revogada",
    expired: "Expirada"
  }[value] ?? value;
}

export function formatVerificationReason(value: string | null | undefined) {
  if (!value) {
    return "Sem detalhe";
  }

  return {
    approved: "Aprovado",
    minimum_age_not_met: "Idade mínima não atingida",
    provider_error: "Erro no provedor",
    provider_unavailable: "Provedor indisponível",
    consent_denied: "Consentimento negado",
    platform_inactive: "Plataforma inativa",
    provider_identity_already_linked: "Identidade do provedor já vinculada",
    not_found: "Não encontrado"
  }[value] ?? value.replaceAll("_", " ");
}
