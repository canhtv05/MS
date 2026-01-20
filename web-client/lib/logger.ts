/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from '@/environments/environment.dev';

export const logger = {
  log: (...args: any[]): void => {
    if (!environment.production) {
      console.log(...args);
    }
  },
  error: (...args: any[]): void => {
    console.error(...args);
  },
  warn: (...args: any[]): void => {
    if (!environment.production) {
      console.warn(...args);
    }
  },
  info: (...args: any[]): void => {
    if (!environment.production) {
      console.info(...args);
    }
  },
  debug: (...args: any[]): void => {
    if (!environment.production) {
      console.debug(...args);
    }
  },
  trace: (...args: any[]): void => {
    if (!environment.production) {
      console.trace(...args);
    }
  },
};
