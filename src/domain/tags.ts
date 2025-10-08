import { TalentData, TalentTag } from '../types/save';
import { normalizeDecimalString } from './numbers';

export type TagMap = Record<string, TalentTag>;

export function ensureWhiteTagsContainer(entity: TalentData): TagMap {
  if (!entity.whiteTagsNEW && entity.whiteTagsNew) {
    entity.whiteTagsNEW = entity.whiteTagsNew;
  }
  if (!entity.whiteTagsNEW || typeof entity.whiteTagsNEW !== 'object') {
    entity.whiteTagsNEW = {};
  }
  return entity.whiteTagsNEW;
}

export function ensureTag(entity: TalentData, tagId: string): TalentTag {
  const container = ensureWhiteTagsContainer(entity);
  const existing = container[tagId];
  if (!existing || typeof existing !== 'object') {
    container[tagId] = {
      overallValues: [],
      id: tagId,
      dateAdded: '0001-01-01T00:00:00',
      movieId: 0,
      value: '0.000',
      IsOverall: false
    };
    return container[tagId];
  }
  const tag = existing;
  if (!Array.isArray(tag.overallValues)) tag.overallValues = [];
  if (typeof tag.id !== 'string') tag.id = tagId;
  if (typeof tag.dateAdded !== 'string') tag.dateAdded = '0001-01-01T00:00:00';
  if (typeof tag.movieId !== 'number') tag.movieId = 0;
  tag.value = normalizeDecimalString(tag.value) || '0.000';
  if (typeof tag.IsOverall !== 'boolean') tag.IsOverall = false;
  return tag;
}

export function getTagValue(entity: TalentData, tagId: string): string {
  const container = entity.whiteTagsNEW || entity.whiteTagsNew;
  if (!container) return '0.000';
  const tag = container[tagId];
  return normalizeDecimalString(tag?.value ?? '0.000') || '0.000';
}
