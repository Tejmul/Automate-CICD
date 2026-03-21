import { getDemoUser } from "./demoUser";

function joinUrl(base, path) {
  if (!base) return path;
  return `${String(base).replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function readErrorBody(res) {
  const contentType = res.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return await res.json();
    }
    return await res.text();
  } catch {
    return undefined;
  }
}

export class HttpError extends Error {
  constructor(message, { status, body, url } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

export async function apiFetch(path, { baseUrl, headers, ...init } = {}) {
  const url = joinUrl(baseUrl || import.meta.env.VITE_API_URL || "", path);
  const user = getDemoUser();

  const res = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      "x-user-email": user.email,
      ...(user.name ? { "x-user-name": user.name } : {}),
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    const message =
      body && typeof body === "object" && body.message
        ? body.message
        : `Request failed: ${res.status} ${res.statusText}`;
    throw new HttpError(message, { status: res.status, body, url });
  }

  if (res.status === 204) return null;
  return res.json();
}
