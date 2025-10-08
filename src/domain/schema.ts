import { TalentData } from '../types/save';
import { validateBirthDateString } from './dates';
import { normalizeDecimalString } from './numbers';

export function isThreeDecimalString(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  const str = String(value);
  return /^-?\d+(?:[\.,]\d+)?$/.test(str);
}

export function validateTalentEntry(entity: unknown): string[] {
  const messages: string[] = [];
  if (typeof entity !== 'object' || !entity) {
    messages.push('Entity is not an object');
    return messages;
  }

  const talent = entity as TalentData;
  if (typeof talent.id !== 'number') messages.push('Missing numeric id');
  if (typeof talent.firstNameId !== 'string') messages.push('Missing string firstNameId');
  if (typeof talent.lastNameId !== 'string') messages.push('Missing string lastNameId');
  if (!validateBirthDateString(talent.birthDate)) messages.push('birthDate not in DD-MM-YYYY');
  if (!talent.professions || typeof talent.professions !== 'object') {
    messages.push('Missing professions object');
  } else if ('Actor' in talent.professions && !isThreeDecimalString(talent.professions.Actor)) {
    messages.push('Actor skill not a decimal string');
  }

  const limit = talent.limit ?? talent.Limit;
  if (!isThreeDecimalString(limit)) messages.push('Missing limit/Limit decimal');

  if (talent.whiteTagsNEW && typeof talent.whiteTagsNEW !== 'object') {
    messages.push('whiteTagsNEW present but not an object');
  }

  return messages;
}

export function validateSaveSchema(root: unknown) {
  const result: { ok: boolean; warnings: string[] } = { ok: true, warnings: [] };
  if (!root || typeof root !== 'object') {
    result.ok = false;
    result.warnings.push('Save root is not an object.');
    return result;
  }

  const chars = (root as { characters?: TalentData[] }).characters;
  const list = Array.isArray(chars) ? chars : undefined;
  if (!list || !list.length) {
    result.ok = false;
    result.warnings.push('Could not locate characters array.');
    return result;
  }

  list.slice(0, 10).forEach((entity, index) => {
    const warnings = validateTalentEntry(entity);
    if (warnings.length) {
      result.ok = false;
      result.warnings.push(`characters[${index}]: ${warnings.join('; ')}`);
    }
  });
  return result;
}

export function syncLimitPair(entity: TalentData, value: unknown) {
  const normalized = normalizeDecimalString(value);
  entity.limit = normalized;
  entity.Limit = normalized;
}
