#!/usr/bin/env python3
"""
Extract a small actor-only sample from a full Hollywood Animal save.

Usage:
  python extract_actor_sample.py /path/to/full_save.json /path/to/output.json --limit 10

Notes:
  - Keeps only fields relevant to the editor to reduce size.
  - Preserves values and shapes for compatibility checks (professions, limit/Limit, whiteTagsNEW, birthDate, names, ids).
"""
import argparse
import json
import sys
from collections import deque


def is_talent_array(arr):
    if not isinstance(arr, list) or not arr:
        return False
    x = arr[0]
    if not isinstance(x, dict):
        return False
    if '$type' in x and isinstance(x['$type'], str) and 'talentdata' in x['$type'].lower():
        return True
    if 'firstNameId' in x and 'lastNameId' in x:
        return True
    if 'professions' in x and isinstance(x['professions'], dict) and 'Actor' in x['professions']:
        return True
    return False


def extract_characters(root):
    if isinstance(root, list) and is_talent_array(root):
        return root
    if isinstance(root, dict) and isinstance(root.get('characters'), list) and is_talent_array(root['characters']):
        return root['characters']
    visited = set()
    q = deque([root])
    while q:
        cur = q.popleft()
        if id(cur) in visited:
            continue
        visited.add(id(cur))
        if isinstance(cur, list):
            if is_talent_array(cur):
                return cur
            for it in cur:
                q.append(it)
        elif isinstance(cur, dict):
            for v in cur.values():
                q.append(v)
    return None


KEEP_KEYS = {
    'id', 'firstNameId', 'lastNameId', 'birthDate', 'deathDate', 'gender',
    'professions', 'limit', 'Limit', 'whiteTagsNEW', 'whiteTags', 'movies'
}


def slim_actor_entry(e):
    out = {}
    for k in KEEP_KEYS:
        if k in e:
            out[k] = e[k]
    # Keep only a subset of tags to reduce noise
    w = out.get('whiteTagsNEW')
    if isinstance(w, dict):
        subset = {}
        for key in list(w.keys()):
            if key in ('ART', 'COM', 'ROMANCE', 'ACTION'):
                subset[key] = w[key]
        out['whiteTagsNEW'] = subset
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('input', help='Full save JSON path')
    ap.add_argument('output', help='Output sample JSON path')
    ap.add_argument('--limit', type=int, default=10, help='Number of actors to include')
    args = ap.parse_args()

    # Use utf-8-sig to tolerate BOM in exported saves
    with open(args.input, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)

    chars = extract_characters(data)
    if not isinstance(chars, list):
        print('Could not locate characters array in input save.', file=sys.stderr)
        sys.exit(2)

    actors = [e for e in chars if isinstance(e, dict) and isinstance(e.get('professions'), dict) and 'Actor' in e['professions']]
    sample = actors[: max(0, args.limit)]
    slimmed = [slim_actor_entry(e) for e in sample]

    out_obj = {
        'meta': {
            'source': args.input,
            'count': len(slimmed)
        },
        'characters': slimmed
    }

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(out_obj, f, ensure_ascii=False, indent=2)

    print(f'Wrote actor-only sample: {args.output} ({len(slimmed)} actors)')


if __name__ == '__main__':
    main()



