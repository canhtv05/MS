import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export interface GitHubRepo {
  stargazers_count: number;
  owner: {
    avatar_url: string;
  };
  description: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getInfoRepo(owner: string, repo: string): Promise<GitHubRepo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data: GitHubRepo = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num < 1000) return num.toString();
  const formatted = (num / 1000).toFixed(1);
  return `${formatted}k`;
}
