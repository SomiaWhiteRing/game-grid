const SHARE_ID_PATTERN = /^[a-f0-9]{16}$/;

function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes);

  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(buffer);
  } else {
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(buffer, (value) => value.toString(16).padStart(2, "0")).join("");
}

export function createShareId(): string {
  return randomHex(8);
}

export function normalizeShareId(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return SHARE_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function assertShareId(value: string | null | undefined): string {
  const normalized = normalizeShareId(value);
  if (!normalized) {
    throw new Error("invalid_share_id");
  }
  return normalized;
}
