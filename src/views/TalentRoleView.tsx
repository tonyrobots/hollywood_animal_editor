import { createContext } from 'preact';
import type { ComponentChild, ComponentChildren } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { AgeField } from '../components/AgeField';
import { SliderField } from '../components/SliderField';
import { ROLE_CONFIG, type SupportedKind, useAppStore } from '../state';
import { TalentDetailDrawer } from './TalentDetailDrawer';
import { fullName, getAge, normalizeDecimalString } from '../domain';
import type { TalentData } from '../types/save';

export interface TalentColumnDefinition {
  id: string;
  label: string;
  sortable?: boolean;
  sortValue?: (row: RoleRow) => string | number;
  render: (row: RoleRow) => ComponentChild;
}

interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

export interface TalentRoleRow extends Record<string, unknown> {
  entity: TalentData;
  displayName: string;
  skill: number;
  limit: number;
  age: number | '';
  studio: string | null;
  idLabel: string;
}
type RoleRow = TalentRoleRow;

function parseUnit(value: unknown, fallback = 0): number {
  const normalized = normalizeDecimalString(value ?? '');
  if (normalized === '') return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

interface SkillLimitContextValue {
  skillPreview: number | null;
  limitPreview: number | null;
  setSkillPreview: (value: number | null) => void;
  setLimitPreview: (value: number | null) => void;
  skillBase: number;
  limitBase: number;
}

const SkillLimitContext = createContext<SkillLimitContextValue | null>(null);

function SkillLimitProvider({ row, children }: { row: RoleRow; children: ComponentChildren }) {
  const [skillPreview, setSkillPreview] = useState<number | null>(null);
  const [limitPreview, setLimitPreview] = useState<number | null>(null);

  useEffect(() => {
    setSkillPreview(null);
    setLimitPreview(null);
  }, [row.entity, row.skill, row.limit]);

  const value = useMemo<SkillLimitContextValue>(
    () => ({
      skillPreview,
      limitPreview,
      setSkillPreview,
      setLimitPreview,
      skillBase: row.skill,
      limitBase: row.limit
    }),
    [skillPreview, limitPreview, row.skill, row.limit]
  );

  return <SkillLimitContext.Provider value={value}>{children}</SkillLimitContext.Provider>;
}

function useSkillLimitContext(): SkillLimitContextValue | null {
  return useContext(SkillLimitContext);
}

function SkillSliderCell({ kind, row, tooltip }: { kind: SupportedKind; row: RoleRow; tooltip: string }) {
  const store = useAppStore();
  const context = useSkillLimitContext();
  if (!context) {
    return (
      <SliderField
        value={row.skill}
        min={0}
        max={1}
        step={0.01}
        onCommit={(value) => store.actions.updateSkill(kind, row.entity, value)}
        title={tooltip}
      />
    );
  }

  const skillBase = context.skillBase;
  const limitBase = context.limitBase;
  const skillValue = context.skillPreview ?? skillBase;

  return (
    <SliderField
      value={skillValue}
      min={0}
      max={1}
      step={0.01}
      onChange={(value) => {
        context.setSkillPreview(value);
        // If skill moves above limit, raise limit to match
        const currentEffectiveLimit = context.limitPreview !== null ? context.limitPreview : limitBase;
        if (value > currentEffectiveLimit) {
          context.setLimitPreview(value);
        }
      }}
      onCommit={(value) => {
        store.actions.updateSkill(kind, row.entity, value);
        context.setSkillPreview(null);
        // Don't clear limitPreview here - let the useEffect handle it after entity updates
      }}
      title={tooltip}
    />
  );
}

function LimitSliderCell({ kind, row }: { kind: SupportedKind; row: RoleRow }) {
  const store = useAppStore();
  const context = useSkillLimitContext();
  if (!context) {
    return (
      <SliderField
        value={row.limit}
        min={0}
        max={1}
        step={0.01}
        onCommit={(value) => store.actions.updateLimit(kind, row.entity, value)}
        title="Limit cannot be reduced below current skill."
      />
    );
  }

  const skillBase = context.skillBase;
  const limitBase = context.limitBase;
  const skillValue = context.skillPreview ?? skillBase;
  const limitRaw = context.limitPreview ?? limitBase;
  const limitValue = Math.max(limitRaw, skillValue);

  return (
    <SliderField
      value={limitValue}
      min={0}
      max={1}
      step={0.01}
      onChange={(value) => {
        // Clamp to skill level - can't go below current skill
        const clamped = Math.max(value, skillValue);
        context.setLimitPreview(clamped);
      }}
      onCommit={(value) => {
        // Clamp to skill level before committing
        const clamped = Math.max(value, skillValue);
        store.actions.updateLimit(kind, row.entity, clamped);
        context.setLimitPreview(null);
      }}
      title="Limit cannot be reduced below current skill."
    />
  );
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'string' || typeof b === 'string') {
    return String(a).localeCompare(String(b));
  }
  const numericA = Number(a);
  const numericB = Number(b);
  return numericA - numericB;
}

