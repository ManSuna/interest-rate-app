export const METADATA_KEY = 'metadata';

export function getMetadata() {
  try {
    if (typeof window === 'undefined') return null; // For SSR environments
    const raw = localStorage.getItem(METADATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Safe getter by "a.b.c" style path
export function getMetaPath(obj, path, fallback) {
  if (!obj) return fallback;
  return path
    .split('.')
    .reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj) ??
    fallback;
}

export function setMetadata(value) {
  localStorage.setItem(METADATA_KEY, JSON.stringify(value ?? {}));
}

export function mergeMetadata(patch) {
  const cur = getMetadata() ?? {};
  setMetadata({ ...cur, ...patch });
}