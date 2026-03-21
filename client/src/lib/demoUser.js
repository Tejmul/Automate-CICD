const STORAGE_KEY = "shopsmart.demoUser.v1";

export function getDemoUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email) return parsed;
    }
  } catch {
    // ignore
  }
  const fallback = {
    email: "demo@shopsmart.dev",
    name: "Demo User",
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
  } catch {
    // ignore
  }
  return fallback;
}

export function setDemoUser(next) {
  const user = {
    email: String(next?.email || "").trim(),
    name: next?.name ? String(next.name).trim() : undefined,
  };
  if (!user.email) throw new Error("Email is required");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}
