import { createEmptyResult, type SocialStatsResult } from "../normalize.js";
import { regexNumber } from "../utils.js";
import { webRead } from "../opencli.js";

function stringifyWebReadPayload(payload: unknown): string {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return JSON.stringify(payload, null, 2);
}

export async function extractGeneric(url: string, platform = "generic"): Promise<SocialStatsResult> {
  const result = createEmptyResult({ url, platform });

  const read = await webRead(url);
  if (!read.ok || !read.json) {
    result.notes.push("web read failed");
    return result;
  }

  result.raw = read.json;
  const text = stringifyWebReadPayload(read.json);

  result.statistic.like = regexNumber(text, [
    /点赞[^\d]{0,8}([\d.万wW亿]+)/,
    /like[^\d]{0,8}([\d.万wW亿]+)/i
  ]);

  result.statistic.favorite = regexNumber(text, [
    /收藏[^\d]{0,8}([\d.万wW亿]+)/,
    /favorite[^\d]{0,8}([\d.万wW亿]+)/i,
    /bookmark[^\d]{0,8}([\d.万wW亿]+)/i
  ]);

  result.statistic.share = regexNumber(text, [
    /转发[^\d]{0,8}([\d.万wW亿]+)/,
    /分享[^\d]{0,8}([\d.万wW亿]+)/,
    /share[^\d]{0,8}([\d.万wW亿]+)/i
  ]);

  result.statistic.comment = regexNumber(text, [
    /评论[^\d]{0,8}([\d.万wW亿]+)/,
    /comment[^\d]{0,8}([\d.万wW亿]+)/i
  ]);

  result.statistic.view = regexNumber(text, [
    /播放[^\d]{0,8}([\d.万wW亿]+)/,
    /观看[^\d]{0,8}([\d.万wW亿]+)/,
    /view[^\d]{0,8}([\d.万wW亿]+)/i,
    /play[^\d]{0,8}([\d.万wW亿]+)/i
  ]);

  result.notes.push("Used generic OpenCLI web read heuristic extraction.");
  return result;
}
