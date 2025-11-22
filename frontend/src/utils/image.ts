export const getAvatarUrl = (path: string | undefined | null) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  // Assuming backend is at localhost:3000 for now, or use env var
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};
