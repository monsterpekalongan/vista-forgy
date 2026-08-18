// Web Crypto file encryption/decryption for .fgy format
// Pure TypeScript - NO framework/UI imports

const MAGIC = new Uint8Array([0x56, 0x46, 0x47, 0x59, 0x31]); // "VFGY1"
const FORMAT_VERSION = 1;
const PBKDF2_ITERATIONS = 250000;

export interface EncryptedFgyData {
  version: number;
  exportedAt: number;
  profile: Record<string, unknown>;
  skills: Record<string, unknown>;
  tiers: Record<string, unknown>;
  streak: Record<string, unknown>;
  stats: Record<string, unknown>;
  badges: string[];
}

export async function exportToFgy(payload: EncryptedFgyData, password: string): Promise<Blob> {
  const enc = new TextEncoder();
  const jsonStr = JSON.stringify(payload);
  const dataBytes = enc.encode(jsonStr);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBytes
  );

  // Layout: MAGIC (5B) + Version u16 BE (2B) + Salt (16B) + IV (12B) + Ciphertext
  const cipherBytes = new Uint8Array(ciphertext);
  const totalLength = MAGIC.length + 2 + salt.length + iv.length + cipherBytes.length;
  const buffer = new Uint8Array(totalLength);

  let offset = 0;
  buffer.set(MAGIC, offset); offset += MAGIC.length;
  buffer[offset] = (FORMAT_VERSION >> 8) & 0xff;
  buffer[offset + 1] = FORMAT_VERSION & 0xff;
  offset += 2;
  buffer.set(salt, offset); offset += salt.length;
  buffer.set(iv, offset); offset += iv.length;
  buffer.set(cipherBytes, offset);

  return new Blob([buffer], { type: 'application/octet-stream' });
}

export async function importFromFgy(buffer: ArrayBuffer, password: string): Promise<EncryptedFgyData> {
  const bytes = new Uint8Array(buffer);

  if (bytes.length < MAGIC.length + 2 + 16 + 12 + 16) {
    throw new Error('File terlalu kecil atau bukan format .fgy yang valid');
  }

  // Check magic header
  for (let i = 0; i < MAGIC.length; i++) {
    if (bytes[i] !== MAGIC[i]) {
      throw new Error('Format file tidak dikenal. Harus file .fgy Vista Forgy');
    }
  }

  let offset = MAGIC.length;
  const version = (bytes[offset] << 8) | bytes[offset + 1];
  offset += 2;

  if (version > FORMAT_VERSION) {
    throw new Error(`Versi format file (${version}) tidak didukung oleh versi aplikasi ini`);
  }

  const salt = bytes.slice(offset, offset + 16); offset += 16;
  const iv = bytes.slice(offset, offset + 12); offset += 12;
  const ciphertext = bytes.slice(offset);

  try {
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decrypted);
    return JSON.parse(jsonStr) as EncryptedFgyData;
  } catch {
    throw new Error('Password salah atau file rusak. Coba periksa lagi — file tidak bisa dibuka tanpa password yang benar.');
  }
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordBytes = enc.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function mergeImportData(current: any, imported: EncryptedFgyData): any {
  const merged = { ...current };

  // Merge skills: per-skill lastReviewTs latest wins
  merged.skills = { ...current.skills };
  if (imported.skills) {
    for (const [id, impSkill] of Object.entries(imported.skills as Record<string, any>)) {
      const curSkill = merged.skills[id];
      if (!curSkill || (impSkill.lastReviewTs || 0) > (curSkill.lastReviewTs || 0)) {
        merged.skills[id] = impSkill;
      }
    }
  }

  // Merge badges: union
  const badgeSet = new Set<string>([...(current.badges || []), ...(imported.badges || [])]);
  merged.badges = Array.from(badgeSet);

  // Merge streak: take best
  if (imported.streak) {
    const impStreak = imported.streak as any;
    merged.streak.best = Math.max(current.streak.best || 0, impStreak.best || 0);
    if ((impStreak.current || 0) > (current.streak.current || 0)) {
      merged.streak.current = impStreak.current;
      merged.streak.lastSessionDate = impStreak.lastSessionDate;
    }
  }

  // Merge examHistory: union by timestamp
  if (imported.tiers && (imported.tiers as any).examHistory) {
    const existingTs = new Set((current.tiers.examHistory || []).map((e: any) => e.ts));
    const newExams = ((imported.tiers as any).examHistory || []).filter((e: any) => !existingTs.has(e.ts));
    merged.tiers.examHistory = [...(current.tiers.examHistory || []), ...newExams];
  }

  return merged;
}
