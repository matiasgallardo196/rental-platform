import { NEXT_PUBLIC_API_URL as API_URL } from "@/lib/env.loader";

export function getApiBase(): string | undefined {
  return API_URL;
}

export function buildApiUrl(path: string): string | undefined {
  const base = getApiBase();
  if (!base) return undefined;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${clean}`;
}

export async function getJson<T>(
  path: string,
  fallback: T,
  init?: RequestInit
): Promise<T> {
  const url = buildApiUrl(path);
  if (!url) return fallback;
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
