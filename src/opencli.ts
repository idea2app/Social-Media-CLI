import { $ } from "zx";
import { safeJsonParse } from "./utils.js";

export interface OpenCLIResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  json?: unknown;
  error?: unknown;
}

export async function runOpenCLI(args: string[], timeout = 120_000): Promise<OpenCLIResult> {
  try {
    const output = await $({ timeout, nothrow: true })`opencli ${args}`;
    const stdout = output.stdout.toString();
    const stderr = output.stderr.toString();

    return {
      ok: output.exitCode === 0,
      stdout,
      stderr,
      json: safeJsonParse(stdout, null)
    };
  } catch (error) {
    return {
      ok: false,
      error,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error)
    };
  }
}

export function webRead(url: string): Promise<OpenCLIResult> {
  return runOpenCLI(["web", "read", "--url", url, "-f", "json", "--download-images", "false"]);
}

export function bilibiliVideo(url: string): Promise<OpenCLIResult> {
  return runOpenCLI(["bilibili", "video", url, "-f", "json"]);
}

export function xhsNote(url: string): Promise<OpenCLIResult> {
  return runOpenCLI(["xiaohongshu", "note", url, "-f", "json"]);
}

export function xhsComments(url: string): Promise<OpenCLIResult> {
  return runOpenCLI(["xiaohongshu", "comments", url, "-f", "json"]);
}
