const TARGET_KEYS = ['budget', 'cash', 'reputation', 'influence'] as const;

export type StudioLike = Record<string, unknown>;

export function findStudioRoot(root: unknown): StudioLike | null {
  if (!root || typeof root !== 'object') return null;
  const visited = new WeakSet<object>();
  const queue: unknown[] = [root];
  let guard = 0;
  let best: StudioLike | null = null;
  let bestScore = -1;

  while (queue.length && guard++ < 200_000) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);

    if (!Array.isArray(current)) {
      const score = TARGET_KEYS.reduce((acc, key) => (Object.prototype.hasOwnProperty.call(current, key) ? acc + 1 : acc), 0);
      if (score > bestScore) {
        bestScore = score;
        best = current as StudioLike;
        if (score === TARGET_KEYS.length) break;
      }
    }

    const values = Array.isArray(current) ? current : Object.values(current);
    queue.push(...values);
  }

  return bestScore > 0 ? best : null;
}
