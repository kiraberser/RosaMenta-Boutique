import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  auth?: boolean;
  tags?: string[];
  revalidate?: number | false;
};

function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) return endpoint;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const full = path.startsWith(API_PREFIX) ? path : `${API_PREFIX}${path}`;
  return `${API_BASE}${full}`;
}

function isServer(): boolean {
  return typeof window === "undefined";
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (!isServer()) return {};
  try {
    const access = cookies().get("access_cookie")?.value;
    return access ? { Authorization: `Bearer ${access}` } : {};
  } catch {
    return {};
  }
}

export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, auth = true, tags, revalidate, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  let serializedBody: BodyInit | undefined;
  if (body != null) {
    if (body instanceof FormData || typeof body === "string") {
      serializedBody = body as BodyInit;
    } else {
      serializedBody = JSON.stringify(body);
      finalHeaders["Content-Type"] ??= "application/json";
    }
  }

  if (auth) {
    Object.assign(finalHeaders, await getAuthHeader());
  }

  const next: { tags?: string[]; revalidate?: number | false } = {};
  if (tags) next.tags = tags;
  if (revalidate !== undefined) next.revalidate = revalidate;

  const res = await fetch(resolveUrl(endpoint), {
    ...rest,
    headers: finalHeaders,
    body: serializedBody,
    ...(Object.keys(next).length ? { next } : {}),
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : null) ??
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  return payload as T;
}

export { API_BASE, API_PREFIX };
