#!/usr/bin/env node
import { Command, type Data } from "commander-jsx";
import { detectPlatform } from "./utils.js";
import { extractBilibili } from "./extractors/bilibili.js";
import { extractXiaohongshu } from "./extractors/xiaohongshu.js";
import { extractGeneric } from "./extractors/generic.js";

interface CLIOptions {
  platform: Data;
}

const toPlatform = (input: Data | undefined): string | undefined =>
  typeof input === "string" && input.trim() ? input : undefined;

const extractSocialStats = async (url: string, platform?: string): Promise<void> => {
  const finalPlatform = platform || detectPlatform(url);

  let result;
  switch (finalPlatform) {
    case "bilibili":
      result = await extractBilibili(url);
      break;
    case "xiaohongshu":
      result = await extractXiaohongshu(url);
      break;
    case "douyin":
    case "wechat_mp":
    case "wechat_channels":
    default:
      result = await extractGeneric(url, finalPlatform);
      break;
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
};

const runStatistic = async (options: { platform: Data }, url: Data) => {
  if (typeof url !== "string" || !url.trim()) throw new Error("URL is required.");
  await extractSocialStats(url, toPlatform(options.platform));
};

const statisticOptions = {
  platform: {
    shortcut: "p",
    parameters: "<platform>",
    description: "Force platform"
  }
} as const;

await Command.execute(
  <Command name="social-media" version="0.1.0" description="Command Line utility for Social Media">
    <Command<CLIOptions, Promise<void>>
      name="statistic"
      parameters="<url>"
      description="Fetch social content statistics via OpenCLI"
      options={statisticOptions}
      executor={runStatistic}
    />
    <Command
      name="stats"
      parameters="<url>"
      description='Alias of "statistic"'
      options={statisticOptions}
      executor={runStatistic}
    />
  </Command>,
  process.argv.slice(2)
);
