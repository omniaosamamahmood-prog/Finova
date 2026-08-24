import api from "../services/api";

export function getInitials(name?: string) {
  if (!name?.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function resolveMediaUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (/^(https?:|blob:|data:)/i.test(pathOrUrl)) return pathOrUrl;

  const base = (api.defaults.baseURL ?? "http://localhost:5000").replace(
    /\/$/,
    ""
  );
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
