export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function firstDefined<T>(...values: (T | null | undefined | "")[]): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value as T;
  }
  return undefined;
}

export function toNumberLoose(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  const s = String(value).trim().replaceAll(",", "");
  if (!s) return undefined;

  const match = s.match(/^([\d.]+)\s*([万wW亿])?$/);
  if (!match) {
    const n = Number(s.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }

  const num = Number(match[1]);
  if (!Number.isFinite(num)) return undefined;

  const unit = match[2];
  if (!unit) return num;
  if (unit === "万" || unit === "w" || unit === "W") return Math.round(num * 10000);
  if (unit === "亿") return Math.round(num * 100000000);

  return num;
}

export function detectPlatform(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("bilibili.com") || u.includes("b23.tv")) return "bilibili";
  if (u.includes("xiaohongshu.com") || u.includes("xhslink.com")) return "xiaohongshu";
  if (u.includes("douyin.com")) return "douyin";
  if (u.includes("mp.weixin.qq.com")) return "wechat_mp";
  if (u.includes("channels.weixin.qq.com")) return "wechat_channels";
  return "generic";
}

export function pickByPaths(obj: unknown, paths: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  for (const path of paths) {
    let cur: unknown = obj;
    let ok = true;
    for (const key of path.split(".")) {
      if (cur && typeof cur === "object" && Object.prototype.hasOwnProperty.call(cur, key)) {
        cur = (cur as Record<string, unknown>)[key];
      } else {
        ok = false;
        break;
      }
    }
    if (ok) return cur;
  }
  return undefined;
}

export function regexNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const re of patterns) {
    const match = text.match(re);
    if (match?.[1]) {
      const n = toNumberLoose(match[1]);
      if (n !== undefined) return n;
    }
  }
  return undefined;
}
