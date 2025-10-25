import { useCallback, useMemo } from 'preact/hooks';
import { TalentRoleView, type TalentColumnDefinition, type TalentRoleRow } from './TalentRoleView';
import { useAppStore } from '../state';
import { getTagValue, normalizeDecimalString } from '../domain';
import type { TalentData } from '../types/save';
import { TagValueInput } from '../components/TagValueInput';

function parseUnit(value: unknown, fallback = 0): number {
  const normalized = normalizeDecimalString(value ?? '');
  if (normalized === '') return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function ActorsView() {
  const store = useAppStore();

  const extraColumns = useMemo<TalentColumnDefinition[]>(() => {
    return [
      {
        id: 'art',
        label: 'Artistic Appeal',
        sortable: true,
        sortValue: (row) => (typeof row.art === 'number' ? row.art : 0),
        render: (row) => (
          <TagValueInput
            value={typeof row.art === 'number' ? row.art : 0}
            icon="🎭"
            title="Artistic Appeal (enter 0.0–10.0; saved as 0.000–1.000)."
            onCommit={(value) => store.actions.updateActorTag(row.entity, 'ART', value)}
          />
        )
      },
      {
        id: 'com',
        label: 'Commercial Appeal',
        sortable: true,
        sortValue: (row) => (typeof row.com === 'number' ? row.com : 0),
        render: (row) => (
          <TagValueInput
            value={typeof row.com === 'number' ? row.com : 0}
            icon="⭐"
            title="Commercial Appeal (enter 0.0–10.0; saved as 0.000–1.000)."
            onCommit={(value) => store.actions.updateActorTag(row.entity, 'COM', value)}
          />
        )
      }
    ];
  }, [store.actions]);

  const augmentRow = useCallback((row: TalentRoleRow, entity: TalentData) => {
    row.art = parseUnit(getTagValue(entity, 'ART'), 0);
    row.com = parseUnit(getTagValue(entity, 'COM'), 0);
  }, []);

  return <TalentRoleView kind="actor" augmentRow={augmentRow} extraColumns={extraColumns} />;
}
