export interface SocialStatsResult {
  url: string;
  platform: string;
  title?: string;
  author?: string;
  publishedAt?: string | number;
  contentType?: string;
  statistic: Partial<Record<"like" | "favorite" | "share" | "comment" | "view" | "coin", number>>;
  comments: unknown[];
  raw: unknown;
  notes: string[];
}

export function createEmptyResult({
  url,
  platform
}: {
  url: string;
  platform: string;
}): SocialStatsResult {
  return {
    url,
    platform,
    title: undefined,
    author: undefined,
    publishedAt: undefined,
    contentType: undefined,
    statistic: {},
    comments: [],
    raw: null,
    notes: []
  };
}
