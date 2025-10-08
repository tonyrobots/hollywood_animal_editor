import { TalentData } from '../types/save';

export function validateBirthDateString(value: unknown): boolean {
  return typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value);
}

export function parseBirthDateParts(str: string | undefined) {
  if (!str) return null;
  const match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (![day, month, year].every(Number.isFinite)) return null;
  return { day, month, year };
}

export function formatBirthDate(day: number, month: number, year: number): string {
  const dd = String(day || 1).padStart(2, '0');
  const mm = String(month || 1).padStart(2, '0');
  const yyyy = String(year || 1).padStart(4, '0');
  return `${dd}-${mm}-${yyyy}`;
}

export function extractYearFromDateString(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = value.match(/^(\d{4})-\d{2}-\d{2}T/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

export function parseYearFromDateTime(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = value.match(/^(\d{4})-/);
  if (!match) return '';
  return match[1];
}

export function computeGameYearFromData(root: unknown): number | null {
  const years: number[] = [];
  const timestampYears: number[] = [];
  const visited = new WeakSet<object>();
  const queue: unknown[] = [root];
  let guard = 0;

  while (queue.length && guard++ < 200_000) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (typeof value === 'string') {
        const year = extractYearFromDateString(value);
        if (year) {
          if (key === 'gameDate') years.push(year);
          else if (key === 'timestamp' || key.toLowerCase().includes('date')) timestampYears.push(year);
        }
      } else if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }

  if (years.length) return Math.max(...years);
  if (!timestampYears.length) return null;

  const counts = new Map<number, number>();
  for (const year of timestampYears) {
    if (year < 1850 || year > 2050) continue;
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }

  let bestYear: number | null = null;
  let bestCount = -1;
  for (const [year, count] of counts.entries()) {
    if (count > bestCount || (count === bestCount && bestYear !== null && year <= 2000 && bestYear > 2000)) {
      bestYear = year;
      bestCount = count;
    }
  }
  return bestYear;
}

export function getAge(entity: TalentData, gameYear: number | null): number | '' {
  if (!gameYear) return '';
  const parts = parseBirthDateParts(typeof entity.birthDate === 'string' ? entity.birthDate : undefined);
  if (!parts || parts.year <= 1) return '';
  const age = gameYear - parts.year;
  return age >= 0 && age <= 200 ? age : '';
}
