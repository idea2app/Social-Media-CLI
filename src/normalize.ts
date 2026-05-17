export interface SocialStatsResult {
  url: string;
  platform: string;
  title?: string;
  author?: string;
  publishedAt?: string | number;
  contentType?: string;
  stats: {
    like?: number;
    favorite?: number;
    share?: number;
    comment?: number;
    view?: number;
    coin?: number;
  };
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
    stats: {
      like: undefined,
      favorite: undefined,
      share: undefined,
      comment: undefined,
      view: undefined,
      coin: undefined
    },
    comments: [],
    raw: null,
    notes: []
  };
}
