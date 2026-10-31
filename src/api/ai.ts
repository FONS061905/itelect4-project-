import { apiFetch } from "./client";
import type { AiItemHelp } from "../models";

// POST /api/ai -> a checked report for a lost or found item. Private, like
// items: the token is added by apiFetch, and the server holds the Gemini key.
export async function askAi(prompt: string): Promise<AiItemHelp> {
  return apiFetch<AiItemHelp>("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}
