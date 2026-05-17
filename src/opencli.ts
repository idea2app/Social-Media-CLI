import { $ } from "zx";
import { safeJsonParse } from "./utils.js";

export interface OpenCLIResult<J, E> {
  ok: boolean;
  stdout: string;
  stderr: string;
  json?: J;
  error?: E;
}

export async function runOpenCLI<J = unknown, E = unknown>(
  args: string[],
  timeout = 120_000
): Promise<OpenCLIResult<J, E>> {
  try {
    const { stdout: output, stderr: errorOutput, exitCode } =
      await $({ timeout, nothrow: true })`opencli ${args}`;
    const stdout = output.toString();
    const stderr = errorOutput.toString();

    return {
      ok: exitCode === 0,
      stdout,
      stderr,
      json: safeJsonParse<J | null>(stdout, null) ?? undefined
    };
  } catch (error) {
    return {
      ok: false,
      error: error as E,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error)
    };
  }
}

export const webRead = <J = unknown, E = unknown>(url: string) =>
  runOpenCLI<J, E>(["web", "read", "--url", url, "-f", "json", "--download-images", "false"]);

export const bilibiliVideo = <J = unknown, E = unknown>(url: string) =>
  runOpenCLI<J, E>(["bilibili", "video", url, "-f", "json"]);

export const xhsNote = <J = unknown, E = unknown>(url: string) =>
  runOpenCLI<J, E>(["xiaohongshu", "note", url, "-f", "json"]);

export const xhsComments = <J = unknown, E = unknown>(url: string) =>
  runOpenCLI<J, E>(["xiaohongshu", "comments", url, "-f", "json"]);
