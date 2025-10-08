export type NameMap = string[];

export function getNameById(map: NameMap, idLike: unknown): string | undefined {
  const id = Number(idLike);
  if (!Number.isFinite(id) || id < 0 || id >= map.length) return undefined;
  return map[id];
}

export function fullName(
  map: NameMap,
  options: { firstId?: unknown; lastId?: unknown; customName?: unknown }
): string {
  const custom = typeof options.customName === 'string' ? options.customName.trim() : '';
  if (custom) return custom;

  const first = getNameById(map, options.firstId) ?? '';
  const last = getNameById(map, options.lastId) ?? '';
  const combined = `${first}${first && last ? ' ' : ''}${last}`.trim();
  if (combined) return combined;

  const fi = options.firstId ?? '?';
  const li = options.lastId ?? '?';
  return `Unknown Name (${fi} ${li})`;
}
