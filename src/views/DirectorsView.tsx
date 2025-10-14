import { useEffect, useMemo, useState } from 'preact/hooks';
import { AgeField } from '../components/AgeField';
import { SliderField } from '../components/SliderField';
import { useAppStore } from '../state';
import { TalentDetailDrawer } from './TalentDetailDrawer';
import { fullName, getAge, normalizeDecimalString } from '../domain';
import type { TalentData } from '../types/save';

type SortColumn = 'name' | 'skill' | 'limit' | 'age';
type SortDirection = 'asc' | 'desc';

interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

interface DirectorRow {
  entity: TalentData;
  displayName: string;
  skill: number;
  limit: number;
  age: number | '';
  studio: string | null;
  idLabel: string;
}

function parseUnit(value: unknown, fallback = 0): number {
  const normalized = normalizeDecimalString(value ?? '');
  if (normalized === '') return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function DirectorsView() {
  const store = useAppStore();
  const filters = store.signals.filters.directors.value;
  const names = store.signals.names.value;
  const gameYear = store.signals.gameYear.value;
  const baseCount = store.signals.directors.value.length;
  const save = store.signals.save.value;
  const [selectedDirector, setSelectedDirector] = useState<TalentData | null>(null);
  const [sortState, setSortState] = useState<SortState>({ column: 'name', direction: 'asc' });

  useEffect(() => {
    if (!save) {
      setSelectedDirector(null);
    }
  }, [save]);

  const directors = store.derived.filteredDirectors.value;
  const filteredCount = directors.length;
  const subtitle =
    filteredCount === baseCount
      ? `${baseCount} directors loaded`
      : `${filteredCount} of ${baseCount} directors shown`;

  const rows = useMemo<DirectorRow[]>(() => {
    const nameMap = names ?? null;
    const mapped = directors.map((entity) => {
      const displayName = nameMap
        ? fullName(nameMap, {
            firstId: entity.firstNameId,
            lastId: entity.lastNameId,
            customName: entity.customName
          })
        : entity.customName ||
          `${entity.firstNameId ?? ''}${entity.firstNameId && entity.lastNameId ? ' ' : ''}${entity.lastNameId ?? ''}`.trim() ||
          'Unknown Director';
      const skill = parseUnit(entity.professions?.Director ?? '0');
      const limitRaw = parseUnit(entity.limit ?? entity.Limit ?? '', skill);
      const limit = limitRaw < skill ? skill : limitRaw;
      const age = getAge(entity, gameYear);
      return {
        entity,
        displayName,
        skill,
        limit,
        age,
        studio: entity.studioId ?? null,
        idLabel: entity.id != null ? String(entity.id) : '—'
      };
    });

    const sorted = [...mapped];
    sorted.sort((a, b) => {
      const direction = sortState.direction === 'asc' ? 1 : -1;
      let compare = 0;
      switch (sortState.column) {
        case 'name':
          compare = a.displayName.localeCompare(b.displayName);
          break;
        case 'skill':
          compare = a.skill - b.skill;
          break;
        case 'limit':
          compare = a.limit - b.limit;
          break;
        case 'age':
          {
            const valueA = typeof a.age === 'number' ? a.age : -Infinity;
            const valueB = typeof b.age === 'number' ? b.age : -Infinity;
            compare = valueA - valueB;
          }
          break;
      }
      if (compare === 0) {
        const idA = a.entity.id ?? 0;
        const idB = b.entity.id ?? 0;
        compare = idA - idB;
      }
      return compare * direction;
    });
    return sorted;
  }, [directors, names, gameYear, sortState]);

  const handleSearch = (event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    store.actions.updateDirectorFilters({ search: value });
  };

  const handleStudioToggle = (event: Event) => {
    const { checked } = event.currentTarget as HTMLInputElement;
    store.actions.updateDirectorFilters({ playerStudioOnly: checked });
  };

  const toggleSort = (column: SortColumn) => {
    setSortState((prev) => {
      if (prev.column === column) {
        const nextDirection = prev.direction === 'desc' ? 'asc' : 'desc';
        return { column, direction: nextDirection };
      }
      return { column, direction: 'desc' };
    });
  };

  const renderSortIndicator = (column: SortColumn) => {
    if (sortState.column !== column) return '';
    return sortState.direction === 'asc' ? '^' : 'v';
  };

  return (
    <>
      <section class="panel">
        <header class="panel__header">
          <h2>Directors</h2>
          <p class="panel__subtitle">{subtitle}</p>
        </header>
        <div class="panel__controls">
          <label class="panel__field">
            <span>Search</span>
            <input type="search" value={filters.search} onInput={handleSearch} placeholder="Find directors…" />
          </label>
          <label class="panel__toggle">
            <input type="checkbox" checked={filters.playerStudioOnly} onChange={handleStudioToggle} />
            <span>Player Studio only</span>
          </label>
        </div>
        {directors.length === 0 ? (
          <p class="panel__empty">Load a save to preview directors.</p>
        ) : (
          <div class="table-wrap">
            <table class="data-table data-table--interactive">
              <thead>
                <tr>
                  <th>
                    <button type="button" class="table-sort" onClick={() => toggleSort('name')}>
                      Name <span class="table-sort__indicator">{renderSortIndicator('name')}</span>
                    </button>
                  </th>
                  <th>ID</th>
                  <th>
                    <button type="button" class="table-sort" onClick={() => toggleSort('skill')}>
                      Skill <span class="table-sort__indicator">{renderSortIndicator('skill')}</span>
                    </button>
                  </th>
                  <th>
                    <button type="button" class="table-sort" onClick={() => toggleSort('limit')}>
                      Limit <span class="table-sort__indicator">{renderSortIndicator('limit')}</span>
                    </button>
                  </th>
                  <th>
                    <button type="button" class="table-sort" onClick={() => toggleSort('age')}>
                      Age <span class="table-sort__indicator">{renderSortIndicator('age')}</span>
                    </button>
                  </th>
                  <th>Studio</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const key = row.entity.id != null ? `director-${row.entity.id}` : `director-${index}`;
                  return (
                    <tr key={key}>
                      <td>
                        <button type="button" class="link-button" onClick={() => setSelectedDirector(row.entity)}>
                          {row.displayName}
                        </button>
                      </td>
                      <td>{row.idLabel}</td>
                      <td>
                        <SliderField
                          value={row.skill}
                          min={0}
                          max={1}
                          step={0.01}
                          onCommit={(value) => store.actions.updateDirectorSkill(row.entity, value)}
                          title="Directing skill (0–1 range shown as 0–10)."
                        />
                      </td>
                      <td>
                        <SliderField
                          value={row.limit}
                          min={row.skill}
                          max={1}
                          step={0.01}
                          onCommit={(value) => store.actions.updateDirectorLimit(row.entity, value)}
                          title="Limit cannot be reduced below directing skill."
                        />
                      </td>
                      <td>
                        <AgeField
                          entity={row.entity}
                          age={row.age}
                          gameYear={gameYear}
                          onCommit={store.actions.updateDirectorAge}
                        />
                      </td>
                      <td>{row.studio ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <TalentDetailDrawer
        kind="director"
        entity={selectedDirector}
        open={selectedDirector !== null}
        onClose={() => setSelectedDirector(null)}
      />
    </>
  );
}
