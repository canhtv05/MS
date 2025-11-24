import axios from 'axios';
import { genUUID } from './common';
import { ClientContext } from '@/types/common';

let cachedContext: ClientContext | null = null;

export async function getClientIP(): Promise<string> {
  try {
    const res = await axios.get('https://api.ipify.org?format=json', {
      timeout: 3000,
    });
    return res.data?.ip || '0.0.0.0';
  } catch {
    return '0.0.0.0';
  }
}

export function getUserAgent(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent;
  }
  return 'unknown';
}

export async function getClientContext(): Promise<ClientContext> {
  if (cachedContext) return cachedContext;

  const ip = await getClientIP();
  const userAgent = getUserAgent();
  const uuid = genUUID();

  cachedContext = {
    ip,
    channel: 'WEB',
    context: `${uuid}_${userAgent}`,
  };

  return cachedContext!;
}
