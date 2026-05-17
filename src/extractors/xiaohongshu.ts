import { createEmptyResult, type SocialStatsResult } from "../normalize.js";
import { firstDefined, pickByPaths, toNumberLoose } from "../utils.js";
import { xhsComments, xhsNote, webRead } from "../opencli.js";

export async function extractXiaohongshu(url: string): Promise<SocialStatsResult> {
  const result = createEmptyResult({ url, platform: "xiaohongshu" });

  const note = await xhsNote(url);
  if (note.ok && note.json) {
    const j = note.json;
    result.raw = { note: j };

    result.title = firstDefined<string>(
      pickByPaths(j, ["title", "data.title", "note.title"]) as string | undefined
    );
    result.author = firstDefined<string>(
      pickByPaths(j, [
        "user.nickname",
        "author.nickname",
        "data.user.nickname",
        "note.user.nickname"
      ]) as string | undefined
    );
    result.publishedAt = firstDefined<string | number>(
      pickByPaths(j, ["time", "publish_time", "data.time"]) as string | number | undefined
    );
    result.contentType = "note";

    result.stats.like = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["liked_count", "interact_info.liked_count", "data.interact_info.liked_count"]) as
          | string
          | number
          | undefined
      )
    );
    result.stats.favorite = toNumberLoose(
      firstDefined(
        pickByPaths(j, [
          "collected_count",
          "interact_info.collected_count",
          "data.interact_info.collected_count"
        ]) as string | number | undefined
      )
    );
    result.stats.comment = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["comment_count", "interact_info.comment_count", "data.interact_info.comment_count"]) as
          | string
          | number
          | undefined
      )
    );
    result.stats.share = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["share_count", "interact_info.share_count", "data.interact_info.share_count"]) as
          | string
          | number
          | undefined
      )
    );

    result.notes.push("Used dedicated OpenCLI xiaohongshu note adapter.");
  } else {
    result.notes.push("Dedicated xiaohongshu note adapter failed.");
  }

  const comments = await xhsComments(url);
  if (comments.ok && comments.json) {
    const data = comments.json as { comments?: unknown[]; data?: unknown[] };
    const arr = Array.isArray(comments.json)
      ? comments.json
      : firstDefined(data.comments, data.data, []);

    if (Array.isArray(arr)) {
      result.comments = arr.slice(0, 20);
    }

    if (result.raw && typeof result.raw === "object") {
      (result.raw as Record<string, unknown>).comments = comments.json;
    } else {
      result.raw = { comments: comments.json };
    }

    result.notes.push("Fetched comments using dedicated OpenCLI xiaohongshu comments adapter.");
    return result;
  }

  const fallback = await webRead(url);
  result.notes.push("Comment adapter unavailable; fell back to web read.");

  if (fallback.ok && fallback.json) {
    if (!result.raw || typeof result.raw !== "object") result.raw = {};
    (result.raw as Record<string, unknown>).web = fallback.json;
  }

  return result;
}
