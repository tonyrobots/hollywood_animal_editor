import { useEffect, useMemo, useState } from 'preact/hooks';
import { SliderField } from '../components/SliderField';
import { useAppStore } from '../state';
import { ActorDetailDrawer } from './ActorDetailDrawer';
import {
  fullName,
  getAge,
  getTagValue,
  normalizeDecimalString
} from '../domain';
import type { TalentData } from '../types/save';

type SortColumn = 'name' | 'skill' | 'limit' | 'art' | 'com' | 'age';
type SortDirection = 'asc' | 'desc';

interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

interface ActorRow {
  actor: TalentData;
  displayName: string;
  skill: number;
  limit: number;
  art: number;
  com: number;
  age: number | '';
  studio: string | null;
  idLabel: string;
}

const ART_COM_TICKS = [0, 0.15, 0.3, 0.7, 1];

function parseUnit(value: unknown, fallback = 0): number {
  const normalized = normalizeDecimalString(value ?? '');
  if (normalized === '') return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ActorAgeCell({
  actor,
  age,
  gameYear,
  onCommit
}: {
  actor: TalentData;
  age: number | '';
  gameYear: number | null;
  onCommit: (actor: TalentData, nextAge: number) => void;
}) {
  const [draft, setDraft] = useState(age === '' ? '' : String(age));

  useEffect(() => {
    setDraft(age === '' ? '' : String(age));
  }, [age]);

  const commit = () => {
    if (!gameYear) return;
    if (draft === '') return;
    const numeric = Number(draft);
    if (!Number.isFinite(numeric)) {
      return;
    }
    const clamped = Math.min(Math.max(Math.round(numeric), 0), 200);
    if (age === clamped) return;
    onCommit(actor, clamped);
  };

  return (
    <input
      type="number"
      class="age-field"
      min={0}
      max={200}
      step={1}
      value={draft}
      placeholder={gameYear ? '—' : 'Set game year'}
      onInput={(event) => setDraft((event.currentTarget as HTMLInputElement).value)}
      onBlur={() => {
        commit();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
        } else if (event.key === 'Escape') {
          setDraft(age === '' ? '' : String(age));
        }
      }}
    />
  );
}

