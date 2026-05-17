#!/usr/bin/env node
import { Command } from "commander-jsx";
import { detectPlatform } from "./utils.js";
import { extractBilibili } from "./extractors/bilibili.js";
import { extractXiaohongshu } from "./extractors/xiaohongshu.js";
import { extractGeneric } from "./extractors/generic.js";

async function handle(url: string, platform?: string): Promise<void> {
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

Command.execute(
  <Command
    name="social-stats"
    version="0.1.0"
    parameters="<url>"
    description="Fetch social content stats via OpenCLI"
    options={{
      platform: {
        shortcut: "p",
        parameters: "<platform>",
        description: "Force platform"
      }
    }}
    executor={async ({ platform }: { platform?: string }, url: string) => {
      await handle(url, platform);
    }}
  />,
  process.argv.slice(2)
);
