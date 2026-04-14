const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
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
