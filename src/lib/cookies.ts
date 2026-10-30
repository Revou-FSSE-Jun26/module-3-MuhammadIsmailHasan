type CookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
};

export function getCookie(name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const { maxAge, path = "/", sameSite = "Lax" } = options;
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, `path=${path}`];
  if (maxAge !== undefined) parts.push(`max-age=${maxAge}`);
  parts.push(`SameSite=${sameSite}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

export function deleteCookie(name: string, path = "/") {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`;
}
