import { APP_KEY } from '@/utils/cookieUtils';
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
    const { language } = JSON.parse(localStorage.getItem(APP_KEY) || '{}') as { language: string };
    if (language === 'vi') return 'vi-VN';
    else if (language === 'en') return 'en-US';
    return navigator.language || navigator.languages?.[0] || 'vi-VN';
  }

  return 'vi-VN';
}

export function formatDateFromISOString(dateString: string): string {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }

  const res = new Intl.DateTimeFormat(detectLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
  const resSplit = res.split(' ');
  return resSplit[0].includes(',')
    ? `${resSplit[0].split(',')[0]} ${resSplit[1]}`
    : `${resSplit[1]} ${resSplit[0]}`;
}

export function formatWebsiteUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

export function normalizeWebsiteUrl(url: string): string {
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return trimmedUrl;
  if (/^https?:\/\//i.test(trimmedUrl)) return trimmedUrl;
  return `https://${trimmedUrl}`;
}

export function hasValue(obj: unknown, target: unknown): boolean {
  if (obj === target) return true;

  if (Array.isArray(obj)) {
    return obj.some(v => hasValue(v, target));
  }

  if (obj && typeof obj === 'object') {
    return Object.values(obj).some(v => hasValue(v, target));
  }

  return false;
}
