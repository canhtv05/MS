import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface IGitHubRepo {
  full_name: string;
  stargazers_count: number;
  owner: {
    avatar_url: string;
  };
  description: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getInfoRepo(owner: string, repo: string): Promise<IGitHubRepo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data: IGitHubRepo = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function formatNumberString(num: number | null | undefined): string {
  if (num === null || num === undefined || num < 0) {
    return '0';
  }

  return new Intl.NumberFormat(detectLocale(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

export function detectLocale(): string {
  if (typeof window !== 'undefined') {
    return navigator.language || navigator.languages?.[0] || 'vi-VN';
  }

  return 'vi-VN';
}

export function formatDateFromISOString(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(detectLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatWebsiteUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
