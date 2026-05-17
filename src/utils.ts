import get from "lodash.get";
import { isEmpty } from "web-utility";

export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function firstDefined<T>(...values: (T | null | undefined)[]): T | undefined {
  for (const value of values) if (value != null) return value;

  return undefined;
}

export function toNumberLoose(value: unknown): number | undefined {
  if (isEmpty(value)) return;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  const string = String(value).trim().replaceAll(",", "");
  if (!string) return;

  const [, number, unit] = string.match(/^(\d+\.?\d*)\s*([万wW亿])?$/) || [];

  if (!number) {
    const number = Number(string.replace(/[^\d.-]/g, ""));
    return Number.isFinite(number) ? number : undefined;
  }

  const num = Number(number);
  if (!Number.isFinite(num)) return;

  if (!unit) return num;
  if (unit === "万" || unit === "w" || unit === "W") return Math.round(num * 10000);
  if (unit === "亿") return Math.round(num * 100000000);

  return num;
}

export function detectPlatform(url: string): string {
  try {
    const { hostname } = new URL(url);
    const host = hostname.toLowerCase();

    if (host === "b23.tv" || host === "bilibili.com" || host.endsWith(".bilibili.com"))
      return "bilibili";
    if (
      host === "xhslink.com" ||
      host === "xiaohongshu.com" ||
      host.endsWith(".xiaohongshu.com")
    )
      return "xiaohongshu";
    if (host === "douyin.com" || host.endsWith(".douyin.com")) return "douyin";
    if (host === "mp.weixin.qq.com") return "wechat_mp";
    if (host === "channels.weixin.qq.com") return "wechat_channels";
    return "generic";
  } catch {
    return "generic";
  }
}

export function pickByPaths(obj: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = get(obj, path);
    if (value !== undefined) return value;
  }

  return undefined;
}

export function regexNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const regexp of patterns) {
    const [, match] = text.match(regexp) || [];

    if (match) {
      const number = toNumberLoose(match);
      if (number != null) return number;
    }
  }

  return undefined;
}
