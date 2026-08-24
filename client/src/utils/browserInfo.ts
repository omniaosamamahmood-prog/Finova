function matchBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\/|Opera/i.test(userAgent)) return "Opera";
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari";
  return "Unknown browser";
}

function matchOs(userAgent: string): string {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Mac OS X/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown OS";
}

export function getBrowserInfo(): string {
  if (typeof navigator === "undefined") {
    return "";
  }

  const userAgent = navigator.userAgent || "";
  return `${matchBrowser(userAgent)} · ${matchOs(userAgent)}`;
}
