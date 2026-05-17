#!/usr/bin/env node
import { Command, type Data } from "commander-jsx";
import { detectPlatform } from "./utils.js";
import { extractBilibili } from "./extractors/bilibili.js";
import { extractXiaohongshu } from "./extractors/xiaohongshu.js";
import { extractGeneric } from "./extractors/generic.js";

interface CLIOptions {
  platform: Data;
}

function toPlatform(input: Data | undefined): string | undefined {
  return typeof input === "string" && input.trim() ? input : undefined;
}

async function extractSocialStats(url: string, platform?: string): Promise<void> {
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
}

await Command.execute(
  new Command<CLIOptions, Promise<void>>({
    name: "social-stats",
    version: "0.1.0",
    parameters: "<url>",
    description: "Fetch social content stats via OpenCLI",
    options: {
      platform: {
        shortcut: "p",
        parameters: "<platform>",
        description: "Force platform"
      }
    },
    executor: async (options, url) => {
      if (typeof url !== "string" || !url.trim()) {
        throw new Error("URL is required.");
      }
      await extractSocialStats(url, toPlatform(options.platform));
    }
  }),
  process.argv.slice(2)
);
