export function genUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const PUBLIC_ROUTERS = ['/sign-in', '/sign-up', '/landing', '/verify-email'];

export const detectLanguage = (content: string = ''): string => {
  const code = content?.trim();

  if (!code) return 'text';

  if (/^<!DOCTYPE html>/i.test(code) || /<\/?[a-z][\s\S]*>/i.test(code)) {
    return 'html';
  }

  if (/^[a-z0-9\s.#\-_]+\{[^}]+}/i.test(code) && !/(=>|\$)/.test(code)) {
    return 'css';
  }

  if (
    /def\s+\w+/.test(code) ||
    /if\s+__name__\s*==\s*['"]__main__['"]:/.test(code) ||
    /import\s+[\w.]+\s+as\s+\w+/.test(code) ||
    /from\s+[\w.]+\s+import/.test(code) ||
    (/print\s*\(/.test(code) && !/;/g.test(code) && !/\{/.test(code))
  ) {
    return 'python';
  }

  if (
    /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(code) &&
    /\b(FROM|INTO|TABLE|WHERE|VALUES)\b/i.test(code)
  ) {
    return 'sql';
  }

  if (code.startsWith('#!') || /\b(sudo|npm|yarn|docker|git|ls|cd|echo)\b/.test(code)) {
    return 'bash';
  }

  if (
    (code.startsWith('{') && code.endsWith('}')) ||
    (code.startsWith('[') && code.endsWith(']'))
  ) {
    if (/"\w+"\s*:/.test(code)) return 'json';
  }

  if (
    /package\s+main/.test(code) ||
    /func\s+\w+\(/.test(code) ||
    /fmt\.P/.test(code) ||
    /:=\s/.test(code)
  ) {
    return 'go';
  }

  if (
    /#include\s+<[\w.]+>/.test(code) ||
    /std::/.test(code) ||
    /cout\s*<</.test(code) ||
    /int\s+main\s*\(/.test(code)
  ) {
    return 'cpp';
  }

  if (
    /public\s+class/.test(code) ||
    /System\.out/.test(code) ||
    /public\s+static\s+void/.test(code) ||
    /ArrayList<|List</.test(code)
  ) {
    return 'java';
  }

  if (
    /import\s+.*\s+from/.test(code) ||
    /export\s+(default|const|class|function)/.test(code) ||
    /const\s+\w+/.test(code) ||
    /let\s+\w+/.test(code) ||
    /console\.log/.test(code) ||
    /=>/.test(code) ||
    /interface\s+\w+/.test(code) ||
    /<\w+\s*\/>/.test(code)
  ) {
    return 'tsx';
  }

  if (
    /\b(if|while|for|switch|catch)\s*\(/.test(code) ||
    /\{[\s\S]*\}/.test(code) ||
    /(\+\+|--|&&|\|\||===|!==)/.test(code)
  ) {
    return 'java';
  }

  return 'text';
};

export const getDateLabel = (dateStr: string, t: (key: string) => string): string => {
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return t('today');
  }
  if (date.getTime() === yesterday.getTime()) {
    return t('yesterday');
  }
  return dateStr;
};
