// ═══════════════════════════════════════════════════════
//  HTTP client — thin wrapper over fetch()
//
//  Used by the service layer when a backend API is available
//  (VITE_API_URL set). Falls through to local data files
//  otherwise — see contentService.js for that branching logic.
// ═══════════════════════════════════════════════════════

export const API_URL = import.meta.env.VITE_API_URL || "";
export const API_ENABLED = Boolean(import.meta.env.VITE_API_URL);

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
