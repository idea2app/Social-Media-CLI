import { createEmptyResult, type SocialStatsResult } from "../normalize.js";
import { firstDefined, pickByPaths, toNumberLoose } from "../utils.js";
import { bilibiliVideo, webRead } from "../opencli.js";

export async function extractBilibili(url: string): Promise<SocialStatsResult> {
  const result = createEmptyResult({ url, platform: "bilibili" });

  const primary = await bilibiliVideo(url);
  if (primary.ok && primary.json) {
    const j = primary.json;
    result.raw = j;

    result.title = firstDefined<string>(
      pickByPaths(j, ["title", "data.title", "video.title"]) as string | undefined
    );
    result.author = firstDefined<string>(
      pickByPaths(j, ["author", "owner.name", "data.owner.name", "video.owner.name"]) as
        | string
        | undefined
    );
    result.publishedAt = firstDefined<string | number>(
      pickByPaths(j, ["pubdate", "publish_time", "data.pubdate"]) as string | number | undefined
    );
    result.contentType = "video";

    result.statistic.view = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.view", "data.stat.view", "view", "play"]) as
          | string
          | number
          | undefined
      )
    );
    result.statistic.like = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.like", "data.stat.like", "like"]) as string | number | undefined
      )
    );
    result.statistic.coin = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.coin", "data.stat.coin", "coin"]) as string | number | undefined
      )
    );
    result.statistic.favorite = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.favorite", "data.stat.favorite", "favorite"]) as
          | string
          | number
          | undefined
      )
    );
    result.statistic.share = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.share", "data.stat.share", "share"]) as string | number | undefined
      )
    );
    result.statistic.comment = toNumberLoose(
      firstDefined(
        pickByPaths(j, ["stat.reply", "data.stat.reply", "comment", "reply"]) as
          | string
          | number
          | undefined
      )
    );

    result.notes.push("Used dedicated OpenCLI bilibili adapter.");
    return result;
  }

  const fallback = await webRead(url);
  result.notes.push("Dedicated bilibili adapter failed; fell back to web read.");

  if (fallback.ok && fallback.json) {
    result.raw = fallback.json;
  } else {
    result.notes.push("Fallback web read failed.");
  }

  return result;
}
