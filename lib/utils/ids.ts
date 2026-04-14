export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}

export function createProofToken() {
  return `agtok_demo_${Math.random().toString(36).slice(2, 12)}`;
}