export function ActorsView() {
  const store = useAppStore();
  const filters = store.signals.filters.actors.value;
  const names = store.signals.names.value;
  const gameYear = store.signals.gameYear.value;
  const baseCount = store.signals.actors.value.length;
  const save = store.signals.save.value;
  const [selectedActor, setSelectedActor] = useState<TalentData | null>(null);
  const [sortState, setSortState] = useState<SortState>({ column: 'name', direction: 'asc' });

  useEffect(() => {
    if (!save) {
      setSelectedActor(null);
    }
  }, [save]);

  const actors = store.derived.filteredActors.value;
  const filteredCount = actors.length;
  const subtitle =
    filteredCount === baseCount ? `${baseCount} actors loaded` : `${filteredCount} of ${baseCount} actors shown`;

  const rows = useMemo<ActorRow[]>(() => {
    const nameMap = names ?? null;
    const mapped = actors.map((actor) => {
      const displayName = nameMap
        ? fullName(nameMap, {
            firstId: actor.firstNameId,
            lastId: actor.lastNameId,
            customName: actor.customName
          })
        : actor.customName ||
          `${actor.firstNameId ?? ''}${actor.firstNameId && actor.lastNameId ? ' ' : ''}${actor.lastNameId ?? ''}`.trim() ||
          'Unknown Actor';
      const skill = parseUnit(actor.professions?.Actor ?? '0');
      const limitRaw = parseUnit(actor.limit ?? actor.Limit ?? '', skill);
      const limit = limitRaw < skill ? skill : limitRaw;
      const art = parseUnit(getTagValue(actor, 'ART'), 0);
      const com = parseUnit(getTagValue(actor, 'COM'), 0);
      const age = getAge(actor, gameYear);
      return {
        actor,
        displayName,
        skill,
        limit,
        art,
        com,
        age,
        studio: actor.studioId ?? null,
        idLabel: actor.id != null ? String(actor.id) : '—'
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
        case 'art':
          compare = a.art - b.art;
          break;
        case 'com':
          compare = a.com - b.com;
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
        const idA = a.actor.id ?? 0;
        const idB = b.actor.id ?? 0;
        compare = idA - idB;
      }
      return compare * direction;
    });
    return sorted;
  }, [actors, names, gameYear, sortState]);

  const handleSearch = (event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    store.actions.updateActorFilters({ search: value });
  };

  const handleStudioToggle = (event: Event) => {
    const { checked } = event.currentTarget as HTMLInputElement;
    store.actions.updateActorFilters({ playerStudioOnly: checked });
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

  const handleRowNameClick = (actor: TalentData) => {
    setSelectedActor(actor);
  };

  return (
    <>
      <section class="panel">
        <header class="panel__header">
          <h2>2. Actors</h2>
          <p class="panel__subtitle">{subtitle}</p>
        </header>
        <div class="panel__controls">
          <label class="panel__field">
            <span>Search</span>
            <input type="search" value={filters.search} onInput={handleSearch} placeholder="Find actors…" />
          </label>
          <label class="panel__toggle">
            <input type="checkbox" checked={filters.playerStudioOnly} onChange={handleStudioToggle} />
            <span>Player Studio only</span>
          </label>
        </div>
        {actors.length === 0 ? (
          <p class="panel__empty">Load a save to preview actors.</p>
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
                    <button type="button" class="table-sort" onClick={() => toggleSort('art')}>
                      Artistic Appeal <span class="table-sort__indicator">{renderSortIndicator('art')}</span>
                    </button>
                  </th>
                  <th>
                    <button type="button" class="table-sort" onClick={() => toggleSort('com')}>
                      Commercial Appeal <span class="table-sort__indicator">{renderSortIndicator('com')}</span>
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
                  const key = row.actor.id != null ? `actor-${row.actor.id}` : `actor-${index}`;
                  return (
                    <tr key={key}>
                      <td>
                        <button type="button" class="link-button" onClick={() => handleRowNameClick(row.actor)}>
                          {row.displayName}
                        </button>
                      </td>
                      <td>{row.idLabel}</td>
                      <td>
                        <SliderField
                          value={row.skill}
                          onCommit={(value) => store.actions.updateActorSkill(row.actor, value)}
                          min={0}
                          max={1}
                          step={0.01}
                          title="Acting skill (0–1 range shown as 0–10)."
                        />
                      </td>
                      <td>
                        <SliderField
                          value={row.limit}
                          min={row.skill}
                          max={1}
                          step={0.01}
                          onCommit={(value) => store.actions.updateActorLimit(row.actor, value)}
                          title="Limit cannot be reduced below acting skill."
                        />
                      </td>
                      <td>
                        <SliderField
                          value={row.art}
                          min={0}
                          max={1}
                          step={0.01}
                          ticks={ART_COM_TICKS}
                          onCommit={(value) => store.actions.updateActorTag(row.actor, 'ART', value)}
                          title="Artistic Appeal (snaps to key film breakpoints)."
                        />
                      </td>
                      <td>
                        <SliderField
                          value={row.com}
                          min={0}
                          max={1}
                          step={0.01}
                          ticks={ART_COM_TICKS}
                          onCommit={(value) => store.actions.updateActorTag(row.actor, 'COM', value)}
                          title="Commercial Appeal (snaps to key film breakpoints)."
                        />
                      </td>
                      <td>
                        <ActorAgeCell
                          actor={row.actor}
                          age={row.age}
                          gameYear={gameYear}
                          onCommit={store.actions.updateActorAge}
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
      <ActorDetailDrawer actor={selectedActor} open={selectedActor !== null} onClose={() => setSelectedActor(null)} />
    </>
  );
}