export interface TalentRoleViewProps {
  kind: SupportedKind;
  augmentRow?: (row: RoleRow, entity: TalentData) => void;
  extraColumns?: TalentColumnDefinition[];
  extraColumnInsertIndex?: number;
}

export function TalentRoleView({ kind, augmentRow, extraColumns, extraColumnInsertIndex }: TalentRoleViewProps) {
  const store = useAppStore();
  const config = ROLE_CONFIG[kind];
  const collectionKey = config.collectionKey;
  const filteredKey = config.filteredKey;
  const filtersSignal = store.signals.filters[collectionKey];
  const filters = filtersSignal.value;
  const globalFilters = store.signals.globalFilters.value;
  const playerStudioOnly = globalFilters.playerStudioOnly;
  const gameYear = store.signals.gameYear.value;
  const save = store.signals.save.value;
  const collectionSignal = store.signals[collectionKey];
  const baseCount = collectionSignal.value.length;
  const derivedSignal = store.derived[filteredKey];
  const entities = derivedSignal.value;
  const names = store.signals.names.value;

  const [selectedEntity, setSelectedEntity] = useState<TalentData | null>(null);
  const [sortState, setSortState] = useState<SortState>({ columnId: 'name', direction: 'asc' });

  useEffect(() => {
    if (!save) {
      setSelectedEntity(null);
    }
  }, [save]);

  const filteredCount = entities.length;
  const pluralLower = config.title.toLowerCase();
  const subtitle =
    filteredCount === baseCount
      ? `${baseCount} ${pluralLower} loaded`
      : `${filteredCount} of ${baseCount} ${pluralLower} shown`;

  const rows = useMemo<RoleRow[]>(() => {
    const professionKey = config.professionKey;
    return entities.map((entity) => {
      const displayName = names
        ? fullName(names, {
            firstId: entity.firstNameId,
            lastId: entity.lastNameId,
            customName: entity.customName
          })
        : entity.customName ||
          `${entity.firstNameId ?? ''}${entity.firstNameId && entity.lastNameId ? ' ' : ''}${entity.lastNameId ?? ''}`.trim() ||
          `Unknown ${config.detailLabel}`;
      const skill = parseUnit(entity.professions?.[professionKey] ?? '0');
      const limitRaw = parseUnit(entity.limit ?? entity.Limit ?? '', skill);
      const limit = limitRaw < skill ? skill : limitRaw;
      const age = getAge(entity, gameYear);
      const row: RoleRow = {
        entity,
        displayName,
        skill,
        limit,
        age,
        studio: entity.studioId ?? null,
        idLabel: entity.id != null ? String(entity.id) : '—'
      };
      augmentRow?.(row, entity);
      return row;
    });
  }, [entities, names, gameYear, config, augmentRow]);

  const columns = useMemo<TalentColumnDefinition[]>(() => {
    const baseColumns: TalentColumnDefinition[] = [
      {
        id: 'name',
        label: 'Name',
        sortable: true,
        sortValue: (row) => row.displayName.toLowerCase(),
        render: (row) => (
          <button type="button" class="link-button" onClick={() => setSelectedEntity(row.entity)}>
            {row.displayName}
          </button>
        )
      },
      {
        id: 'skill',
        label: 'Skill',
        sortable: true,
        sortValue: (row) => row.skill,
        render: (row) => <SkillSliderCell kind={kind} row={row} tooltip={config.skillTooltip} />
      },
      {
        id: 'limit',
        label: 'Limit',
        sortable: true,
        sortValue: (row) => row.limit,
        render: (row) => <LimitSliderCell kind={kind} row={row} />
      },
      {
        id: 'age',
        label: 'Age',
        sortable: true,
        sortValue: (row) => (typeof row.age === 'number' ? row.age : -Infinity),
        render: (row) => (
          <AgeField
            entity={row.entity}
            age={row.age}
            gameYear={gameYear}
            onCommit={(entity, age) => store.actions.updateAge(kind, entity, age)}
          />
        )
      },
      {
        id: 'studio',
        label: 'Studio',
        sortable: true,
        sortValue: (row) => row.studio ?? '',
        render: (row) => row.studio ?? '—'
      }
    ];

    if (extraColumns && extraColumns.length > 0) {
      const insertAt =
        extraColumnInsertIndex != null ? extraColumnInsertIndex : Math.max(baseColumns.findIndex((col) => col.id === 'age'), 0);
      baseColumns.splice(insertAt, 0, ...extraColumns);
    }

    return baseColumns;
  }, [store, kind, config.skillTooltip, gameYear, extraColumns, extraColumnInsertIndex, setSelectedEntity]);

  const handleSearch = (event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    store.actions.updateCollectionFilters(kind, { search: value });
  };

  const handleGlobalFilterToggle = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    store.actions.updateGlobalFilters({ playerStudioOnly: target.checked });
  };

  const toggleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !column.sortable) return;
    setSortState((prev) => {
      if (prev.columnId === columnId) {
        const nextDirection = prev.direction === 'desc' ? 'asc' : 'desc';
        return { columnId, direction: nextDirection };
      }
      return { columnId, direction: 'desc' };
    });
  };

  const renderSortIndicator = (columnId: string) => {
    if (sortState.columnId !== columnId) return '';
    return sortState.direction === 'asc' ? '^' : 'v';
  };

  const sortedRows = useMemo(() => {
    const column = columns.find((col) => col.id === sortState.columnId);
    const direction = sortState.direction === 'asc' ? 1 : -1;
    const sortValue = column?.sortValue;
    const sorted = [...rows];
    sorted.sort((a, b) => {
      let compare = 0;
      if (sortValue) {
        const valueA = sortValue(a);
        const valueB = sortValue(b);
        compare = compareValues(valueA, valueB);
      }
      if (compare === 0) {
        const idA = a.entity.id ?? 0;
        const idB = b.entity.id ?? 0;
        compare = idA - idB;
      }
      return compare * direction;
    });
    return sorted;
  }, [rows, columns, sortState]);

  return (
    <>
      <section class="panel">
        <header class="panel__header">
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">
            <h2>
              {config.title} <span class="panel__subtitle">({subtitle})</span>
            </h2>
            <label class="panel__toggle" style="cursor: pointer;">
              <span>Player Studio Only</span>
              <span class="toggle-switch">
                <input type="checkbox" checked={playerStudioOnly} onChange={handleGlobalFilterToggle} />
                <span class="toggle-switch__slider" />
              </span>
            </label>
          </div>
        </header>
        <div class="panel__controls">
          <label class="panel__field">
            <span>Search</span>
            <input type="search" value={filters.search} onInput={handleSearch} placeholder={`Find ${pluralLower}…`} />
          </label>
        </div>
        {rows.length === 0 ? (
          <p class="panel__empty">Load a save to preview {pluralLower}.</p>
        ) : (
          <div class="table-wrap">
            <table class="data-table data-table--interactive">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.id}>
                      {column.sortable ? (
                        <button type="button" class="table-sort" onClick={() => toggleSort(column.id)}>
                          {column.label}{' '}
                          <span class="table-sort__indicator">{renderSortIndicator(column.id)}</span>
                        </button>
                      ) : (
                        <span>{column.label}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, index) => {
                  const key = row.entity.id != null ? `${collectionKey}-${row.entity.id}` : `${collectionKey}-${index}`;
                  return (
                    <SkillLimitProvider key={key} row={row}>
                      <tr>
                        {columns.map((column) => (
                          <td key={column.id}>{column.render(row)}</td>
                        ))}
                      </tr>
                    </SkillLimitProvider>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <TalentDetailDrawer
        kind={kind}
        entity={selectedEntity}
        open={selectedEntity !== null}
        onClose={() => setSelectedEntity(null)}
      />
    </>
  );
}

export const ProducersView = () => <TalentRoleView kind="producer" />;
export const WritersView = () => <TalentRoleView kind="writer" />;
export const EditorsView = () => <TalentRoleView kind="editor" />;
export const ComposersView = () => <TalentRoleView kind="composer" />;
export const CinematographersView = () => <TalentRoleView kind="cinematographer" />;
export const AgentsView = () => <TalentRoleView kind="agent" />;
