import { GoogleGenAI } from "@google/genai";
import type { GitHubRepo } from "./github";
const initGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};
const ai = initGeminiClient();
const summaryCache = new Map<string, string>();
export async function generateRepoSummary(repo: GitHubRepo): Promise<string> {
  if (!ai) {
    throw new Error(
      "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file."
    );
  }
  const cacheKey = repo.full_name;
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)!;
  }
  const t = (repo as { topics?: string[] }).topics;
  const topicsStr = t ? t.join(", ") : "None";
  const prompt = `
You are a senior software engineer analyzing GitHub repositories. 
Analyze the following repository and write a very concise, insightful one-sentence summary (max 15 words) of what this repository likely does and its primary tech stack. Focus on the technical essence. Do not use filler words like "This is a repository that..." or "A project for...". Output ONLY the summary sentence.
Repository Name: ${repo.name}
Description: ${repo.description || "No description provided."}
Primary Language: ${repo.language || "Unknown"}
Topics: ${topicsStr}
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      //   model: "gemini-2.5-flash",

      contents: prompt,
    });
    const summary = response.text?.trim() || "AI could not generate a summary.";
    summaryCache.set(cacheKey, summary);
    return summary;
  } catch {
    throw new Error(
      "Failed to generate AI summary. Ensure your API key is valid."
    );
  }
}
export async function generateProfileSummary(
  username: string,
  bio: string | null,
  repoCount: number,
  languages: string[],
  topRepos: string[]
): Promise<string> {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }
  const cacheKey = `profile_${username}`;
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)!;
  }
  const prompt = `
You are an expert software engineering recruiter and tech analyst. Write a concise, 2-sentence professional summary (max 30 words total) of this developer's GitHub profile. 
Focus on identifying what kind of developer they are (frontend, backend, fullstack, devops, etc.), their primary tech stack, and the essence of the projects they build based on the top repos provided. Do not use generic filler words. Write directly about their technical focus.
Developer Username: ${username}
Bio: ${bio || "None"}
Public Repositories: ${repoCount}
Primary Languages: ${languages.length ? languages.join(", ") : "Unknown"}
Notable Repositories:
${topRepos.length ? topRepos.join("\n") : "None"}
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: prompt,
    });
    const summary =
      response.text?.trim() || "AI could not generate a profile summary.";
    summaryCache.set(cacheKey, summary);
    return summary;
  } catch {
    throw new Error("Failed to generate AI profile summary.");
  }
}
